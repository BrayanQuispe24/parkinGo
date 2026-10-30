import { Injectable, NotFoundException } from '@nestjs/common';
import { NivelRepository } from '../repositories/nivel.repository.js';
import { CroquisRepository } from '../repositories/croquis.repository.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';
import { CroquisMapper } from '../mappers/croquis.mapper.js';

@Injectable()
export class GetCroquisPublicoByNivelAction {
  constructor(
    private readonly croquisRepository: CroquisRepository,
    private readonly nivelRepository: NivelRepository,
  ) {}

  async execute(
    estacionamientoId: string,
    nivelId: string,
  ): Promise<CroquisResponseDto | null> {
    const nivel = await this.nivelRepository.findById(nivelId);
    if (!nivel) {
      throw new NotFoundException('El nivel indicado no fue encontrado.');
    }

    if (nivel.estacionamientoId !== estacionamientoId) {
      throw new NotFoundException(
        'El nivel no pertenece al estacionamiento solicitado.',
      );
    }

    const croquis = await this.croquisRepository.findByNivelId(nivelId);
    if (!croquis) {
      return null;
    }

    return CroquisMapper.toResponseDto(croquis);
  }
}
