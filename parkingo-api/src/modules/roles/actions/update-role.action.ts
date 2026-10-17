import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
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
        //vamos a buscar el rol con el id para verificar si que no sea el rol del superadmin
        const currentRole = await this.roleRepository.findById(id);
        //si el rol es igual al del superadmin lo rechazamos 
        if (currentRole.name === "SUPER_ADMIN") {
            throw new ForbiddenException("No esta permitido modificar el rol base del sistema(SUPER_ADMIN).");
        }
        //ahora vamos a ver si el nombre que envia el cliente existe en la base de datos 
        if (name && name.toUpperCase() !== currentRole.name) {
            const roleExists = await this.roleRepository.findByName(name);
            if (roleExists) throw new ConflictException(`El rol con el nombre "${name}" ya existe.`);
        }
        return this.roleRepository.update(id, name, permissionIds);
    }
}