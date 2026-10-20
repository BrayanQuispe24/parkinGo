import { parkingoApi } from '../../../core/api/parkingoApi';
import type {
  CreateEspacioPayload,
  EspacioModel,
  UpdateEspacioPayload,
} from '../domain/Espacio';
import type { EspacioRepository } from '../domain/EspacioRepository';

export class HttpEspacioRepository implements EspacioRepository {
  async getMisEspacios(nivelId?: string): Promise<EspacioModel[]> {
    const params = nivelId ? { nivelId } : undefined;
    const response = await parkingoApi.get<EspacioModel[]>(
      '/estacionamientos/me/espacios',
      { params },
    );
    return response.data;
  }

  async createEspacio(payload: CreateEspacioPayload): Promise<EspacioModel> {
    const response = await parkingoApi.post<EspacioModel>(
      '/estacionamientos/me/espacios',
      payload,
    );
    return response.data;
  }

  async updateEspacio(
    id: string,
    payload: UpdateEspacioPayload,
  ): Promise<EspacioModel> {
    const response = await parkingoApi.patch<EspacioModel>(
      `/estacionamientos/me/espacios/${id}`,
      payload,
    );
    return response.data;
  }

  async deleteEspacio(id: string): Promise<EspacioModel> {
    const response = await parkingoApi.delete<EspacioModel>(
      `/estacionamientos/me/espacios/${id}`,
    );
    return response.data;
  }
}

export const espacioRepositoryInstance = new HttpEspacioRepository();
