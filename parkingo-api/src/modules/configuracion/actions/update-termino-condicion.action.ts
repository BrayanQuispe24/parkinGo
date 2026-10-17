import { Injectable } from '@nestjs/common';
import { TerminosCondicionesRepository } from '../repositories/terminos-condiciones.repository.js';
import { UpdateTerminoCondicionDto } from '../dto/update-termino-condicion.dto.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';
import { TerminosCondicionesMapper } from '../mappers/terminos-condiciones.mapper.js';

@Injectable()
export class UpdateTerminoCondicionAction {
    constructor(private readonly repository: TerminosCondicionesRepository) {}

    async execute(id: string, dto: UpdateTerminoCondicionDto): Promise<TerminoCondicionResponseDto> {
        const entity = await this.repository.update(id, dto);
        return TerminosCondicionesMapper.toResponseDto(entity);
    }
}
