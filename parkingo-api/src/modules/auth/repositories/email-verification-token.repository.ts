// src/modules/auth/repositories/email-verification-token.repository.ts
export interface EmailVerificationTokenRecord {
    id: string;
    userId: string;
    codeHash: string;
    attempts: number;
    expiresAt: Date;
    createdAt: Date;
}

export abstract class EmailVerificationTokenRepository {
    abstract create(userId: string, codeHash: string, expiresAt: Date): Promise<EmailVerificationTokenRecord>;
    abstract findLatestByUserId(userId: string): Promise<EmailVerificationTokenRecord | null>;
    abstract incrementAttempts(id: string): Promise<void>;
    abstract deleteByUserId(userId: string): Promise<void>;
    abstract purgeExpiredUnverifiedUsers(): Promise<number>;
}
