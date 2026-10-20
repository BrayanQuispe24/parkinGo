import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { TarifaRepository } from '../repositories/tarifa.repository.js';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';
import { TarifaMapper } from '../mappers/tarifa.mapper.js';

@Injectable()
export class EliminarTarifaAction {
  constructor(
    private readonly tarifaRepository: TarifaRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(id: string, userId: string): Promise<TarifaResponseDto> {
    const tarifa = await this.tarifaRepository.findById(id);
    if (!tarifa) {
      throw new NotFoundException('La tarifa solicitada no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (
      !tarifa.estacionamiento ||
      !userTenantIds.includes(tarifa.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar tarifas de este estacionamiento.',
      );
    }

    const deleted = await this.tarifaRepository.delete(id);
    return TarifaMapper.toResponseDto(deleted);
  }
}
