export interface ServicioExtraModel {
  id: string;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  activo: boolean;
  estacionamientoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicioExtraPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
}

export interface UpdateServicioExtraPayload {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}
