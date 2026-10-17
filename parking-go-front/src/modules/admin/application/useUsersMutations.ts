// src/modules/admin/application/useUsersMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRepository } from '../infrastructure/HttpAdminRepository';
import type { AdminUser, CreateAdminUserPayload } from '../domain/AdminUser';
import { ADMIN_USERS_QUERY_KEY } from './useUsersQuery';

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<AdminUser, Error, CreateAdminUserPayload>({
        mutationFn: (payload: CreateAdminUserPayload) => adminRepository.createUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
        },
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<AdminUser, Error, { id: string; payload: Partial<CreateAdminUserPayload> }>({
        mutationFn: ({ id, payload }) => adminRepository.updateUser(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
        },
    });
};

export const useToggleUserStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        AdminUser,
        Error,
        { id: string; newStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING_APPROVAL' }
    >({
        mutationFn: ({ id, newStatus }) => adminRepository.updateUserStatus(id, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
        },
    });
};
