import { ApiProperty } from '@nestjs/swagger';
import { CalificacionResponseDto } from './calificacion-response.dto.js';

export class EstacionamientoCalificacionesSummaryResponseDto {
  @ApiProperty({ example: 4.8, description: 'Promedio general de estrellas del parqueo' })
  promedio: number;

  @ApiProperty({ example: 24, description: 'Total de calificaciones registradas' })
  total: number;

  @ApiProperty({
    type: [CalificacionResponseDto],
    description: 'Lista de calificaciones recibidas',
  })
  items: CalificacionResponseDto[];
}
