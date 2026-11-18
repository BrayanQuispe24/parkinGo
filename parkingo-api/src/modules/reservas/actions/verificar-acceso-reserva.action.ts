// src/modules/reservas/actions/verificar-acceso-reserva.action.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EstadoReserva } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { QrTokenUtil } from '../utils/qr-token.util.js';
import {
  VerificarAccesoDto,
  ResultadoVerificacionAccesoDto,
} from '../dto/verificar-acceso.dto.js';

@Injectable()
export class VerificarAccesoReservaAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: VerificarAccesoDto,
  ): Promise<ResultadoVerificacionAccesoDto> {
    const role = (user.roleName || user.role || '').trim().toUpperCase();
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // 1. Validar formato y firma del token QR o código ingresado
    const rawToken = (dto.token || dto.qrToken || '').trim();
    if (!rawToken) {
      return {
        valido: false,
        mensaje: 'El token o código QR de la reserva es obligatorio para la verificación.',
      };
    }

    const validacion = QrTokenUtil.validarTokenAcceso(rawToken);
    let reserva = null;

    if (validacion.codigoReserva) {
      reserva = await this.reservaRepo.findByCodigo(validacion.codigoReserva);
    }

    if (!reserva) {
      reserva = await this.reservaRepo.findByQrToken(rawToken);
    }

    if (!reserva) {
      return {
        valido: false,
        mensaje: 'Código o token QR no válido. No existe ninguna reserva asociada en el sistema.',
      };
    }

    // 2. Validar que el operador o anfitrión tenga potestad sobre este estacionamiento
    const estacionamiento = await this.prisma.estacionamiento.findUnique({
      where: { id: reserva.estacionamientoId },
      include: {
        tenant: true,
        operadores: { select: { id: true } },
      },
    });

    if (!estacionamiento) {
      return {
        valido: false,
        mensaje: 'Estacionamiento asociado a la reserva no encontrado.',
      };
    }

    const esDuenio = estacionamiento.tenant?.usuarioId === userId;
    const esOperadorAsignado = estacionamiento.operadores?.some((op) => op.id === userId);
    const esSuperAdmin = role === 'SUPER_ADMIN';

    if (!esDuenio && !esOperadorAsignado && !esSuperAdmin) {
      return {
        valido: false,
        mensaje: `Esta reserva pertenece al parqueo "${estacionamiento.nombre}". Tu usuario en sesión no está registrado como su anfitrión ni operador autorizado.`,
      };
    }

    // 3. Evaluar el estado de la reserva y el método de pago
    const primerDetalle = reserva.detalles[0];
    const primerPago = reserva.pagos && reserva.pagos.length > 0 ? reserva.pagos[0] : null;
    const metodoPago = (primerPago?.metodoPago || 'EFECTIVO') as 'EFECTIVO' | 'QR';

    const fechaIngreso = new Date(primerDetalle?.inicioReserva || reserva.fechaCreacion);
    const fechaFin = new Date(primerDetalle?.finReserva || reserva.fechaCreacion);
    const duracionHoras = Math.max(
      1,
      Math.round((fechaFin.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60)) || 1,
    );

    const baseResponse: Omit<ResultadoVerificacionAccesoDto, 'valido' | 'mensaje'> = {
      reservaId: reserva.id,
      codigoReserva: reserva.codigoReserva,
      clienteNombre: `${reserva.cliente.firstName} ${reserva.cliente.lastName}`.trim(),
      clienteEmail: reserva.cliente.email,
      clienteTelefono: reserva.cliente.phone,
      vehiculoPlaca: primerDetalle?.vehiculo?.placa || 'Sin placa registrada',
      vehiculoModelo: primerDetalle?.vehiculo
        ? `${primerDetalle.vehiculo.modelo} (${primerDetalle.vehiculo.color})`
        : 'Vehículo Conductor',
      espacioCodigo: primerDetalle?.espacio?.codigoEspacio || 'Plaza Asignada',
      estadoReserva: reserva.estado,
      metodoPago,
      estadoPago: primerPago?.estado === 'COMPLETADO' ? 'COMPLETADO' : 'PENDIENTE',
      montoTotal: reserva.total,
      horaIngreso: fechaIngreso.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      duracionHoras,
      requiereCobroEfectivo: false,
    };

    if (reserva.estado === EstadoReserva.CANCELADA) {
      return {
        ...baseResponse,
        valido: false,
        mensaje: 'La reserva se encuentra CANCELADA. Acceso denegado.',
      };
    }

    if (reserva.estado === EstadoReserva.COMPLETADA) {
      return {
        ...baseResponse,
        valido: false,
        mensaje: 'Esta reserva ya fue UTILIZADA y COMPLETADA anteriormente.',
      };
    }

    // Si la reserva es en EFECTIVO y está pendiente de pago
    if (metodoPago === 'EFECTIVO' && reserva.estado === EstadoReserva.PENDIENTE_PAGO) {
      return {
        ...baseResponse,
        valido: true,
        mensaje: `Credencial auténtica. Pendiente de cobro en garita por Bs. ${reserva.total.toFixed(2)}.`,
        requiereCobroEfectivo: true,
      };
    }

    // Si la reserva es en QR digital pero el cliente aún no la pagó
    if (metodoPago === 'QR' && reserva.estado === EstadoReserva.PENDIENTE_PAGO) {
      return {
        ...baseResponse,
        valido: false,
        mensaje: 'El cliente seleccionó Pago Digital QR pero aún no ha realizado la transferencia.',
        requiereCobroEfectivo: false,
      };
    }

    // Si la reserva ya está confirmada o en curso (Pagada vía QR o ya cobrada previamente)
    return {
      ...baseResponse,
      valido: true,
      mensaje: 'Acceso autorizado. Reserva pagada y confirmada satisfactoriamente.',
      requiereCobroEfectivo: false,
      estadoPago: 'COMPLETADO',
    };
  }
}
