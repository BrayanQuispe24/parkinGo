// src/modules/auth/repositories/prisma-email-verification-token.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service.js';
import {
    EmailVerificationTokenRecord,
    EmailVerificationTokenRepository,
} from './email-verification-token.repository.js';

@Injectable()
export class PrismaEmailVerificationTokenRepository implements EmailVerificationTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userId: string, codeHash: string, expiresAt: Date): Promise<EmailVerificationTokenRecord> {
        return this.prisma.emailVerificationToken.create({
            data: {
                userId,
                codeHash,
                expiresAt,
            },
        });
    }

    async findLatestByUserId(userId: string): Promise<EmailVerificationTokenRecord | null> {
        return this.prisma.emailVerificationToken.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async incrementAttempts(id: string): Promise<void> {
        await this.prisma.emailVerificationToken.update({
            where: { id },
            data: {
                attempts: { increment: 1 },
            },
        });
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.prisma.emailVerificationToken.deleteMany({
            where: { userId },
        });
    }

    async purgeExpiredUnverifiedUsers(): Promise<number> {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const unverified = await this.prisma.user.findMany({
            where: {
                isVerified: false,
                createdAt: { lt: fifteenMinutesAgo },
                role: {
                    name: { in: ['DRIVER', 'HOST', 'PARKING_ADMIN'] },
                },
            },
            select: { id: true },
        });

        if (unverified.length > 0) {
            const ids = unverified.map((u) => u.id);
            await this.prisma.user.deleteMany({
                where: { id: { in: ids } },
            });
            return ids.length;
        }
        return 0;
    }
}

