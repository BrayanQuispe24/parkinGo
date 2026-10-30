// src/modules/calificaciones/infrastructure/HttpCalificacionRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { CalificacionRepository } from '../domain/CalificacionRepository';
import type {
  CalificacionModel,
  CrearCalificacionPayload,
  EstacionamientoCalificacionesSummary,
} from '../domain/Calificacion';

export class HttpCalificacionRepository implements CalificacionRepository {
  async crear(payload: CrearCalificacionPayload): Promise<CalificacionModel> {
    const response = await parkingoApi.post<CalificacionModel>('/calificaciones', payload);
    return response.data;
  }

  async getByTenant(): Promise<CalificacionModel[]> {
    const response = await parkingoApi.get<CalificacionModel[]>('/calificaciones/tenant');
    return response.data;
  }

  async getByEstacionamiento(
    estacionamientoId: string,
  ): Promise<EstacionamientoCalificacionesSummary> {
    const response = await parkingoApi.get<EstacionamientoCalificacionesSummary>(
      `/calificaciones/estacionamiento/${estacionamientoId}`,
    );
    return response.data;
  }

  async getMisCalificaciones(): Promise<CalificacionModel[]> {
    const response = await parkingoApi.get<CalificacionModel[]>('/calificaciones/mis-resenas');
    return response.data;
  }
}

export const httpCalificacionRepository = new HttpCalificacionRepository();
