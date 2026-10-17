// src/modules/auth/entities/verification-document.entity.ts

export enum DocumentVerificationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export class VerificationDocumentEntity {
    id: string;
    userId: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    status: DocumentVerificationStatus;
    reviewedBy?: string | null;
    reviewedAt?: Date | null;
    rejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<VerificationDocumentEntity>) {
        Object.assign(this, partial);
    }
}
