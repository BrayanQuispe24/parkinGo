import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { GuardarCroquisDto } from '../dto/guardar-croquis.dto.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';
import { CroquisMapper } from '../mappers/croquis.mapper.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class GuardarCroquisAction {
  constructor(
    private readonly croquisRepository: CroquisRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    nivelId: string,
    dto: GuardarCroquisDto,
    userId: string,
    roleName?: string,
  ): Promise<CroquisResponseDto> {
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
        'No tienes permisos para modificar el croquis de este nivel.',
      );
    }

    if (roleName === 'HOST' && dto.contenido && typeof dto.contenido === 'object') {
      const nodos = (dto.contenido as { nodos?: Array<{ tipo?: string }> }).nodos;
      if (Array.isArray(nodos)) {
        const espaciosEnCroquis = nodos.filter((n) => n && n.tipo === 'ESPACIO');
        if (espaciosEnCroquis.length > 1) {
          throw new BadRequestException(
            'El plano arquitectónico para el rol Anfitrión solo puede contener una única plaza de parqueo (ESPACIO).',
          );
        }
      }
    }

    const saved = await this.croquisRepository.upsertByNivelId(nivelId, {
      codigo: dto.codigo?.trim() || 'PLANO-PRINCIPAL',
      anchoLienzo: dto.anchoLienzo,
      altoLienzo: dto.altoLienzo,
      contenido: dto.contenido as unknown as Prisma.InputJsonValue,
      fondoTipo: dto.fondoTipo,
      fondoImagenUrl: dto.fondoImagenUrl,
      fondoOpacidad: dto.fondoOpacidad,
    });

    return CroquisMapper.toResponseDto(saved);
  }
}
