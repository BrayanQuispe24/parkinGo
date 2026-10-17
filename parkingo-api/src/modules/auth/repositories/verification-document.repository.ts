// src/modules/auth/repositories/verification-document.repository.ts
import {
    DocumentVerificationStatus,
    VerificationDocumentEntity,
} from '../entities/verification-document.entity.js';

export { DocumentVerificationStatus, VerificationDocumentEntity };

export interface CreateVerificationDocumentData {
    userId: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
}

export abstract class VerificationDocumentRepository {
    abstract create(data: CreateVerificationDocumentData): Promise<VerificationDocumentEntity>;
    abstract findByUserId(userId: string): Promise<VerificationDocumentEntity[]>;
    abstract findPending(): Promise<VerificationDocumentEntity[]>;
    abstract updateStatus(
        id: string,
        status: DocumentVerificationStatus,
        reviewedBy?: string,
        rejectionReason?: string,
    ): Promise<VerificationDocumentEntity>;
}
