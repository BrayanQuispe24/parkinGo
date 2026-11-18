import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class GetUsuariosAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(requesterUserId?: string, requesterRoleName?: string) {
        if (requesterRoleName === 'HOST') {
            throw new ForbiddenException("El rol Anfitrión no tiene permiso para listar operadores u otros usuarios.");
        }

        if (requesterRoleName === 'PARKING_ADMIN') {
            return this.usuarioRepository.findAll({
                createdById: requesterUserId,
                roleName: 'PARKING_OPERATOR',
            });
        }
        return this.usuarioRepository.findAll();
    }
}
