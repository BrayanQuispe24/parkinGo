import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUsuarioDto } from "../dto/update-usuario.dto.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class UpdateUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(id: string, dto: UpdateUsuarioDto) {
        // 1. Buscamos al usuario original
        const currentUser = await this.usuarioRepository.findById(id);

        // 2. Si intenta actualizar el correo, verificamos que no exista en OTRO usuario
        if (dto.email && dto.email !== currentUser.email) {
            const emailExists = await this.usuarioRepository.findByEmail(dto.email);
            if (emailExists) {
                throw new ConflictException(`El correo electrónico '${dto.email}' ya está en uso.`);
            }
        }

        // 3. Lo mismo para el CI
        if (dto.ci && dto.ci !== currentUser.ci) {
            const ciExists = await this.usuarioRepository.findByCi(dto.ci);
            if (ciExists) {
                throw new ConflictException(`El número de identificación '${dto.ci}' ya está en uso.`);
            }
        }

        return this.usuarioRepository.update(id, dto as any);
    }
}
