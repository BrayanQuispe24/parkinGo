import { Injectable } from '@nestjs/common';
import { EstadoEstacionamiento, DiaSemana, FotoEstacionamiento } from '@prisma/client';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
  CreateEstacionamientoData,
  EstacionamientoRepository,
  EstacionamientoWithRelations,
} from './estacionamiento.repository.js';

const ESTACIONAMIENTO_INCLUDES = {
  fotos: true,
  horarios: {
    include: {
      horario: true,
    },
  },
  tenant: {
    select: {
      id: true,
      nombre: true,
      nit: true,
      razonSocial: true,
      direccion: true,
      ciudad: true,
      usuarioId: true,
      usuario: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          ci: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
} as const;

@Injectable()
export class PrismaEstacionamientoRepository implements EstacionamientoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEstacionamientoData): Promise<EstacionamientoWithRelations> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear el estacionamiento base con sus fotos
      const estacionamiento = await tx.estacionamiento.create({
        data: {
          nombre: data.nombre,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
          tenantId: data.tenantId,
          estado: EstadoEstacionamiento.PENDIENTE,
          fotos: {
            create: data.fotosUrls.map((url) => ({ url })),
          },
        },
      });

      // 2. Upsert de cada Horario canónico para el Tenant y vínculo en EstacionamientoHorario
      for (const h of data.horarios) {
        const horarioRecord = await tx.horario.upsert({
          where: {
            tenantId_dia_horaInicio_horaCierre: {
              tenantId: data.tenantId,
              dia: h.dia,
              horaInicio: h.horaInicio,
              horaCierre: h.horaCierre,
            },
          },
          update: {},
          create: {
            tenantId: data.tenantId,
            dia: h.dia,
            horaInicio: h.horaInicio,
            horaCierre: h.horaCierre,
          },
        });

        await tx.estacionamientoHorario.create({
          data: {
            estacionamientoId: estacionamiento.id,
            horarioId: horarioRecord.id,
          },
        });
      }

      // 3. Retornar entidad completa con relaciones
      return tx.estacionamiento.findUniqueOrThrow({
        where: { id: estacionamiento.id },
        include: ESTACIONAMIENTO_INCLUDES,
      });
    });
  }

  async findByTenantId(tenantId: string): Promise<EstacionamientoWithRelations | null> {
    return this.prisma.estacionamiento.findUnique({
      where: { tenantId },
      include: ESTACIONAMIENTO_INCLUDES,
    });
  }

  async findById(id: string): Promise<EstacionamientoWithRelations | null> {
    return this.prisma.estacionamiento.findUnique({
      where: { id },
      include: ESTACIONAMIENTO_INCLUDES,
    });
  }

  async findAll(estado?: EstadoEstacionamiento): Promise<EstacionamientoWithRelations[]> {
    return this.prisma.estacionamiento.findMany({
      where: estado ? { estado } : undefined,
      orderBy: { createdAt: 'desc' },
      include: ESTACIONAMIENTO_INCLUDES,
    });
  }

  async updateEstado(
    id: string,
    estado: EstadoEstacionamiento,
    motivoRechazo?: string | null,
    fechaAprobacion?: Date | null,
  ): Promise<EstacionamientoWithRelations> {
    return this.prisma.estacionamiento.update({
      where: { id },
      data: {
        estado,
        motivoRechazo: motivoRechazo !== undefined ? motivoRechazo : undefined,
        fechaAprobacion: fechaAprobacion !== undefined ? fechaAprobacion : undefined,
      },
      include: ESTACIONAMIENTO_INCLUDES,
    });
  }

  async actualizarHorarios(
    estacionamientoId: string,
    horarios: {
      dia: DiaSemana;
      horaInicio: string;
      horaCierre: string;
    }[],
  ): Promise<EstacionamientoWithRelations> {
    return this.prisma.$transaction(async (tx) => {
      const est = await tx.estacionamiento.findUniqueOrThrow({
        where: { id: estacionamientoId },
        select: { tenantId: true },
      });

      // 1. Eliminar vínculos previos en la tabla intermedia EstacionamientoHorario
      await tx.estacionamientoHorario.deleteMany({
        where: { estacionamientoId },
      });

      // 2. Upsert de cada Horario para el Tenant y re-creación de vínculos
      for (const h of horarios) {
        const horarioRecord = await tx.horario.upsert({
          where: {
            tenantId_dia_horaInicio_horaCierre: {
              tenantId: est.tenantId,
              dia: h.dia,
              horaInicio: h.horaInicio,
              horaCierre: h.horaCierre,
            },
          },
          update: {},
          create: {
            tenantId: est.tenantId,
            dia: h.dia,
            horaInicio: h.horaInicio,
            horaCierre: h.horaCierre,
          },
        });

        await tx.estacionamientoHorario.create({
          data: {
            estacionamientoId,
            horarioId: horarioRecord.id,
          },
        });
      }

      // 3. Retornar estacionamiento actualizado con relaciones
      return tx.estacionamiento.findUniqueOrThrow({
        where: { id: estacionamientoId },
        include: ESTACIONAMIENTO_INCLUDES,
      });
    });
  }

  async findHorariosByTenantId(tenantId: string): Promise<{
    id: string;
    dia: DiaSemana;
    horaInicio: string;
    horaCierre: string;
  }[]> {
    return this.prisma.horario.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        dia: true,
        horaInicio: true,
        horaCierre: true,
      },
    });
  }

  async actualizarHorariosTenant(
    tenantId: string,
    horarios: {
      dia: DiaSemana;
      horaInicio: string;
      horaCierre: string;
    }[],
  ): Promise<{
    id: string;
    dia: DiaSemana;
    horaInicio: string;
    horaCierre: string;
  }[]> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Si el tenant ya tiene estacionamiento asociado
      const estacionamiento = await tx.estacionamiento.findUnique({
        where: { tenantId },
      });

      // Limpiamos vínculos viejos si existe estacionamiento
      if (estacionamiento) {
        await tx.estacionamientoHorario.deleteMany({
          where: { estacionamientoId: estacionamiento.id },
        });
      }

      // 2. Eliminar horarios viejos del tenant
      await tx.horario.deleteMany({
        where: { tenantId },
      });

      // 3. Crear los nuevos horarios del tenant
      const createdHorarios = [];
      for (const h of horarios) {
        const created = await tx.horario.create({
          data: {
            tenantId,
            dia: h.dia,
            horaInicio: h.horaInicio,
            horaCierre: h.horaCierre,
          },
        });
        createdHorarios.push(created);

        // Si ya hay estacionamiento, vincular a través de la tabla intermedia
        if (estacionamiento) {
          await tx.estacionamientoHorario.create({
            data: {
              estacionamientoId: estacionamiento.id,
              horarioId: created.id,
            },
          });
        }
      }

      return createdHorarios.map((h) => ({
        id: h.id,
        dia: h.dia,
        horaInicio: h.horaInicio,
        horaCierre: h.horaCierre,
      }));
    });
  }

  async agregarFotos(
    estacionamientoId: string,
    fotosUrls: string[],
  ): Promise<FotoEstacionamiento[]> {
    const createdFotos: FotoEstacionamiento[] = [];
    for (const url of fotosUrls) {
      const foto = await this.prisma.fotoEstacionamiento.create({
        data: {
          estacionamientoId,
          url,
        },
      });
      createdFotos.push(foto);
    }
    return createdFotos;
  }

  async findFotoById(
    fotoId: string,
  ): Promise<(FotoEstacionamiento & { estacionamiento: { tenantId: string } }) | null> {
    return this.prisma.fotoEstacionamiento.findUnique({
      where: { id: fotoId },
      include: {
        estacionamiento: {
          select: { tenantId: true },
        },
      },
    });
  }

  async eliminarFoto(fotoId: string): Promise<FotoEstacionamiento> {
    return this.prisma.fotoEstacionamiento.delete({
      where: { id: fotoId },
    });
  }
}
