import { EspacioResponseDto } from '../dto/espacio-response.dto.js';
import { Espacio } from '@prisma/client';

export class EspacioMapper {
  static toResponseDto(
    entity: Espacio & { nivel?: { codigo: string } },
  ): EspacioResponseDto {
    return {
      id: entity.id,
      codigoEspacio: entity.codigoEspacio,
      tipo: entity.tipo,
      modalidad: entity.modalidad,
      estado: entity.estado,
      nivelId: entity.nivelId,
      nivelCodigo: entity.nivel ? entity.nivel.codigo : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseDtoList(
    entities: (Espacio & { nivel?: { codigo: string } })[],
  ): EspacioResponseDto[] {
    return entities.map((e) => this.toResponseDto(e));
  }
}
