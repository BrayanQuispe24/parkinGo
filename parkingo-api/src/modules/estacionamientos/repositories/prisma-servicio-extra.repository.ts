import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ServicioExtra } from '@prisma/client';
import {
  CreateServicioExtraData,
  ServicioExtraRepository,
  UpdateServicioExtraData,
} from './servicio-extra.repository.js';

@Injectable()
export class PrismaServicioExtraRepository implements ServicioExtraRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateServicioExtraData): Promise<ServicioExtra> {
    return this.prisma.servicioExtra.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
        precio: data.precio,
        estacionamientoId: data.estacionamientoId,
      },
    });
  }

  async findById(id: string): Promise<ServicioExtra | null> {
    return this.prisma.servicioExtra.findUnique({
      where: { id },
      include: {
        estacionamiento: {
          select: {
            id: true,
            tenantId: true,
          },
        },
      },
    });
  }

  async findByEstacionamientoId(
    estacionamientoId: string,
    soloActivos: boolean = false,
  ): Promise<ServicioExtra[]> {
    return this.prisma.servicioExtra.findMany({
      where: {
        estacionamientoId,
        ...(soloActivos ? { activo: true } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdateServicioExtraData): Promise<ServicioExtra> {
    return this.prisma.servicioExtra.update({
      where: { id },
      data: {
        ...(data.nombre !== undefined && { nombre: data.nombre }),
        ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
        ...(data.precio !== undefined && { precio: data.precio }),
        ...(data.activo !== undefined && { activo: data.activo }),
      },
    });
  }

  async delete(id: string): Promise<ServicioExtra> {
    return this.prisma.servicioExtra.delete({
      where: { id },
    });
  }
}
