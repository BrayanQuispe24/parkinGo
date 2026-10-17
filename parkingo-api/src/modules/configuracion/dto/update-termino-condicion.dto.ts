import { PartialType } from '@nestjs/swagger';
import { CreateTerminoCondicionDto } from './create-termino-condicion.dto.js';

export class UpdateTerminoCondicionDto extends PartialType(CreateTerminoCondicionDto) {}
