import { ForbiddenException, Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class DeleteUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(id: string, requestingUserId?: string, requestingRoleName?: string) {
        const currentUser = await this.usuarioRepository.findById(id);

        if (requestingRoleName === 'HOST') {
            throw new ForbiddenException("El rol Anfitrión no tiene permiso para eliminar operadores.");
        }

        if (requestingRoleName === 'PARKING_ADMIN') {
            if (currentUser.createdById !== requestingUserId) {
                throw new ForbiddenException("No tienes permiso para eliminar este operador.");
            }
        }

        return this.usuarioRepository.delete(id);
    }
}
