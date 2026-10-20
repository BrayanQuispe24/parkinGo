import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RechazarEstacionamientoDto {
  @ApiProperty({
    description: 'Motivo fundamentado por el cual se rechaza la solicitud de estacionamiento',
    example: 'Las fotografías de las plazas no coinciden con la dirección declarada.',
  })
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El motivo de rechazo es obligatorio' })
  @MinLength(5, { message: 'El motivo de rechazo debe contener al menos 5 caracteres' })
  motivoRechazo: string;
}
