// src/modules/auth/strategies/verification/user-verification-strategy.interface.ts
import { UserStatus } from '../../../usuarios/entities/usuario.entity.js';
import { RegisterAuthDto } from '../../dto/register-auth.dto.js';

export interface UploadedDocumentFile {
    fieldname?: string;
    originalname: string;
    encoding?: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
    destination?: string;
    filename?: string;
    path?: string;
}

export interface VerificationProcessResult {
    requiresDocumentReview: boolean;
    message: string;
    documentId?: string;
    documentUrl?: string;
}

export interface UserVerificationStrategy {
    readonly strategyKey: string;

    /**
     * Valida precondiciones del registro según la estrategia del rol.
     * Si no cumple los requisitos, debe lanzar BadRequestException.
     */
    validateRequirements(dto: RegisterAuthDto, file?: UploadedDocumentFile): void;

    /**
     * Determina el estado inicial del usuario según su rol y requerimientos.
     */
    determineInitialStatus(): UserStatus;

    /**
     * Procesa la documentación o vinculaciones adicionales post-creación de usuario.
     */
    processVerification(userId: string, file?: UploadedDocumentFile): Promise<VerificationProcessResult>;
}
