// src/modules/reservas/dto/pago.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { METODOS_PAGO, type MetodoPagoTipo } from '../strategies/payment-strategy.interface.js';

export class IniciarPagoDto {
  @ApiProperty({
    enum: METODOS_PAGO,
    example: 'QR',
    description: 'Canal o método de pago a inicializar',
  })
  @IsEnum(METODOS_PAGO, {
    message: 'El método de pago debe ser EFECTIVO o QR',
  })
  metodoPago!: MetodoPagoTipo;
}

export class ConfirmarPagoDto {
  @ApiProperty({
    enum: METODOS_PAGO,
    example: 'EFECTIVO',
    description: 'Método de pago ejecutado',
  })
  @IsEnum(METODOS_PAGO, {
    message: 'El método de pago debe ser EFECTIVO o QR',
  })
  metodoPago!: MetodoPagoTipo;

  @ApiPropertyOptional({
    example: 50.0,
    description: 'Monto en efectivo recibido por el operador para cálculo automático de cambio',
  })
  @IsOptional()
  @IsNumber({}, { message: 'El monto entregado debe ser numérico' })
  @Min(0, { message: 'El monto entregado no puede ser negativo' })
  montoEntregado?: number;

  @ApiPropertyOptional({
    example: 'Pago recibido en efectivo en puerta norte',
    description: 'Notas u observaciones del cobrador',
  })
  @IsOptional()
  @IsString()
  notas?: string;

  @ApiPropertyOptional({
    example: 'TX-BNB-984214',
    description: 'Identificador de transacción externa o referencia digital bancaria',
  })
  @IsOptional()
  @IsString()
  referenciaExterna?: string;
}

export class QrDataResponseDto {
  @ApiProperty({ example: 'PARKINGO:QR:PAGO:TKT-2026-1402:25.00:BOB:1731850000' })
  qrTextoPayload!: string;

  @ApiProperty({ example: '2026-11-17T15:10:00.000Z' })
  expiraEn!: string;
}

export class InicioPagoResponseDto {
  @ApiProperty({ enum: METODOS_PAGO, example: 'QR' })
  metodoPago!: MetodoPagoTipo;

  @ApiProperty({ example: true })
  requiereAccionCliente!: boolean;

  @ApiPropertyOptional({ type: QrDataResponseDto })
  qrData?: QrDataResponseDto;

  @ApiPropertyOptional({
    example: 'Escanea el código QR desde tu app bancaria móvil para completar el pago.',
  })
  instrucciones?: string;
}

