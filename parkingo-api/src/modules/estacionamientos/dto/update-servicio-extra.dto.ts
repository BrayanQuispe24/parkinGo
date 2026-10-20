import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateServicioExtraDto } from './create-servicio-extra.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateServicioExtraDto extends PartialType(CreateServicioExtraDto) {
  @ApiProperty({
    description: 'Estado de disponibilidad del servicio extra',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano' })
  activo?: boolean;
}
