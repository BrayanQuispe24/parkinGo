import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min, Length } from 'class-validator';

export class CrearCalificacionDto {
  @ApiProperty({
    description: 'ID único del estacionamiento calificado',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID('4', { message: 'El estacionamientoId debe ser un UUID v4 válido' })
  @IsNotEmpty({ message: 'El estacionamientoId es obligatorio' })
  estacionamientoId: string;

  @ApiProperty({
    description: 'Puntaje de 1 a 5 estrellas asignado al servicio',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: 'El puntaje debe ser un número entero' })
  @Min(1, { message: 'El puntaje mínimo es 1 estrella' })
  @Max(5, { message: 'El puntaje máximo es 5 estrellas' })
  @IsNotEmpty({ message: 'El puntaje es obligatorio' })
  puntaje: number;

  @ApiProperty({
    description: 'Comentario o reseña detallada sobre la estadía en el parqueo',
    example: 'Excelente atención, portón amplio y muy buena seguridad.',
    minLength: 3,
    maxLength: 1000,
  })
  @IsString({ message: 'El comentario debe ser texto' })
  @Length(3, 1000, { message: 'El comentario debe tener entre 3 y 1000 caracteres' })
  @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
  comentario: string;
}
