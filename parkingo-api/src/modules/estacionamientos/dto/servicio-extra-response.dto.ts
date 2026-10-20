import { ApiProperty } from '@nestjs/swagger';

export class ServicioExtraResponseDto {
  @ApiProperty({
    description: 'Identificador único del servicio extra (UUID)',
    example: 'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del servicio extra',
    example: 'Lavado Ecológico Completo',
  })
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada del servicio',
    example: 'Lavado exterior e interior con productos biodegradables y aspirado.',
    nullable: true,
  })
  descripcion: string | null;

  @ApiProperty({
    description: 'Precio del servicio en moneda local (Bs.)',
    example: 35.5,
  })
  precio: number;

  @ApiProperty({
    description: 'Indica si el servicio está activo y disponible para los conductores',
    example: true,
  })
  activo: boolean;

  @ApiProperty({
    description: 'UUID del estacionamiento al que pertenece el servicio',
    example: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
  })
  estacionamientoId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2026-10-20T14:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-10-20T14:30:00.000Z',
  })
  updatedAt: Date;
}
