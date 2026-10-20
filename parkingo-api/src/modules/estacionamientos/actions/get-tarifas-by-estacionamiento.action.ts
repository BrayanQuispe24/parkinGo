import { Injectable } from '@nestjs/common';
import { TarifaRepository } from '../repositories/tarifa.repository.js';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';
import { TarifaMapper } from '../mappers/tarifa.mapper.js';

@Injectable()
export class GetTarifasByEstacionamientoAction {
  constructor(private readonly tarifaRepository: TarifaRepository) {}

  async execute(estacionamientoId: string): Promise<TarifaResponseDto[]> {
    const tarifas = await this.tarifaRepository.findByEstacionamientoId(
      estacionamientoId,
      true, // sólo tarifas activas para vista pública/conductor
    );

    return TarifaMapper.toResponseDtoList(tarifas);
  }
}
