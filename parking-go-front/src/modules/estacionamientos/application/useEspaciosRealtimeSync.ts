import { useEffect, useRef } from 'react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import {
  releaseRealtimeSocket,
  retainRealtimeSocket,
} from '../../../core/realtime/socketClient';
import type { EspacioRealtimeEvent } from '../../../core/realtime/realtimeEvents';
import type { EspacioModel } from '../domain/Espacio';
import { applyEspacioEventToAdminEspacios } from './espaciosCacheUpdater';
import { ESPACIOS_QUERY_KEYS } from './useEspaciosQuery';

function extractNivelFilter(queryKey: QueryKey): string | undefined {
  const maybeFilter = queryKey[2];
  if (
    typeof maybeFilter === 'object' &&
    maybeFilter !== null &&
    'nivelId' in maybeFilter
  ) {
    const nivelId = (maybeFilter as { nivelId?: unknown }).nivelId;
    return typeof nivelId === 'string' ? nivelId : undefined;
  }
  return undefined;
}

export const useEspaciosRealtimeSync = (estacionamientoId?: string): void => {
  const queryClient = useQueryClient();
  const hasConnectedOnceRef = useRef(false);

  useEffect(() => {
    if (!estacionamientoId) {
      return;
    }

    const socket = retainRealtimeSocket();

    const joinRoom = () => {
      socket.emit('room:join-parking', { estacionamientoId });
    };

    const handleConnect = () => {
      joinRoom();
      if (hasConnectedOnceRef.current) {
        queryClient.invalidateQueries({ queryKey: ESPACIOS_QUERY_KEYS.all });
      }
      hasConnectedOnceRef.current = true;
    };

    const handleEspacioActualizado = (event: EspacioRealtimeEvent) => {
      if (event.estacionamientoId !== estacionamientoId) {
        return;
      }

      const cachedQueries = queryClient.getQueriesData<EspacioModel[]>({
        queryKey: ESPACIOS_QUERY_KEYS.all,
      });

      cachedQueries.forEach(([queryKey, oldData]) => {
        if (!oldData) {
          return;
        }
        const filterNivelId = extractNivelFilter(queryKey);
        const nextData = applyEspacioEventToAdminEspacios(
          oldData,
          event,
          filterNivelId,
        );
        if (nextData !== oldData) {
          queryClient.setQueryData<EspacioModel[]>(queryKey, nextData);
        }
      });
    };

    socket.on('connect', handleConnect);
    socket.on('espacio:actualizado', handleEspacioActualizado);

    if (socket.connected) {
      joinRoom();
      hasConnectedOnceRef.current = true;
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('espacio:actualizado', handleEspacioActualizado);
      if (socket.connected) {
        socket.emit('room:leave-parking', { estacionamientoId });
      }
      releaseRealtimeSocket();
    };
  }, [estacionamientoId, queryClient]);
};

