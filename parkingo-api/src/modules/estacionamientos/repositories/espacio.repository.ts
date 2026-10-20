import { Espacio, TipoEspacio, ModalidadTarifa, EstadoEspacio } from '@prisma/client';

export interface CreateEspacioData {
  codigoEspacio: string;
  tipo?: TipoEspacio;
  modalidad?: ModalidadTarifa;
  estado?: EstadoEspacio;
  nivelId: string;
}

export interface UpdateEspacioData {
  codigoEspacio?: string;
  tipo?: TipoEspacio;
  modalidad?: ModalidadTarifa;
  estado?: EstadoEspacio;
  nivelId?: string;
}

export type EspacioWithRelations = Espacio & {
  nivel: {
    id: string;
    codigo: string;
    estacionamiento: {
      id: string;
      tenantId: string;
    };
  };
};

export abstract class EspacioRepository {
  abstract create(data: CreateEspacioData): Promise<Espacio>;
  abstract findById(id: string): Promise<EspacioWithRelations | null>;
  abstract findByNivelId(nivelId: string): Promise<(Espacio & { nivel: { codigo: string } })[]>;
  abstract findByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<(Espacio & { nivel: { codigo: string } })[]>;
  abstract update(id: string, data: UpdateEspacioData): Promise<Espacio>;
  abstract delete(id: string): Promise<Espacio>;
}
