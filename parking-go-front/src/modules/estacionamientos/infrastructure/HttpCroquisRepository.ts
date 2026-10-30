import { parkingoApi } from '../../../core/api/parkingoApi';
import type { CroquisModel, GuardarCroquisPayload } from '../domain/Croquis';
import type { CroquisRepository } from '../domain/CroquisRepository';

export class HttpCroquisRepository implements CroquisRepository {
  async getCroquisByNivel(nivelId: string): Promise<CroquisModel | null> {
    const response = await parkingoApi.get<CroquisModel | null>(
      `/estacionamientos/me/niveles/${nivelId}/croquis`,
    );
    return response.data;
  }

  async getCroquisByEstacionamientoYNivel(
    estacionamientoId: string,
    nivelId: string,
  ): Promise<CroquisModel | null> {
    const response = await parkingoApi.get<CroquisModel | null>(
      `/estacionamientos/${estacionamientoId}/niveles/${nivelId}/croquis`,
    );
    return response.data;
  }

  async guardarCroquis(
    nivelId: string,
    payload: GuardarCroquisPayload,
  ): Promise<CroquisModel> {
    const response = await parkingoApi.put<CroquisModel>(
      `/estacionamientos/me/niveles/${nivelId}/croquis`,
      payload,
    );
    return response.data;
  }

  async subirFondoImagen(nivelId: string, file: File): Promise<CroquisModel> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await parkingoApi.post<CroquisModel>(
      `/estacionamientos/me/niveles/${nivelId}/croquis/fondo-imagen`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }
}

export const croquisRepositoryInstance = new HttpCroquisRepository();
