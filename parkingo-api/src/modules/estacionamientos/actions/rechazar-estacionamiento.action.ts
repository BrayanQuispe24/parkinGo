import { Injectable, NotFoundException } from '@nestjs/common';
import { EstadoEstacionamiento } from '@prisma/client';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';

@Injectable()
export class RechazarEstacionamientoAction {
  constructor(private readonly estacionamientoRepository: EstacionamientoRepository) {}

  async execute(id: string, motivoRechazo: string): Promise<EstacionamientoResponseDto> {
    const existing = await this.estacionamientoRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`No se encontró el estacionamiento con ID: ${id}`);
    }

    const updated = await this.estacionamientoRepository.updateEstado(
      id,
      EstadoEstacionamiento.RECHAZADO,
      motivoRechazo,
      null,
    );

    return EstacionamientoMapper.toResponseDto(updated);
  }
}
