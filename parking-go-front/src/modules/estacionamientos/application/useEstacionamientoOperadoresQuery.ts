import { useQuery } from '@tanstack/react-query';
import { estacionamientoOperadorRepositoryInstance } from '../infrastructure/HttpEstacionamientoOperadorRepository';

export const ESTACIONAMIENTO_OPERADORES_QUERY_KEYS = {
  all: ['estacionamiento-operadores'] as const,
  byEstacionamiento: (estacionamientoId: string) =>
    ['estacionamiento-operadores', estacionamientoId] as const,
  disponibles: (estacionamientoId: string) =>
    ['estacionamiento-operadores', 'disponibles', estacionamientoId] as const,
};

export const useOperadoresEstacionamientoQuery = (estacionamientoId: string) => {
  return useQuery({
    queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.byEstacionamiento(estacionamientoId),
    queryFn: () =>
      estacionamientoOperadorRepositoryInstance.getOperadores(estacionamientoId),
    enabled: !!estacionamientoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const useOperadoresDisponiblesQuery = (
  estacionamientoId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.disponibles(estacionamientoId),
    queryFn: () =>
      estacionamientoOperadorRepositoryInstance.getOperadoresDisponibles(estacionamientoId),
    enabled: !!estacionamientoId && (options?.enabled ?? true),
    staleTime: 1000 * 30, // 30 segundos
  });
};
