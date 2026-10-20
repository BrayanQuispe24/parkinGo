export type ModalidadTarifa = 'HORA' | 'DIA' | 'MES';
export type EstadoTarifa = 'ACTIVO' | 'INACTIVO';

export interface TarifaModel {
  id: string;
  descripcion: string;
  monto: number;
  modalidad: ModalidadTarifa;
  estado: EstadoTarifa;
  estacionamientoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTarifaPayload {
  descripcion: string;
  monto: number;
  modalidad: ModalidadTarifa;
  estado?: EstadoTarifa;
}

export interface UpdateTarifaPayload {
  descripcion?: string;
  monto?: number;
  modalidad?: ModalidadTarifa;
  estado?: EstadoTarifa;
}
