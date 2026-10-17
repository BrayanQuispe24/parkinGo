// src/modules/tenants/application/useTenantsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { httpTenantRepository } from '../infrastructure/HttpTenantRepository';
import type { Tenant } from '../domain/Tenant';

export const TENANTS_QUERY_KEYS = {
    all: ['tenants'] as const,
    detail: (id: string) => ['tenants', id] as const,
};

export const useTenantsQuery = () => {
    return useQuery<Tenant[]>({
        queryKey: TENANTS_QUERY_KEYS.all,
        queryFn: () => httpTenantRepository.getTenants(),
        staleTime: 1000 * 60 * 3, // 3 minutos
    });
};

export const useTenantDetailQuery = (id: string, enabled = true) => {
    return useQuery<Tenant>({
        queryKey: TENANTS_QUERY_KEYS.detail(id),
        queryFn: () => httpTenantRepository.getTenantById(id),
        enabled: Boolean(id) && enabled,
    });
};
