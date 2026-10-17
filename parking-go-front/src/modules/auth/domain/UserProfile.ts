// src/modules/auth/domain/UserProfile.ts

export interface UpdateUserProfilePayload {
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'M' | 'F' | 'U';
    birthDate?: string;
}
