import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { EspacioRepository } from '../repositories/espacio.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { EspacioResponseDto } from '../dto/espacio-response.dto.js';
import { EspacioMapper } from '../mappers/espacio.mapper.js';

@Injectable()
export class GetMisEspaciosAction {
  constructor(
    private readonly espacioRepository: EspacioRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string, nivelId?: string): Promise<EspacioResponseDto[]> {
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      return [];
    }

    const tenantIds = tenants.map((t) => t.id);

    if (nivelId) {
      const nivel = await this.nivelRepository.findById(nivelId);
      if (!nivel) {
        throw new NotFoundException('El nivel especificado no existe.');
      }
      if (!nivel.estacionamiento || !tenantIds.includes(nivel.estacionamiento.tenantId)) {
        throw new ForbiddenException('No tienes acceso a los espacios de este nivel.');
      }

      const espacios = await this.espacioRepository.findByNivelId(nivelId);
      return EspacioMapper.toResponseDtoList(espacios);
    }

    // Si no especifica nivel, obtener todos los espacios del estacionamiento del tenant
    let estacionamiento = null;
    for (const t of tenants) {
      const found = await this.estacionamientoRepository.findByTenantId(t.id);
      if (found) {
        estacionamiento = found;
        break;
      }
    }

    if (!estacionamiento) {
      return [];
    }

    const espacios = await this.espacioRepository.findByEstacionamientoId(estacionamiento.id);
    return EspacioMapper.toResponseDtoList(espacios);
  }
}
