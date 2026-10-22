import { ApiProperty } from '@nestjs/swagger';

export class OperadorEstacionamientoResponseDto {
  @ApiProperty({ description: 'ID único del usuario', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Correo electrónico institucional o personal', example: 'operador1@parkingo.bo' })
  email: string;

  @ApiProperty({ description: 'Nombres del operador', example: 'Carlos' })
  firstName: string;

  @ApiProperty({ description: 'Apellidos del operador', example: 'Mamani' })
  lastName: string;

  @ApiProperty({ description: 'Nombre completo unificado', example: 'Carlos Mamani' })
  nombreCompleto: string;

  @ApiProperty({ description: 'Cédula de identidad', example: '6789123' })
  ci: string;

  @ApiProperty({ description: 'Número de contacto o celular', example: '71234567', required: false, nullable: true })
  phone?: string | null;

  @ApiProperty({ description: 'Avatar o foto de perfil', required: false, nullable: true })
  photoUrl?: string | null;

  @ApiProperty({ description: 'Estado actual del usuario en la plataforma', example: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'ID del estacionamiento al que se encuentra asignado actualmente', required: false, nullable: true })
  estacionamientoId?: string | null;

  @ApiProperty({ description: 'Nombre del rol asignado', example: 'PARKING_OPERATOR' })
  roleName: string;

  @ApiProperty({ description: 'Fecha de registro del usuario', example: '2026-10-21T10:00:00.000Z' })
  createdAt: string;
}
