import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { HorarioItemDto } from './horario-item.dto.js';

export class RegistrarEstacionamientoDto {
  @ApiProperty({
    description: 'UUID del Tenant (empresa) al cual vincular el estacionamiento. Si no se envía, se asociará al tenant por defecto del usuario o se creará uno.',
    example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El tenantId debe ser un UUID válido (versión 4)' })
  tenantId?: string;
  @ApiProperty({
    description: 'Nombre comercial del estacionamiento',
    example: 'Estacionamiento Central ParkinGo',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Dirección física completa del estacionamiento',
    example: 'Av. Heroínas #456 entre San Martín y 25 de Mayo',
  })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  direccion: string;

  @ApiProperty({
    description: 'Latitud geográfica para geolocalización',
    example: -17.3935,
  })
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'La latitud debe ser un valor numérico decimal' })
  @IsNotEmpty({ message: 'La latitud es obligatoria' })
  latitud: number;

  @ApiProperty({
    description: 'Longitud geográfica para geolocalización',
    example: -66.157,
  })
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'La longitud debe ser un valor numérico decimal' })
  @IsNotEmpty({ message: 'La longitud es obligatoria' })
  longitud: number;

  @ApiProperty({
    description: 'Lista de horarios de atención por día de la semana',
    type: [HorarioItemDto],
  })
  @Transform(({ value }) => {
    let parsed = value;
    if (typeof value === 'string') {
      try {
        parsed = JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (Array.isArray(parsed)) {
      return plainToInstance(HorarioItemDto, parsed);
    }
    return parsed;
  })
  @IsArray({ message: 'Los horarios deben enviarse como una lista' })
  @ValidateNested({ each: true })
  @Type(() => HorarioItemDto)
  horarios: HorarioItemDto[];
}
