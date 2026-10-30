import { Nivel } from '@prisma/client';

export interface CreateNivelData {
  codigo: string;
  estacionamientoId: string;
}

export interface UpdateNivelData {
  codigo?: string;
}

export type NivelWithCount = Nivel & {
  _count?: {
    espacios: number;
  };
};

export type NivelWithEstacionamiento = Nivel & {
  estacionamiento: {
    id: string;
    tenantId: string;
    tenant?: {
      usuarioId: string;
    };
    operadores: { id: string }[];
  };
};

export abstract class NivelRepository {
  abstract create(data: CreateNivelData): Promise<Nivel>;
  abstract findById(id: string): Promise<NivelWithEstacionamiento | null>;
  abstract findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<NivelWithCount[]>;
  abstract update(id: string, data: UpdateNivelData): Promise<Nivel>;
  abstract delete(id: string): Promise<Nivel>;
}
