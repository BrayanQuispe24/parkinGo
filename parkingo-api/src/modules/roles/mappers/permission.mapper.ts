import { PermissionEntity } from "../entities/permission.entity.js";

export class PermissionMapper {

    //estamos convirtiendo datos crudos de la base de datos a una entidad de dominio
    static toDomain(raw: any): PermissionEntity | null {
        if (!raw) return null;
        const permission = new PermissionEntity();
        permission.id = raw.id;
        permission.name = raw.name;
        return permission;
    }

    //estamos convirtiendo la entidad de dominio a un formato plano para el frontend
    static toEntity(permission: PermissionEntity): any {
        return {
            id: permission.id,
            name: permission.name,
        }
    }
}