import { TerminoCondicionEntity } from '../entities/termino-condicion.entity.js';
import { CreateTerminoCondicionDto } from '../dto/create-termino-condicion.dto.js';
import { UpdateTerminoCondicionDto } from '../dto/update-termino-condicion.dto.js';

export abstract class TerminosCondicionesRepository {
    abstract findAllActive(): Promise<TerminoCondicionEntity[]>;
    abstract findAll(): Promise<TerminoCondicionEntity[]>;
    abstract findById(id: string): Promise<TerminoCondicionEntity | null>;
    abstract create(dto: CreateTerminoCondicionDto): Promise<TerminoCondicionEntity>;
    abstract update(id: string, dto: UpdateTerminoCondicionDto): Promise<TerminoCondicionEntity>;
    abstract delete(id: string): Promise<TerminoCondicionEntity>;
}
