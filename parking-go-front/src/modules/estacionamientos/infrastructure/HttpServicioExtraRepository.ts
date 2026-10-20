import { parkingoApi } from '../../../core/api/parkingoApi';
import type {
  CreateServicioExtraPayload,
  ServicioExtraModel,
  UpdateServicioExtraPayload,
} from '../domain/ServicioExtra';
import type { ServicioExtraRepository } from '../domain/ServicioExtraRepository';

export class HttpServicioExtraRepository implements ServicioExtraRepository {
  async getMisServicios(): Promise<ServicioExtraModel[]> {
    const response = await parkingoApi.get<ServicioExtraModel[]>('/estacionamientos/me/servicios');
    return response.data;
  }

  async getServiciosByEstacionamiento(estacionamientoId: string): Promise<ServicioExtraModel[]> {
    const response = await parkingoApi.get<ServicioExtraModel[]>(
      `/estacionamientos/${estacionamientoId}/servicios`,
    );
    return response.data;
  }

  async createServicio(payload: CreateServicioExtraPayload): Promise<ServicioExtraModel> {
    const response = await parkingoApi.post<ServicioExtraModel>(
      '/estacionamientos/me/servicios',
      payload,
    );
    return response.data;
  }

  async updateServicio(
    id: string,
    payload: UpdateServicioExtraPayload,
  ): Promise<ServicioExtraModel> {
    const response = await parkingoApi.patch<ServicioExtraModel>(
      `/estacionamientos/me/servicios/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteServicio(id: string): Promise<ServicioExtraModel> {
    const response = await parkingoApi.delete<ServicioExtraModel>(
      `/estacionamientos/me/servicios/${id}`,
    );
    return response.data;
  }
}

export const servicioExtraRepositoryInstance = new HttpServicioExtraRepository();
