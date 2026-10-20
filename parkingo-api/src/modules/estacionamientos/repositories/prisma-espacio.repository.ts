import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { Espacio } from '@prisma/client';
import {
  CreateEspacioData,
  EspacioRepository,
  EspacioWithRelations,
  UpdateEspacioData,
} from './espacio.repository.js';

@Injectable()
export class PrismaEspacioRepository implements EspacioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEspacioData): Promise<Espacio> {
    return this.prisma.espacio.create({
      data: {
        codigoEspacio: data.codigoEspacio,
        tipo: data.tipo,
        modalidad: data.modalidad,
        estado: data.estado,
        nivelId: data.nivelId,
      },
      include: {
        nivel: {
          select: {
            codigo: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<EspacioWithRelations | null> {
    return this.prisma.espacio.findUnique({
      where: { id },
      include: {
        nivel: {
          select: {
            id: true,
            codigo: true,
            estacionamiento: {
              select: {
                id: true,
                tenantId: true,
              },
            },
          },
        },
      },
    });
  }

  async findByNivelId(
    nivelId: string,
  ): Promise<(Espacio & { nivel: { codigo: string } })[]> {
    return this.prisma.espacio.findMany({
      where: { nivelId },
      include: {
        nivel: {
          select: {
            codigo: true,
          },
        },
      },
      orderBy: { codigoEspacio: 'asc' },
    });
  }

  async findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<(Espacio & { nivel: { codigo: string } })[]> {
    return this.prisma.espacio.findMany({
      where: {
        nivel: {
          estacionamientoId,
        },
      },
      include: {
        nivel: {
          select: {
            codigo: true,
          },
        },
      },
      orderBy: [
        { nivel: { codigo: 'asc' } },
        { codigoEspacio: 'asc' },
      ],
    });
  }

  async update(id: string, data: UpdateEspacioData): Promise<Espacio> {
    return this.prisma.espacio.update({
      where: { id },
      data: {
        ...(data.codigoEspacio !== undefined && { codigoEspacio: data.codigoEspacio }),
        ...(data.tipo !== undefined && { tipo: data.tipo }),
        ...(data.modalidad !== undefined && { modalidad: data.modalidad }),
        ...(data.estado !== undefined && { estado: data.estado }),
        ...(data.nivelId !== undefined && { nivelId: data.nivelId }),
      },
      include: {
        nivel: {
          select: {
            codigo: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Espacio> {
    return this.prisma.espacio.delete({
      where: { id },
      include: {
        nivel: {
          select: {
            codigo: true,
          },
        },
      },
    });
  }
}
