import { Injectable, NotFoundException } from '@nestjs/common';
import { CalificacionRepository } from '../repositories/calificacion.repository.js';
import { EstacionamientoRepository } from '../../estacionamientos/repositories/estacionamiento.repository.js';
import { EstacionamientoCalificacionesSummaryResponseDto } from '../dto/estacionamiento-calificaciones-summary-response.dto.js';
import { CalificacionMapper } from '../mappers/calificacion.mapper.js';

@Injectable()
export class GetCalificacionesByEstacionamientoAction {
  constructor(
    private readonly calificacionRepository: CalificacionRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
  ) {}

  async execute(
    estacionamientoId: string,
  ): Promise<EstacionamientoCalificacionesSummaryResponseDto> {
    const estacionamiento = await this.estacionamientoRepository.findById(
      estacionamientoId,
    );
    if (!estacionamiento) {
      throw new NotFoundException(
        `El estacionamiento con ID "${estacionamientoId}" no existe.`,
      );
    }

    const [items, summary] = await Promise.all([
      this.calificacionRepository.findByEstacionamientoId(estacionamientoId),
      this.calificacionRepository.getSummaryByEstacionamientoId(estacionamientoId),
    ]);

    return {
      promedio: summary.promedio,
      total: summary.total,
      items: CalificacionMapper.toResponseDtoList(items),
    };
  }
}
