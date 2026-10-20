import type {
  CreateEspacioPayload,
  EspacioModel,
  UpdateEspacioPayload,
} from './Espacio';

export interface EspacioRepository {
  getMisEspacios(nivelId?: string): Promise<EspacioModel[]>;
  createEspacio(payload: CreateEspacioPayload): Promise<EspacioModel>;
  updateEspacio(id: string, payload: UpdateEspacioPayload): Promise<EspacioModel>;
  deleteEspacio(id: string): Promise<EspacioModel>;
}
