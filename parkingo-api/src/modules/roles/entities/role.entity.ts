import { PermissionEntity } from "./permission.entity.js";

/**
 * Entidad de Dominio: Role.
 * Representa el concepto de un "Rol" puro dentro de la lógica de negocio.
 * Es independiente de la base de datos (Prisma) y de la interfaz externa (HTTP).
 */
export class RoleEntity {
    id: string;
    name: string;
    permissions?: PermissionEntity[];
}