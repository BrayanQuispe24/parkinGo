import { Croquis } from '@prisma/client';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';

export class CroquisMapper {
  static toResponseDto(entity: Croquis): CroquisResponseDto {
    return {
      id: entity.id,
      codigo: entity.codigo,
      anchoLienzo: entity.anchoLienzo,
      altoLienzo: entity.altoLienzo,
      contenido: (entity.contenido as Record<string, unknown>) ?? null,
      fondoTipo: entity.fondoTipo ?? 'PLANO',
      fondoImagenUrl: entity.fondoImagenUrl ?? null,
      fondoOpacidad: entity.fondoOpacidad ?? 0.4,
      nivelId: entity.nivelId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
