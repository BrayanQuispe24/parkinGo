import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana, EstadoEstacionamiento } from '@prisma/client';

export class FotoResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: '/uploads/estacionamientos/foto_123.jpg' })
  url: string;

  @ApiProperty({ example: '2026-10-19T14:00:00.000Z' })
  createdAt: Date;
}

export class HorarioResponseDto {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901' })
  id: string;

  @ApiProperty({ enum: DiaSemana, example: DiaSemana.LUNES })
  dia: DiaSemana;

  @ApiProperty({ example: '08:00' })
  horaInicio: string;

  @ApiProperty({ example: '22:00' })
  horaCierre: string;
}

export class UsuarioSolicitanteDto {
  @ApiProperty({ example: 'usr-123' })
  id: string;

  @ApiProperty({ example: 'Juan' })
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @ApiProperty({ example: 'juan.perez@empresa.com' })
  email: string;

  @ApiProperty({ example: '+591 71234567', nullable: true })
  phone: string | null;

  @ApiProperty({ example: '1234567 CBBA', nullable: true })
  ci: string | null;

  @ApiProperty({ example: 'TENANT_ADMIN' })
  roleName: string;
}

export class TenantSolicitanteDto {
  @ApiProperty({ example: 'tenant-uuid-1234' })
  id: string;

  @ApiProperty({ example: 'Parkings del Valle S.R.L.' })
  nombre: string;

  @ApiProperty({ example: '1020304050' })
  nit: string;

  @ApiProperty({ example: 'Parkings del Valle Sociedad de Responsabilidad Limitada' })
  razonSocial: string;

  @ApiProperty({ example: 'Av. América #123', nullable: true })
  direccion: string | null;

  @ApiProperty({ example: 'Cochabamba', nullable: true })
  ciudad: string | null;

  @ApiProperty({ type: UsuarioSolicitanteDto, nullable: true })
  usuario?: UsuarioSolicitanteDto | null;
}

export class EstacionamientoResponseDto {
  @ApiProperty({ example: 'f3e2d1c0-b9a8-7654-3210-fedcba987654' })
  id: string;

  @ApiProperty({ example: 'Estacionamiento Central ParkinGo' })
  nombre: string;

  @ApiProperty({ example: 'Av. Heroínas #456 entre San Martín y 25 de Mayo' })
  direccion: string;

  @ApiProperty({ example: -17.3935 })
  latitud: number;

  @ApiProperty({ example: -66.157 })
  longitud: number;

  @ApiProperty({
    enum: EstadoEstacionamiento,
    example: EstadoEstacionamiento.PENDIENTE,
  })
  estado: EstadoEstacionamiento;

  @ApiProperty({ example: 'tenant-uuid-1234' })
  tenantId: string;

  @ApiProperty({ type: TenantSolicitanteDto, nullable: true })
  tenant?: TenantSolicitanteDto | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Motivo de rechazo en caso de no ser aprobado',
  })
  motivoRechazo: string | null;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Fecha de aprobación por el Administrador General',
  })
  fechaAprobacion: Date | null;

  @ApiProperty({ type: [FotoResponseDto] })
  fotos: FotoResponseDto[];

  @ApiProperty({ type: [HorarioResponseDto] })
  horarios: HorarioResponseDto[];

  @ApiProperty({ example: '2026-10-19T14:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-19T14:30:00.000Z' })
  updatedAt: Date;
}
