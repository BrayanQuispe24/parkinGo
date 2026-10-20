import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTarifaDto } from './create-tarifa.dto.js';

export class UpdateTarifaDto extends PartialType(CreateTarifaDto) {}
