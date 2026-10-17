// src/modules/tenants/infrastructure/HttpTenantRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { TenantRepository } from '../domain/TenantRepository';
import type { Tenant, CreateTenantPayload, UpdateTenantPayload, TenantStatus } from '../domain/Tenant';

interface ApiResponse<T> {
    message: string;
    data: T;
}

export class HttpTenantRepository implements TenantRepository {
    async getTenants(): Promise<Tenant[]> {
        const response = await parkingoApi.get<ApiResponse<Tenant[]>>('/tenants');
        return response.data.data;
    }

    async getTenantById(id: string): Promise<Tenant> {
        const response = await parkingoApi.get<ApiResponse<Tenant>>(`/tenants/${id}`);
        return response.data.data;
    }

    async createTenant(payload: CreateTenantPayload): Promise<Tenant> {
        const response = await parkingoApi.post<ApiResponse<Tenant>>('/tenants', payload);
        return response.data.data;
    }

    async updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant> {
        const response = await parkingoApi.patch<ApiResponse<Tenant>>(`/tenants/${id}`, payload);
        return response.data.data;
    }

    async darDeBajaTenant(id: string, estado?: TenantStatus): Promise<Tenant> {
        const url = estado ? `/tenants/${id}/baja?estado=${estado}` : `/tenants/${id}/baja`;
        const response = await parkingoApi.patch<ApiResponse<Tenant>>(url);
        return response.data.data;
    }

    async deleteTenant(id: string): Promise<{ id: string; message: string }> {
        const response = await parkingoApi.delete<ApiResponse<{ id: string }>>(`/tenants/${id}`);
        return {
            id: response.data.data.id,
            message: response.data.message,
        };
    }
}

export const httpTenantRepository = new HttpTenantRepository();
