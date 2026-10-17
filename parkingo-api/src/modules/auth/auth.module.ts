// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { RolesModule } from '../roles/roles.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { LoginAuthAction } from './actions/login-auth.action.js';
import { RegisterAuthAction } from './actions/register-auth.action.js';
import { ResendOtpAuthAction } from './actions/resend-otp-auth.action.js';
import { VerifyOtpAuthAction } from './actions/verify-otp-auth.action.js';
import { AuthController } from './controllers/auth.controller.js';
import { EmailVerificationTokenRepository } from './repositories/email-verification-token.repository.js';
import { PrismaEmailVerificationTokenRepository } from './repositories/prisma-email-verification-token.repository.js';
import { PrismaVerificationDocumentRepository } from './repositories/prisma-verification-document.repository.js';
import { VerificationDocumentRepository } from './repositories/verification-document.repository.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { DocumentedPartnerStrategy } from './strategies/verification/documented-partner.strategy.js';
import { StandardDriverStrategy } from './strategies/verification/standard-driver.strategy.js';
import { UserVerificationContext } from './strategies/verification/user-verification.context.js';
import { UserVerificationStrategyResolver } from './strategies/verification/user-verification-strategy.resolver.js';

@Module({
    imports: [
        UsuariosModule,
        RolesModule,
        PrismaModule,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        RegisterAuthAction,
        LoginAuthAction,
        VerifyOtpAuthAction,
        ResendOtpAuthAction,
        StandardDriverStrategy,
        DocumentedPartnerStrategy,
        UserVerificationStrategyResolver,
        UserVerificationContext,
        {
            provide: EmailVerificationTokenRepository,
            useClass: PrismaEmailVerificationTokenRepository,
        },
        {
            provide: VerificationDocumentRepository,
            useClass: PrismaVerificationDocumentRepository,
        },
        JwtStrategy,
    ],
    exports: [EmailVerificationTokenRepository, VerificationDocumentRepository],
})
export class AuthModule {}
