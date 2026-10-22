import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoOperadorRepository } from '../repositories/estacionamiento-operador.repository.js';
import { AsignarOperadoresDto } from '../dto/asignar-operadores.dto.js';
import { OperadorEstacionamientoResponseDto } from '../dto/operador-estacionamiento-response.dto.js';
import { EstacionamientoOperadorMapper } from '../mappers/estacionamiento-operador.mapper.js';

@Injectable()
export class AsignarOperadoresAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly operadorRepository: EstacionamientoOperadorRepository,
  ) {}

  async execute(
    estacionamientoId: string,
    dto: AsignarOperadoresDto,
  ): Promise<OperadorEstacionamientoResponseDto[]> {
    const estacionamiento = await this.estacionamientoRepository.findById(estacionamientoId);
    if (!estacionamiento) {
      throw new NotFoundException(`Estacionamiento con ID ${estacionamientoId} no encontrado.`);
    }

    if (!dto.usuarioIds || dto.usuarioIds.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un ID de operador.');
    }

    const operadoresFound = await this.operadorRepository.findOperadoresByIds(dto.usuarioIds);
    if (operadoresFound.length !== dto.usuarioIds.length) {
      throw new BadRequestException('Uno o más operadores especificados no existen en el sistema.');
    }

    // Ensure users have the PARKING_OPERATOR or OPERATOR role
    const invalidRole = operadoresFound.some(
      (u) => !['PARKING_OPERATOR', 'OPERATOR'].includes(u.role?.name || ''),
    );
    if (invalidRole) {
      throw new BadRequestException('Uno o más usuarios seleccionados no tienen rol de operador de parqueo.');
    }

    // Strict 1:N rule: assigning updates their estacionamientoId to this parking lot
    await this.operadorRepository.asignarOperadores(estacionamientoId, dto.usuarioIds);

    const updatedOperadores = await this.operadorRepository.findOperadoresByEstacionamientoId(
      estacionamientoId,
    );
    return EstacionamientoOperadorMapper.toResponseDtoList(updatedOperadores);
  }
}
