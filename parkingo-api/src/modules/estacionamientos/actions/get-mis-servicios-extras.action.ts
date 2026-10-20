import { Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { ServicioExtraRepository } from '../repositories/servicio-extra.repository.js';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';
import { ServicioExtraMapper } from '../mappers/servicio-extra.mapper.js';

@Injectable()
export class GetMisServiciosExtrasAction {
  constructor(
    private readonly servicioExtraRepository: ServicioExtraRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string): Promise<ServicioExtraResponseDto[]> {
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

    const servicios = await this.servicioExtraRepository.findByEstacionamientoId(
      estacionamiento.id,
      false, // retornar tanto activos como inactivos para el dueño
    );

    return ServicioExtraMapper.toResponseDtoList(servicios);
  }
}
