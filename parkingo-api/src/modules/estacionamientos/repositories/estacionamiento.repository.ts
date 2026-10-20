import { Prisma, EstadoEstacionamiento, DiaSemana, FotoEstacionamiento } from '@prisma/client';

export type EstacionamientoWithRelations = Prisma.EstacionamientoGetPayload<{
  include: {
    fotos: true;
    horarios: {
      include: {
        horario: true;
      };
    };
    tenant: {
      select: {
        id: true;
        nombre: true;
        nit: true;
        razonSocial: true;
        direccion: true;
        ciudad: true;
        usuarioId: true;
        usuario: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
            phone: true;
            ci: true;
            role: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export interface CreateEstacionamientoData {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  tenantId: string;
  fotosUrls: string[];
  horarios: {
    dia: DiaSemana;
    horaInicio: string;
    horaCierre: string;
  }[];
}

export abstract class EstacionamientoRepository {
  abstract create(data: CreateEstacionamientoData): Promise<EstacionamientoWithRelations>;

  abstract findByTenantId(tenantId: string): Promise<EstacionamientoWithRelations | null>;

  abstract findById(id: string): Promise<EstacionamientoWithRelations | null>;

  abstract findAll(estado?: EstadoEstacionamiento): Promise<EstacionamientoWithRelations[]>;

  abstract updateEstado(
    id: string,
    estado: EstadoEstacionamiento,
    motivoRechazo?: string | null,
    fechaAprobacion?: Date | null,
  ): Promise<EstacionamientoWithRelations>;

  abstract actualizarHorarios(
    estacionamientoId: string,
    horarios: {
      dia: DiaSemana;
      horaInicio: string;
      horaCierre: string;
    }[],
  ): Promise<EstacionamientoWithRelations>;

  abstract findHorariosByTenantId(tenantId: string): Promise<{
    id: string;
    dia: DiaSemana;
    horaInicio: string;
    horaCierre: string;
  }[]>;

  abstract actualizarHorariosTenant(
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
  }[]>;

  abstract agregarFotos(
    estacionamientoId: string,
    fotosUrls: string[],
  ): Promise<FotoEstacionamiento[]>;

  abstract findFotoById(
    fotoId: string,
  ): Promise<(FotoEstacionamiento & { estacionamiento: { tenantId: string } }) | null>;

  abstract eliminarFoto(fotoId: string): Promise<FotoEstacionamiento>;
}
