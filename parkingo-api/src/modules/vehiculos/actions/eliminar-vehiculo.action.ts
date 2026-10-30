import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';

@Injectable()
export class EliminarVehiculoAction {
  constructor(private readonly vehiculoRepo: VehiculoRepository) {}

  async execute(
    vehiculoId: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<{ message: string }> {
    const role = user.roleName || user.role;
    if (role !== 'DRIVER') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) pueden eliminar sus vehículos',
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
        'No tienes permisos para eliminar este vehículo ya que no te pertenece',
      );
    }

    await this.vehiculoRepo.delete(vehiculoId);

    // Si era el predeterminado, verificar si quedan otros para marcar el más reciente
    if (vehiculo.esPredeterminado) {
      const restantes = await this.vehiculoRepo.findByPropietarioId(userId);
      if (restantes.length > 0) {
        await this.vehiculoRepo.setPredeterminado(restantes[0].id, userId);
      }
    }

    return { message: 'Vehículo eliminado exitosamente' };
  }
}
