import type {
  CreateTarifaPayload,
  TarifaModel,
  UpdateTarifaPayload,
} from './Tarifa';

export interface TarifaRepository {
  getMisTarifas(): Promise<TarifaModel[]>;
  getTarifasByEstacionamiento(estacionamientoId: string): Promise<TarifaModel[]>;
  createTarifa(payload: CreateTarifaPayload): Promise<TarifaModel>;
  updateTarifa(id: string, payload: UpdateTarifaPayload): Promise<TarifaModel>;
  deleteTarifa(id: string): Promise<TarifaModel>;
}
