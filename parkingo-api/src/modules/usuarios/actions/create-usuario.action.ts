import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUsuarioDto } from "../dto/create-usuario.dto.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class CreateUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(dto: CreateUsuarioDto) {
        // 1. Validar que el correo no exista
        const emailExists = await this.usuarioRepository.findByEmail(dto.email);
        if (emailExists) {
            throw new ConflictException(`El correo electrónico '${dto.email}' ya está registrado.`);
        }

        // 2. Validar que el CI no exista
        const ciExists = await this.usuarioRepository.findByCi(dto.ci);
        if (ciExists) {
            throw new ConflictException(`El número de identificación '${dto.ci}' ya está registrado.`);
        }

        // En la Fase 2 hashearemos la contraseña aquí
        return this.usuarioRepository.create(dto as any);
    }
}
