export interface NivelModel {
  id: string;
  codigo: string;
  estacionamientoId: string;
  totalEspacios?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNivelPayload {
  codigo: string;
}

export interface UpdateNivelPayload {
  codigo: string;
}
