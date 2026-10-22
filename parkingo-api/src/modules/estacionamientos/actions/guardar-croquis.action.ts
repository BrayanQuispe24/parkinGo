import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { GuardarCroquisDto } from '../dto/guardar-croquis.dto.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';
import { CroquisMapper } from '../mappers/croquis.mapper.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuardarCroquisAction {
  constructor(
    private readonly croquisRepository: CroquisRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    nivelId: string,
    dto: GuardarCroquisDto,
    userId: string,
  ): Promise<CroquisResponseDto> {
    const nivel = await this.nivelRepository.findById(nivelId);
    if (!nivel) {
      throw new NotFoundException('El nivel indicado no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (
      !nivel.estacionamiento ||
      !userTenantIds.includes(nivel.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para modificar el croquis de este nivel.',
      );
    }

    const saved = await this.croquisRepository.upsertByNivelId(nivelId, {
      codigo: dto.codigo?.trim() || 'PLANO-PRINCIPAL',
      anchoLienzo: dto.anchoLienzo,
      altoLienzo: dto.altoLienzo,
      contenido: dto.contenido as unknown as Prisma.InputJsonValue,
      fondoTipo: dto.fondoTipo,
      fondoImagenUrl: dto.fondoImagenUrl,
      fondoOpacidad: dto.fondoOpacidad,
    });

    return CroquisMapper.toResponseDto(saved);
  }
}
