// src/modules/reservas/actions/registrar-movimiento-reserva.action.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { EstadoReserva, TipoMovimiento } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { RegistrarMovimientoDto } from '../dto/registrar-movimiento.dto.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';
import { QrTokenUtil } from '../utils/qr-token.util.js';
import { EspaciosRealtimeService } from '../../realtime/services/espacios-realtime.service.js';
import { EspacioMapper } from '../../estacionamientos/mappers/espacio.mapper.js';

@Injectable()
export class RegistrarMovimientoReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
    private readonly espaciosRealtimeService: EspaciosRealtimeService,
  ) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: RegistrarMovimientoDto,
  ): Promise<BoletaReservaResponseDto> {
    const role = (user.roleName || user.role || '').trim().toUpperCase();
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // 1. Identificar la reserva por ID, código o token QR
    let reserva = null;

    if (dto.reservaId) {
      reserva = await this.reservaRepo.findById(dto.reservaId);
    }

    if (!reserva && dto.codigoReserva) {
      reserva = await this.reservaRepo.findByCodigo(dto.codigoReserva);
    }

    if (!reserva && dto.token) {
      const validacion = QrTokenUtil.validarTokenAcceso(dto.token);
      if (validacion.codigoReserva) {
        reserva = await this.reservaRepo.findByCodigo(validacion.codigoReserva);
      }
      if (!reserva) {
        reserva = await this.reservaRepo.findByQrToken(dto.token);
      }
    }

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada con los parámetros proporcionados.');
    }

    // 2. Validar permisos de anfitrión u operador sobre el estacionamiento
    const estacionamiento = await this.prisma.estacionamiento.findUnique({
      where: { id: reserva.estacionamientoId },
      include: {
        tenant: true,
        operadores: { select: { id: true } },
      },
    });

    if (!estacionamiento) {
      throw new NotFoundException('Estacionamiento asociado no existe');
    }

    const esDuenio = estacionamiento.tenant?.usuarioId === userId;
    const esOperadorAsignado = estacionamiento.operadores?.some((op) => op.id === userId);
    const esSuperAdmin = role === 'SUPER_ADMIN';

    if (!esDuenio && !esOperadorAsignado && !esSuperAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para registrar movimientos en este estacionamiento.',
      );
    }

    // 3. Obtener el detalle de la reserva
    const detalle = dto.detalleReservacionId
      ? reserva.detalles.find((d) => d.id === dto.detalleReservacionId)
      : reserva.detalles[0];

    if (!detalle) {
      throw new NotFoundException('Detalle de reservación no encontrado para registrar movimiento.');
    }

    const movimientosPrevios = detalle.movimientos || [];
    const tieneEntrada = movimientosPrevios.some((m) => m.tipoMovimiento === TipoMovimiento.ENTRADA);
    const tieneSalida = movimientosPrevios.some((m) => m.tipoMovimiento === TipoMovimiento.SALIDA);

    // 4. Validaciones de negocio por tipo de movimiento
    if (dto.tipoMovimiento === TipoMovimiento.ENTRADA) {
      if (reserva.estado === EstadoReserva.CANCELADA) {
        throw new BadRequestException('La reserva se encuentra cancelada. Acceso rechazado.');
      }
      if (reserva.estado === EstadoReserva.COMPLETADA || tieneSalida) {
        throw new BadRequestException('Esta reserva ya fue completada.');
      }
      if (reserva.estado === EstadoReserva.EN_CURSO || tieneEntrada) {
        throw new BadRequestException('El vehículo ya ingresó previamente a las instalaciones.');
      }

      // Si estaba pendiente de cobro en efectivo, se asienta el pago automáticamente al permitir el ingreso
      if (reserva.estado === EstadoReserva.PENDIENTE_PAGO) {
        await this.reservaRepo.registrarPagoYConfirmar(reserva.id, {
          monto: reserva.total,
          metodoPago: 'EFECTIVO',
          fechaPago: new Date(),
        });
      }
    } else if (dto.tipoMovimiento === TipoMovimiento.SALIDA) {
      if (!tieneEntrada && reserva.estado !== EstadoReserva.EN_CURSO) {
        throw new BadRequestException(
          'No se puede registrar la salida de un vehículo que no ha registrado su entrada previa.',
        );
      }
      if (tieneSalida || reserva.estado === EstadoReserva.COMPLETADA) {
        throw new BadRequestException('La salida ya fue registrada con anterioridad.');
      }
    }

    // 5. Registrar el movimiento y actualizar estados atómicamente
    const reservaActualizada = await this.reservaRepo.registrarMovimiento(
      reserva.id,
      detalle.id,
      dto.tipoMovimiento,
      userId,
      dto.notas,
    );

    // 6. Notificar por WebSocket la actualización del estado del espacio en tiempo real
    if (detalle.espacioId) {
      try {
        const espacioActualizado = await this.prisma.espacio.findUnique({
          where: { id: detalle.espacioId },
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

    return ReservaMapper.toDto(reservaActualizada);
  }
}

