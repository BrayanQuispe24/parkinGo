// src/modules/auth/actions/register-auth.action.ts
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RoleRepository } from '../../roles/repositories/role.repository.js';
import { UsuarioRepository } from '../../usuarios/repositories/usuario.repository.js';
import { MailerService } from '../../mailer/mailer.service.js';
import { RegisterAuthDto } from '../dto/register-auth.dto.js';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token.repository.js';
import { UploadedDocumentFile } from '../strategies/verification/user-verification-strategy.interface.js';
import { UserVerificationContext } from '../strategies/verification/user-verification.context.js';
import { EmailValidatorUtil } from '../utils/email-validator.util.js';
import { OtpUtil } from '../utils/otp.util.js';

@Injectable()
export class RegisterAuthAction {
    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly roleRepository: RoleRepository,
        private readonly tokenRepository: EmailVerificationTokenRepository,
        private readonly mailerService: MailerService,
        private readonly verificationContext: UserVerificationContext,
    ) { }

    async execute(dto: RegisterAuthDto, file?: UploadedDocumentFile) {
        const { email, password, firstName, lastName, ci, roleName, gender, birthDate, phone } = dto;

        // 1. Configurar la estrategia en el Contexto según el rol y validar requerimientos (Strategy Pattern)
        this.verificationContext.setStrategyByRole(roleName);
        this.verificationContext.validateRequirements(dto, file);

        // 2. Validar que el correo no sea de un proveedor desechable / temporal
        if (EmailValidatorUtil.isDisposable(email)) {
            throw new BadRequestException('No se permiten correos electrónicos temporales o desechables.');
        }

        // 3. Validar que el dominio tenga servidores de correo MX reales y activos
        const hasMx = await EmailValidatorUtil.hasValidMxRecords(email);
        if (!hasMx) {
            throw new BadRequestException(
                'El dominio del correo electrónico no cuenta con un servidor de correo activo o válido.',
            );
        }

        // 4. Purgar periódicamente usuarios no verificados cuya ventana de 15 minutos expiró
        try {
            await this.tokenRepository.purgeExpiredUnverifiedUsers();
        } catch {
            // Ignorar errores no bloqueantes de purga
        }

        // 5. Validar si el usuario ya existe por Email o CI (auto-eliminar si la cuenta anterior no fue verificada)
        const emailExists = await this.usuarioRepository.findByEmail(email);
        if (emailExists) {
            if (!emailExists.isVerified) {
                await this.usuarioRepository.delete(emailExists.id);
            } else {
                throw new BadRequestException('El correo ya está registrado');
            }
        }

        const ciExists = await this.usuarioRepository.findByCi(ci);
        if (ciExists) {
            if (!ciExists.isVerified) {
                await this.usuarioRepository.delete(ciExists.id);
            } else {
                throw new BadRequestException('El CI ya está registrado');
            }
        }

        // 6. Buscar el Rol (El DTO ya aseguró que roleName sea válido)
        const role = await this.roleRepository.findByName(roleName);
        if (!role) throw new BadRequestException(`El rol ${roleName} no se encuentra en el sistema.`);

        if (role.name === 'SUPER_ADMIN' || role.name === 'GENERAL_ADMIN') {
            throw new BadRequestException('No está permitido registrar cuentas administrativas públicamente.');
        }

        // 7. Determinar estado inicial a través del Contexto de Estrategia (ACTIVE vs PENDING_APPROVAL)
        const initialStatus = this.verificationContext.determineInitialStatus();

        // 8. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 9. Crear la entidad/registro
        try {
            const newUser = await this.usuarioRepository.create({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                ci,
                roleId: role.id,
                gender,
                birthDate: birthDate ? new Date(birthDate) : undefined,
                phone,
                status: initialStatus,
                isVerified: false,
                termsAccepted: true,
                termsAcceptedAt: new Date(),
            });

            // 10. Procesar la verificación documental delegada al Contexto de Estrategia
            const verificationResult = await this.verificationContext.processVerification(newUser.id, file);

            // 11. Generar OTP de 6 dígitos criptográficamente seguro y almacenar hash
            const otpCode = OtpUtil.generateOtp();
            const codeHash = OtpUtil.hashOtp(otpCode);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

            await this.tokenRepository.create(newUser.id, codeHash, expiresAt);

            // 12. Despachar correo electrónico transaccional con el OTP
            await this.mailerService.sendOtpVerificationEmail(newUser.email, newUser.firstName, otpCode);

            // 13. Retornar datos seguros
            return {
                success: true,
                requiresVerification: true,
                requiresDocumentReview: verificationResult.requiresDocumentReview,
                message: verificationResult.requiresDocumentReview
                    ? 'Registro exitoso. Se ha enviado un código de 6 dígitos a tu correo. Tu documentación PDF será evaluada por el Administrador.'
                    : 'Usuario registrado exitosamente. Se ha enviado un código de verificación de 6 dígitos a tu correo.',
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    role: role.name,
                    roleId: role.id,
                    status: initialStatus,
                    isVerified: false,
                    documentId: verificationResult.documentId,
                },
            };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Ocurrió un error al registrar el usuario');
        }
    }
}
