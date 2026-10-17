// src/modules/driver/domain/DriverProfile.ts

export interface UpdateDriverProfilePayload {
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'M' | 'F' | 'U';
    birthDate?: string;
}
