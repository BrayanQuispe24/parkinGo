import { useQuery } from '@tanstack/react-query';
import { tarifaRepositoryInstance } from '../infrastructure/HttpTarifaRepository';

export const TARIFAS_QUERY_KEYS = {
  all: ['tarifas'] as const,
  mine: ['tarifas', 'me'] as const,
  byEstacionamiento: (estacionamientoId: string) =>
    ['tarifas', 'estacionamiento', estacionamientoId] as const,
};

export const useMisTarifasQuery = () => {
  return useQuery({
    queryKey: TARIFAS_QUERY_KEYS.mine,
    queryFn: () => tarifaRepositoryInstance.getMisTarifas(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};

export const useTarifasByEstacionamientoQuery = (estacionamientoId: string) => {
  return useQuery({
    queryKey: TARIFAS_QUERY_KEYS.byEstacionamiento(estacionamientoId),
    queryFn: () =>
      tarifaRepositoryInstance.getTarifasByEstacionamiento(estacionamientoId),
    enabled: !!estacionamientoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
