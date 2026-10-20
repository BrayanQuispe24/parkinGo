import { Injectable } from '@nestjs/common';
import { ServicioExtraRepository } from '../repositories/servicio-extra.repository.js';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';
import { ServicioExtraMapper } from '../mappers/servicio-extra.mapper.js';

@Injectable()
export class GetServiciosExtrasByEstacionamientoAction {
  constructor(
    private readonly servicioExtraRepository: ServicioExtraRepository,
  ) {}

  async execute(estacionamientoId: string): Promise<ServicioExtraResponseDto[]> {
    const servicios = await this.servicioExtraRepository.findByEstacionamientoId(
      estacionamientoId,
      true, // solo los activos
    );

    return ServicioExtraMapper.toResponseDtoList(servicios);
  }
}
