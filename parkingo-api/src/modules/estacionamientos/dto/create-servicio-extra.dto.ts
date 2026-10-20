import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateServicioExtraDto {
  @ApiProperty({
    description: 'Nombre del servicio extra',
    example: 'Lavado Ecológico Completo',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  nombre: string;

  @ApiProperty({
    description: 'Descripción detallada o alcances del servicio',
    example: 'Lavado a vapor exterior, aspirado profundo y encerado rápido.',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({
    description: 'Precio o tarifa del servicio en Bs.',
    example: 35.0,
  })
  @Transform(({ value }) => {
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? value : parsed;
  })
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio: number;
}
