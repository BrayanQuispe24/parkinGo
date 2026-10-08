import { Injectable } from "@nestjs/common";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class GetUsuariosAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute() {
        return this.usuarioRepository.findAll();
    }
}
