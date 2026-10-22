import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { Croquis } from '@prisma/client';
import {
  CroquisRepository,
  UpsertCroquisData,
} from './croquis.repository.js';

@Injectable()
export class PrismaCroquisRepository implements CroquisRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNivelId(nivelId: string): Promise<Croquis | null> {
    return this.prisma.croquis.findFirst({
      where: { nivelId },
    });
  }

  async upsertByNivelId(
    nivelId: string,
    data: UpsertCroquisData,
  ): Promise<Croquis> {
    const existing = await this.prisma.croquis.findFirst({
      where: { nivelId },
    });

    if (existing) {
      return this.prisma.croquis.update({
        where: { id: existing.id },
        data: {
          codigo: data.codigo ?? existing.codigo,
          anchoLienzo: data.anchoLienzo ?? existing.anchoLienzo,
          altoLienzo: data.altoLienzo ?? existing.altoLienzo,
          contenido: data.contenido ?? existing.contenido,
          fondoTipo: data.fondoTipo !== undefined ? data.fondoTipo : existing.fondoTipo,
          fondoImagenUrl: data.fondoImagenUrl !== undefined ? data.fondoImagenUrl : existing.fondoImagenUrl,
          fondoOpacidad: data.fondoOpacidad !== undefined ? data.fondoOpacidad : existing.fondoOpacidad,
        },
      });
    }

    return this.prisma.croquis.create({
      data: {
        nivelId,
        codigo: data.codigo ?? 'PLANO-PRINCIPAL',
        anchoLienzo: data.anchoLienzo ?? 1200,
        altoLienzo: data.altoLienzo ?? 800,
        contenido: data.contenido ?? { elementos: [] },
        fondoTipo: data.fondoTipo ?? 'PLANO',
        fondoImagenUrl: data.fondoImagenUrl ?? null,
        fondoOpacidad: data.fondoOpacidad ?? 0.4,
      },
    });
  }
}
