import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class AsignarOperadoresDto {
  @ApiProperty({
    description: 'Lista de IDs de usuarios con rol de operador a vincular al estacionamiento',
    example: ['b17f549c-d6b9-44e2-b353-85bb2155eac6'],
    type: [String],
  })
  @IsArray({ message: 'usuarioIds debe ser un arreglo' })
  @ArrayNotEmpty({ message: 'Debe proporcionar al menos un ID de operador' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID versión 4 válido' })
  usuarioIds: string[];
}
