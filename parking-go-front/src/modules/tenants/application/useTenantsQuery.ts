// src/modules/tenants/application/useTenantsQuery.ts
import { useQuery } from '@tanstack/react-query';
import { httpTenantRepository } from '../infrastructure/HttpTenantRepository';
import type { Tenant } from '../domain/Tenant';
import type { HorarioItemPayload } from '../../estacionamientos/domain/Estacionamiento';

export const TENANTS_QUERY_KEYS = {
    all: ['tenants'] as const,
    detail: (id: string) => ['tenants', id] as const,
    horarios: (id: string) => ['tenants', id, 'horarios'] as const,
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

export const useTenantHorariosQuery = (tenantId: string) => {
    return useQuery<HorarioItemPayload[]>({
        queryKey: TENANTS_QUERY_KEYS.horarios(tenantId),
        queryFn: () => httpTenantRepository.getTenantHorarios(tenantId),
        enabled: Boolean(tenantId),
        staleTime: 1000 * 60 * 3,
    });
};
