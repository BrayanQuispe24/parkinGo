import type { ModalidadTarifa } from './Tarifa';

export type TipoEspacio =
  | 'AUTO'
  | 'MOTO'
  | 'CAMIONETA'
  | 'DISCAPACITADO'
  | 'ELECTRICO';

export type EstadoEspacio =
  | 'DISPONIBLE'
  | 'OCUPADO'
  | 'RESERVADO'
  | 'MANTENIMIENTO';

export interface EspacioModel {
  id: string;
  codigoEspacio: string;
  tipo: TipoEspacio;
  modalidad: ModalidadTarifa;
  estado: EstadoEspacio;
  nivelId: string;
  nivelCodigo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEspacioPayload {
  codigoEspacio: string;
  tipo?: TipoEspacio;
  modalidad?: ModalidadTarifa;
  estado?: EstadoEspacio;
  nivelId: string;
}

export interface UpdateEspacioPayload {
  codigoEspacio?: string;
  tipo?: TipoEspacio;
  modalidad?: ModalidadTarifa;
  estado?: EstadoEspacio;
  nivelId?: string;
}
