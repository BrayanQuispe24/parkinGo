import { Tarifa } from '@prisma/client';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';

export class TarifaMapper {
  static toResponseDto(entity: Tarifa): TarifaResponseDto {
    return {
      id: entity.id,
      descripcion: entity.descripcion,
      monto: entity.monto,
      modalidad: entity.modalidad,
      estado: entity.estado,
      estacionamientoId: entity.estacionamientoId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: Tarifa[]): TarifaResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
