import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CalificacionRepository } from '../repositories/calificacion.repository.js';
import { EstacionamientoRepository } from '../../estacionamientos/repositories/estacionamiento.repository.js';
import { CrearCalificacionDto } from '../dto/crear-calificacion.dto.js';
import { CalificacionResponseDto } from '../dto/calificacion-response.dto.js';
import { CalificacionMapper } from '../mappers/calificacion.mapper.js';

@Injectable()
export class CrearCalificacionAction {
  constructor(
    private readonly calificacionRepository: CalificacionRepository,
    private readonly estacionamientoRepository: EstacionamientoRepository,
  ) {}

  async execute(
    dto: CrearCalificacionDto,
    clienteId: string,
    roleName?: string,
  ): Promise<CalificacionResponseDto> {
    // 1. Regla de seguridad por rol: Únicamente DRIVER puede calificar
    const normalizedRole = roleName?.toUpperCase();
    if (normalizedRole !== 'DRIVER') {
      throw new ForbiddenException(
        'Acceso restringido: Únicamente los usuarios con rol Conductor (DRIVER) pueden calificar un estacionamiento.',
      );
    }

    // 2. Validar que el estacionamiento exista
    const estacionamiento = await this.estacionamientoRepository.findById(
      dto.estacionamientoId,
    );
    if (!estacionamiento) {
      throw new NotFoundException(
        `El estacionamiento con ID "${dto.estacionamientoId}" no existe.`,
      );
    }

    // 3. Validar que esté aprobado
    if (estacionamiento.estado !== 'APROBADO') {
      throw new BadRequestException(
        'Solo es posible calificar estacionamientos que se encuentren en estado APROBADO.',
      );
    }

    // 4. Crear la calificación
    const calificacion = await this.calificacionRepository.create({
      puntaje: dto.puntaje,
      comentario: dto.comentario.trim(),
      clienteId,
      estacionamientoId: dto.estacionamientoId,
    });

    return CalificacionMapper.toResponseDto(calificacion);
  }
}
