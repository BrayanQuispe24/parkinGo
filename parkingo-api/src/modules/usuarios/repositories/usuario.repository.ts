import { UsuarioEntity } from "../entities/usuario.entity.js";

export abstract class UsuarioRepository {
    abstract create(data: Partial<UsuarioEntity>): Promise<UsuarioEntity>;
    abstract findAll(filter?: { createdById?: string; roleName?: string }): Promise<UsuarioEntity[]>;
    abstract findById(id: string): Promise<UsuarioEntity>;
    abstract findByEmail(email: string): Promise<UsuarioEntity | null>;
    abstract findByCi(ci: string): Promise<UsuarioEntity | null>;
    abstract update(id: string, data: Partial<UsuarioEntity>): Promise<UsuarioEntity>;
    abstract delete(id: string): Promise<UsuarioEntity>;
}
