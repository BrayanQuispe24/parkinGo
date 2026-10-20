import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoWithRelations } from '../repositories/estacionamiento.repository.js';

export class EstacionamientoMapper {
  static toResponseDto(entity: EstacionamientoWithRelations): EstacionamientoResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      direccion: entity.direccion,
      latitud: entity.latitud,
      longitud: entity.longitud,
      estado: entity.estado,
      tenantId: entity.tenantId,
      tenant: entity.tenant
        ? {
            id: entity.tenant.id,
            nombre: entity.tenant.nombre,
            nit: entity.tenant.nit,
            razonSocial: entity.tenant.razonSocial,
            direccion: entity.tenant.direccion,
            ciudad: entity.tenant.ciudad,
            usuario: entity.tenant.usuario
              ? {
                  id: entity.tenant.usuario.id,
                  firstName: entity.tenant.usuario.firstName,
                  lastName: entity.tenant.usuario.lastName,
                  email: entity.tenant.usuario.email,
                  phone: entity.tenant.usuario.phone,
                  ci: entity.tenant.usuario.ci,
                  roleName: entity.tenant.usuario.role?.name ?? 'TENANT_ADMIN',
                }
              : null,
          }
        : null,
      motivoRechazo: entity.motivoRechazo,
      fechaAprobacion: entity.fechaAprobacion,
      fotos: (entity.fotos ?? []).map((f) => ({
        id: f.id,
        url: f.url,
        createdAt: f.createdAt,
      })),
      horarios: (entity.horarios ?? []).map((eh) => ({
        id: eh.horario.id,
        dia: eh.horario.dia,
        horaInicio: eh.horario.horaInicio,
        horaCierre: eh.horario.horaCierre,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: EstacionamientoWithRelations[]): EstacionamientoResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
