import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { Nivel } from '@prisma/client';
import {
  CreateNivelData,
  NivelRepository,
  NivelWithCount,
  UpdateNivelData,
} from './nivel.repository.js';

@Injectable()
export class PrismaNivelRepository implements NivelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNivelData): Promise<Nivel> {
    return this.prisma.nivel.create({
      data: {
        codigo: data.codigo,
        estacionamientoId: data.estacionamientoId,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<(Nivel & { estacionamiento: { tenantId: string } }) | null> {
    return this.prisma.nivel.findUnique({
      where: { id },
      include: {
        estacionamiento: {
          select: {
            tenantId: true,
          },
        },
      },
    });
  }

  async findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<NivelWithCount[]> {
    return this.prisma.nivel.findMany({
      where: { estacionamientoId },
      include: {
        _count: {
          select: {
            espacios: true,
          },
        },
      },
      orderBy: { codigo: 'asc' },
    });
  }

  async update(id: string, data: UpdateNivelData): Promise<Nivel> {
    return this.prisma.nivel.update({
      where: { id },
      data: {
        ...(data.codigo !== undefined && { codigo: data.codigo }),
      },
    });
  }

  async delete(id: string): Promise<Nivel> {
    return this.prisma.nivel.delete({
      where: { id },
    });
  }
}
