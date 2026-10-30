import { useQuery } from '@tanstack/react-query';
import { croquisRepositoryInstance } from '../infrastructure/HttpCroquisRepository';

export const CROQUIS_QUERY_KEYS = {
  all: ['croquis'] as const,
  byNivel: (nivelId: string) => ['croquis', 'nivel', nivelId] as const,
  byEstacionamientoNivel: (estacionamientoId: string, nivelId: string) =>
    ['croquis', 'estacionamiento', estacionamientoId, 'nivel', nivelId] as const,
};

export const useCroquisByNivelQuery = (nivelId?: string) => {
  return useQuery({
    queryKey: CROQUIS_QUERY_KEYS.byNivel(nivelId || ''),
    queryFn: () => {
      if (!nivelId) return null;
      return croquisRepositoryInstance.getCroquisByNivel(nivelId);
    },
    enabled: !!nivelId,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

export const useCroquisEstacionamientoQuery = (
  estacionamientoId: string,
  nivelId?: string,
) => {
  return useQuery({
    queryKey: CROQUIS_QUERY_KEYS.byEstacionamientoNivel(
      estacionamientoId,
      nivelId || '',
    ),
    queryFn: () => {
      if (!nivelId || !estacionamientoId) return null;
      return croquisRepositoryInstance.getCroquisByEstacionamientoYNivel(
        estacionamientoId,
        nivelId,
      );
    },
    enabled: !!estacionamientoId && !!nivelId,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};
