import { UpdateRoleDto } from "../dto/update-role.js";
import { RoleEntity } from "../entities/role.entity.js";

/**
 * Contrato (Interfaz/Clase Abstracta) del Repositorio de Roles.
 * Define qué operaciones de base de datos puede solicitar la capa de negocio (Actions),
 * sin importar qué tecnología de base de datos se esté usando por debajo.
 */
export abstract class RoleRepository {
    abstract create(name: string, permissionIds?: string[]): Promise<RoleEntity>;
    abstract findAll(): Promise<RoleEntity[]>;
    abstract findById(id: string): Promise<RoleEntity>;
    abstract findByName(name: string): Promise<RoleEntity | null>;
    abstract update(id: string, name?: string, permissionIds?: string[]): Promise<RoleEntity>;
    abstract delete(id: string): Promise<RoleEntity>;
}