import type { CreateNivelPayload, NivelModel } from './Nivel';

export interface NivelRepository {
  getMisNiveles(): Promise<NivelModel[]>;
  createNivel(payload: CreateNivelPayload): Promise<NivelModel>;
  deleteNivel(id: string): Promise<NivelModel>;
}
