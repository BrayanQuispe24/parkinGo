import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { Tarifa } from '@prisma/client';
import {
  CreateTarifaData,
  TarifaRepository,
  UpdateTarifaData,
} from './tarifa.repository.js';

@Injectable()
export class PrismaTarifaRepository implements TarifaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTarifaData): Promise<Tarifa> {
    return this.prisma.tarifa.create({
      data: {
        descripcion: data.descripcion,
        monto: data.monto,
        modalidad: data.modalidad,
        ...(data.estado ? { estado: data.estado } : {}),
        estacionamientoId: data.estacionamientoId,
      },
    });
  }

  async findById(
    id: string,
  ): Promise<(Tarifa & { estacionamiento: { tenantId: string } }) | null> {
    return this.prisma.tarifa.findUnique({
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
    soloActivos: boolean = false,
  ): Promise<Tarifa[]> {
    return this.prisma.tarifa.findMany({
      where: {
        estacionamientoId,
        ...(soloActivos ? { estado: 'ACTIVO' } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateTarifaData): Promise<Tarifa> {
    return this.prisma.tarifa.update({
      where: { id },
      data: {
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.monto !== undefined && { monto: data.monto }),
        ...(data.modalidad !== undefined && { modalidad: data.modalidad }),
        ...(data.estado !== undefined && { estado: data.estado }),
      },
    });
  }

  async delete(id: string): Promise<Tarifa> {
    return this.prisma.tarifa.delete({
      where: { id },
    });
  }
}
