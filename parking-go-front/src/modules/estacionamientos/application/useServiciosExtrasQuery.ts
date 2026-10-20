import { useQuery } from '@tanstack/react-query';
import { servicioExtraRepositoryInstance } from '../infrastructure/HttpServicioExtraRepository';

export const SERVICIOS_EXTRAS_QUERY_KEYS = {
  all: ['servicios-extras'] as const,
  mine: ['servicios-extras', 'me'] as const,
  byEstacionamiento: (estacionamientoId: string) =>
    ['servicios-extras', 'estacionamiento', estacionamientoId] as const,
};

export const useMisServiciosExtrasQuery = () => {
  return useQuery({
    queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.mine,
    queryFn: () => servicioExtraRepositoryInstance.getMisServicios(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const useServiciosExtrasByEstacionamientoQuery = (estacionamientoId: string) => {
  return useQuery({
    queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.byEstacionamiento(estacionamientoId),
    queryFn: () =>
      servicioExtraRepositoryInstance.getServiciosByEstacionamiento(estacionamientoId),
    enabled: !!estacionamientoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
