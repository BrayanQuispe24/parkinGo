import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';

@Injectable()
export class GetReservaByIdAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    id: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto> {
    const role = user.roleName || user.role;
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    // Regla 3: El Administrador General NO puede ver las reservas de nadie
    if (role === 'GENERAL_ADMIN') {
      throw new ForbiddenException(
        'Acceso restringido: El Administrador General no tiene permitido visualizar reservas',
      );
    }

    const reserva = await this.reservaRepo.findById(id);
    if (!reserva) {
      throw new NotFoundException(`La reserva con ID "${id}" no existe`);
    }

    // Si es conductor, solo puede ver su propia reserva
    if (role === 'DRIVER' && reserva.clienteId !== userId) {
      throw new ForbiddenException(
        'No tienes autorización para consultar una reserva que no te pertenece',
      );
    }

    // Si es operador o administrador de parqueo, debe pertenecer al estacionamiento de la reserva
    if (role === 'PARKING_ADMIN' || role === 'HOST' || role === 'PARKING_OPERATOR') {
      const estacionamiento = await this.prisma.estacionamiento.findUnique({
        where: { id: reserva.estacionamientoId },
        include: {
          tenant: true,
          operadores: { select: { id: true } },
        },
      });

      const esDuenio = estacionamiento?.tenant.usuarioId === userId;
      const esOperador = estacionamiento?.operadores.some((op) => op.id === userId);

      if (!esDuenio && !esOperador) {
        throw new ForbiddenException(
          'No tienes permisos para consultar reservas de este estacionamiento',
        );
      }
    }

    return ReservaMapper.toDto(reserva);
  }
}
