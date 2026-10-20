import { parkingoApi } from '../../../core/api/parkingoApi';
import type {
  CreateTarifaPayload,
  TarifaModel,
  UpdateTarifaPayload,
} from '../domain/Tarifa';
import type { TarifaRepository } from '../domain/TarifaRepository';

export class HttpTarifaRepository implements TarifaRepository {
  async getMisTarifas(): Promise<TarifaModel[]> {
    const response = await parkingoApi.get<TarifaModel[]>('/estacionamientos/me/tarifas');
    return response.data;
  }

  async getTarifasByEstacionamiento(estacionamientoId: string): Promise<TarifaModel[]> {
    const response = await parkingoApi.get<TarifaModel[]>(
      `/estacionamientos/${estacionamientoId}/tarifas`,
    );
    return response.data;
  }

  async createTarifa(payload: CreateTarifaPayload): Promise<TarifaModel> {
    const response = await parkingoApi.post<TarifaModel>(
      '/estacionamientos/me/tarifas',
      payload,
    );
    return response.data;
  }

  async updateTarifa(
    id: string,
    payload: UpdateTarifaPayload,
  ): Promise<TarifaModel> {
    const response = await parkingoApi.patch<TarifaModel>(
      `/estacionamientos/me/tarifas/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteTarifa(id: string): Promise<TarifaModel> {
    const response = await parkingoApi.delete<TarifaModel>(
      `/estacionamientos/me/tarifas/${id}`,
    );
    return response.data;
  }
}

export const tarifaRepositoryInstance = new HttpTarifaRepository();
