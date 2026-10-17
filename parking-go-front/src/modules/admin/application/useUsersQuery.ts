// src/modules/admin/application/useUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { adminRepository } from '../infrastructure/HttpAdminRepository';
import type { AdminUser } from '../domain/AdminUser';
import type { RoleWithPermissions } from '../domain/RolePermission';

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const;
export const ADMIN_ROLES_QUERY_KEY = ['admin', 'roles'] as const;

export const useUsersQuery = () => {
    return useQuery<AdminUser[], Error>({
        queryKey: ADMIN_USERS_QUERY_KEY,
        queryFn: () => adminRepository.getUsers(),
        staleTime: 1000 * 60 * 2, // 2 minutos de caché limpia
    });
};

export const useRolesQuery = () => {
    return useQuery<RoleWithPermissions[], Error>({
        queryKey: ADMIN_ROLES_QUERY_KEY,
        queryFn: () => adminRepository.getRoles(),
        staleTime: 1000 * 60 * 10,
    });
};
