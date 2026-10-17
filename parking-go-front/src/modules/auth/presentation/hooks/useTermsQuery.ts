// src/modules/auth/presentation/hooks/useTermsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { termsRepository } from '../../infrastructure/HttpTermsRepository';
import type { TermItem } from '../../domain/TermItem';

export const useTermsQuery = () => {
    return useQuery<TermItem[]>({
        queryKey: ['system-settings', 'terms'],
        queryFn: () => termsRepository.getTerms(),
        staleTime: 1000 * 60 * 30, // 30 minutos de frescura en caché
        gcTime: 1000 * 60 * 60, // 1 hora antes de recolectar basura
    });
};
