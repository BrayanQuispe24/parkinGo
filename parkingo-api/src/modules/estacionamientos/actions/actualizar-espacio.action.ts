import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EspacioRepository } from '../repositories/espacio.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { UpdateEspacioDto } from '../dto/update-espacio.dto.js';
import { EspacioResponseDto } from '../dto/espacio-response.dto.js';
import { EspacioMapper } from '../mappers/espacio.mapper.js';

@Injectable()
export class ActualizarEspacioAction {
  constructor(
    private readonly espacioRepository: EspacioRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateEspacioDto,
    userId: string,
  ): Promise<EspacioResponseDto> {
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
        'No tienes permisos para modificar este espacio.',
      );
    }

    if (dto.nivelId && dto.nivelId !== espacio.nivelId) {
      const nuevoNivel = await this.nivelRepository.findById(dto.nivelId);
      if (!nuevoNivel) {
        throw new NotFoundException('El nuevo nivel especificado no existe.');
      }
      if (
        !nuevoNivel.estacionamiento ||
        !userTenantIds.includes(nuevoNivel.estacionamiento.tenantId)
      ) {
        throw new ForbiddenException(
          'No tienes permisos para mover el espacio al nivel indicado.',
        );
      }
    }

    try {
      const updated = await this.espacioRepository.update(id, {
        codigoEspacio: dto.codigoEspacio?.trim(),
        tipo: dto.tipo,
        modalidad: dto.modalidad,
        estado: dto.estado,
        nivelId: dto.nivelId,
      });

      return EspacioMapper.toResponseDto(updated);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException(
          `Ya existe un espacio con ese código en el nivel seleccionado.`,
        );
      }
      throw err;
    }
  }
}
