import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  CalificacionRepository,
  CreateCalificacionData,
  CalificacionWithRelations,
} from './calificacion.repository.js';

@Injectable()
export class PrismaCalificacionRepository implements CalificacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelations = {
    cliente: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    estacionamiento: {
      select: {
        id: true,
        nombre: true,
        tenantId: true,
      },
    },
  };

  async create(data: CreateCalificacionData): Promise<CalificacionWithRelations> {
    return this.prisma.calificacion.create({
      data: {
        puntaje: data.puntaje,
        comentario: data.comentario,
        clienteId: data.clienteId,
        estacionamientoId: data.estacionamientoId,
      },
      include: this.includeRelations,
    });
  }

  async findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<CalificacionWithRelations[]> {
    return this.prisma.calificacion.findMany({
      where: { estacionamientoId },
      include: this.includeRelations,
      orderBy: { fechaCreado: 'desc' },
    });
  }

  async findByTenantId(tenantId: string): Promise<CalificacionWithRelations[]> {
    return this.prisma.calificacion.findMany({
      where: {
        estacionamiento: {
          tenantId,
        },
      },
      include: this.includeRelations,
      orderBy: { fechaCreado: 'desc' },
    });
  }

  async findByClienteId(clienteId: string): Promise<CalificacionWithRelations[]> {
    return this.prisma.calificacion.findMany({
      where: { clienteId },
      include: this.includeRelations,
      orderBy: { fechaCreado: 'desc' },
    });
  }

  async getSummaryByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<{ promedio: number; total: number }> {
    const aggregate = await this.prisma.calificacion.aggregate({
      where: { estacionamientoId },
      _avg: { puntaje: true },
      _count: { id: true },
    });

    const total = aggregate._count.id;
    const promedio = aggregate._avg.puntaje ? Number(aggregate._avg.puntaje.toFixed(1)) : 0;

    return { promedio, total };
  }
}
