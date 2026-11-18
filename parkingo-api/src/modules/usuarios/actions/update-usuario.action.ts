import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from "../dto/update-usuario.dto.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";

@Injectable()
export class UpdateUsuarioAction {
    constructor(private readonly usuarioRepository: UsuarioRepository) { }

    async execute(id: string, dto: UpdateUsuarioDto, requestingUserId?: string, requestingRoleName?: string) {
        // 1. Buscamos al usuario original
        const currentUser = await this.usuarioRepository.findById(id);
        const normalizedRole = (requestingRoleName ?? '').trim().toUpperCase();
        const isSuperAdmin = normalizedRole === 'SUPER_ADMIN';
        const isGeneralAdmin = normalizedRole === 'GENERAL_ADMIN';
        const isParkingAdmin = normalizedRole === 'PARKING_ADMIN';

        // 2. Validación de propiedad del recurso (prevención de IDOR / BOLA)
        if (!isSuperAdmin && !isGeneralAdmin) {
            if (isParkingAdmin) {
                if (id !== requestingUserId && currentUser.createdById !== requestingUserId) {
                    throw new ForbiddenException("No tienes permiso para modificar este operador.");
                }
            } else {
                // HOST, DRIVER, PARKING_OPERATOR, OPERATOR solo pueden editar su propio perfil
                if (id !== requestingUserId) {
                    throw new ForbiddenException("No tienes permiso para modificar el perfil de otros usuarios.");
                }
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

        // 5. Prevención de escalación de privilegios (roleId y status)
        const dataToUpdate: Partial<UpdateUsuarioDto> = { ...dto };

        // Solo SUPER_ADMIN puede cambiar el roleId de un usuario
        if (!isSuperAdmin) {
            delete dataToUpdate.roleId;
        }

        // Solo SUPER_ADMIN, GENERAL_ADMIN o PARKING_ADMIN (sobre sus propios operadores) pueden cambiar status
        const canChangeStatus =
            isSuperAdmin ||
            isGeneralAdmin ||
            (isParkingAdmin && id !== requestingUserId && currentUser.createdById === requestingUserId);

        if (!canChangeStatus) {
            delete dataToUpdate.status;
        }

        // 6. Si viene contraseña, hashearla
        if (dto.password) {
            dataToUpdate.password = await bcrypt.hash(dto.password, 10);
        }

        return this.usuarioRepository.update(id, dataToUpdate);
    }
}

