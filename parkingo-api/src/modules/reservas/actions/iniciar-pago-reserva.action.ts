// src/modules/reservas/actions/iniciar-pago-reserva.action.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EstadoReserva } from '@prisma/client';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { PaymentStrategyResolver } from '../strategies/payment-strategy.resolver.js';
import { IniciarPagoDto, InicioPagoResponseDto } from '../dto/pago.dto.js';

@Injectable()
export class IniciarPagoReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly paymentStrategyResolver: PaymentStrategyResolver,
  ) {}

  async execute(
    reservaId: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: IniciarPagoDto,
  ): Promise<InicioPagoResponseDto> {
    const userId = user.userId || user.id;
    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const reserva = await this.reservaRepo.findById(reservaId);
    if (!reserva) {
      throw new NotFoundException(`La reserva con ID "${reservaId}" no existe`);
    }

    if (reserva.estado !== EstadoReserva.PENDIENTE_PAGO) {
      throw new BadRequestException(
        `La reserva no está en estado PENDIENTE_PAGO. Estado actual: "${reserva.estado}"`,
      );
    }

    // Resolver la estrategia (EFECTIVO o QR)
    const strategy = this.paymentStrategyResolver.resolve(dto.metodoPago);

    const inicio = await strategy.iniciarPago({
      reservacionId: reserva.id,
      codigoReserva: reserva.codigoReserva,
      montoTotal: reserva.total,
      clienteId: reserva.clienteId,
      estacionamientoId: reserva.estacionamientoId,
    });

    return {
      metodoPago: inicio.metodoPago,
      requiereAccionCliente: inicio.requiereAccionCliente,
      qrData: inicio.qrData,
      instrucciones: inicio.instrucciones,
    };
  }
}

