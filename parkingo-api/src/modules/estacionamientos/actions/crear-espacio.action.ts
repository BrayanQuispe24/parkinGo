import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { EspacioRepository } from '../repositories/espacio.repository.js';
import { CreateEspacioDto } from '../dto/create-espacio.dto.js';
import { EspacioResponseDto } from '../dto/espacio-response.dto.js';
import { EspacioMapper } from '../mappers/espacio.mapper.js';

@Injectable()
export class CrearEspacioAction {
  constructor(
    private readonly espacioRepository: EspacioRepository,
    private readonly nivelRepository: NivelRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: CreateEspacioDto,
    userId: string,
  ): Promise<EspacioResponseDto> {
    const nivel = await this.nivelRepository.findById(dto.nivelId);
    if (!nivel) {
      throw new NotFoundException('El nivel indicado no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    if (
      !nivel.estacionamiento ||
      !userTenantIds.includes(nivel.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para agregar espacios a este nivel.',
      );
    }

    const codigoTrim = dto.codigoEspacio.trim();
    try {
      const created = await this.espacioRepository.create({
        codigoEspacio: codigoTrim,
        tipo: dto.tipo,
        modalidad: dto.modalidad,
        estado: dto.estado,
        nivelId: dto.nivelId,
      });

      return EspacioMapper.toResponseDto(created);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2002') {
        throw new ConflictException(
          `Ya existe un espacio con el código "${codigoTrim}" en este nivel.`,
        );
      }
      throw err;
    }
  }
}
