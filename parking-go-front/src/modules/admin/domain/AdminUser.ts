// src/modules/admin/domain/AdminUser.ts

export interface AdminVerificationDocument {
    id: string;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    rejectionReason?: string | null;
    createdAt?: string;
}

export interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullname?: string;
    ci: string;
    gender?: string;
    phone?: string;
    status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'INACTIVE' | 'DELETED';
    roleId: string;
    role: {
        id: string;
        name: string;
    };
    empresa?: string;
    parqueosCount?: number;
    verificationDocuments?: AdminVerificationDocument[];
    createdAt?: string;
}

export interface CreateAdminUserPayload {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    ci: string;
    roleId: string;
    phone?: string;
    gender?: 'M' | 'F' | 'U';
}

export interface UpdateAdminUserPayload {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    ci?: string;
    roleId?: string;
    phone?: string;
    gender?: 'M' | 'F' | 'U';
    status?: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'INACTIVE' | 'DELETED';
}
