import { Injectable } from '@nestjs/common';
import { TerminosCondicionesRepository } from '../repositories/terminos-condiciones.repository.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';
import { TerminosCondicionesMapper } from '../mappers/terminos-condiciones.mapper.js';

@Injectable()
export class GetTerminosCondicionesAction {
    constructor(private readonly repository: TerminosCondicionesRepository) {}

    async execute(): Promise<TerminoCondicionResponseDto[]> {
        const records = await this.repository.findAllActive();
        return records.map(record => TerminosCondicionesMapper.toResponseDto(record));
    }
}
