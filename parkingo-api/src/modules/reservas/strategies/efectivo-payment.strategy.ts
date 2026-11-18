// src/modules/reservas/strategies/efectivo-payment.strategy.ts
import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import type {
  PaymentStrategy,
  MetodoPagoTipo,
  IniciarPagoParams,
  InicioPagoResult,
  ConfirmarPagoParams,
  ResultadoPago,
} from './payment-strategy.interface.js';

@Injectable()
export class EfectivoPaymentStrategy implements PaymentStrategy {
  readonly metodo: MetodoPagoTipo = 'EFECTIVO';

  async iniciarPago(params: IniciarPagoParams): Promise<InicioPagoResult> {
    return {
      metodoPago: this.metodo,
      requiereAccionCliente: false,
      instrucciones: `Tu reserva "${params.codigoReserva}" está confirmada para pago en persona. Al ingresar al parqueo, el operador o anfitrión registrará el cobro de Bs. ${params.montoTotal.toFixed(2)} en efectivo.`,
    };
  }

  async confirmarPago(params: ConfirmarPagoParams): Promise<ResultadoPago> {
    const rol = (params.rolCobrador || '').trim().toUpperCase();

    // Regla de Negocio: Solo personal de garita o anfitrión autorizado puede registrar cobro en efectivo
    const rolesAutorizados = ['PARKING_OPERATOR', 'OPERATOR', 'HOST', 'PARKING_ADMIN', 'SUPER_ADMIN'];
    if (!rolesAutorizados.includes(rol)) {
      throw new ForbiddenException(
        'Acceso denegado: Únicamente el operador de garita o el anfitrión del parqueo pueden asentar cobros en efectivo.',
      );
    }

    let cambioEntregado = 0;
    if (params.montoEntregado !== undefined && params.montoEntregado !== null) {
      if (params.montoEntregado < params.montoTotal) {
        throw new BadRequestException(
          `Monto insuficiente: El efectivo entregado (Bs. ${params.montoEntregado}) es menor al total de la reserva (Bs. ${params.montoTotal}).`,
        );
      }
      cambioEntregado = Math.round((params.montoEntregado - params.montoTotal) * 100) / 100;
    }

    return {
      metodoPago: this.metodo,
      estadoPago: 'COMPLETADO',
      montoCobrado: params.montoTotal,
      cambioEntregado,
      referencia: `EFECTIVO-GARITA-${Date.now()}`,
      fechaPago: new Date(),
    };
  }
}

