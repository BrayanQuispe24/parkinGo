// src/modules/reservas/strategies/qr-payment.strategy.ts
import { Injectable } from '@nestjs/common';
import type {
  PaymentStrategy,
  MetodoPagoTipo,
  IniciarPagoParams,
  InicioPagoResult,
  ConfirmarPagoParams,
  ResultadoPago,
} from './payment-strategy.interface.js';

@Injectable()
export class QrPaymentStrategy implements PaymentStrategy {
  readonly metodo: MetodoPagoTipo = 'QR';

  async iniciarPago(params: IniciarPagoParams): Promise<InicioPagoResult> {
    const diezMinutos = 10 * 60 * 1000;
    const fechaExpiracion = new Date(Date.now() + diezMinutos).toISOString();

    // Generación del token estándar interoperable para QR Simple
    const qrTextoPayload = `PARKINGO:QR:PAGO:${params.codigoReserva}:${params.montoTotal.toFixed(2)}:BOB:${Date.now()}`;

    return {
      metodoPago: this.metodo,
      requiereAccionCliente: true,
      qrData: {
        qrTextoPayload,
        expiraEn: fechaExpiracion,
      },
      instrucciones: `Escanea el código QR desde tu aplicación bancaria móvil para pagar Bs. ${params.montoTotal.toFixed(2)}. Tienes 10 minutos antes de que el código expire.`,
    };
  }

  async confirmarPago(params: ConfirmarPagoParams): Promise<ResultadoPago> {
    const referencia = params.referenciaExterna || `QR-DIGITAL-${Date.now()}`;

    return {
      metodoPago: this.metodo,
      estadoPago: 'COMPLETADO',
      montoCobrado: params.montoTotal,
      referencia,
      fechaPago: new Date(),
    };
  }
}

