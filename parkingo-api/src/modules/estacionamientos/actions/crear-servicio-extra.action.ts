import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { ServicioExtraRepository } from '../repositories/servicio-extra.repository.js';
import { CreateServicioExtraDto } from '../dto/create-servicio-extra.dto.js';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';
import { ServicioExtraMapper } from '../mappers/servicio-extra.mapper.js';

@Injectable()
export class CrearServicioExtraAction {
  constructor(
    private readonly servicioExtraRepository: ServicioExtraRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    dto: CreateServicioExtraDto,
    userId: string,
  ): Promise<ServicioExtraResponseDto> {
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
        'Debes contar con un estacionamiento registrado para añadir servicios extras.',
      );
    }

    const created = await this.servicioExtraRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      precio: dto.precio,
      estacionamientoId: estacionamiento.id,
    });

    return ServicioExtraMapper.toResponseDto(created);
  }
}
