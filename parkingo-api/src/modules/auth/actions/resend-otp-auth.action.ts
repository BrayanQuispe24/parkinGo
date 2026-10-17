// src/modules/auth/actions/resend-otp-auth.action.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MailerService } from '../../mailer/mailer.service.js';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js';
import { ResendOtpDto } from '../dto/resend-otp.dto.js';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token.repository.js';
import { OtpUtil } from '../utils/otp.util.js';

@Injectable()
export class ResendOtpAuthAction {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly tokenRepository: EmailVerificationTokenRepository,
        private readonly mailerService: MailerService,
    ) {}

    async execute(dto: ResendOtpDto) {
        const { email } = dto;

        // 1. Localizar al usuario
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException('No se encontró ninguna cuenta asociada a este correo electrónico.');
        }

        if (user.isVerified) {
            throw new BadRequestException('Esta cuenta ya ha sido verificada previamente.');
        }

        // 2. Control de tiempo mínimo entre reenvíos (cooldown de 60 segundos)
        const latestToken = await this.tokenRepository.findLatestByUserId(user.id);
        if (latestToken) {
            const timeDiffMs = Date.now() - new Date(latestToken.createdAt).getTime();
            const minCooldownMs = 60 * 1000; // 60 segundos

            if (timeDiffMs < minCooldownMs) {
                const waitSeconds = Math.ceil((minCooldownMs - timeDiffMs) / 1000);
                throw new BadRequestException(
                    `Debes esperar ${waitSeconds} segundo(s) antes de solicitar otro código de verificación.`,
                );
            }
        }

        // 3. Eliminar tokens previos
        await this.tokenRepository.deleteByUserId(user.id);

        // 4. Generar nuevo código OTP
        const otpCode = OtpUtil.generateOtp();
        const codeHash = OtpUtil.hashOtp(otpCode);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await this.tokenRepository.create(user.id, codeHash, expiresAt);

        // 5. Enviar correo transaccional
        await this.mailerService.sendOtpVerificationEmail(user.email, user.firstName, otpCode);

        return {
            success: true,
            message: 'Un nuevo código de verificación de 6 dígitos ha sido enviado a tu correo.',
        };
    }
}
