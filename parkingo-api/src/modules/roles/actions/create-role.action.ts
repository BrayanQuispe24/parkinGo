import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "../dto/create-role.dto.js";
import { RoleRepository } from "../repositories/role.repository.js";

/**
 * Caso de Uso (Action): Crear un nuevo Rol.
 * Encapsula la lógica de negocio para la creación de un rol.
 * Orquesta la llamada al repositorio, separando la lógica del controlador.
 */
@Injectable()
export class CreateRoleAction {
    constructor(private readonly rolRepository: RoleRepository) { }

    /**
     * Ejecuta el caso de uso.
     * @param dto - Datos validados provenientes del controlador.
     * @returns RoleEntity - La entidad de dominio recién creada.
     */
    async execute(dto: CreateRoleDto) {
        //agregar validaciones de negocio aquí si son necesarias
        return this.rolRepository.create(dto.name, dto.permissionIds);
    }
}