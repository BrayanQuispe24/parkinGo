import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class GetUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(id: string, requesterUserId?: string, requesterRoleName?: string) {
        const targetUser = await this.usuarioRepository.findById(id);
        const normalizedRole = (requesterRoleName ?? '').trim().toUpperCase();

        // SUPER_ADMIN y GENERAL_ADMIN pueden consultar cualquier usuario
        if (normalizedRole === 'SUPER_ADMIN' || normalizedRole === 'GENERAL_ADMIN') {
            return targetUser;
        }

        // PARKING_ADMIN puede consultar su propio perfil o los operadores creados por él
        if (normalizedRole === 'PARKING_ADMIN') {
            if (id === requesterUserId || targetUser.createdById === requesterUserId) {
                return targetUser;
            }
            throw new ForbiddenException("No tienes permiso para consultar este usuario.");
        }

        // HOST, DRIVER, PARKING_OPERATOR / OPERATOR solo pueden consultar su propio perfil
        if (id !== requesterUserId) {
            throw new ForbiddenException("No tienes permiso para consultar el perfil de otros usuarios.");
        }

        return targetUser;
    }
}

