import { Vehiculo } from '@prisma/client';
import { VehiculoResponseDto } from '../dto/vehiculo-response.dto.js';

export class VehiculoMapper {
  static toDto(entity: Vehiculo): VehiculoResponseDto {
    return {
      id: entity.id,
      tipo: entity.tipo,
      placa: entity.placa,
      modelo: entity.modelo,
      color: entity.color,
      propietarioId: entity.propietarioId,
      esPredeterminado: entity.esPredeterminado,
      fechaCreado: entity.fechaCreado,
      fechaActualizado: entity.fechaActualizado,
    };
  }

  static toDtoList(entities: Vehiculo[]): VehiculoResponseDto[] {
    return entities.map((e) => this.toDto(e));
  }
}
