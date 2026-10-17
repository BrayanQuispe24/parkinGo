import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TenantStatus } from '@prisma/client';

export class TenantUserSummaryDto {
  @ApiProperty({ example: 'usr-123', description: 'ID del usuario propietario' })
  id: string;

  @ApiProperty({ example: 'admin@parkingo.app', description: 'Correo del usuario' })
  email: string;

  @ApiProperty({ example: 'Brayan', description: 'Nombre del usuario' })
  firstName: string;

  @ApiProperty({ example: 'Quispe', description: 'Apellido del usuario' })
  lastName: string;

  @ApiPropertyOptional({ example: '+591 773-48291', description: 'Teléfono' })
  phone?: string | null;

  @ApiProperty({ example: '6305914', description: 'Cédula de Identidad' })
  ci: string;
}

export class TenantResponseDto {
  @ApiProperty({ example: 'tnt-uuid-1234', description: 'Identificador único UUID' })
  id: string;

  @ApiProperty({ example: 'AutoPark Equipetrol SRL', description: 'Nombre comercial' })
  nombre: string;

  @ApiProperty({ example: '10293847019', description: 'NIT de la empresa' })
  nit: string;

  @ApiProperty({ example: 'AutoPark Equipetrol Sociedad de Responsabilidad Limitada', description: 'Razón Social' })
  razonSocial: string;

  @ApiProperty({ enum: TenantStatus, example: TenantStatus.ACTIVO, description: 'Estado actual' })
  estado: TenantStatus;

  @ApiPropertyOptional({ example: 'Av. San Martín #450, Barrio Equipetrol', description: 'Dirección física de la empresa' })
  direccion?: string | null;

  @ApiPropertyOptional({ example: 'Santa Cruz de la Sierra', description: 'Ciudad donde radica la empresa' })
  ciudad?: string | null;

  @ApiPropertyOptional({ example: -17.7833, description: 'Latitud geográfica WGS84' })
  latitud?: number | null;

  @ApiPropertyOptional({ example: -63.1880, description: 'Longitud geográfica WGS84' })
  longitud?: number | null;

  @ApiProperty({ example: 'usr-uuid-1234', description: 'ID del usuario creador/administrador' })
  usuarioId: string;

  @ApiPropertyOptional({ type: () => TenantUserSummaryDto, description: 'Datos del usuario propietario' })
  usuario?: TenantUserSummaryDto;

  @ApiProperty({ example: '2026-10-16T12:00:00.000Z', description: 'Fecha de creación' })
  createdAt: string;

  @ApiProperty({ example: '2026-10-16T12:00:00.000Z', description: 'Fecha de última actualización' })
  updatedAt: string;
}
