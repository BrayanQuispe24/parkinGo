import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { TarifaRepository } from '../repositories/tarifa.repository.js';
import { CreateTarifaDto } from '../dto/create-tarifa.dto.js';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';
import { TarifaMapper } from '../mappers/tarifa.mapper.js';

@Injectable()
export class CrearTarifaAction {
  constructor(
    private readonly tarifaRepository: TarifaRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: CreateTarifaDto,
    userId: string,
  ): Promise<TarifaResponseDto> {
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
        'Debes contar con un estacionamiento registrado para añadir tarifas.',
      );
    }

    const created = await this.tarifaRepository.create({
      descripcion: dto.descripcion,
      monto: dto.monto,
      modalidad: dto.modalidad,
      estado: dto.estado,
      estacionamientoId: estacionamiento.id,
    });

    return TarifaMapper.toResponseDto(created);
  }
}
