import { useQuery } from '@tanstack/react-query';
import { espacioRepositoryInstance } from '../infrastructure/HttpEspacioRepository';

export const ESPACIOS_QUERY_KEYS = {
  all: ['espacios'] as const,
  mine: (nivelId?: string) =>
    nivelId ? (['espacios', 'me', { nivelId }] as const) : (['espacios', 'me'] as const),
};

export const useMisEspaciosQuery = (nivelId?: string) => {
  return useQuery({
    queryKey: ESPACIOS_QUERY_KEYS.mine(nivelId),
    queryFn: () => espacioRepositoryInstance.getMisEspacios(nivelId),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
