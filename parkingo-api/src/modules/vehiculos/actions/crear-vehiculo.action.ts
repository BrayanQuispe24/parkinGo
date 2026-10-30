import {
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';
import { CrearVehiculoDto } from '../dto/crear-vehiculo.dto.js';
import { VehiculoResponseDto } from '../dto/vehiculo-response.dto.js';
import { VehiculoMapper } from '../mappers/vehiculo.mapper.js';

@Injectable()
export class CrearVehiculoAction {
  constructor(private readonly vehiculoRepo: VehiculoRepository) {}

  async execute(
    user: { id?: string; userId?: string; role?: string; roleName?: string },
    dto: CrearVehiculoDto,
  ): Promise<VehiculoResponseDto> {
    const role = user.roleName || user.role;
    if (role !== 'DRIVER') {
      throw new ForbiddenException(
        'Solo los usuarios con rol Conductor (DRIVER) pueden registrar vehículos',
      );
    }

    const userId = user.userId || user.id;
    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    const placaNormalizada = dto.placa.trim().toUpperCase();
    const existing = await this.vehiculoRepo.findByPlaca(placaNormalizada);
    if (existing) {
      throw new ConflictException(
        `El vehículo con placa "${placaNormalizada}" ya se encuentra registrado en el sistema`,
      );
    }

    const vehiculo = await this.vehiculoRepo.create({
      tipo: dto.tipo,
      placa: placaNormalizada,
      modelo: dto.modelo,
      color: dto.color,
      propietarioId: userId,
      esPredeterminado: dto.esPredeterminado,
    });

    return VehiculoMapper.toDto(vehiculo);
  }
}
