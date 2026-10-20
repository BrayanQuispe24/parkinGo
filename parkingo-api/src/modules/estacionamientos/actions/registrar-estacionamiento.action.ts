import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { RegistrarEstacionamientoDto } from '../dto/registrar-estacionamiento.dto.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';

export interface UploadedPhotoFile {
  originalname: string;
  buffer?: Buffer;
  path?: string;
  mimetype?: string;
}

@Injectable()
export class RegistrarEstacionamientoAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: RegistrarEstacionamientoDto,
    files: UploadedPhotoFile[],
    userId: string,
    providedTenantId?: string,
  ): Promise<EstacionamientoResponseDto> {
    // 1. Resolver Tenant
    let tenantId = providedTenantId;
    if (!tenantId) {
      const tenants = await this.tenantRepository.findByUsuarioId(userId);
      if (!tenants || tenants.length === 0) {
        const nuevoTenant = await this.tenantRepository.create({
          nombre: dto.nombre,
          nit: `${Date.now()}`,
          razonSocial: dto.nombre,
          direccion: dto.direccion,
          ciudad: 'Cochabamba',
          latitud: dto.latitud,
          longitud: dto.longitud,
          usuarioId: userId,
        });
        tenantId = nuevoTenant.id;
      } else {
        tenantId = tenants[0].id;
      }
    } else {
      const tenant = await this.tenantRepository.findById(tenantId);
      if (!tenant) {
        throw new NotFoundException('El tenant especificado no existe.');
      }
      if (tenant.usuarioId !== userId) {
        throw new ForbiddenException(
          'No tienes autorización para vincular este estacionamiento a una empresa que no te pertenece.',
        );
      }
    }

    // 2. REGLA ESTRICTA DE NEGOCIO: Solo 1 estacionamiento por tenant
    const existing = await this.estacionamientoRepository.findByTenantId(tenantId);
    if (existing) {
      throw new ConflictException(
        'El tenant ya cuenta con un estacionamiento registrado o en proceso de revisión.',
      );
    }

    // 3. Validar horarios
    if (!dto.horarios || dto.horarios.length === 0) {
      throw new BadRequestException(
        'Es obligatorio configurar al menos un horario de atención para el estacionamiento.',
      );
    }

    // 4. Procesar y almacenar archivos fotográficos
    const fotosUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadDir = path.resolve(process.cwd(), 'uploads', 'estacionamientos');
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${sanitizedName}`;
        const targetPath = path.join(uploadDir, uniqueFileName);

        if (file.buffer) {
          await fs.writeFile(targetPath, file.buffer);
        } else if (file.path) {
          await fs.copyFile(file.path, targetPath);
        }

        fotosUrls.push(`/uploads/estacionamientos/${uniqueFileName}`);
      }
    }

    // 5. Creación atómica del estacionamiento en estado PENDIENTE
    const created = await this.estacionamientoRepository.create({
      nombre: dto.nombre,
      direccion: dto.direccion,
      latitud: dto.latitud,
      longitud: dto.longitud,
      tenantId,
      fotosUrls,
      horarios: dto.horarios,
    });

    return EstacionamientoMapper.toResponseDto(created);
  }
}
