import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from '../repositories/tenant.repository.js';

interface RequestingUser {
  userId: string;
  roleName: string;
}

@Injectable()
export class DeleteTenantAction {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string, user: RequestingUser): Promise<{ id: string; message: string }> {
    if (user.roleName !== 'GENERAL_ADMIN' && user.roleName !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Únicamente el Administrador General o el Superadmin pueden eliminar definitivamente una empresa del sistema.'
      );
    }

    const existing = await this.tenantRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
    }

    await this.tenantRepository.delete(id);

    return {
      id,
      message: `Empresa "${existing.nombre}" (NIT: ${existing.nit}) eliminada definitivamente del sistema.`,
    };
  }
}
