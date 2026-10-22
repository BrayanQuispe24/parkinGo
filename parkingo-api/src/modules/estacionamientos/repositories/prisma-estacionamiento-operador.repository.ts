import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  EstacionamientoOperadorRepository,
  OperadorWithRole,
} from './estacionamiento-operador.repository.js';

@Injectable()
export class PrismaEstacionamientoOperadorRepository
  implements EstacionamientoOperadorRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findOperadoresByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<OperadorWithRole[]> {
    return this.prisma.user.findMany({
      where: {
        estacionamientoId,
        role: {
          name: { in: ['PARKING_OPERATOR', 'OPERATOR'] },
        },
      },
      include: {
        role: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
    });
  }

  async findOperadoresDisponibles(
    adminUserId?: string,
  ): Promise<OperadorWithRole[]> {
    const where: Prisma.UserWhereInput = {
      role: {
        name: { in: ['PARKING_OPERATOR', 'OPERATOR'] },
      },
      estacionamientoId: null,
    };

    if (adminUserId) {
      where.createdById = adminUserId;
    }

    return this.prisma.user.findMany({
      where,
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOperadoresByIds(
    usuarioIds: string[],
  ): Promise<OperadorWithRole[]> {
    return this.prisma.user.findMany({
      where: {
        id: { in: usuarioIds },
      },
      include: {
        role: true,
      },
    });
  }

  async asignarOperadores(
    estacionamientoId: string,
    usuarioIds: string[],
  ): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: { in: usuarioIds },
        role: {
          name: { in: ['PARKING_OPERATOR', 'OPERATOR'] },
        },
      },
      data: {
        estacionamientoId,
      },
    });
  }

  async desasignarOperador(
    estacionamientoId: string,
    usuarioId: string,
  ): Promise<void> {
    await this.prisma.user.updateMany({
      where: {
        id: usuarioId,
        estacionamientoId,
      },
      data: {
        estacionamientoId: null,
      },
    });
  }
}
