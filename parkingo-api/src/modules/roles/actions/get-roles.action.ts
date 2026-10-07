import { Injectable } from "@nestjs/common";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";

/**
 * Caso de Uso (Action): Obtener todos los Roles.
 * Encapsula la lógica para recuperar los roles existentes.
 */
@Injectable()
export class GetRolesAction {
    constructor(private readonly roleRepository: RoleRepository) { }

    /**
     * Ejecuta el caso de uso.
     * @returns Un arreglo de entidades de dominio de roles.
     */
    async execute(): Promise<RoleEntity[]> {
        return this.roleRepository.findAll();
    }
}