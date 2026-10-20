import type {
  CreateServicioExtraPayload,
  ServicioExtraModel,
  UpdateServicioExtraPayload,
} from './ServicioExtra';

export interface ServicioExtraRepository {
  getMisServicios(): Promise<ServicioExtraModel[]>;
  getServiciosByEstacionamiento(estacionamientoId: string): Promise<ServicioExtraModel[]>;
  createServicio(payload: CreateServicioExtraPayload): Promise<ServicioExtraModel>;
  updateServicio(id: string, payload: UpdateServicioExtraPayload): Promise<ServicioExtraModel>;
  deleteServicio(id: string): Promise<ServicioExtraModel>;
}
