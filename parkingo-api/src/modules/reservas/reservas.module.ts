import { Module } from '@nestjs/common';
import { ReservasController } from './controllers/reservas.controller.js';
import { CotizarReservaAction } from './actions/cotizar-reserva.action.js';
import { CrearReservaAction } from './actions/crear-reserva.action.js';
import { GetMisReservasAction } from './actions/get-mis-reservas.action.js';
import { GetReservasEstacionamientoAction } from './actions/get-reservas-estacionamiento.action.js';
import { GetReservaByIdAction } from './actions/get-reserva-by-id.action.js';
import { CancelarReservaAction } from './actions/cancelar-reserva.action.js';
import { IniciarPagoReservaAction } from './actions/iniciar-pago-reserva.action.js';
import { ConfirmarPagoReservaAction } from './actions/confirmar-pago-reserva.action.js';
import { VerificarAccesoReservaAction } from './actions/verificar-acceso-reserva.action.js';
import { EfectivoPaymentStrategy } from './strategies/efectivo-payment.strategy.js';
import { QrPaymentStrategy } from './strategies/qr-payment.strategy.js';
import { PaymentStrategyResolver } from './strategies/payment-strategy.resolver.js';
import { ReservaRepository } from './repositories/reserva.repository.js';
import { PrismaReservaRepository } from './repositories/prisma-reserva.repository.js';

@Module({
  controllers: [ReservasController],
  providers: [
    CotizarReservaAction,
    CrearReservaAction,
    GetMisReservasAction,
    GetReservasEstacionamientoAction,
    GetReservaByIdAction,
    CancelarReservaAction,
    IniciarPagoReservaAction,
    ConfirmarPagoReservaAction,
    VerificarAccesoReservaAction,
    EfectivoPaymentStrategy,
    QrPaymentStrategy,
    PaymentStrategyResolver,
    {
      provide: ReservaRepository,
      useClass: PrismaReservaRepository,
    },
  ],
  exports: [ReservaRepository, PaymentStrategyResolver],
})
export class ReservasModule {}
