import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { TipoVehiculo } from '@prisma/client';

export class CrearVehiculoDto {
  @ApiProperty({
    description: 'Tipo o categoría de vehículo',
    enum: TipoVehiculo,
    example: TipoVehiculo.SEDAN,
  })
  @IsEnum(TipoVehiculo, {
    message: 'El tipo debe ser uno de: SEDAN, SUV, CAMIONETA, MOTO, ELECTRICO, OTRO',
  })
  @IsNotEmpty({ message: 'El tipo de vehículo es obligatorio' })
  tipo!: TipoVehiculo;

  @ApiProperty({
    description: 'Número de placa único del vehículo',
    example: '9912-KLS',
  })
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La placa es obligatoria' })
  @Matches(/^[A-Z0-9\-\s]{3,12}$/i, {
    message: 'Formato de placa inválido. Solo se admiten letras, números y guiones (3 a 12 caracteres)',
  })
  placa!: string;

  @ApiProperty({
    description: 'Marca y modelo del vehículo',
    example: 'Toyota Corolla 2023',
  })
  @IsString({ message: 'El modelo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El modelo es obligatorio' })
  modelo!: string;

  @ApiProperty({
    description: 'Color predominante del vehículo',
    example: 'Blanco Perlado',
  })
  @IsString({ message: 'El color debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El color es obligatorio' })
  color!: string;

  @ApiProperty({
    description: 'Define si este vehículo se marcará como predeterminado para reservas inmediatas',
    example: false,
    required: false,
  })
  @IsOptional()
  esPredeterminado?: boolean;
}
