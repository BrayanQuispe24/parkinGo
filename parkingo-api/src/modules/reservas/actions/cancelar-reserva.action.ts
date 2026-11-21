import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { EstadoReserva } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';
import { EspaciosRealtimeService } from '../../realtime/services/espacios-realtime.service.js';
import { EspacioMapper } from '../../estacionamientos/mappers/espacio.mapper.js';

@Injectable()
export class CancelarReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
    private readonly espaciosRealtimeService: EspaciosRealtimeService,
  ) {}

  async execute(
    id: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto> {
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    const reserva = await this.reservaRepo.findById(id);
    if (!reserva) {
      throw new NotFoundException(`La reserva con ID "${id}" no existe`);
    }

    // Regla 5: Solo el cliente (cliente_id) que originó la reserva puede cancelarla
    if (reserva.clienteId !== userId) {
      throw new ForbiddenException(
        'Solo el cliente que registró la reserva tiene autorización para cancelarla',
      );
    }

    if (reserva.estado === EstadoReserva.CANCELADA) {
      throw new BadRequestException('La reserva ya se encuentra cancelada');
    }

    if (reserva.estado === EstadoReserva.COMPLETADA) {
      throw new BadRequestException(
        'No es posible cancelar una reserva que ya ha sido completada',
      );
    }

    const cancelada = await this.reservaRepo.cancelar(id);

    // Notificar por WebSocket la liberación del espacio a DISPONIBLE en tiempo real
    for (const det of reserva.detalles) {
      if (det.espacioId) {
        try {
          const espacioActualizado = await this.prisma.espacio.findUnique({
            where: { id: det.espacioId },
            include: {
              nivel: {
                select: { codigo: true },
              },
            },
          });
          if (espacioActualizado) {
            const espacioDto = EspacioMapper.toResponseDto(espacioActualizado);
            this.espaciosRealtimeService.emitEspacioCambio(
              'UPDATED',
              reserva.estacionamientoId,
              espacioDto,
            );
          }
        } catch (wsErr) {
          // La notificación realtime es asíncrona y no interrumpe el flujo principal
        }
      }
    }

    return ReservaMapper.toDto(cancelada);
  }
}
