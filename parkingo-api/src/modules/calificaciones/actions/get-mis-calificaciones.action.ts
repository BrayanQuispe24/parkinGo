import { Injectable } from '@nestjs/common';
import { CalificacionRepository } from '../repositories/calificacion.repository.js';
import { CalificacionResponseDto } from '../dto/calificacion-response.dto.js';
import { CalificacionMapper } from '../mappers/calificacion.mapper.js';

@Injectable()
export class GetMisCalificacionesAction {
  constructor(private readonly calificacionRepository: CalificacionRepository) {}

  async execute(clienteId: string): Promise<CalificacionResponseDto[]> {
    const calificaciones = await this.calificacionRepository.findByClienteId(clienteId);
    return CalificacionMapper.toResponseDtoList(calificaciones);
  }
}
