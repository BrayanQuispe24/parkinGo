import { Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class GetUsuariosAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(requesterUserId?: string, requesterRoleName?: string) {
        if (requesterRoleName === 'PARKING_ADMIN' || requesterRoleName === 'HOST') {
            return this.usuarioRepository.findAll({
                createdById: requesterUserId,
                roleName: 'PARKING_OPERATOR',
            });
        }
        return this.usuarioRepository.findAll();
    }
}
