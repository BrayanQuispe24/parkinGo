import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';
import { CroquisMapper } from '../mappers/croquis.mapper.js';
import { UploadedPhotoFile } from './registrar-estacionamiento.action.js';

@Injectable()
export class SubirFondoCroquisAction {
  constructor(
    private readonly croquisRepository: CroquisRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    nivelId: string,
    file: UploadedPhotoFile,
    userId: string,
  ): Promise<CroquisResponseDto> {
    if (!file) {
      throw new BadRequestException('Debes enviar una imagen o plano válido.');
    }

    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/svg+xml',
    ];

    if (file.mimetype && !allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato no permitido. Solo se aceptan imágenes PNG, JPG, WEBP o SVG.',
      );
    }

    const nivel = await this.nivelRepository.findById(nivelId);
    if (!nivel) {
      throw new NotFoundException('El nivel indicado no existe.');
    }

    if (!nivel.estacionamiento) {
      throw new ForbiddenException(
        'El nivel no está asociado a un estacionamiento válido.',
      );
    }

    const esDuenoTenant = nivel.estacionamiento.tenant?.usuarioId === userId;
    const esOperador = (nivel.estacionamiento.operadores || []).some(
      (op) => op.id === userId,
    );

    let tienePermiso = esDuenoTenant || esOperador;
    if (!tienePermiso) {
      const tenants = await this.tenantRepository.findByUsuarioId(userId);
      const userTenantIds = (tenants || []).map((t) => t.id);
      tienePermiso = userTenantIds.includes(nivel.estacionamiento.tenantId);
    }

    if (!tienePermiso) {
      throw new ForbiddenException(
        'No tienes permisos para modificar el croquis de este nivel.',
      );
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', 'croquis');
    await fs.mkdir(uploadDir, { recursive: true });

    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${sanitizedName}`;
    const targetPath = path.join(uploadDir, uniqueFileName);

    if (file.buffer) {
      await fs.writeFile(targetPath, file.buffer);
    } else if (file.path) {
      await fs.copyFile(file.path, targetPath);
    }

    const publicUrl = `/uploads/croquis/${uniqueFileName}`;

    // Obtener croquis actual para ver si tenía una imagen previa que limpiar
    const existing = await this.croquisRepository.findByNivelId(nivelId);
    if (existing?.fondoImagenUrl && existing.fondoImagenUrl.startsWith('/uploads/croquis/')) {
      const oldPath = path.resolve(
        process.cwd(),
        existing.fondoImagenUrl.replace(/^\//, ''),
      );
      try {
        await fs.unlink(oldPath);
      } catch {
        // Ignorar si el archivo viejo ya no existía
      }
    }

    const saved = await this.croquisRepository.upsertByNivelId(nivelId, {
      contenido: existing?.contenido ?? { elementos: [] },
      fondoTipo: 'PERSONALIZADO',
      fondoImagenUrl: publicUrl,
      fondoOpacidad: existing?.fondoOpacidad ?? 0.4,
    });

    return CroquisMapper.toResponseDto(saved);
  }
}
