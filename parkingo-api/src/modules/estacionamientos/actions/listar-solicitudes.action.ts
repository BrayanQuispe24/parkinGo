import { Injectable } from '@nestjs/common';
import { EstadoEstacionamiento } from '@prisma/client';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';

@Injectable()
export class ListarSolicitudesAction {
  constructor(private readonly estacionamientoRepository: EstacionamientoRepository) {}

  async execute(estado?: EstadoEstacionamiento): Promise<EstacionamientoResponseDto[]> {
    const list = await this.estacionamientoRepository.findAll(estado);
    return EstacionamientoMapper.toResponseDtoList(list);
  }
}
