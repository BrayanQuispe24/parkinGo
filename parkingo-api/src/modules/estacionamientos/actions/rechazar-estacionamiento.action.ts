import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EstadoEstacionamiento } from '@prisma/client';
import { EstacionamientoRepository } from '../repositories/estacionamiento.repository.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoMapper } from '../mappers/estacionamiento.mapper.js';
import { MailerService } from '../../mailer/mailer.service.js';

@Injectable()
export class RechazarEstacionamientoAction {
  private readonly logger = new Logger(RechazarEstacionamientoAction.name);

  constructor(
    private readonly estacionamientoRepository: EstacionamientoRepository,
    private readonly mailerService: MailerService,
  ) {}

  async execute(id: string, motivoRechazo: string): Promise<EstacionamientoResponseDto> {
    const existing = await this.estacionamientoRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`No se encontró el estacionamiento con ID: ${id}`);
    }

    const motivoLimpio = motivoRechazo.trim();

    const updated = await this.estacionamientoRepository.updateEstado(
      id,
      EstadoEstacionamiento.RECHAZADO,
      motivoLimpio,
      null,
    );

    const owner = updated.tenant?.usuario;
    if (owner?.email) {
      const recipientName = `${owner.firstName} ${owner.lastName}`.trim() || 'Administrador de Parqueo';
      const fechaLegible = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      this.mailerService
        .sendParkingRejectionEmail(owner.email, recipientName, {
          estacionamientoNombre: updated.nombre,
          tenantNombre: updated.tenant?.nombre,
          motivoRechazo: motivoLimpio,
          fecha: fechaLegible,
        })
        .catch((err: unknown) => {
          this.logger.error(
            `Error enviando correo de rechazo de estacionamiento (${updated.id}) a ${owner.email}:`,
            err,
          );
        });
    } else {
      this.logger.warn(
        `No se encontró correo del usuario solicitante para notificar el rechazo del estacionamiento ${updated.id}.`,
      );
    }

    return EstacionamientoMapper.toResponseDto(updated);
  }
}
