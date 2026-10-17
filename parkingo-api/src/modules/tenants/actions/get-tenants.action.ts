import { ForbiddenException, Injectable } from '@nestjs/common';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantRepository } from '../repositories/tenant.repository.js';
import { TenantMapper } from '../mappers/tenant.mapper.js';

interface RequestingUser {
  userId: string;
  roleName: string;
}

@Injectable()
export class GetTenantsAction {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(user: RequestingUser): Promise<TenantResponseDto[]> {
    if (user.roleName === 'PARKING_ADMIN') {
      // El administrador de parqueo solo ve las empresas que registró
      const userTenants = await this.tenantRepository.findByUsuarioId(user.userId);
      return TenantMapper.toDtoList(userTenants);
    }

    if (user.roleName === 'GENERAL_ADMIN' || user.roleName === 'SUPER_ADMIN') {
      // El administrador general y superadmin ven todas las empresas
      const allTenants = await this.tenantRepository.findAll();
      return TenantMapper.toDtoList(allTenants);
    }

    throw new ForbiddenException(
      'No tiene permisos suficientes para consultar la lista de empresas / tenants.'
    );
  }
}
