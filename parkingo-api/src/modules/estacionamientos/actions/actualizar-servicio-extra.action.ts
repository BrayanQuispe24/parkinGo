import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from '../../tenants/repositories/tenant.repository.js';
import { ServicioExtraRepository } from '../repositories/servicio-extra.repository.js';
import { UpdateServicioExtraDto } from '../dto/update-servicio-extra.dto.js';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';
import { ServicioExtraMapper } from '../mappers/servicio-extra.mapper.js';

@Injectable()
export class ActualizarServicioExtraAction {
  constructor(
    private readonly servicioExtraRepository: ServicioExtraRepository,
    private readonly tenantRepository: TenantRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateServicioExtraDto,
    userId: string,
  ): Promise<ServicioExtraResponseDto> {
    const servicio = await this.servicioExtraRepository.findById(id);
    if (!servicio) {
      throw new NotFoundException('El servicio extra solicitado no existe.');
    }

    const tenants = await this.tenantRepository.findByUsuarioId(userId);
    const userTenantIds = (tenants || []).map((t) => t.id);

    // Verificamos que el estacionamiento pertenezca a uno de los tenants del usuario
    const servicioWithRelation = servicio as typeof servicio & {
      estacionamiento?: { tenantId: string };
    };

    if (
      !servicioWithRelation.estacionamiento ||
      !userTenantIds.includes(servicioWithRelation.estacionamiento.tenantId)
    ) {
      throw new ForbiddenException(
        'No tienes permisos para modificar servicios extras de este estacionamiento.',
      );
    }

    const updated = await this.servicioExtraRepository.update(id, dto);
    return ServicioExtraMapper.toResponseDto(updated);
  }
}
