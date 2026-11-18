// src/modules/reservas/strategies/payment-strategy.resolver.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import type { PaymentStrategy, MetodoPagoTipo } from './payment-strategy.interface.js';
import { EfectivoPaymentStrategy } from './efectivo-payment.strategy.js';
import { QrPaymentStrategy } from './qr-payment.strategy.js';

@Injectable()
export class PaymentStrategyResolver {
  private readonly strategies = new Map<MetodoPagoTipo, PaymentStrategy>();

  constructor(
    private readonly efectivoStrategy: EfectivoPaymentStrategy,
    private readonly qrStrategy: QrPaymentStrategy,
  ) {
    this.strategies.set('EFECTIVO', this.efectivoStrategy);
    this.strategies.set('QR', this.qrStrategy);
  }

  /**
   * Resuelve dinámicamente la estrategia de pago según el canal seleccionado.
   * Lanza BadRequestException si el método solicitado no está soportado.
   */
  resolve(metodo?: string | null): PaymentStrategy {
    const normalizado = (metodo || 'EFECTIVO').trim().toUpperCase() as MetodoPagoTipo;

    const strategy = this.strategies.get(normalizado);
    if (!strategy) {
      throw new BadRequestException(
        `Método de pago "${metodo}" no soportado. Métodos activos disponibles: ${Array.from(this.strategies.keys()).join(', ')}`,
      );
    }

    return strategy;
  }

  getMetodosDisponibles(): MetodoPagoTipo[] {
    return Array.from(this.strategies.keys());
  }
}

