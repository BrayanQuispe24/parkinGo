import type { EspacioRealtimeEvent } from '../../../core/realtime/realtimeEvents';
import type { EspacioModel } from '../domain/Espacio';

function mapEventToEspacioModel(
  event: EspacioRealtimeEvent,
  existing?: EspacioModel,
): EspacioModel {
  return {
    id: event.espacioId,
    codigoEspacio: event.codigoEspacio,
    tipo: event.tipo,
    modalidad: event.modalidad,
    estado: event.estado,
    nivelId: event.nivelId,
    nivelCodigo: event.nivelCodigo ?? existing?.nivelCodigo,
    createdAt: existing?.createdAt ?? event.timestamp,
    updatedAt: event.timestamp,
  };
}

export function applyEspacioEventToAdminEspacios(
  espacios: EspacioModel[] | undefined,
  event: EspacioRealtimeEvent,
  filterNivelId?: string,
): EspacioModel[] | undefined {
  if (!espacios) {
    return espacios;
  }

  const belongsToCurrentFilter =
    !filterNivelId || filterNivelId === event.nivelId;

  if (event.action === 'DELETED') {
    const filtered = espacios.filter((e) => e.id !== event.espacioId);
    return filtered.length !== espacios.length ? filtered : espacios;
  }

  const existingIndex = espacios.findIndex((e) => e.id === event.espacioId);

  if (existingIndex >= 0) {
    if (!belongsToCurrentFilter) {
      return espacios.filter((e) => e.id !== event.espacioId);
    }
    const next = [...espacios];
    next[existingIndex] = mapEventToEspacioModel(event, espacios[existingIndex]);
    return next;
  }

  if (belongsToCurrentFilter) {
    return [...espacios, mapEventToEspacioModel(event)];
  }

  return espacios;
}

