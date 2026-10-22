import { Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoOperadorRepository } from '../repositories/estacionamiento-operador.repository.js';
import { OperadorEstacionamientoResponseDto } from '../dto/operador-estacionamiento-response.dto.js';
import { EstacionamientoOperadorMapper } from '../mappers/estacionamiento-operador.mapper.js';

@Injectable()
export class GetOperadoresDisponiblesAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly operadorRepository: EstacionamientoOperadorRepository,
  ) {}

  async execute(
    estacionamientoId: string,
    currentUserId: string,
    currentUserRole: string,
  ): Promise<OperadorEstacionamientoResponseDto[]> {
    const estacionamiento = await this.estacionamientoRepository.findById(estacionamientoId);
    if (!estacionamiento) {
      throw new NotFoundException(`Estacionamiento con ID ${estacionamientoId} no encontrado.`);
    }

    const isGlobalAdmin = ['SUPER_ADMIN', 'GENERAL_ADMIN'].includes(currentUserRole);
    const adminUserId = isGlobalAdmin ? undefined : (estacionamiento.tenant?.usuarioId || currentUserId);

    const disponibles = await this.operadorRepository.findOperadoresDisponibles(adminUserId);
    return EstacionamientoOperadorMapper.toResponseDtoList(disponibles);
  }
}
