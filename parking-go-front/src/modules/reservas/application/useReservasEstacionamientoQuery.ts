// src/modules/reservas/application/useReservasEstacionamientoQuery.ts
import { useQuery } from '@tanstack/react-query';
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { BoletaReserva } from '../../driver/domain/DriverBooking';

export const RESERVAS_QUERY_KEYS = {
  estacionamiento: (id?: string) => ['reservas', 'estacionamiento', id ?? 'none'] as const,
  detalle: (id: string) => ['reservas', 'detail', id] as const,
};

export const useReservasEstacionamientoQuery = (estacionamientoId?: string) => {
  return useQuery({
    queryKey: RESERVAS_QUERY_KEYS.estacionamiento(estacionamientoId),
    queryFn: async (): Promise<BoletaReserva[]> => {
      if (!estacionamientoId) return [];
      const response = await parkingoApi.get<BoletaReserva[]>(`/reservas/estacionamiento/${estacionamientoId}`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(estacionamientoId),
    staleTime: 1000 * 15, // 15 segundos
  });
};

