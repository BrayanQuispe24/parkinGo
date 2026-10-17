// src/modules/auth/strategies/verification/standard-driver.strategy.ts
import { Injectable } from '@nestjs/common';
import { UserStatus } from '../../../usuarios/entities/usuario.entity.js';
import { RegisterAuthDto } from '../../dto/register-auth.dto.js';
import {
    UploadedDocumentFile,
    UserVerificationStrategy,
    VerificationProcessResult,
} from './user-verification-strategy.interface.js';

@Injectable()
export class StandardDriverStrategy implements UserVerificationStrategy {
    readonly strategyKey = 'COMMON';

    validateRequirements(_dto: RegisterAuthDto, _file?: UploadedDocumentFile): void {
        // Los conductores no requieren documentación para registrarse
    }

    determineInitialStatus(): UserStatus {
        return UserStatus.ACTIVE;
    }

    async processVerification(
        _userId: string,
        _file?: UploadedDocumentFile,
    ): Promise<VerificationProcessResult> {
        return {
            requiresDocumentReview: false,
            message: 'Registro de conductor habilitado inmediatamente tras verificación de correo.',
        };
    }
}
