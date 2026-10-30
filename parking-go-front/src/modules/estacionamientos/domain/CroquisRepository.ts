import type { CroquisModel, GuardarCroquisPayload } from './Croquis';

export interface CroquisRepository {
  getCroquisByNivel(nivelId: string): Promise<CroquisModel | null>;
  getCroquisByEstacionamientoYNivel(
    estacionamientoId: string,
    nivelId: string,
  ): Promise<CroquisModel | null>;
  guardarCroquis(
    nivelId: string,
    payload: GuardarCroquisPayload,
  ): Promise<CroquisModel>;
  subirFondoImagen(nivelId: string, file: File): Promise<CroquisModel>;
}
