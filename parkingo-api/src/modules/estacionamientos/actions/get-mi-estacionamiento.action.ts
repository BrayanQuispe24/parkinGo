import { Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';

@Injectable()
export class GetMiEstacionamientoAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string): Promise<EstacionamientoResponseDto | null> {
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      return null;
    }

    const tenantId = tenants[0].id;
    const estacionamiento = await this.estacionamientoRepository.findByTenantId(tenantId);
    if (!estacionamiento) {
      return null;
    }

    return EstacionamientoMapper.toResponseDto(estacionamiento);
  }
}
