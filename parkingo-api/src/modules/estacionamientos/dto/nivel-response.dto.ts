import { ApiProperty } from '@nestjs/swagger';

export class NivelResponseDto {
  @ApiProperty({
    description: 'Identificador único del nivel (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Código o denominación del nivel',
    example: 'Piso 1',
  })
  codigo: string;

  @ApiProperty({
    description: 'UUID del estacionamiento al que pertenece el nivel',
    example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  })
  estacionamientoId: string;

  @ApiProperty({
    description: 'Cantidad de espacios/plazas registrados en este nivel',
    example: 24,
    required: false,
  })
  totalEspacios?: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-10-20T14:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-10-20T14:30:00.000Z',
  })
  updatedAt: Date;
}
