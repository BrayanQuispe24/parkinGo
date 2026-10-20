import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { ActualizarHorariosDto } from '../dto/actualizar-horarios.dto.js';
import { HorarioResponseDto } from '../dto/estacionamiento-response.dto.js';

@Injectable()
export class ActualizarTenantHorariosAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    tenantId: string,
    dto: ActualizarHorariosDto,
    userId: string,
    roles: string[] = [],
  ): Promise<HorarioResponseDto[]> {
    if (!dto.horarios || dto.horarios.length === 0) {
      throw new BadRequestException('Debes configurar al menos un horario de atención para la empresa.');
    }

    const tenant = await this.tenantRepository.findById(tenantId);
    if (!tenant) {
      throw new NotFoundException('La empresa (tenant) especificada no existe.');
    }

    const isAdmin = roles.includes('GENERAL_ADMIN') || roles.includes('SUPER_ADMIN');
    if (!isAdmin && tenant.usuarioId !== userId) {
      throw new ForbiddenException('No tienes autorización para modificar los horarios de esta empresa.');
    }

    const updated = await this.estacionamientoRepository.actualizarHorariosTenant(
      tenantId,
      dto.horarios,
    );

    return updated.map((h) => ({
      id: h.id,
      dia: h.dia,
      horaInicio: h.horaInicio,
      horaCierre: h.horaCierre,
    }));
  }
}
