import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    example: 'AutoPark Equipetrol SRL',
    description: 'Nombre comercial de la empresa o tenant',
  })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 120, { message: 'El nombre debe tener entre 3 y 120 caracteres' })
  nombre: string;

  @ApiProperty({
    example: '10293847019',
    description: 'Número de Identificación Tributaria (NIT)',
  })
  @IsNotEmpty({ message: 'El NIT es obligatorio' })
  @IsString({ message: 'El NIT debe ser una cadena de texto' })
  @Matches(/^[0-9A-Za-z-]{5,20}$/, {
    message: 'El NIT debe contener entre 5 y 20 caracteres válidos (números, letras o guiones)',
  })
  nit: string;

  @ApiProperty({
    example: 'AutoPark Equipetrol Sociedad de Responsabilidad Limitada',
    description: 'Razón Social legal de la empresa',
  })
  @IsNotEmpty({ message: 'La razón social es obligatoria' })
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @Length(3, 160, { message: 'La razón social debe tener entre 3 y 160 caracteres' })
  razonSocial: string;

  @ApiPropertyOptional({
    example: 'Av. San Martín #450, Barrio Equipetrol',
    description: 'Dirección física descriptiva de la empresa',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(3, 200, { message: 'La dirección debe tener entre 3 y 200 caracteres' })
  direccion?: string;

  @ApiPropertyOptional({
    example: 'Santa Cruz de la Sierra',
    description: 'Ciudad o municipio de radicación de la empresa',
  })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser una cadena de texto' })
  @Length(2, 100, { message: 'La ciudad debe tener entre 2 y 100 caracteres' })
  ciudad?: string;

  @ApiPropertyOptional({
    example: -17.7833,
    description: 'Latitud geográfica WGS84 de la ubicación (-90 a 90)',
  })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un valor numérico decimal' })
  @Min(-90, { message: 'La latitud no puede ser menor a -90' })
  @Max(90, { message: 'La latitud no puede ser mayor a 90' })
  latitud?: number;

  @ApiPropertyOptional({
    example: -63.1880,
    description: 'Longitud geográfica WGS84 de la ubicación (-180 a 180)',
  })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un valor numérico decimal' })
  @Min(-180, { message: 'La longitud no puede ser menor a -180' })
  @Max(180, { message: 'La longitud no puede ser mayor a 180' })
  longitud?: number;
}

