import { Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoOperadorRepository } from '../repositories/estacionamiento-operador.repository.js';
import { assertEstacionamientoPermiteOperadores } from '../utils/estacionamiento-operadores.policy.js';

@Injectable()
export class DesasignarOperadorAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly operadorRepository: EstacionamientoOperadorRepository,
  ) {}

  async execute(
    estacionamientoId: string,
    usuarioId: string,
  ): Promise<{ success: boolean; message: string }> {
    const estacionamiento = await this.estacionamientoRepository.findById(estacionamientoId);
    if (!estacionamiento) {
      throw new NotFoundException(`Estacionamiento con ID ${estacionamientoId} no encontrado.`);
    }

    assertEstacionamientoPermiteOperadores(estacionamiento);

    await this.operadorRepository.desasignarOperador(estacionamientoId, usuarioId);

    return {
      success: true,
      message: 'Operador desvinculado del estacionamiento con éxito.',
    };
  }
}
