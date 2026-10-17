import { Injectable } from '@nestjs/common';
import { TerminosCondicionesRepository } from '../repositories/terminos-condiciones.repository.js';
import { CreateTerminoCondicionDto } from '../dto/create-termino-condicion.dto.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';
import { TerminosCondicionesMapper } from '../mappers/terminos-condiciones.mapper.js';

@Injectable()
export class CreateTerminoCondicionAction {
    constructor(private readonly repository: TerminosCondicionesRepository) {}

    async execute(dto: CreateTerminoCondicionDto): Promise<TerminoCondicionResponseDto> {
        const entity = await this.repository.create(dto);
        return TerminosCondicionesMapper.toResponseDto(entity);
    }
}
