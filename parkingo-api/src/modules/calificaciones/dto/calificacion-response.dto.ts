import { ApiProperty } from '@nestjs/swagger';

export class CalificacionResponseDto {
  @ApiProperty({ example: 'b3f5c7a1-8d2e-4b6a-9c1f-0e2d3c4b5a6f' })
  id: string;

  @ApiProperty({ example: 5 })
  puntaje: number;

  @ApiProperty({ example: 'Excelente parqueo, muy seguro y techado.' })
  comentario: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  estacionamientoId: string;

  @ApiProperty({ example: 'ParkinGo Central Equipetrol' })
  estacionamientoNombre: string;

  @ApiProperty({ example: 'c1d2e3f4-g5h6-7890-ijkl-mnopqrstuvwx' })
  clienteId: string;

  @ApiProperty({ example: 'Carlos Mendizábal' })
  clienteNombre: string;

  @ApiProperty({ example: '2026-10-26T16:00:00.000Z' })
  fechaCreado: Date;
}
