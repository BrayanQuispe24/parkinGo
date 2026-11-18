// src/modules/reservas/strategies/payment-strategy.interface.ts

export const METODOS_PAGO = ['EFECTIVO', 'QR'] as const;
export type MetodoPagoTipo = (typeof METODOS_PAGO)[number];

export interface IniciarPagoParams {
  reservacionId: string;
  codigoReserva: string;
  montoTotal: number;
  clienteId: string;
  estacionamientoId: string;
}

export interface InicioPagoResult {
  metodoPago: MetodoPagoTipo;
  requiereAccionCliente: boolean;
  qrData?: {
    qrTextoPayload: string;
    expiraEn: string;
  };
  instrucciones?: string;
}

export interface ConfirmarPagoParams {
  reservacionId: string;
  montoTotal: number;
  usuarioCobradorId?: string;
  rolCobrador?: string;
  montoEntregado?: number;
  referenciaExterna?: string;
  notas?: string;
}

export interface ResultadoPago {
  metodoPago: MetodoPagoTipo;
  estadoPago: 'COMPLETADO' | 'PENDIENTE' | 'FALLIDO';
  montoCobrado: number;
  cambioEntregado?: number;
  referencia?: string;
  fechaPago: Date;
}

/**
 * Contrato del Patrón Strategy (GoF) para procesamiento de métodos de pago.
 * Encapsula la lógica algorítmica de inicialización y confirmación según el canal de pago.
 */
export interface PaymentStrategy {
  readonly metodo: MetodoPagoTipo;
  iniciarPago(params: IniciarPagoParams): Promise<InicioPagoResult>;
  confirmarPago(params: ConfirmarPagoParams): Promise<ResultadoPago>;
}

