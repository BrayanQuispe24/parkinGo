import { ApiProperty } from '@nestjs/swagger';

export class EliminarEstacionamientoRechazadoResponseDto {
  @ApiProperty({
    description: 'ID UUID del estacionamiento rechazado que fue eliminado',
    example: '9c5c5d4c-1e72-4a20-8a1e-5a8b09c6d123',
  })
  id: string;

  @ApiProperty({
    description: 'Mensaje de confirmación de la eliminación',
    example: 'Solicitud de estacionamiento rechazada eliminada exitosamente.',
  })
  message: string;
}

