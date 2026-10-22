import { Croquis, Prisma } from '@prisma/client';

export interface UpsertCroquisData {
  codigo?: string;
  anchoLienzo?: number;
  altoLienzo?: number;
  contenido: Prisma.InputJsonValue;
  fondoTipo?: string;
  fondoImagenUrl?: string | null;
  fondoOpacidad?: number;
}

export abstract class CroquisRepository {
  abstract findByNivelId(nivelId: string): Promise<Croquis | null>;
  abstract upsertByNivelId(
    nivelId: string,
    data: UpsertCroquisData,
  ): Promise<Croquis>;
}
