import { Tarifa, ModalidadTarifa, EstadoTarifa } from '@prisma/client';

export interface CreateTarifaData {
  descripcion: string;
  monto: number;
  modalidad: ModalidadTarifa;
  estado?: EstadoTarifa;
  estacionamientoId: string;
}

export interface UpdateTarifaData {
  descripcion?: string;
  monto?: number;
  modalidad?: ModalidadTarifa;
  estado?: EstadoTarifa;
}

export abstract class TarifaRepository {
  abstract create(data: CreateTarifaData): Promise<Tarifa>;
  abstract findById(
    id: string,
  ): Promise<(Tarifa & { estacionamiento: { tenantId: string } }) | null>;
  abstract findByEstacionamientoId(
    estacionamientoId: string,
    soloActivos?: boolean,
  ): Promise<Tarifa[]>;
  abstract update(id: string, data: UpdateTarifaData): Promise<Tarifa>;
  abstract delete(id: string): Promise<Tarifa>;
}
