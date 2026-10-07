import { PermissionEntity } from "../entities/permission.entity.js";
import { RoleEntity } from "../entities/role.entity.js";

export class RoleMapper {
    /**
     * Convierte los datos crudos devueltos por el ORM (Prisma/Base de Datos)
     * a una Entidad de Dominio pura de nuestra aplicación.
     * Esto sirve para aislar la lógica de negocio (Actions) de la estructura exacta de la base de datos.
     * 
     * @param raw - Objeto crudo devuelto por PrismaClient.
     * @returns RoleEntity - La entidad de dominio lista para usarse en la aplicación.
     */
    static toDomain(raw: any): RoleEntity | null {
        if (!raw) return null;
        const role = new RoleEntity();
        role.id = raw.id;
        role.name = raw.name;

        if (raw.permissions) {
            role.permissions = raw.permissions.map((rp: any) => {
                const permission = new PermissionEntity();
                permission.id = rp.id;
                permission.name = rp.name;
                return permission;
            });
        }
        return role;
    }

    /**
     * Convierte la Entidad de Dominio a un formato plano (generalmente para DTOs de salida).
     * Esto sirve para decidir exactamente qué datos queremos enviarle al cliente
     * (Controller/Frontend), ocultando datos sensibles que solo deberían vivir en el Dominio.
     * 
     * @param role - La entidad de dominio que usamos internamente.
     * @returns Un objeto plano (DTO) listo para ser la respuesta HTTP.
     */
    static toEntity(role: RoleEntity): any {
        return {
            id: role.id,
            name: role.name,
            permissions: role.permissions?.map((p) => ({
                id: p.id,
                name: p.name,
            })) || [],
        };
    }
}