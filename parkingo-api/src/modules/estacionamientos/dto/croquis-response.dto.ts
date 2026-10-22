import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CroquisResponseDto {
  @ApiProperty({
    description: 'UUID único del croquis',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Código o nombre identificador del croquis',
    example: 'PLANO-PRINCIPAL',
  })
  codigo: string;

  @ApiProperty({
    description: 'Ancho total del lienzo en píxeles',
    example: 1200,
  })
  anchoLienzo: number;

  @ApiProperty({
    description: 'Alto total del lienzo en píxeles',
    example: 800,
  })
  altoLienzo: number;

  @ApiPropertyOptional({
    description: 'Estructura JSON con los elementos visuales dibujados',
  })
  contenido: Record<string, unknown> | null;

  @ApiProperty({
    description: 'Tipo de fondo simulado (PLANO, ASFALTO, CONCRETO, EPOXICO, PERSONALIZADO)',
    example: 'PLANO',
  })
  fondoTipo: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen de plano personalizado de fondo',
    example: '/uploads/croquis/blueprint.png',
  })
  fondoImagenUrl?: string | null;

  @ApiProperty({
    description: 'Opacidad del fondo simulado',
    example: 0.85,
  })
  fondoOpacidad: number;

  @ApiProperty({
    description: 'UUID del nivel al que pertenece el croquis',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  nivelId: string;

  @ApiProperty({
    description: 'Fecha de creación del croquis',
    example: '2026-10-20T12:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2026-10-20T12:30:00.000Z',
  })
  updatedAt: Date;
}
