import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class GuardarCroquisDto {
  @ApiPropertyOptional({
    description: 'Código o nombre identificador del croquis',
    example: 'PLANO-PRINCIPAL',
    default: 'PLANO-PRINCIPAL',
  })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({
    description: 'Ancho total del lienzo en píxeles',
    example: 1200,
    default: 1200,
  })
  @IsOptional()
  @IsInt()
  @Min(300)
  anchoLienzo?: number;

  @ApiPropertyOptional({
    description: 'Alto total del lienzo en píxeles',
    example: 800,
    default: 800,
  })
  @IsOptional()
  @IsInt()
  @Min(200)
  altoLienzo?: number;

  @ApiProperty({
    description: 'Estructura JSON con los elementos visuales (boxes, muros, flechas, posiciones)',
    example: {
      anchoLienzo: 1200,
      altoLienzo: 800,
      nodos: [],
    },
  })
  @IsNotEmpty({ message: 'El contenido del croquis es obligatorio.' })
  contenido: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Tipo de fondo simulado (PLANO, ASFALTO, CONCRETO, EPOXICO, PERSONALIZADO)',
    example: 'ASFALTO',
    default: 'PLANO',
  })
  @IsOptional()
  @IsString()
  fondoTipo?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de fondo personalizada si aplica',
    example: '/uploads/croquis/blueprint-nivel1.png',
  })
  @IsOptional()
  @IsString()
  fondoImagenUrl?: string;

  @ApiPropertyOptional({
    description: 'Opacidad del fondo simulado o imagen (de 0.1 a 1.0)',
    example: 0.85,
    default: 0.85,
  })
  @IsOptional()
  fondoOpacidad?: number;
}
