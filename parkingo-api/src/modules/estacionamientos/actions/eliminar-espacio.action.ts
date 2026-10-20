import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EspacioRepository } from '../repositories/espacio.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { EspacioResponseDto } from '../dto/espacio-response.dto.js';
import { EspacioMapper } from '../mappers/espacio.mapper.js';

@Injectable()
export class EliminarEspacioAction {
  constructor(
    private readonly espacioRepository: EspacioRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(id: string, userId: string): Promise<EspacioResponseDto> {
    const espacio = await this.espacioRepository.findById(id);
    if (!espacio) {
      throw new NotFoundException('El espacio no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (
      !espacio.nivel?.estacionamiento ||
      !userTenantIds.includes(espacio.nivel.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este espacio.',
      );
    }

    const deleted = await this.espacioRepository.delete(id);
    return EspacioMapper.toResponseDto(deleted);
  }
}
