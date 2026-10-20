import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CreateNivelDto } from '../dto/create-nivel.dto.js';
import { NivelResponseDto } from '../dto/nivel-response.dto.js';
import { NivelMapper } from '../mappers/nivel.mapper.js';

@Injectable()
export class CrearNivelAction {
  constructor(
    private readonly nivelRepository: NivelRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: CreateNivelDto,
    userId: string,
  ): Promise<NivelResponseDto> {
    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    if (!tenants || tenants.length === 0) {
      throw new NotFoundException(
        'No se encontraron empresas (tenants) asociadas a tu cuenta.',
      );
    }

    let estacionamiento = null;
    for (const t of tenants) {
      const found = await this.estacionamientoRepository.findByTenantId(t.id);
      if (found) {
        estacionamiento = found;
        break;
      }
    }

    if (!estacionamiento) {
      throw new BadRequestException(
        'Debes contar con un estacionamiento registrado para añadir niveles.',
      );
    }

    const codigoTrim = dto.codigo.trim();
    try {
      const created = await this.nivelRepository.create({
        codigo: codigoTrim,
        estacionamientoId: estacionamiento.id,
      });

      return NivelMapper.toResponseDto(created);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2002') {
        throw new ConflictException(`Ya existe un nivel con el código "${codigoTrim}" en este estacionamiento.`);
      }
      throw err;
    }
  }
}
