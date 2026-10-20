import { useQuery } from '@tanstack/react-query';
import { nivelRepositoryInstance } from '../infrastructure/HttpNivelRepository';

export const NIVELES_QUERY_KEYS = {
  all: ['niveles'] as const,
  mine: ['niveles', 'me'] as const,
};

export const useMisNivelesQuery = () => {
  return useQuery({
    queryKey: NIVELES_QUERY_KEYS.mine,
    queryFn: () => nivelRepositoryInstance.getMisNiveles(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
