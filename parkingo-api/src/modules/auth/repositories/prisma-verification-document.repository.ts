// src/modules/auth/repositories/prisma-verification-document.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
    CreateVerificationDocumentData,
    DocumentVerificationStatus,
    VerificationDocumentEntity,
    VerificationDocumentRepository,
} from './verification-document.repository.js';

interface PrismaUserVerificationDocumentRecord {
    id: string;
    userId: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    status: string;
    reviewedBy?: string | null;
    reviewedAt?: Date | null;
    rejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

@Injectable()
export class PrismaVerificationDocumentRepository implements VerificationDocumentRepository {
    constructor(private readonly prisma: PrismaService) { }

    private toEntity(doc: PrismaUserVerificationDocumentRecord): VerificationDocumentEntity {
        return new VerificationDocumentEntity({
            id: doc.id,
            userId: doc.userId,
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            mimeType: doc.mimeType,
            status: doc.status as DocumentVerificationStatus,
            reviewedBy: doc.reviewedBy,
            reviewedAt: doc.reviewedAt,
            rejectionReason: doc.rejectionReason,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        });
    }

    async create(data: CreateVerificationDocumentData): Promise<VerificationDocumentEntity> {
        const doc: PrismaUserVerificationDocumentRecord = await this.prisma.userVerificationDocument.create({
            data: {
                userId: data.userId,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize,
                mimeType: data.mimeType,
                status: DocumentVerificationStatus.PENDING,
            },
        });
        return this.toEntity(doc);
    }

    async findByUserId(userId: string): Promise<VerificationDocumentEntity[]> {
        const docs: PrismaUserVerificationDocumentRecord[] = await this.prisma.userVerificationDocument.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return docs.map((doc: PrismaUserVerificationDocumentRecord) => this.toEntity(doc));
    }

    async findPending(): Promise<VerificationDocumentEntity[]> {
        const docs: PrismaUserVerificationDocumentRecord[] = await this.prisma.userVerificationDocument.findMany({
            where: { status: DocumentVerificationStatus.PENDING },
            orderBy: { createdAt: 'desc' },
        });
        return docs.map((doc: PrismaUserVerificationDocumentRecord) => this.toEntity(doc));
    }

    async updateStatus(
        id: string,
        status: DocumentVerificationStatus,
        reviewedBy?: string,
        rejectionReason?: string,
    ): Promise<VerificationDocumentEntity> {
        const doc: PrismaUserVerificationDocumentRecord = await this.prisma.userVerificationDocument.update({
            where: { id },
            data: {
                status,
                reviewedBy,
                reviewedAt: new Date(),
                rejectionReason,
            },
        });
        return this.toEntity(doc);
    }
}
