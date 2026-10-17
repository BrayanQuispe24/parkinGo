import { Injectable } from '@nestjs/common';
import { TerminosCondicionesRepository } from '../repositories/terminos-condiciones.repository.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';
import { TerminosCondicionesMapper } from '../mappers/terminos-condiciones.mapper.js';

@Injectable()
export class DeleteTerminoCondicionAction {
    constructor(private readonly repository: TerminosCondicionesRepository) {}

    async execute(id: string): Promise<TerminoCondicionResponseDto> {
        const entity = await this.repository.delete(id);
        return TerminosCondicionesMapper.toResponseDto(entity);
    }
}
