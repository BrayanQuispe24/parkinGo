import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from "../dto/update-usuario.dto.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class UpdateUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(id: string, dto: UpdateUsuarioDto, requestingUserId?: string, requestingRoleName?: string) {
        // 1. Buscamos al usuario original
        const currentUser = await this.usuarioRepository.findById(id);

        // 2. Si el solicitante es PARKING_ADMIN o HOST y no está editando su propio perfil,
        // validar que sea el creador del operador
        if ((requestingRoleName === 'PARKING_ADMIN' || requestingRoleName === 'HOST') && id !== requestingUserId) {
            if (currentUser.createdById !== requestingUserId) {
                throw new ForbiddenException("No tienes permiso para modificar este operador.");
            }
        }

        // 3. Si intenta actualizar el correo, verificamos que no exista en OTRO usuario
        if (dto.email && dto.email !== currentUser.email) {
            const emailExists = await this.usuarioRepository.findByEmail(dto.email);
            if (emailExists) {
                throw new ConflictException(`El correo electrónico '${dto.email}' ya está en uso.`);
            }
        }

        // 4. Lo mismo para el CI
        if (dto.ci && dto.ci !== currentUser.ci) {
            const ciExists = await this.usuarioRepository.findByCi(dto.ci);
            if (ciExists) {
                throw new ConflictException(`El número de identificación '${dto.ci}' ya está en uso.`);
            }
        }

        // 5. Si viene contraseña, hashearla
        let dataToUpdate: any = { ...dto };
        if (dto.password) {
            dataToUpdate.password = await bcrypt.hash(dto.password, 10);
        }

        return this.usuarioRepository.update(id, dataToUpdate);
    }
}
