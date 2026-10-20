import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ModalidadTarifa, EstadoTarifa } from '@prisma/client';

export class CreateTarifaDto {
  @ApiProperty({
    description: 'Descripción del esquema de tarifa',
    example: 'Tarifa Estándar Diurna para Vehículos Livianos',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción de la tarifa es obligatoria' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  descripcion: string;

  @ApiProperty({
    description: 'Monto de la tarifa en moneda local (Bs.)',
    example: 10.0,
  })
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @ApiProperty({
    description: 'Modalidad de cobro de la tarifa',
    enum: ModalidadTarifa,
    example: ModalidadTarifa.HORA,
  })
  @IsEnum(ModalidadTarifa, {
    message: 'La modalidad debe ser una de: HORA, DIA, MES',
  })
  @IsNotEmpty({ message: 'La modalidad es obligatoria' })
  modalidad: ModalidadTarifa;

  @ApiProperty({
    description: 'Estado de la tarifa (ACTIVO o INACTIVO)',
    enum: EstadoTarifa,
    example: EstadoTarifa.ACTIVO,
    required: false,
    default: EstadoTarifa.ACTIVO,
  })
  @IsOptional()
  @IsEnum(EstadoTarifa, {
    message: 'El estado debe ser ACTIVO o INACTIVO',
  })
  estado?: EstadoTarifa;
}
