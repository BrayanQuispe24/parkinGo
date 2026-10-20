// src/modules/tenants/application/useTenantsMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpTenantRepository } from '../infrastructure/HttpTenantRepository';
import { TENANTS_QUERY_KEYS } from './useTenantsQuery';
import type { CreateTenantPayload, UpdateTenantPayload, TenantStatus } from '../domain/Tenant';

export const useCreateTenantMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTenantPayload) => httpTenantRepository.createTenant(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.all });
        },
    });
};

export const useUpdateTenantMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateTenantPayload }) =>
            httpTenantRepository.updateTenant(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.detail(variables.id) });
        },
    });
};

export const useDarDeBajaTenantMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, estado }: { id: string; estado?: TenantStatus }) =>
            httpTenantRepository.darDeBajaTenant(id, estado),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.all });
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.detail(variables.id) });
        },
    });
};

export const useDeleteTenantMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => httpTenantRepository.deleteTenant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.all });
        },
    });
};

export const useActualizarTenantHorariosMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tenantId, horarios }: { tenantId: string; horarios: import('../../estacionamientos/domain/Estacionamiento').HorarioItemPayload[] }) =>
            httpTenantRepository.actualizarTenantHorarios(tenantId, horarios),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEYS.horarios(variables.tenantId) });
            queryClient.invalidateQueries({ queryKey: ['estacionamientos', 'me'] });
        },
    });
};
