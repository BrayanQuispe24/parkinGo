import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { TipoEspacio, EstadoEspacio, ModalidadTarifa } from '@prisma/client';

export class CreateEspacioDto {
  @ApiProperty({
    description: 'Código de identificación del espacio (ej. A-01, E-102)',
    example: 'A-01',
  })
  @IsString({ message: 'El código del espacio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El código del espacio es obligatorio' })
  @MinLength(1, { message: 'El código del espacio debe tener al menos 1 caracter' })
  codigoEspacio: string;

  @ApiProperty({
    description: 'Tipo de vehículo admitido en la plaza',
    enum: TipoEspacio,
    example: TipoEspacio.AUTO,
    required: false,
    default: TipoEspacio.AUTO,
  })
  @IsOptional()
  @IsEnum(TipoEspacio, { message: 'Tipo de espacio inválido' })
  tipo?: TipoEspacio;

  @ApiProperty({
    description: 'Modalidad de cobro/asignación del espacio',
    enum: ModalidadTarifa,
    example: ModalidadTarifa.HORA,
    required: false,
    default: ModalidadTarifa.HORA,
  })
  @IsOptional()
  @IsEnum(ModalidadTarifa, { message: 'Modalidad inválida' })
  modalidad?: ModalidadTarifa;

  @ApiProperty({
    description: 'Estado operativo del espacio',
    enum: EstadoEspacio,
    example: EstadoEspacio.DISPONIBLE,
    required: false,
    default: EstadoEspacio.DISPONIBLE,
  })
  @IsOptional()
  @IsEnum(EstadoEspacio, { message: 'Estado de espacio inválido' })
  estado?: EstadoEspacio;

  @ApiProperty({
    description: 'UUID del nivel al que pertenece el espacio',
    example: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
  })
  @IsUUID('4', { message: 'El nivelId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El nivelId es obligatorio' })
  nivelId: string;
}
