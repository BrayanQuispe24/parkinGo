// src/modules/calificaciones/application/useCalificacionesQuery.ts
import { useQuery } from '@tanstack/react-query';
import { httpCalificacionRepository } from '../infrastructure/HttpCalificacionRepository';
import type {
  CalificacionModel,
  EstacionamientoCalificacionesSummary,
} from '../domain/Calificacion';

export const CALIFICACIONES_QUERY_KEYS = {
  all: ['calificaciones'] as const,
  tenant: () => [...CALIFICACIONES_QUERY_KEYS.all, 'tenant'] as const,
  estacionamiento: (estacionamientoId: string) =>
    [...CALIFICACIONES_QUERY_KEYS.all, 'estacionamiento', estacionamientoId] as const,
  misResenas: () => [...CALIFICACIONES_QUERY_KEYS.all, 'mis-resenas'] as const,
};

/**
 * Hook para consultar las calificaciones de los estacionamientos del tenant autenticado.
 * Utilizado por Administradores de Parqueo y Anfitriones.
 */
export const useCalificacionesTenantQuery = () => {
  return useQuery<CalificacionModel[]>({
    queryKey: CALIFICACIONES_QUERY_KEYS.tenant(),
    queryFn: () => httpCalificacionRepository.getByTenant(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

/**
 * Hook para consultar el resumen estadístico y lista de opiniones de un estacionamiento específico.
 * Utilizado en la ficha técnica del parqueo.
 */
export const useCalificacionesEstacionamientoQuery = (estacionamientoId?: string) => {
  return useQuery<EstacionamientoCalificacionesSummary>({
    queryKey: CALIFICACIONES_QUERY_KEYS.estacionamiento(estacionamientoId || ''),
    queryFn: () => {
      if (!estacionamientoId) {
        return Promise.resolve({ promedio: 0, total: 0, items: [] });
      }
      return httpCalificacionRepository.getByEstacionamiento(estacionamientoId);
    },
    enabled: Boolean(estacionamientoId),
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Hook para consultar el historial de calificaciones emitidas por el conductor en sesión.
 */
export const useMisCalificacionesQuery = () => {
  return useQuery<CalificacionModel[]>({
    queryKey: CALIFICACIONES_QUERY_KEYS.misResenas(),
    queryFn: () => httpCalificacionRepository.getMisCalificaciones(),
    staleTime: 1000 * 60 * 2,
  });
};
