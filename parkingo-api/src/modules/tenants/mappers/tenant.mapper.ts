import { TenantWithUser } from '../repositories/tenant.repository.js';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';

export class TenantMapper {
  static toDto(entity: TenantWithUser): TenantResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      nit: entity.nit,
      razonSocial: entity.razonSocial,
      estado: entity.estado,
      direccion: entity.direccion,
      ciudad: entity.ciudad,
      latitud: entity.latitud,
      longitud: entity.longitud,
      usuarioId: entity.usuarioId,
      usuario: entity.usuario
        ? {
            id: entity.usuario.id,
            email: entity.usuario.email,
            firstName: entity.usuario.firstName,
            lastName: entity.usuario.lastName,
            phone: entity.usuario.phone,
            ci: entity.usuario.ci,
          }
        : undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static toDtoList(entities: TenantWithUser[]): TenantResponseDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
