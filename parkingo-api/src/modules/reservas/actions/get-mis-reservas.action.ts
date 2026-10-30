import { Injectable, ForbiddenException } from '@nestjs/common';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';

@Injectable()
export class GetMisReservasAction {
  constructor(private readonly reservaRepo: ReservaRepository) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto[]> {
    const role = user.roleName || user.role;
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    if (role !== 'DRIVER') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) pueden consultar sus reservas personales',
      );
    }

    const reservas = await this.reservaRepo.findByClienteId(userId);
    return ReservaMapper.toDtoList(reservas);
  }
}
