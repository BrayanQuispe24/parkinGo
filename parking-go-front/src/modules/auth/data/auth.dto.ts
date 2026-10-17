// src/modules/auth/data/auth.dto.ts

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    requiresVerification?: boolean;
    data: T;
}

export interface LoginRequestDto {
    email: string;
    password: string;
}

export interface ApiUserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    roleId?: string;
    ci?: string;
    gender?: string;
    phone?: string;
    isVerified?: boolean;
}

export interface LoginResponseData {
    token: string;
    user: ApiUserData;
}

export interface RegisterRequestDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    ci: string;
    roleName: string; // 'DRIVER' | 'HOST' | 'PARKING_ADMIN'
    gender?: 'M' | 'F' | 'U';
    birthDate?: string;
    phone?: string;
    acceptedTerms: boolean;
    document?: File;
}

export interface RegisterResponseData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
    roleId?: string;
    status?: string;
    isVerified?: boolean;
    requiresDocumentReview?: boolean;
    documentId?: string;
}

export interface VerifyOtpRequestDto {
    email: string;
    code: string;
}

export interface ResendOtpRequestDto {
    email: string;
}
