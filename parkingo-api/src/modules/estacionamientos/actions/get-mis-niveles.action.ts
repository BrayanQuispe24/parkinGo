import { Injectable } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { NivelResponseDto } from '../dto/nivel-response.dto.js';
import { NivelMapper } from '../mappers/nivel.mapper.js';

@Injectable()
export class GetMisNivelesAction {
  constructor(
    private readonly nivelRepository: NivelRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string): Promise<NivelResponseDto[]> {
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      return [];
    }

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

    const niveles = await this.nivelRepository.findByEstacionamientoId(
      estacionamiento.id,
    );

    return NivelMapper.toResponseDtoList(niveles);
  }
}
