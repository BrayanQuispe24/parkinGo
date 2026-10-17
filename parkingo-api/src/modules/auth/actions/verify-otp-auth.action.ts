// src/modules/auth/actions/verify-otp-auth.action.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token.repository.js';
import { OtpUtil } from '../utils/otp.util.js';

@Injectable()
export class VerifyOtpAuthAction {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly tokenRepository: EmailVerificationTokenRepository,
        private readonly jwtService: JwtService,
    ) {}

    async execute(dto: VerifyOtpDto) {
        const { email, code } = dto;

        // 1. Localizar al usuario
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('No se encontró ninguna cuenta asociada a este correo electrónico.');
        }

        // Si ya está verificado, generamos token y retornamos éxito
        if (user.isVerified) {
            const token = await this.jwtService.signAsync({
                sub: user.id,
                email: user.email,
                roleId: user.roleId,
            });

            return {
                success: true,
                message: 'La cuenta ya ha sido verificada previamente.',
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role?.name ?? '',
                        roleId: user.roleId,
                        isVerified: true,
                    },
                },
            };
        }

        // 2. Localizar el token activo más reciente
        const tokenRecord = await this.tokenRepository.findLatestByUserId(user.id);
        if (!tokenRecord) {
            throw new BadRequestException('No hay ningún código de verificación activo. Por favor solicita uno nuevo.');
        }

        // 3. Validar expiración
        if (new Date() > new Date(tokenRecord.expiresAt)) {
            throw new BadRequestException('El código de verificación ha expirado. Por favor solicita uno nuevo.');
        }

        // 4. Validar límite de intentos fallidos
        if (tokenRecord.attempts >= 5) {
            throw new BadRequestException(
                'Has superado el número máximo de intentos permitidos (5). Solicita un nuevo código de verificación.',
            );
        }

        // 5. Comparar código ingresado
        const isValid = OtpUtil.verifyOtp(code, tokenRecord.codeHash);
        if (!isValid) {
            await this.tokenRepository.incrementAttempts(tokenRecord.id);
            const remaining = 5 - (tokenRecord.attempts + 1);
            throw new BadRequestException(
                `Código incorrecto. Te ${remaining === 1 ? 'queda 1 intento' : `quedan ${remaining} intentos`}.`,
            );
        }

        // 6. Marcar usuario como verificado y limpiar tokens
        await this.usuarioRepository.update(user.id, { isVerified: true });
        await this.tokenRepository.deleteByUserId(user.id);

        // 7. Generar token de sesión JWT
        const token = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
            roleId: user.roleId,
        });

        return {
            success: true,
            message: '¡Correo electrónico verificado exitosamente!',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role?.name ?? '',
                    roleId: user.roleId,
                    isVerified: true,
                },
            },
        };
    }
}
