import { NivelResponseDto } from '../dto/nivel-response.dto.js';
import { NivelWithCount } from '../repositories/nivel.repository.js';
import { Nivel } from '@prisma/client';

export class NivelMapper {
  static toResponseDto(entity: Nivel | NivelWithCount): NivelResponseDto {
    return {
      id: entity.id,
      codigo: entity.codigo,
      estacionamientoId: entity.estacionamientoId,
      totalEspacios: '_count' in entity && entity._count ? entity._count.espacios : 0,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(entities: (Nivel | NivelWithCount)[]): NivelResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
