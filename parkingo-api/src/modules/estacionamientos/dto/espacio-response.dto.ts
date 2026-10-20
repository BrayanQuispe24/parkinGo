import { ApiProperty } from '@nestjs/swagger';
import { TipoEspacio, EstadoEspacio, ModalidadTarifa } from '@prisma/client';

export class EspacioResponseDto {
  @ApiProperty({
    description: 'Identificador único del espacio (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'Código de identificación del espacio',
    example: 'A-01',
  })
  codigoEspacio: string;

  @ApiProperty({
    description: 'Tipo de vehículo admitido',
    enum: TipoEspacio,
    example: TipoEspacio.AUTO,
  })
  tipo: TipoEspacio;

  @ApiProperty({
    description: 'Modalidad de cobro/asignación',
    enum: ModalidadTarifa,
    example: ModalidadTarifa.HORA,
  })
  modalidad: ModalidadTarifa;

  @ApiProperty({
    description: 'Estado operativo del espacio',
    enum: EstadoEspacio,
    example: EstadoEspacio.DISPONIBLE,
  })
  estado: EstadoEspacio;

  @ApiProperty({
    description: 'UUID del nivel al que pertenece el espacio',
    example: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
  })
  nivelId: string;

  @ApiProperty({
    description: 'Código del nivel al que pertenece (ej. Piso 1)',
    example: 'Piso 1',
    required: false,
  })
  nivelCodigo?: string;

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
