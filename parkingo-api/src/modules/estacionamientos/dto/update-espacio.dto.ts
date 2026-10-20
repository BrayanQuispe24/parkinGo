import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEspacioDto } from './create-espacio.dto.js';

export class UpdateEspacioDto extends PartialType(CreateEspacioDto) {}
