import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';
import { VehiculoResponseDto } from '../dto/vehiculo-response.dto.js';
import { VehiculoMapper } from '../mappers/vehiculo.mapper.js';

@Injectable()
export class SetVehiculoPredeterminadoAction {
  constructor(private readonly vehiculoRepo: VehiculoRepository) {}

  async execute(
    vehiculoId: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<VehiculoResponseDto> {
    const role = user.roleName || user.role;
    if (role !== 'DRIVER') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) pueden gestionar sus vehículos',
      );
    }

    const userId = user.userId || user.id;
    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    const vehiculo = await this.vehiculoRepo.findById(vehiculoId);
    if (!vehiculo) {
      throw new NotFoundException(`El vehículo con ID "${vehiculoId}" no existe`);
    }

    if (vehiculo.propietarioId !== userId) {
      throw new ForbiddenException(
        'No tienes permisos para modificar este vehículo ya que no te pertenece',
      );
    }

    const actualizado = await this.vehiculoRepo.setPredeterminado(
      vehiculoId,
      userId,
    );
    return VehiculoMapper.toDto(actualizado);
  }
}
