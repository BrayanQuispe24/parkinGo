import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CotizarServicioExtraItemDto {
  @ApiProperty({ description: 'ID del servicio extra configurable de BD' })
  @IsUUID('4', { message: 'El ID del servicio extra debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El servicioExtraId es obligatorio' })
  servicioExtraId!: string;

  @ApiPropertyOptional({ description: 'Cantidad a contratar (por defecto 1)', default: 1 })
  @IsOptional()
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser mayor a 0' })
  cantidad?: number = 1;
}

export class CotizarEspacioItemDto {
  @ApiProperty({ description: 'ID del espacio de parqueo a reservar' })
  @IsUUID('4', { message: 'El espacioId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El espacioId es obligatorio' })
  espacioId!: string;

  @ApiProperty({ description: 'Duración estimada en horas para el cálculo de la tarifa base', example: 2 })
  @IsPositive({ message: 'La duración en horas debe ser mayor a 0' })
  duracionHoras!: number;

  @ApiPropertyOptional({ description: 'ID del vehículo vinculado opcional' })
  @IsOptional()
  @IsUUID('4', { message: 'El vehiculoId debe ser un UUID válido' })
  vehiculoId?: string;

  @ApiPropertyOptional({
    description: 'Lista de servicios extras contratados específicamente para este espacio',
    type: [CotizarServicioExtraItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CotizarServicioExtraItemDto)
  serviciosExtras?: CotizarServicioExtraItemDto[];
}

export class CotizarReservaDto {
  @ApiProperty({ description: 'ID del estacionamiento' })
  @IsUUID('4', { message: 'El estacionamientoId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El estacionamientoId es obligatorio' })
  estacionamientoId!: string;

  @ApiProperty({
    description: 'Lista de espacios a cotizar con sus respectivos servicios extras',
    type: [CotizarEspacioItemDto],
  })
  @IsArray({ message: 'Debe enviar una lista de espacios' })
  @IsNotEmpty({ message: 'La lista de espacios no puede estar vacía' })
  @ValidateNested({ each: true })
  @Type(() => CotizarEspacioItemDto)
  espacios!: CotizarEspacioItemDto[];
}
