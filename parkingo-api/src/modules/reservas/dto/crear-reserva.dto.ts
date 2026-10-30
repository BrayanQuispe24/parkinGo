import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ModalidadTarifa } from '@prisma/client';

export class CrearServicioExtraItemDto {
  @ApiProperty({ description: 'ID del servicio extra configurable de BD' })
  @IsUUID('4', { message: 'El ID del servicio extra debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El servicioExtraId es obligatorio' })
  servicioExtraId!: string;

  @ApiPropertyOptional({ description: 'Cantidad del servicio (por defecto 1)', default: 1 })
  @IsOptional()
  @IsInt({ message: 'La cantidad debe ser un entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad?: number = 1;
}

export class CrearEspacioItemDto {
  @ApiProperty({ description: 'ID del espacio a reservar' })
  @IsUUID('4', { message: 'El espacioId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El espacioId es obligatorio' })
  espacioId!: string;

  @ApiProperty({
    description: 'Fecha y hora de inicio de la reserva (formato ISO 8601)',
    example: '2026-10-28T14:00:00.000Z',
  })
  @IsDateString({}, { message: 'inicioReserva debe ser una fecha ISO 8601 válida' })
  @IsNotEmpty({ message: 'inicioReserva es obligatorio' })
  inicioReserva!: string;

  @ApiProperty({
    description: 'Fecha y hora de finalización de la reserva (formato ISO 8601)',
    example: '2026-10-28T16:00:00.000Z',
  })
  @IsDateString({}, { message: 'finReserva debe ser una fecha ISO 8601 válida' })
  @IsNotEmpty({ message: 'finReserva es obligatorio' })
  finReserva!: string;

  @ApiPropertyOptional({ description: 'ID del vehículo que ocupará el espacio' })
  @IsOptional()
  @IsUUID('4', { message: 'El vehiculoId debe ser un UUID válido' })
  vehiculoId?: string;

  @ApiPropertyOptional({
    description: 'Lista de servicios extras contratados exclusivamente para este espacio',
    type: [CrearServicioExtraItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearServicioExtraItemDto)
  serviciosExtras?: CrearServicioExtraItemDto[];
}

export class CrearReservaDto {
  @ApiProperty({ description: 'ID del estacionamiento donde se realiza la reserva' })
  @IsUUID('4', { message: 'El estacionamientoId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estacionamientoId es obligatorio' })
  estacionamientoId!: string;

  @ApiPropertyOptional({
    description: 'Modalidad de tarifa aplicada (HORA, DIA, MES)',
    enum: ModalidadTarifa,
    default: ModalidadTarifa.HORA,
  })
  @IsOptional()
  @IsEnum(ModalidadTarifa, { message: 'Modalidad de tarifa inválida' })
  modalidad?: ModalidadTarifa = ModalidadTarifa.HORA;

  @ApiPropertyOptional({
    description:
      'ID del cliente en sesión o cliente atendido por un PARKING_OPERATOR en ventanilla/garita',
  })
  @IsOptional()
  @IsUUID('4', { message: 'clienteId debe ser un UUID válido' })
  clienteId?: string;

  @ApiProperty({
    description: 'Lista de espacios a reservar con sus respectivos servicios extras',
    type: [CrearEspacioItemDto],
  })
  @IsArray({ message: 'Debe incluir al menos un espacio para reservar' })
  @IsNotEmpty({ message: 'La lista de espacios no puede estar vacía' })
  @ValidateNested({ each: true })
  @Type(() => CrearEspacioItemDto)
  espacios!: CrearEspacioItemDto[];
}
