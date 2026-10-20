import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNivelDto } from './create-nivel.dto.js';

export class UpdateNivelDto extends PartialType(CreateNivelDto) {}
