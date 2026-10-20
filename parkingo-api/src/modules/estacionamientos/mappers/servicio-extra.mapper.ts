import { ServicioExtra } from '@prisma/client';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';

export class ServicioExtraMapper {
  static toResponseDto(entity: ServicioExtra): ServicioExtraResponseDto {
    return {
      id: entity.id,
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      precio: entity.precio,
      activo: entity.activo,
      estacionamientoId: entity.estacionamientoId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: ServicioExtra[]): ServicioExtraResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
