import { CalificacionWithRelations } from '../repositories/calificacion.repository.js';
import { CalificacionResponseDto } from '../dto/calificacion-response.dto.js';

export class CalificacionMapper {
  static toResponseDto(entity: CalificacionWithRelations): CalificacionResponseDto {
    const clienteFullName = [entity.cliente.firstName, entity.cliente.lastName]
      .filter(Boolean)
      .join(' ')
      .trim() || entity.cliente.email;

    return {
      id: entity.id,
      puntaje: entity.puntaje,
      comentario: entity.comentario,
      estacionamientoId: entity.estacionamientoId,
      estacionamientoNombre: entity.estacionamiento.nombre,
      clienteId: entity.clienteId,
      clienteNombre: clienteFullName,
      fechaCreado: entity.fechaCreado,
    };
  }

  static toResponseDtoList(entities: CalificacionWithRelations[]): CalificacionResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
