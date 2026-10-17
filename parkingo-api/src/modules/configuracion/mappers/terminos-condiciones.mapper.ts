import { TerminoCondicion } from '@prisma/client';
import { TerminoCondicionEntity } from '../entities/termino-condicion.entity.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';

export class TerminosCondicionesMapper {
    static toDomain(model: TerminoCondicion): TerminoCondicionEntity {
        return {
            id: model.id,
            title: model.title,
            content: model.content,
            order: model.order,
            isActive: model.isActive,
            version: model.version,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        };
    }

    static toResponseDto(entity: TerminoCondicionEntity): TerminoCondicionResponseDto {
        return {
            id: entity.id,
            title: entity.title,
            content: entity.content,
            order: entity.order,
            isActive: entity.isActive,
            version: entity.version,
        };
    }
}
