import { ApiProperty } from '@nestjs/swagger';
import { TipoVehiculo } from '@prisma/client';

export class VehiculoResponseDto {
  @ApiProperty({ example: 'b0e07172-871d-444a-9b19-e58fbe54c5a3' })
  id!: string;

  @ApiProperty({ enum: TipoVehiculo, example: TipoVehiculo.SEDAN })
  tipo!: TipoVehiculo;

  @ApiProperty({ example: '9912-KLS' })
  placa!: string;

  @ApiProperty({ example: 'Toyota Corolla 2023' })
  modelo!: string;

  @ApiProperty({ example: 'Blanco Perlado' })
  color!: string;

  @ApiProperty({ example: 'usr-123-uuid' })
  propietarioId!: string;

  @ApiProperty({ example: true })
  esPredeterminado!: boolean;

  @ApiProperty({ example: '2026-10-26T16:00:00.000Z' })
  fechaCreado!: Date;

  @ApiProperty({ example: '2026-10-26T16:00:00.000Z' })
  fechaActualizado!: Date;
}
