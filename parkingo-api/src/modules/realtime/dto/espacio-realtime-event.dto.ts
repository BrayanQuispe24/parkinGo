import { ApiProperty } from '@nestjs/swagger';
import { EstadoEspacio, ModalidadTarifa, TipoEspacio } from '@prisma/client';

export type EspacioRealtimeAction = 'CREATED' | 'UPDATED' | 'DELETED';

export class EspacioRealtimeEventDto {
  @ApiProperty({
    description: 'Acción realizada sobre el espacio',
    enum: ['CREATED', 'UPDATED', 'DELETED'],
    example: 'UPDATED',
  })
  action: EspacioRealtimeAction;

  @ApiProperty({
    description: 'UUID del estacionamiento propietario del espacio',
    example: 'b1c2d3e4-f5a6-7890-abcd-ef1234567890',
  })
  estacionamientoId: string;

  @ApiProperty({
    description: 'UUID del espacio afectado',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  espacioId: string;

  @ApiProperty({
    description: 'Código visible del espacio/box',
    example: 'A1-2',
  })
  codigoEspacio: string;

  @ApiProperty({
    description: 'Tipo de vehículo admitido',
    enum: TipoEspacio,
  })
  tipo: TipoEspacio;

  @ApiProperty({
    description: 'Modalidad de cobro del espacio',
    enum: ModalidadTarifa,
  })
  modalidad: ModalidadTarifa;

  @ApiProperty({
    description: 'Estado operativo actual del espacio',
    enum: EstadoEspacio,
  })
  estado: EstadoEspacio;

  @ApiProperty({
    description: 'UUID del nivel al que pertenece el espacio',
  })
  nivelId: string;

  @ApiProperty({
    description: 'Código legible del nivel (ej. A1, Piso 1)',
    required: false,
  })
  nivelCodigo?: string;

  @ApiProperty({
    description: 'Marca temporal ISO del evento emitido',
    example: '2026-11-11T20:15:00.000Z',
  })
  timestamp: string;
}

