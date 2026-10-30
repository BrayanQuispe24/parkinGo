import { Injectable } from '@nestjs/common';
import { EstadoReserva, EstadoDetalleReserva } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  ReservaRepository,
  CreateReservaData,
  ReservacionConRelaciones,
} from './reserva.repository.js';

@Injectable()
export class PrismaReservaRepository implements ReservaRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly includeRelaciones = {
    estacionamiento: {
      select: {
        id: true,
        nombre: true,
        direccion: true,
      },
    },
    cliente: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    },
    operador: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    },
    detalles: {
      include: {
        espacio: {
          select: {
            id: true,
            codigoEspacio: true,
            tipo: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            placa: true,
            modelo: true,
            color: true,
          },
        },
        serviciosExtras: {
          include: {
            servicioExtra: {
              select: {
                id: true,
                nombre: true,
                precio: true,
              },
            },
          },
        },
      },
    },
  };

  async verificarColisionEspacios(
    espaciosIds: string[],
    inicio: Date,
    fin: Date,
  ): Promise<{ espacioId: string; codigoEspacio: string; conflictoCon: string }[]> {
    if (espaciosIds.length === 0) return [];

    // Busca detalles en intervalos superpuestos: inicioA < finB && finA > inicioB
    const colisiones = await this.prisma.detalleReservacion.findMany({
      where: {
        espacioId: { in: espaciosIds },
        estado: EstadoDetalleReserva.ACTIVO,
        reservacion: {
          estado: {
            in: [
              EstadoReserva.PENDIENTE_PAGO,
              EstadoReserva.CONFIRMADA,
              EstadoReserva.EN_CURSO,
            ],
          },
        },
        // Superposición de intervalo:
        AND: [
          { inicioReserva: { lt: fin } },
          { finReserva: { gt: inicio } },
        ],
      },
      include: {
        espacio: {
          select: {
            codigoEspacio: true,
          },
        },
        reservacion: {
          select: {
            codigoReserva: true,
          },
        },
      },
    });

    return colisiones.map((c) => ({
      espacioId: c.espacioId,
      codigoEspacio: c.espacio.codigoEspacio,
      conflictoCon: c.reservacion.codigoReserva,
    }));
  }

  async create(data: CreateReservaData): Promise<ReservacionConRelaciones> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear boleta cabecera
      const reservacion = await tx.reservacion.create({
        data: {
          codigoReserva: data.codigoReserva,
          qrToken: data.qrToken,
          total: data.total,
          modalidad: data.modalidad,
          estado: EstadoReserva.PENDIENTE_PAGO,
          estacionamientoId: data.estacionamientoId,
          clienteId: data.clienteId,
          operadorId: data.operadorId,
        },
      });

      // 2. Crear detalles de espacios y sus extras correspondientes
      for (const detalleData of data.detalles) {
        const detalle = await tx.detalleReservacion.create({
          data: {
            reservacionId: reservacion.id,
            espacioId: detalleData.espacioId,
            vehiculoId: detalleData.vehiculoId,
            tarifaId: detalleData.tarifaId,
            inicioReserva: detalleData.inicioReserva,
            finReserva: detalleData.finReserva,
            precioUnitarioAplicado: detalleData.precioUnitarioAplicado,
            subtotal: detalleData.subtotal,
            estado: EstadoDetalleReserva.ACTIVO,
          },
        });

        // 3. Crear extras vinculados a este detalle de espacio
        if (detalleData.serviciosExtras && detalleData.serviciosExtras.length > 0) {
          for (const extra of detalleData.serviciosExtras) {
            await tx.detalleServicioExtra.create({
              data: {
                detalleReservacionId: detalle.id,
                servicioExtraId: extra.servicioExtraId,
                cantidad: extra.cantidad,
                precioUnitarioAplicado: extra.precioUnitarioAplicado,
                subtotal: extra.subtotal,
              },
            });
          }
        }
      }

      // 4. Retornar la boleta completa con todas sus relaciones
      const creada = await tx.reservacion.findUniqueOrThrow({
        where: { id: reservacion.id },
        include: this.includeRelaciones,
      });

      return creada as unknown as ReservacionConRelaciones;
    });
  }

  async findById(id: string): Promise<ReservacionConRelaciones | null> {
    const res = await this.prisma.reservacion.findUnique({
      where: { id },
      include: this.includeRelaciones,
    });
    return res as unknown as ReservacionConRelaciones | null;
  }

  async findByCodigo(codigoReserva: string): Promise<ReservacionConRelaciones | null> {
    const res = await this.prisma.reservacion.findUnique({
      where: { codigoReserva },
      include: this.includeRelaciones,
    });
    return res as unknown as ReservacionConRelaciones | null;
  }

  async findByClienteId(clienteId: string): Promise<ReservacionConRelaciones[]> {
    const list = await this.prisma.reservacion.findMany({
      where: { clienteId },
      include: this.includeRelaciones,
      orderBy: { fechaCreacion: 'desc' },
    });
    return list as unknown as ReservacionConRelaciones[];
  }

  async findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<ReservacionConRelaciones[]> {
    const list = await this.prisma.reservacion.findMany({
      where: { estacionamientoId },
      include: this.includeRelaciones,
      orderBy: { fechaCreacion: 'desc' },
    });
    return list as unknown as ReservacionConRelaciones[];
  }

  async cancelar(id: string): Promise<ReservacionConRelaciones> {
    return this.prisma.$transaction(async (tx) => {
      // Cancelar detalles
      await tx.detalleReservacion.updateMany({
        where: { reservacionId: id },
        data: { estado: EstadoDetalleReserva.CANCELADO },
      });

      // Cancelar boleta
      const cancelada = await tx.reservacion.update({
        where: { id },
        data: { estado: EstadoReserva.CANCELADA },
        include: this.includeRelaciones,
      });

      return cancelada as unknown as ReservacionConRelaciones;
    });
  }
}
