import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { ActualizarHorariosDto } from '../dto/actualizar-horarios.dto.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';

@Injectable()
export class ActualizarHorariosAction {
  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: ActualizarHorariosDto,
    userId: string,
  ): Promise<EstacionamientoResponseDto> {
    if (!dto.horarios || dto.horarios.length === 0) {
      throw new BadRequestException(
        'Es obligatorio configurar al menos un día con horario de atención.',
      );
    }

    // 1. Obtener tenants del usuario
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      throw new NotFoundException(
        'No se encontraron empresas (tenants) asociadas a tu cuenta.',
      );
    }

    // 2. Buscar estacionamiento en los tenants del usuario
    let estacionamiento = null;
    for (const t of tenants) {
      const found = await this.estacionamientoRepository.findByTenantId(t.id);
      if (found) {
        estacionamiento = found;
        break;
      }
    }

    if (!estacionamiento) {
      throw new NotFoundException(
        'No se encontró ningún estacionamiento registrado para tu empresa. Registra uno primero.',
      );
    }

    // 3. Actualizar horarios en persistencia
    const updated = await this.estacionamientoRepository.actualizarHorarios(
      estacionamiento.id,
      dto.horarios,
    );

    return EstacionamientoMapper.toResponseDto(updated);
  }
}
