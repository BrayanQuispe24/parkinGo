import { Injectable } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { TarifaRepository } from '../repositories/tarifa.repository.js';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';
import { TarifaMapper } from '../mappers/tarifa.mapper.js';

@Injectable()
export class GetMisTarifasAction {
  constructor(
    private readonly tarifaRepository: TarifaRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string): Promise<TarifaResponseDto[]> {
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

    const tarifas = await this.tarifaRepository.findByEstacionamientoId(
      estacionamiento.id,
      false, // retornar tanto activas como inactivas para el dueño
    );

    return TarifaMapper.toResponseDtoList(tarifas);
  }
}
