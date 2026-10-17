import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { TerminoCondicionEntity } from '../entities/termino-condicion.entity.js';
import { TerminosCondicionesMapper } from '../mappers/terminos-condiciones.mapper.js';
import { TerminosCondicionesRepository } from './terminos-condiciones.repository.js';
import { CreateTerminoCondicionDto } from '../dto/create-termino-condicion.dto.js';
import { UpdateTerminoCondicionDto } from '../dto/update-termino-condicion.dto.js';

@Injectable()
export class PrismaTerminosCondicionesRepository implements TerminosCondicionesRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAllActive(): Promise<TerminoCondicionEntity[]> {
        const records = await this.prisma.terminoCondicion.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return records.map(record => TerminosCondicionesMapper.toDomain(record));
    }

    async findAll(): Promise<TerminoCondicionEntity[]> {
        const records = await this.prisma.terminoCondicion.findMany({
            orderBy: { order: 'asc' },
        });
        return records.map(record => TerminosCondicionesMapper.toDomain(record));
    }

    async findById(id: string): Promise<TerminoCondicionEntity | null> {
        const record = await this.prisma.terminoCondicion.findUnique({
            where: { id },
        });
        return record ? TerminosCondicionesMapper.toDomain(record) : null;
    }

    async create(dto: CreateTerminoCondicionDto): Promise<TerminoCondicionEntity> {
        const record = await this.prisma.terminoCondicion.create({
            data: {
                title: dto.title,
                content: dto.content,
                order: dto.order ?? 0,
                isActive: dto.isActive ?? true,
                version: dto.version ?? '1.0',
            },
        });
        return TerminosCondicionesMapper.toDomain(record);
    }

    async update(id: string, dto: UpdateTerminoCondicionDto): Promise<TerminoCondicionEntity> {
        try {
            const record = await this.prisma.terminoCondicion.update({
                where: { id },
                data: dto,
            });
            return TerminosCondicionesMapper.toDomain(record);
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Término y condición con ID ${id} no encontrado`);
            }
            throw error;
        }
    }

    async delete(id: string): Promise<TerminoCondicionEntity> {
        try {
            const record = await this.prisma.terminoCondicion.delete({
                where: { id },
            });
            return TerminosCondicionesMapper.toDomain(record);
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Término y condición con ID ${id} no encontrado`);
            }
            throw error;
        }
    }
}
