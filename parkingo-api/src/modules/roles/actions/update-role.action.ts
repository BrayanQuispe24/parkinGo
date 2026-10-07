import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";

/**
 * Caso de Uso (Action): Actualizar un Rol existente.
 * Encapsula la lógica para modificar un rol, interactuando con el Repositorio.
 */
@Injectable()
export class UpdateRoleAction {
    constructor(private readonly roleRepository: RoleRepository) { }

    /**
     * Ejecuta el caso de uso de actualización.
     * @param id El ID del rol a actualizar.
     * @param name El nuevo nombre del rol (opcional).
     * @param permissionIds Los IDs de los permisos a asignar (opcional).
     * @returns La entidad de dominio del rol actualizada.
     */
    async execute(id: string, name?: string, permissionIds?: string[]): Promise<RoleEntity> {
        return this.roleRepository.update(id, name, permissionIds);
    }
}