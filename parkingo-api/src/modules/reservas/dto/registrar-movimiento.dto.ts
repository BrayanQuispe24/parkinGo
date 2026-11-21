// src/modules/reservas/dto/registrar-movimiento.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TipoMovimiento } from '@prisma/client';

export class RegistrarMovimientoDto {
  @ApiPropertyOptional({
    description: 'Token escaneado del QR o código de la reserva (TKT-...)',
    example: 'TKT-2026-9774',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({
    description: 'Código de la reserva alternativo',
    example: 'TKT-2026-9774',
  })
  @IsOptional()
  @IsString()
  codigoReserva?: string;

  @ApiPropertyOptional({
    description: 'ID de la reserva opcional',
    example: 'uuid-reserva',
  })
  @IsOptional()
  @IsString()
  reservaId?: string;

  @ApiPropertyOptional({
    description: 'ID específico del detalle de reserva a marcar',
  })
  @IsOptional()
  @IsString()
  detalleReservacionId?: string;

  @ApiProperty({
    enum: TipoMovimiento,
    description: 'Tipo de movimiento a registrar: ENTRADA o SALIDA',
    example: TipoMovimiento.ENTRADA,
  })
  @IsNotEmpty({ message: 'El tipo de movimiento es requerido' })
  @IsEnum(TipoMovimiento, { message: 'El tipo de movimiento debe ser ENTRADA o SALIDA' })
  tipoMovimiento!: TipoMovimiento;

  @ApiPropertyOptional({
    description: 'Notas u observaciones del operador en garita',
    example: 'Ingreso normal del vehículo',
  })
  @IsOptional()
  @IsString()
  notas?: string;
}

export class RespuestaMovimientoDto {
  @ApiProperty({ description: 'Indica si el movimiento se registró exitosamente' })
  exito!: boolean;

  @ApiProperty({ description: 'Mensaje descriptivo del resultado' })
  mensaje!: string;

  @ApiProperty({ enum: TipoMovimiento, description: 'Tipo de movimiento procesado' })
  tipoMovimiento!: TipoMovimiento;

  @ApiProperty({ description: 'Hora y fecha exacta del registro' })
  fechaHora!: string;

  @ApiPropertyOptional({ description: 'Código del espacio vehicular' })
  espacioCodigo?: string;

  @ApiPropertyOptional({ description: 'Placa del vehículo' })
  vehiculoPlaca?: string;
}

