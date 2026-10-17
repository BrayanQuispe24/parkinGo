// src/modules/tenants/domain/TenantRepository.ts
import type { Tenant, CreateTenantPayload, UpdateTenantPayload, TenantStatus } from './Tenant';

export interface TenantRepository {
    getTenants(): Promise<Tenant[]>;
    getTenantById(id: string): Promise<Tenant>;
    createTenant(payload: CreateTenantPayload): Promise<Tenant>;
    updateTenant(id: string, payload: UpdateTenantPayload): Promise<Tenant>;
    darDeBajaTenant(id: string, estado?: TenantStatus): Promise<Tenant>;
    deleteTenant(id: string): Promise<{ id: string; message: string }>;
}
