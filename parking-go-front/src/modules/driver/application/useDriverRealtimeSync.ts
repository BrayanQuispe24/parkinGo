import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  releaseRealtimeSocket,
  retainRealtimeSocket,
} from '../../../core/realtime/socketClient';
import type { EspacioRealtimeEvent } from '../../../core/realtime/realtimeEvents';
import type { DriverParking } from '../domain/DriverParking';
import { applyEspacioEventToParkings } from './parkingCacheUpdater';
import { DRIVER_KEYS } from './useDriverQueries';

export const useDriverRealtimeSync = (activeParkingId: string | null): void => {
  const queryClient = useQueryClient();
  const hasConnectedOnceRef = useRef(false);

  useEffect(() => {
    const socket = retainRealtimeSocket();

    const joinRooms = () => {
      socket.emit('room:join-catalogo');
      if (activeParkingId) {
        socket.emit('room:join-parking', {
          estacionamientoId: activeParkingId,
        });
      }
    };

    const handleConnect = () => {
      joinRooms();
      if (hasConnectedOnceRef.current) {
        queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.parkings() });
      }
      hasConnectedOnceRef.current = true;
    };

    const handleEspacioActualizado = (event: EspacioRealtimeEvent) => {
      queryClient.setQueryData<DriverParking[]>(
        DRIVER_KEYS.parkings(),
        (prev) => applyEspacioEventToParkings(prev, event),
      );
    };

    socket.on('connect', handleConnect);
    socket.on('espacio:actualizado', handleEspacioActualizado);

    if (socket.connected) {
      joinRooms();
      hasConnectedOnceRef.current = true;
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('espacio:actualizado', handleEspacioActualizado);
      if (socket.connected) {
        socket.emit('room:leave-catalogo');
        if (activeParkingId) {
          socket.emit('room:leave-parking', {
            estacionamientoId: activeParkingId,
          });
        }
      }
      releaseRealtimeSocket();
    };
  }, [activeParkingId, queryClient]);
};

