import { Injectable, Logger } from '@nestjs/common';
import type { EspacioResponseDto } from '../../estacionamientos/dto/espacio-response.dto.js';
import type {
  EspacioRealtimeAction,
  EspacioRealtimeEventDto,
} from '../dto/espacio-realtime-event.dto.js';
import { EspaciosRealtimeGateway } from '../gateways/espacios-realtime.gateway.js';

@Injectable()
export class EspaciosRealtimeService {
  private readonly logger = new Logger(EspaciosRealtimeService.name);

  constructor(private readonly gateway: EspaciosRealtimeGateway) {}

  emitEspacioCambio(
    action: EspacioRealtimeAction,
    estacionamientoId: string,
    espacio: EspacioResponseDto,
  ): void {
    try {
      const payload: EspacioRealtimeEventDto = {
        action,
        estacionamientoId,
        espacioId: espacio.id,
        codigoEspacio: espacio.codigoEspacio,
        tipo: espacio.tipo,
        modalidad: espacio.modalidad,
        estado: espacio.estado,
        nivelId: espacio.nivelId,
        nivelCodigo: espacio.nivelCodigo,
        timestamp: new Date().toISOString(),
      };
      this.gateway.emitEspacioActualizado(payload);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `No se pudo emitir evento realtime para espacio ${espacio.id}: ${msg}`,
      );
    }
  }
}

