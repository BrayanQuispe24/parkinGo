import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';
import { TenantRepository } from '../repositories/tenant.repository.js';
import { TenantMapper } from '../mappers/tenant.mapper.js';

interface RequestingUser {
  userId: string;
  roleName: string;
}

@Injectable()
export class UpdateTenantAction {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(id: string, dto: UpdateTenantDto, user: RequestingUser): Promise<TenantResponseDto> {
    const existing = await this.tenantRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada.`);
    }

    // El administrador de parqueo solo puede editar sus propios tenants
    if (user.roleName === 'PARKING_ADMIN' && existing.usuarioId !== user.userId) {
      throw new ForbiddenException('No tiene permisos para modificar esta empresa.');
    }

    // Si modifica el NIT, verificar que no pertenezca a otra empresa
    if (dto.nit && dto.nit.trim() !== existing.nit) {
      const existingByNit = await this.tenantRepository.findByNit(dto.nit.trim());
      if (existingByNit && existingByNit.id !== id) {
        throw new ConflictException(
          `El NIT ${dto.nit} ya está registrado por otra empresa.`
        );
      }
    }

    const updated = await this.tenantRepository.update(id, {
      nombre: dto.nombre?.trim(),
      nit: dto.nit?.trim(),
      razonSocial: dto.razonSocial?.trim(),
      estado: dto.estado,
      direccion: dto.direccion !== undefined ? dto.direccion?.trim() : undefined,
      ciudad: dto.ciudad !== undefined ? dto.ciudad?.trim() : undefined,
      latitud: dto.latitud,
      longitud: dto.longitud,
    });

    return TenantMapper.toDto(updated);
  }
}
