import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { TenantStatus } from '@prisma/client';

export class UpdateTenantDto {
  @ApiPropertyOptional({
    example: 'AutoPark Equipetrol Modificado SRL',
    description: 'Nombre comercial de la empresa',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(3, 120, { message: 'El nombre debe tener entre 3 y 120 caracteres' })
  nombre?: string;

  @ApiPropertyOptional({
    example: '10293847019',
    description: 'Número de Identificación Tributaria (NIT)',
  })
  @IsOptional()
  @IsString({ message: 'El NIT debe ser una cadena de texto' })
  @Matches(/^[0-9A-Za-z-]{5,20}$/, {
    message: 'El NIT debe contener entre 5 y 20 caracteres válidos',
  })
  nit?: string;

  @ApiPropertyOptional({
    example: 'AutoPark Equipetrol S.R.L.',
    description: 'Razón Social legal',
  })
  @IsOptional()
  @IsString({ message: 'La razón social debe ser una cadena de texto' })
  @Length(3, 160, { message: 'La razón social debe tener entre 3 y 160 caracteres' })
  razonSocial?: string;

  @ApiPropertyOptional({
    enum: TenantStatus,
    example: TenantStatus.ACTIVO,
    description: 'Estado de la empresa (ACTIVO o INACTIVO)',
  })
  @IsOptional()
  @IsEnum(TenantStatus, { message: 'El estado debe ser ACTIVO o INACTIVO' })
  estado?: TenantStatus;

  @ApiPropertyOptional({
    example: 'Av. San Martín #450, Barrio Equipetrol',
    description: 'Dirección física de la empresa',
  })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @Length(3, 200, { message: 'La dirección debe tener entre 3 y 200 caracteres' })
  direccion?: string;

  @ApiPropertyOptional({
    example: 'Santa Cruz de la Sierra',
    description: 'Ciudad de la empresa',
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

