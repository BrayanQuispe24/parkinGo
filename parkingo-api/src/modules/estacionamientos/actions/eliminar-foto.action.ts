import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs/promises';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { FotoResponseDto } from '../dto/estacionamiento-response.dto.js';

@Injectable()
export class EliminarFotoAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(fotoId: string, userId: string): Promise<FotoResponseDto> {
    const foto = await this.estacionamientoRepository.findFotoById(fotoId);
    if (!foto) {
      throw new NotFoundException('La fotografía no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (!userTenantIds.includes(foto.estacionamiento.tenantId)) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar fotografías de este estacionamiento.',
      );
    }

    const deleted = await this.estacionamientoRepository.eliminarFoto(fotoId);

    // Intentar borrar archivo físico si existe
    try {
      if (deleted.url.startsWith('/uploads/')) {
        const filePath = path.resolve(process.cwd(), deleted.url.replace(/^\//, ''));
        await fs.unlink(filePath);
      }
    } catch {
      // Si el archivo físico ya no existía, continuamos sin romper la transacción
    }

    return {
      id: deleted.id,
      url: deleted.url,
      createdAt: deleted.createdAt,
    };
  }
}
