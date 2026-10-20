import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { NivelResponseDto } from '../dto/nivel-response.dto.js';
import { NivelMapper } from '../mappers/nivel.mapper.js';

@Injectable()
export class EliminarNivelAction {
  constructor(
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(id: string, userId: string): Promise<NivelResponseDto> {
    const nivel = await this.nivelRepository.findById(id);
    if (!nivel) {
      throw new NotFoundException('El nivel solicitado no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (
      !nivel.estacionamiento ||
      !userTenantIds.includes(nivel.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar niveles de este estacionamiento.',
      );
    }

    const deleted = await this.nivelRepository.delete(id);
    return NivelMapper.toResponseDto(deleted);
  }
}
