import type {
  AsignarOperadoresPayload,
  OperadorEstacionamientoModel,
} from './EstacionamientoOperador';

export interface EstacionamientoOperadorRepository {
  getOperadores(estacionamientoId: string): Promise<OperadorEstacionamientoModel[]>;
  getOperadoresDisponibles(estacionamientoId: string): Promise<OperadorEstacionamientoModel[]>;
  asignarOperadores(
    estacionamientoId: string,
    payload: AsignarOperadoresPayload,
  ): Promise<OperadorEstacionamientoModel[]>;
  desasignarOperador(
    estacionamientoId: string,
    usuarioId: string,
  ): Promise<{ success: boolean; message: string }>;
}
