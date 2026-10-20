import { parkingoApi } from '../../../core/api/parkingoApi';
import type { CreateNivelPayload, NivelModel } from '../domain/Nivel';
import type { NivelRepository } from '../domain/NivelRepository';

export class HttpNivelRepository implements NivelRepository {
  async getMisNiveles(): Promise<NivelModel[]> {
    const response = await parkingoApi.get<NivelModel[]>('/estacionamientos/me/niveles');
    return response.data;
  }

  async createNivel(payload: CreateNivelPayload): Promise<NivelModel> {
    const response = await parkingoApi.post<NivelModel>(
      '/estacionamientos/me/niveles',
      payload,
    );
    return response.data;
  }

  async deleteNivel(id: string): Promise<NivelModel> {
    const response = await parkingoApi.delete<NivelModel>(
      `/estacionamientos/me/niveles/${id}`,
    );
    return response.data;
  }
}

export const nivelRepositoryInstance = new HttpNivelRepository();
