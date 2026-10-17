import { Tenant, TenantStatus, Prisma } from '@prisma/client';

export type TenantWithUser = Prisma.TenantGetPayload<{
  include: {
    usuario: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
        phone: true;
        ci: true;
      };
    };
  };
}>;

export abstract class TenantRepository {
  abstract create(data: {
    nombre: string;
    nit: string;
    razonSocial: string;
    estado?: TenantStatus;
    direccion?: string;
    ciudad?: string;
    latitud?: number;
    longitud?: number;
    usuarioId: string;
  }): Promise<TenantWithUser>;

  abstract findAll(): Promise<TenantWithUser[]>;

  abstract findByUsuarioId(usuarioId: string): Promise<TenantWithUser[]>;

  abstract findById(id: string): Promise<TenantWithUser | null>;

  abstract findByNit(nit: string): Promise<Tenant | null>;

  abstract update(
    id: string,
    data: {
      nombre?: string;
      nit?: string;
      razonSocial?: string;
      estado?: TenantStatus;
      direccion?: string;
      ciudad?: string;
      latitud?: number;
      longitud?: number;
    }
  ): Promise<TenantWithUser>;

  abstract updateStatus(id: string, estado: TenantStatus): Promise<TenantWithUser>;

  abstract delete(id: string): Promise<Tenant>;
}
