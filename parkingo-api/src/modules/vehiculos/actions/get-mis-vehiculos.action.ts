import { Injectable, ForbiddenException } from '@nestjs/common';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';
import { VehiculoResponseDto } from '../dto/vehiculo-response.dto.js';
import { VehiculoMapper } from '../mappers/vehiculo.mapper.js';

@Injectable()
export class GetMisVehiculosAction {
  constructor(private readonly vehiculoRepo: VehiculoRepository) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<VehiculoResponseDto[]> {
    const role = user.roleName || user.role;
    if (role !== 'DRIVER') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) pueden consultar sus vehículos',
      );
    }

    const userId = user.userId || user.id;
    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    const vehiculos = await this.vehiculoRepo.findByPropietarioId(userId);
    return VehiculoMapper.toDtoList(vehiculos);
  }
}
