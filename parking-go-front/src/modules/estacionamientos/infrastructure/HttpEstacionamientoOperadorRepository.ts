import { parkingoApi } from '../../../core/api/parkingoApi';
import type {
  AsignarOperadoresPayload,
  OperadorEstacionamientoModel,
} from '../domain/EstacionamientoOperador';
import type { EstacionamientoOperadorRepository } from '../domain/EstacionamientoOperadorRepository';

export class HttpEstacionamientoOperadorRepository
  implements EstacionamientoOperadorRepository
{
  async getOperadores(
    estacionamientoId: string,
  ): Promise<OperadorEstacionamientoModel[]> {
    const response = await parkingoApi.get<OperadorEstacionamientoModel[]>(
      `/estacionamientos/${estacionamientoId}/operadores`,
    );
    return response.data;
  }

  async getOperadoresDisponibles(
    estacionamientoId: string,
  ): Promise<OperadorEstacionamientoModel[]> {
    const response = await parkingoApi.get<OperadorEstacionamientoModel[]>(
      `/estacionamientos/${estacionamientoId}/operadores-disponibles`,
    );
    return response.data;
  }

  async asignarOperadores(
    estacionamientoId: string,
    payload: AsignarOperadoresPayload,
  ): Promise<OperadorEstacionamientoModel[]> {
    const response = await parkingoApi.post<OperadorEstacionamientoModel[]>(
      `/estacionamientos/${estacionamientoId}/operadores`,
      payload,
    );
    return response.data;
  }

  async desasignarOperador(
    estacionamientoId: string,
    usuarioId: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await parkingoApi.delete<{ success: boolean; message: string }>(
      `/estacionamientos/${estacionamientoId}/operadores/${usuarioId}`,
    );
    return response.data;
  }
}

export const estacionamientoOperadorRepositoryInstance =
  new HttpEstacionamientoOperadorRepository();
