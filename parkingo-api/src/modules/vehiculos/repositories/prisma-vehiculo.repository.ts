import { Injectable } from '@nestjs/common';
import { TipoVehiculo, Vehiculo } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  VehiculoRepository,
  CreateVehiculoData,
} from './vehiculo.repository.js';

@Injectable()
export class PrismaVehiculoRepository implements VehiculoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateVehiculoData): Promise<Vehiculo> {
    const existingCount = await this.prisma.vehiculo.count({
      where: { propietarioId: data.propietarioId },
    });

    const shouldBeDefault = data.esPredeterminado ?? existingCount === 0;

    return this.prisma.$transaction(async (tx) => {
      if (shouldBeDefault && existingCount > 0) {
        await tx.vehiculo.updateMany({
          where: { propietarioId: data.propietarioId },
          data: { esPredeterminado: false },
        });
      }

      return tx.vehiculo.create({
        data: {
          tipo: data.tipo,
          placa: data.placa.trim().toUpperCase(),
          modelo: data.modelo.trim(),
          color: data.color.trim(),
          propietarioId: data.propietarioId,
          esPredeterminado: shouldBeDefault,
        },
      });
    });
  }

  async findByPropietarioId(propietarioId: string): Promise<Vehiculo[]> {
    return this.prisma.vehiculo.findMany({
      where: { propietarioId },
      orderBy: [
        { esPredeterminado: 'desc' },
        { fechaCreado: 'desc' },
      ],
    });
  }

  async findByPlaca(placa: string): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({
      where: { placa: placa.trim().toUpperCase() },
    });
  }

  async findById(id: string): Promise<Vehiculo | null> {
    return this.prisma.vehiculo.findUnique({
      where: { id },
    });
  }

  async setPredeterminado(id: string, propietarioId: string): Promise<Vehiculo> {
    return this.prisma.$transaction(async (tx) => {
      await tx.vehiculo.updateMany({
        where: { propietarioId },
        data: { esPredeterminado: false },
      });

      return tx.vehiculo.update({
        where: { id },
        data: { esPredeterminado: true },
      });
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehiculo.delete({
      where: { id },
    });
  }

  async countByPropietarioId(propietarioId: string): Promise<number> {
    return this.prisma.vehiculo.count({
      where: { propietarioId },
    });
  }
}
