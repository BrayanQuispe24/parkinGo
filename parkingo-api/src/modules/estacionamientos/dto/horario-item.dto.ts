import { ApiProperty } from '@nestjs/swagger';
import { DiaSemana } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class HorarioItemDto {
  @ApiProperty({
    description: 'Día de la semana para el horario de atención',
    enum: DiaSemana,
    example: DiaSemana.LUNES,
  })
  @IsEnum(DiaSemana, { message: 'El día debe ser un valor válido (LUNES, MARTES, etc.)' })
  @IsNotEmpty({ message: 'El día es obligatorio' })
  dia: DiaSemana;

  @ApiProperty({
    description: 'Hora de apertura en formato HH:mm (24 horas)',
    example: '08:00',
  })
  @IsString({ message: 'La hora de inicio debe ser texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de inicio debe tener el formato HH:mm (ej. 08:30)',
  })
  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  horaInicio: string;

  @ApiProperty({
    description: 'Hora de cierre en formato HH:mm (24 horas)',
    example: '22:00',
  })
  @IsString({ message: 'La hora de cierre debe ser texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de cierre debe tener el formato HH:mm (ej. 22:00)',
  })
  @IsNotEmpty({ message: 'La hora de cierre es obligatoria' })
  horaCierre: string;
}
