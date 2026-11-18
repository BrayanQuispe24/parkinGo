import { describe, it, expect, vi } from 'vitest';
import { EstadoEspacio, ModalidadTarifa, TipoEspacio } from '@prisma/client';
import { EspaciosRealtimeService } from './espacios-realtime.service.js';
import type { EspaciosRealtimeGateway } from '../gateways/espacios-realtime.gateway.js';
import type { EspacioResponseDto } from '../../estacionamientos/dto/espacio-response.dto.js';

describe('EspaciosRealtimeService', () => {
  const sampleEspacio: EspacioResponseDto = {
    id: 'esp-1',
    codigoEspacio: 'A1-2',
    tipo: TipoEspacio.AUTO,
    modalidad: ModalidadTarifa.HORA,
    estado: EstadoEspacio.OCUPADO,
    nivelId: 'niv-1',
    nivelCodigo: 'A1',
    createdAt: new Date('2026-11-11T10:00:00.000Z'),
    updatedAt: new Date('2026-11-11T10:05:00.000Z'),
  };

  it('emite el evento delta con estacionamientoId y metadata del espacio', () => {
    const emitEspacioActualizado = vi.fn();
    const mockGateway = {
      emitEspacioActualizado,
    } as unknown as EspaciosRealtimeGateway;

    const service = new EspaciosRealtimeService(mockGateway);
    service.emitEspacioCambio('UPDATED', 'park-1', sampleEspacio);

    expect(emitEspacioActualizado).toHaveBeenCalledTimes(1);
    expect(emitEspacioActualizado).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'UPDATED',
        estacionamientoId: 'park-1',
        espacioId: 'esp-1',
        codigoEspacio: 'A1-2',
        estado: EstadoEspacio.OCUPADO,
        nivelId: 'niv-1',
        nivelCodigo: 'A1',
      }),
    );
  });

  it('no propaga excepciones si falla la emisión en el gateway', () => {
    const mockGateway = {
      emitEspacioActualizado: vi.fn(() => {
        throw new Error('Socket error');
      }),
    } as unknown as EspaciosRealtimeGateway;

    const service = new EspaciosRealtimeService(mockGateway);
    expect(() =>
      service.emitEspacioCambio('UPDATED', 'park-1', sampleEspacio),
    ).not.toThrow();
  });
});

