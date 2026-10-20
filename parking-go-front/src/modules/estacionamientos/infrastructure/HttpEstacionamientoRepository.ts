import axios from 'axios';
import { parkingoApi } from '../../../core/api/parkingoApi';
import type {
  EstacionamientoModel,
  EstadoEstacionamiento,
  FotoEstacionamientoModel,
  HorarioItemPayload,
  RegistrarEstacionamientoPayload,
} from '../domain/Estacionamiento';
import type { EstacionamientoRepository } from '../domain/EstacionamientoRepository';

export class HttpEstacionamientoRepository implements EstacionamientoRepository {
  async getMiEstacionamiento(): Promise<EstacionamientoModel | null> {
    try {
      const response = await parkingoApi.get<EstacionamientoModel | null>('/estacionamientos/me');
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async registrarEstacionamiento(
    payload: RegistrarEstacionamientoPayload,
  ): Promise<EstacionamientoModel> {
    const formData = new FormData();
    formData.append('nombre', payload.nombre);
    formData.append('direccion', payload.direccion);
    formData.append('latitud', String(payload.latitud));
    formData.append('longitud', String(payload.longitud));
    formData.append('horarios', JSON.stringify(payload.horarios));

    if (payload.tenantId) {
      formData.append('tenantId', payload.tenantId);
    }

    if (payload.fotos && payload.fotos.length > 0) {
      payload.fotos.forEach((file) => {
        formData.append('fotos', file);
      });
    }

    const response = await parkingoApi.post<EstacionamientoModel>('/estacionamientos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async listarEstacionamientos(estado?: EstadoEstacionamiento): Promise<EstacionamientoModel[]> {
    const response = await parkingoApi.get<EstacionamientoModel[]>('/admin/estacionamientos', {
      params: estado ? { estado } : undefined,
    });
    return response.data;
  }

  async aprobarEstacionamiento(id: string): Promise<EstacionamientoModel> {
    const response = await parkingoApi.patch<EstacionamientoModel>(
      `/admin/estacionamientos/${id}/aprobar`,
    );
    return response.data;
  }

  async rechazarEstacionamiento(id: string, motivoRechazo: string): Promise<EstacionamientoModel> {
    const response = await parkingoApi.patch<EstacionamientoModel>(
      `/admin/estacionamientos/${id}/rechazar`,
      { motivoRechazo },
    );
    return response.data;
  }

  async inhabilitarEstacionamiento(id: string): Promise<EstacionamientoModel> {
    const response = await parkingoApi.patch<EstacionamientoModel>(
      `/admin/estacionamientos/${id}/inhabilitar`,
    );
    return response.data;
  }

  async actualizarHorarios(horarios: HorarioItemPayload[]): Promise<EstacionamientoModel> {
    const response = await parkingoApi.put<EstacionamientoModel>(
      '/estacionamientos/me/horarios',
      { horarios },
    );
    return response.data;
  }

  async subirFotos(fotos: File[]): Promise<FotoEstacionamientoModel[]> {
    const formData = new FormData();
    fotos.forEach((f) => formData.append('fotos', f));

    const response = await parkingoApi.post<FotoEstacionamientoModel[]>(
      '/estacionamientos/me/fotos',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  }

  async eliminarFoto(fotoId: string): Promise<FotoEstacionamientoModel> {
    const response = await parkingoApi.delete<FotoEstacionamientoModel>(
      `/estacionamientos/me/fotos/${fotoId}`,
    );
    return response.data;
  }
}

export const httpEstacionamientoRepository = new HttpEstacionamientoRepository();
