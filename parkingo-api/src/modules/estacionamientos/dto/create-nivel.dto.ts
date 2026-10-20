import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateNivelDto {
  @ApiProperty({
    description: 'Código o nombre del nivel (ej. P1, Piso 1, Subsuelo S1)',
    example: 'Piso 1',
  })
  @IsString({ message: 'El código del nivel debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del nivel es obligatorio' })
  @MinLength(1, { message: 'El código debe tener al menos 1 caracter' })
  codigo: string;
}
