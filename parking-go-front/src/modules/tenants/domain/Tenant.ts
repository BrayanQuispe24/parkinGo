// src/modules/tenants/domain/Tenant.ts

export type TenantStatus = 'ACTIVO' | 'INACTIVO';

export interface TenantUserSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    ci: string;
}

export interface LocationCoordinates {
    lat: number;
    lng: number;
}

export interface Tenant {
    id: string;
    nombre: string;
    nit: string;
    razonSocial: string;
    estado: TenantStatus;
    direccion?: string | null;
    ciudad?: string | null;
    latitud?: number | null;
    longitud?: number | null;
    usuarioId: string;
    usuario?: TenantUserSummary;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTenantPayload {
    nombre: string;
    nit: string;
    razonSocial: string;
    direccion?: string;
    ciudad?: string;
    latitud?: number;
    longitud?: number;
}

export interface UpdateTenantPayload {
    nombre?: string;
    nit?: string;
    razonSocial?: string;
    estado?: TenantStatus;
    direccion?: string;
    ciudad?: string;
    latitud?: number;
    longitud?: number;
}

