// src/modules/reservas/dto/verificar-acceso.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class VerificarAccesoDto {
  @ApiPropertyOptional({
    example: 'PARKINGO:v1:TKT-2026-4891:usr_123:est_456:EFECTIVO:1794945000000:a1b2c3d4e5f6g7h8',
    description: 'Token escaneado desde el código QR presentado por el conductor o código de boleta',
  })
  @IsOptional()
  @IsString({ message: 'El token o código debe ser una cadena de texto' })
  token?: string;

  @ApiPropertyOptional({
    example: 'PARKINGO:RES:TKT-2026-5188:b7265b8e-22f4:2f96c782',
    description: 'Alias alternativo para el token QR escaneado',
  })
  @IsOptional()
  @IsString({ message: 'El qrToken debe ser una cadena de texto' })
  qrToken?: string;

  @ApiPropertyOptional({
    description: 'ID opcional del estacionamiento para validar contexto de garita',
  })
  @IsOptional()
  @IsString()
  estacionamientoId?: string;
}

export class ResultadoVerificacionAccesoDto {
  @ApiProperty({ description: 'Indica si la credencial QR es auténtica y válida' })
  valido!: boolean;

  @ApiProperty({ description: 'Mensaje informativo o causa de rechazo' })
  mensaje!: string;

  @ApiPropertyOptional({ description: 'ID de la reserva' })
  reservaId?: string;

  @ApiPropertyOptional({ description: 'Código único de la boleta (ej. TKT-2026-4891)' })
  codigoReserva?: string;

  @ApiPropertyOptional({ description: 'Nombre completo del conductor titular' })
  clienteNombre?: string;

  @ApiPropertyOptional({ description: 'Correo del conductor' })
  clienteEmail?: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto del conductor' })
  clienteTelefono?: string | null;

  @ApiPropertyOptional({ description: 'Placa del vehículo con el que ingresa' })
  vehiculoPlaca?: string;

  @ApiPropertyOptional({ description: 'Modelo y color del vehículo' })
  vehiculoModelo?: string;

  @ApiPropertyOptional({ description: 'Código del espacio asignado (ej. A-1)' })
  espacioCodigo?: string;

  @ApiPropertyOptional({ description: 'Estado actual de la reserva (PENDIENTE_PAGO, CONFIRMADA, EN_CURSO, etc.)' })
  estadoReserva?: string;

  @ApiPropertyOptional({ description: 'Método de pago de la reserva (EFECTIVO o QR)' })
  metodoPago?: 'EFECTIVO' | 'QR';

  @ApiPropertyOptional({ description: 'Estado del pago registrado (PENDIENTE o COMPLETADO)' })
  estadoPago?: 'PENDIENTE' | 'COMPLETADO';

  @ApiPropertyOptional({ description: 'Monto total de la boleta a cobrar o ya cobrado' })
  montoTotal?: number;

  @ApiPropertyOptional({ description: 'Hora programada o inicio de la estadía' })
  horaIngreso?: string;

  @ApiPropertyOptional({ description: 'Duración estimada en horas' })
  duracionHoras?: number;

  @ApiPropertyOptional({ description: 'Indica si el operador debe cobrar dinero físico en garita' })
  requiereCobroEfectivo?: boolean;
}

