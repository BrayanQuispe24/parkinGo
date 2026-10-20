import { ApiProperty } from '@nestjs/swagger';
import { ModalidadTarifa, EstadoTarifa } from '@prisma/client';

export class TarifaResponseDto {
  @ApiProperty({
    description: 'Identificador único de la tarifa (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Descripción detallada de la tarifa',
    example: 'Tarifa Estándar Diurna para Vehículos Livianos',
  })
  descripcion: string;

  @ApiProperty({
    description: 'Monto de la tarifa en moneda local (Bs.)',
    example: 10.0,
  })
  monto: number;

  @ApiProperty({
    description: 'Modalidad de cobro de la tarifa',
    enum: ModalidadTarifa,
    example: ModalidadTarifa.HORA,
  })
  modalidad: ModalidadTarifa;

  @ApiProperty({
    description: 'Estado de la tarifa (ACTIVO o INACTIVO)',
    enum: EstadoTarifa,
    example: EstadoTarifa.ACTIVO,
  })
  estado: EstadoTarifa;

  @ApiProperty({
    description: 'UUID del estacionamiento al que pertenece la tarifa',
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
