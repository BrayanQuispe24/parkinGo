// src/modules/auth/actions/login-auth.action.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from '../dto/login-auth.dto.js';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js';

@Injectable()
export class LoginAuthAction {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(dto: LoginAuthDto) {
        const { email, password } = dto;

        // 1. Buscar al usuario por correo
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user || !user.password) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 2. Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        // (Opcional) Puedes validar si el usuario está bloqueado o eliminado aquí
        if (user.status !== 'ACTIVE') throw new UnauthorizedException('Usuario inactivo');

        // 3. Crear el "Payload" que irá dentro del JWT
        // Se aconseja no poner información sensible, solo el ID y Rol
        const payload = {
            sub: user.id, // En JWT 'sub' se usa para el id del sujeto
            email: user.email,
            roleId: user.roleId,
        };

        // 4. Firmar y generar el Token
        const token = await this.jwtService.signAsync(payload);

        return {
            success: true,
            message: 'Login exitoso',
            data: {
                token, // El frontend debe guardar este token
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role?.name ?? '',
                    roleId: user.roleId,
                    ci: user.ci,
                    gender: user.gender,
                    phone: user.phone,
                }
            }
        };
    }
}
