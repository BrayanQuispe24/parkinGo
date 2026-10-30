import { Injectable } from '@nestjs/common';
import { CalificacionRepository } from '../repositories/calificacion.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { CalificacionResponseDto } from '../dto/calificacion-response.dto.js';
import { CalificacionMapper } from '../mappers/calificacion.mapper.js';

@Injectable()
export class GetCalificacionesTenantAction {
  constructor(
    private readonly calificacionRepository: CalificacionRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(userId: string): Promise<CalificacionResponseDto[]> {
    // 1. Obtener los tenants asociados al usuario (dueño o anfitrión)
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      return [];
    }

    // 2. Obtener las calificaciones de todos los estacionamientos de sus tenants
    const tenantIds = tenants.map((t) => t.id);
    const allCalificaciones = await Promise.all(
      tenantIds.map((tid) => this.calificacionRepository.findByTenantId(tid)),
    );

    const flattened = allCalificaciones.flat();
    return CalificacionMapper.toResponseDtoList(flattened);
  }
}
