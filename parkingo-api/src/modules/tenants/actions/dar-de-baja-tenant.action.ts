import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantStatus } from '@prisma/client';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantRepository } from '../repositories/tenant.repository.js';
import { TenantMapper } from '../mappers/tenant.mapper.js';

interface RequestingUser {
  userId: string;
  roleName: string;
}

@Injectable()
export class DarDeBajaTenantAction {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string, user: RequestingUser, nuevoEstado?: TenantStatus): Promise<TenantResponseDto> {
    const existing = await this.tenantRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
    }

    if (user.roleName === 'PARKING_ADMIN' && existing.usuarioId !== user.userId) {
      throw new ForbiddenException('No tiene permisos para cambiar el estado de esta empresa.');
    }

    // Si no se especifica el nuevo estado, alternar o dar de baja (INACTIVO)
    const estadoFinal =
      nuevoEstado || (existing.estado === TenantStatus.ACTIVO ? TenantStatus.INACTIVO : TenantStatus.ACTIVO);

    const updated = await this.tenantRepository.updateStatus(id, estadoFinal);
    return TenantMapper.toDto(updated);
  }
}
