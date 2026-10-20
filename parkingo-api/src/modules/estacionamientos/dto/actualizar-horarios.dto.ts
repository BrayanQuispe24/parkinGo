import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { HorarioItemDto } from './horario-item.dto.js';

export class ActualizarHorariosDto {
  @ApiProperty({
    description: 'Lista completa de horarios de atención por día de la semana',
    type: [HorarioItemDto],
  })
  @IsArray({ message: 'Los horarios deben enviarse como una lista' })
  @ValidateNested({ each: true })
  @Type(() => HorarioItemDto)
  horarios: HorarioItemDto[];
}
