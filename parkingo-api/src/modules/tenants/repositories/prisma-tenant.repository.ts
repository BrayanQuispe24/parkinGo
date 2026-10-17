import { Injectable, NotFoundException } from '@nestjs/common';
import { Tenant, TenantStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { TenantRepository, TenantWithUser } from './tenant.repository.js';

@Injectable()
export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    ci: true,
  };

  async create(data: {
    nombre: string;
    nit: string;
    razonSocial: string;
    estado?: TenantStatus;
    direccion?: string;
    ciudad?: string;
    latitud?: number;
    longitud?: number;
    usuarioId: string;
  }): Promise<TenantWithUser> {
    return this.prisma.tenant.create({
      data: {
        nombre: data.nombre,
        nit: data.nit,
        razonSocial: data.razonSocial,
        estado: data.estado ?? TenantStatus.ACTIVO,
        direccion: data.direccion,
        ciudad: data.ciudad,
        latitud: data.latitud,
        longitud: data.longitud,
        usuarioId: data.usuarioId,
      },
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
    });
  }

  async findAll(): Promise<TenantWithUser[]> {
    return this.prisma.tenant.findMany({
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUsuarioId(usuarioId: string): Promise<TenantWithUser[]> {
    return this.prisma.tenant.findMany({
      where: { usuarioId },
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<TenantWithUser | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
    });
  }

  async findByNit(nit: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { nit },
    });
  }

  async update(
    id: string,
    data: {
      nombre?: string;
      nit?: string;
      razonSocial?: string;
      estado?: TenantStatus;
      direccion?: string;
      ciudad?: string;
      latitud?: number;
      longitud?: number;
    }
  ): Promise<TenantWithUser> {
    const existing = await this.prisma.tenant.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado.`);
    }

    return this.prisma.tenant.update({
      where: { id },
      data,
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
    });
  }

  async updateStatus(id: string, estado: TenantStatus): Promise<TenantWithUser> {
    const existing = await this.prisma.tenant.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado.`);
    }

    return this.prisma.tenant.update({
      where: { id },
      data: { estado },
      include: {
        usuario: {
          select: this.userSelect,
        },
      },
    });
  }

  async delete(id: string): Promise<Tenant> {
    const existing = await this.prisma.tenant.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Tenant con ID ${id} no encontrado.`);
    }

    return this.prisma.tenant.delete({
      where: { id },
    });
  }
}
