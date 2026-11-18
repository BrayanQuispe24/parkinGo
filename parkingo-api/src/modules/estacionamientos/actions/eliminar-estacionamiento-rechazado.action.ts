import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoEstacionamiento } from '@prisma/client';
import path from 'path';
import fs from 'fs/promises';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { EliminarEstacionamientoRechazadoResponseDto } from '../dto/eliminar-estacionamiento-rechazado-response.dto.js';

@Injectable()
export class EliminarEstacionamientoRechazadoAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<EliminarEstacionamientoRechazadoResponseDto> {
    const existing = await this.estacionamientoRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`No se encontró el estacionamiento con ID: ${id}`);
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (!userTenantIds.includes(existing.tenantId)) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este estacionamiento.',
      );
    }

    if (existing.estado !== EstadoEstacionamiento.RECHAZADO) {
      throw new BadRequestException(
        'Solo se pueden eliminar solicitudes de estacionamiento en estado RECHAZADO.',
      );
    }

    const photoUrls = (existing.fotos ?? []).map((f) => f.url);

    await this.estacionamientoRepository.delete(id);

    // Limpiar archivos físicos locales sin interrumpir si alguno ya fue removido
    const uploadsRoot = path.resolve(process.cwd(), 'uploads');
    await Promise.all(
      photoUrls.map(async (url) => {
        if (!url.startsWith('/uploads/')) return;
        try {
          const filePath = path.resolve(process.cwd(), url.replace(/^\//, ''));
          if (!filePath.startsWith(uploadsRoot + path.sep)) return;
          await fs.unlink(filePath);
        } catch {
          // Si el archivo físico ya no existía, continuamos de forma segura
        }
      }),
    );

    return {
      id,
      message: 'Solicitud de estacionamiento rechazada eliminada exitosamente.',
    };
  }
}

