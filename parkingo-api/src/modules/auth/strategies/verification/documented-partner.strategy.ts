// src/modules/auth/strategies/verification/documented-partner.strategy.ts
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserStatus } from '../../../usuarios/entities/usuario.entity.js';
import fs from 'fs/promises';
import path from 'path';
import { RegisterAuthDto } from '../../dto/register-auth.dto.js';
import { VerificationDocumentRepository } from '../../repositories/verification-document.repository.js';
import {
    UploadedDocumentFile,
    UserVerificationStrategy,
    VerificationProcessResult,
} from './user-verification-strategy.interface.js';

@Injectable()
export class DocumentedPartnerStrategy implements UserVerificationStrategy {
    readonly strategyKey = 'DOCUMENT_VERIFICATION';

    constructor(private readonly documentRepository: VerificationDocumentRepository) {}

    validateRequirements(_dto: RegisterAuthDto, file?: UploadedDocumentFile): void {
        if (!file) {
            throw new BadRequestException(
                'Para registrarse como Anfitrión o Administrador de Parqueo es obligatorio adjuntar la documentación de respaldo en formato PDF.',
            );
        }

        const isPdfMime = file.mimetype === 'application/pdf';
        const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');

        if (!isPdfMime && !isPdfExt) {
            throw new BadRequestException(
                'El documento de respaldo debe estar estrictamente en formato PDF.',
            );
        }

        const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSizeBytes) {
            throw new BadRequestException(
                'El documento PDF excede el límite máximo permitido de 10 MB.',
            );
        }
    }

    determineInitialStatus(): UserStatus {
        return UserStatus.PENDING_APPROVAL;
    }

    async processVerification(
        userId: string,
        file?: UploadedDocumentFile,
    ): Promise<VerificationProcessResult> {
        if (!file) {
            throw new BadRequestException('No se recibió el archivo PDF requerido.');
        }

        try {
            // Asegurar directorio de almacenamiento
            const uploadDir = path.resolve(process.cwd(), 'uploads', 'verification_documents');
            await fs.mkdir(uploadDir, { recursive: true });

            const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const uniqueFileName = `${userId}_${Date.now()}_${sanitizedOriginalName}`;
            const targetPath = path.join(uploadDir, uniqueFileName);

            // Si el archivo viene en buffer de memoria o en disco
            if (file.buffer) {
                await fs.writeFile(targetPath, file.buffer);
            } else if (file.path) {
                await fs.copyFile(file.path, targetPath);
            }

            const publicUrl = `/uploads/verification_documents/${uniqueFileName}`;

            // Registrar en base de datos
            const doc = await this.documentRepository.create({
                userId,
                fileUrl: publicUrl,
                fileName: file.originalname,
                fileSize: file.size,
                mimeType: file.mimetype || 'application/pdf',
            });

            return {
                requiresDocumentReview: true,
                message:
                    'Documentación PDF recibida exitosamente. Tu cuenta está en estado de revisión y será evaluada por el Administrador.',
                documentId: doc.id,
                documentUrl: doc.fileUrl,
            };
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException(
                'Ocurrió un error al almacenar y procesar el documento PDF de verificación.',
            );
        }
    }
}
