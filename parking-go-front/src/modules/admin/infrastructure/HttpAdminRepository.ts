// src/modules/admin/infrastructure/HttpAdminRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { AdminAnalytics } from '../domain/AdminAnalytics';
import type { AdminUser, CreateAdminUserPayload } from '../domain/AdminUser';
import type { PermissionItem, RoleWithPermissions } from '../domain/RolePermission';

export class HttpAdminRepository {
    async getGeneralAnalytics(): Promise<AdminAnalytics> {
        const response = await parkingoApi.get<{ data: AdminAnalytics }>('/reports/general');
        return response.data.data;
    }

    async getUsers(): Promise<AdminUser[]> {
        const response = await parkingoApi.get<{ data: { users: AdminUser[] } }>('/usuarios');
        return response.data.data.users.map((u) => {
            const fullname = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
            return {
                ...u,
                fullname: fullname || u.email,
                empresa: u.empresa,
                parqueosCount: u.parqueosCount,
            };
        });
    }

    async updateUserStatus(
        id: string,
        newStatus: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'PENDING_APPROVAL'
    ): Promise<AdminUser> {
        const response = await parkingoApi.patch<{ data: { user: AdminUser } }>(`/usuarios/${id}`, {
            status: newStatus,
        });
        return response.data.data.user;
    }

    async createUser(payload: CreateAdminUserPayload): Promise<AdminUser> {
        const response = await parkingoApi.post<{ data: { user: AdminUser } }>('/usuarios', payload);
        return response.data.data.user;
    }

    async updateUser(id: string, payload: Partial<CreateAdminUserPayload>): Promise<AdminUser> {
        const response = await parkingoApi.patch<{ data: { user: AdminUser } }>(`/usuarios/${id}`, payload);
        return response.data.data.user;
    }

    async getRoles(): Promise<RoleWithPermissions[]> {
        const response = await parkingoApi.get<{ data: { roles: RoleWithPermissions[] } }>('/roles');
        return response.data.data.roles;
    }

    async getPermissions(): Promise<PermissionItem[]> {
        const response = await parkingoApi.get<{ data: { permissions: PermissionItem[] } } | PermissionItem[]>('/permissions');
        if (Array.isArray(response.data)) {
            return response.data;
        }
        if (Array.isArray((response.data as any).permissions)) {
            return (response.data as any).permissions;
        }
        return (response.data as any).data?.permissions || (response.data as any).data || [];
    }

    async updateRolePermissions(roleId: string, name: string, permissionsIds: string[]): Promise<RoleWithPermissions> {
        const response = await parkingoApi.patch<{ data: { role: RoleWithPermissions } }>(`/roles/${roleId}`, {
            name,
            permissionsIds,
        });
        return response.data.data.role;
    }
}

export const adminRepository = new HttpAdminRepository();
