import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { FotoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { UploadedPhotoFile } from './registrar-estacionamiento.action.js';

@Injectable()
export class SubirFotosAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    files: UploadedPhotoFile[],
    userId: string,
  ): Promise<FotoResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Debes enviar al menos un archivo de fotografía válido.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      throw new NotFoundException('No se encontraron empresas asociadas a tu cuenta.');
    }

    let estacionamiento = null;
    for (const t of tenants) {
      const found = await this.estacionamientoRepository.findByTenantId(t.id);
      if (found) {
        estacionamiento = found;
        break;
      }
    }

    if (!estacionamiento) {
      throw new NotFoundException('No posees un estacionamiento registrado para cargar fotografías.');
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads', 'estacionamientos');
    await fs.mkdir(uploadDir, { recursive: true });

    const fotosUrls: string[] = [];
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

    const createdFotos = await this.estacionamientoRepository.agregarFotos(
      estacionamiento.id,
      fotosUrls,
    );

    return createdFotos.map((f) => ({
      id: f.id,
      url: f.url,
      createdAt: f.createdAt,
    }));
  }
}
