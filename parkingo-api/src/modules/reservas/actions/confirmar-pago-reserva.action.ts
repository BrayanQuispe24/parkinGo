// src/modules/reservas/actions/confirmar-pago-reserva.action.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EstadoReserva } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { PaymentStrategyResolver } from '../strategies/payment-strategy.resolver.js';
import { ConfirmarPagoDto } from '../dto/pago.dto.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';
import { QrTokenUtil } from '../utils/qr-token.util.js';

@Injectable()
export class ConfirmarPagoReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
    private readonly paymentStrategyResolver: PaymentStrategyResolver,
  ) {}

  async execute(
    reservaId: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: ConfirmarPagoDto,
  ): Promise<BoletaReservaResponseDto> {
    const role = (user.roleName || user.role || '').trim().toUpperCase();
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
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

    // Regla de Negocio: Validar autorización según el método de pago
    if (dto.metodoPago === 'EFECTIVO') {
      const estacionamiento = await this.prisma.estacionamiento.findUnique({
        where: { id: reserva.estacionamientoId },
        include: {
          tenant: true,
          operadores: { select: { id: true } },
        },
      });

      if (!estacionamiento) {
        throw new NotFoundException('El estacionamiento asociado a la reserva no existe');
      }

      const esDuenio = estacionamiento.tenant.usuarioId === userId;
      const esOperadorAsignado = estacionamiento.operadores.some((op) => op.id === userId);

      if (!esDuenio && !esOperadorAsignado && role !== 'SUPER_ADMIN') {
        throw new ForbiddenException(
          'Solo el operador asignado o el anfitrión dueño del estacionamiento pueden registrar cobros en efectivo.',
        );
      }
    } else if (dto.metodoPago === 'QR') {
      // Para QR: Puede confirmarlo el propio cliente (conductor) tras escanear, o un webhook/operador
      const esClienteDuenio = reserva.clienteId === userId;
      const esPersonal = ['PARKING_OPERATOR', 'OPERATOR', 'HOST', 'PARKING_ADMIN', 'SUPER_ADMIN'].includes(role);
      if (!esClienteDuenio && !esPersonal) {
        throw new ForbiddenException('No tienes autorización para confirmar el pago de esta reserva.');
      }
    }

    // Resolver y ejecutar la estrategia de pago elegida
    const strategy = this.paymentStrategyResolver.resolve(dto.metodoPago);
    const resultado = await strategy.confirmarPago({
      reservacionId: reserva.id,
      montoTotal: reserva.total,
      usuarioCobradorId: userId,
      rolCobrador: role,
      montoEntregado: dto.montoEntregado,
      referenciaExterna: dto.referenciaExterna,
      notas: dto.notas,
    });

    if (resultado.estadoPago !== 'COMPLETADO') {
      throw new BadRequestException('El procesamiento del pago no pudo completarse satisfactoriamente.');
    }

    // Regla de Negocio:
    // Si el pago es por QR digital, ahora que está acreditado se genera y emite el QR definitivo de acceso
    let qrTokenAcceso: string | undefined;
    if (dto.metodoPago === 'QR') {
      qrTokenAcceso = QrTokenUtil.generarTokenAcceso({
        codigoReserva: reserva.codigoReserva,
        clienteId: reserva.clienteId,
        estacionamientoId: reserva.estacionamientoId,
        metodoPago: 'QR',
      });
    }

    // Persistir de manera atómica en la base de datos
    const confirmada = await this.reservaRepo.registrarPagoYConfirmar(reservaId, {
      monto: resultado.montoCobrado,
      metodoPago: resultado.metodoPago,
      fechaPago: resultado.fechaPago,
      qrToken: qrTokenAcceso,
    });

    return ReservaMapper.toDto(confirmada);
  }
}

