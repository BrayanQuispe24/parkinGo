import { ServicioExtra } from '@prisma/client';

export interface CreateServicioExtraData {
  nombre: string;
  descripcion?: string | null;
  precio: number;
  estacionamientoId: string;
}

export interface UpdateServicioExtraData {
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  activo?: boolean;
}

export abstract class ServicioExtraRepository {
  abstract create(data: CreateServicioExtraData): Promise<ServicioExtra>;
  abstract findById(id: string): Promise<ServicioExtra | null>;
  abstract findByEstacionamientoId(
    estacionamientoId: string,
    soloActivos?: boolean,
  ): Promise<ServicioExtra[]>;
  abstract update(id: string, data: UpdateServicioExtraData): Promise<ServicioExtra>;
  abstract delete(id: string): Promise<ServicioExtra>;
}
