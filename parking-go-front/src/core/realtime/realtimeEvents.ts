import type { EstadoEspacio, TipoEspacio } from '../../modules/estacionamientos/domain/Espacio';
import type { ModalidadTarifa } from '../../modules/estacionamientos/domain/Tarifa';

export type EspacioRealtimeAction = 'CREATED' | 'UPDATED' | 'DELETED';

export interface EspacioRealtimeEvent {
  action: EspacioRealtimeAction;
  estacionamientoId: string;
  espacioId: string;
  codigoEspacio: string;
  tipo: TipoEspacio;
  modalidad: ModalidadTarifa;
  estado: EstadoEspacio;
  nivelId: string;
  nivelCodigo?: string;
  timestamp: string;
}

export interface JoinParkingPayload {
  estacionamientoId: string;
}

export interface ServerToClientEvents {
  'espacio:actualizado': (event: EspacioRealtimeEvent) => void;
}

export interface ClientToServerEvents {
  'room:join-catalogo': () => void;
  'room:leave-catalogo': () => void;
  'room:join-parking': (payload: JoinParkingPayload) => void;
  'room:leave-parking': (payload: JoinParkingPayload) => void;
}

