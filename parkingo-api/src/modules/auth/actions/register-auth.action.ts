// src/modules/auth/actions/register-auth.action.ts
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js'; // Ajusta la ruta y extensión si es necesario
// Asumo que tienes un RoleRepository abstracto en tu módulo de roles
import { RoleRepository } from '../../roles/repositories/role.repository.js';
import { RegisterAuthDto } from '../dto/register-auth.dto.js';

@Injectable()
export class RegisterAuthAction {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly roleRepository: RoleRepository,
    ) { }

    async execute(dto: RegisterAuthDto) {
        const { email, password, firstName, lastName, ci, roleName } = dto;

        // 1. Validar que el usuario no exista por Email o CI
        const emailExists = await this.usuarioRepository.findByEmail(email);
        if (emailExists) throw new BadRequestException('El correo ya está registrado');

        const ciExists = await this.usuarioRepository.findByCi(ci);
        if (ciExists) throw new BadRequestException('El CI ya está registrado');

        // 2. Buscar el Rol (El DTO ya aseguró que roleName sea válido)
        const role = await this.roleRepository.findByName(roleName);
        if (!role) throw new BadRequestException(`El rol ${roleName} no se encuentra en el sistema.`);

        // 3. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Crear la entidad/registro
        try {
            const newUser = await this.usuarioRepository.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                ci,
                roleId: role.id,
                // Agrega otros campos requeridos por tu UsuarioEntity
            });

            // Retornar datos seguros (sin la contraseña)
            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                }
            };
        } catch (error) {
            throw new InternalServerErrorException('Ocurrió un error al registrar el usuario');
        }
    }
}
