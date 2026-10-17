import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantRepository } from '../repositories/tenant.repository.js';
import { TenantMapper } from '../mappers/tenant.mapper.js';

interface RequestingUser {
  userId: string;
  roleName: string;
}

@Injectable()
export class GetTenantByIdAction {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string, user: RequestingUser): Promise<TenantResponseDto> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
    }

    if (user.roleName === 'PARKING_ADMIN' && tenant.usuarioId !== user.userId) {
      throw new ForbiddenException('No tiene permisos para acceder a esta empresa.');
    }

    return TenantMapper.toDto(tenant);
  }
}
