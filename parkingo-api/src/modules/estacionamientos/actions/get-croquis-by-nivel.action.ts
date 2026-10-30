import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';
import { CroquisMapper } from '../mappers/croquis.mapper.js';

@Injectable()
export class GetCroquisByNivelAction {
  constructor(
    private readonly croquisRepository: CroquisRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    nivelId: string,
    userId: string,
  ): Promise<CroquisResponseDto | null> {
    const nivel = await this.nivelRepository.findById(nivelId);
    if (!nivel) {
      throw new NotFoundException('El nivel indicado no existe.');
    }

    if (!nivel.estacionamiento) {
      throw new ForbiddenException(
        'El nivel no está asociado a un estacionamiento válido.',
      );
    }

    const esDuenoTenant = nivel.estacionamiento.tenant?.usuarioId === userId;
    const esOperador = (nivel.estacionamiento.operadores || []).some(
      (op) => op.id === userId,
    );

    let tienePermiso = esDuenoTenant || esOperador;
    if (!tienePermiso) {
      const tenants = await this.tenantRepository.findByUsuarioId(userId);
      const userTenantIds = (tenants || []).map((t) => t.id);
      tienePermiso = userTenantIds.includes(nivel.estacionamiento.tenantId);
    }

    if (!tienePermiso) {
      throw new ForbiddenException(
        'No tienes permisos para consultar el croquis de este nivel.',
      );
    }

    const croquis = await this.croquisRepository.findByNivelId(nivelId);
    if (!croquis) {
      return null;
    }

    return CroquisMapper.toResponseDto(croquis);
  }
}
