import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { HorarioResponseDto } from '../dto/estacionamiento-response.dto.js';

@Injectable()
export class GetTenantHorariosAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(tenantId: string, userId: string, roles: string[] = []): Promise<HorarioResponseDto[]> {
    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('La empresa (tenant) especificada no existe.');
    }

    const isAdmin = roles.includes('GENERAL_ADMIN') || roles.includes('SUPER_ADMIN');
    if (!isAdmin && tenant.usuarioId !== userId) {
      throw new ForbiddenException('No tienes autorización para consultar los horarios de esta empresa.');
    }

    const horarios = await this.estacionamientoRepository.findHorariosByTenantId(tenantId);
    return horarios.map((h) => ({
      id: h.id,
      dia: h.dia,
      horaInicio: h.horaInicio,
      horaCierre: h.horaCierre,
    }));
  }
}
