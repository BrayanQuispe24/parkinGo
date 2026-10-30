import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import { ReservaRepository } from '../repositories/reserva.repository.js';
import { BoletaReservaResponseDto } from '../dto/reserva-response.dto.js';
import { ReservaMapper } from '../mappers/reserva.mapper.js';

@Injectable()
export class GetReservasEstacionamientoAction {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    estacionamientoId: string,
    user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto[]> {
    const role = user.roleName || user.role;
    const userId = user.userId || user.id;

    if (!userId) {
      throw new ForbiddenException('Usuario no autenticado o ID no identificado');
    }

    // Regla 3: El administrador general NO puede ver las reservas de nadie
    if (role === 'GENERAL_ADMIN') {
      throw new ForbiddenException(
        'Acceso restringido: El Administrador General no tiene permitido visualizar las reservas de los estacionamientos',
      );
    }

    // Validar existencia del estacionamiento
    const estacionamiento = await this.prisma.estacionamiento.findUnique({
      where: { id: estacionamientoId },
      include: {
        tenant: true,
        operadores: { select: { id: true } },
      },
    });

    if (!estacionamiento) {
      throw new NotFoundException(
        `El estacionamiento con ID "${estacionamientoId}" no existe`,
      );
    }

    // Regla 2: Solo el administrador de parqueo / host dueño o el operador asignado pueden verlas
    const esDuenio = estacionamiento.tenant.usuarioId === userId;
    const esOperadorAsignado = estacionamiento.operadores.some((op) => op.id === userId);

    if (!esDuenio && !esOperadorAsignado && role !== 'SUPER_ADMIN') {
      throw new ForbiddenException(
        'Solo el Administrador del parqueo o su operador asignado pueden visualizar las reservas de este establecimiento',
      );
    }

    const reservas = await this.reservaRepo.findByEstacionamientoId(estacionamientoId);
    return ReservaMapper.toDtoList(reservas);
  }
}
