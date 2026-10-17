// src/modules/parking-admin/domain/ParkingOperator.ts

export type OperatorShift =
    | 'Turno Mañana (07:00 - 15:00)'
    | 'Turno Tarde (15:00 - 23:00)'
    | 'Turno Noche (23:00 - 07:00)';

export type OperatorStatus = 'activo' | 'en-sitio' | 'inactivo';

export type GaritaLocation =
    | 'Caseta Principal Norte'
    | 'Caseta Acceso Sur'
    | 'Garita Nivel Subterráneo';

export interface ParkingOperator {
    id: string;
    fullName: string;
    firstName?: string;
    lastName?: string;
    ci: string;
    phone: string;
    email: string;
    garita?: GaritaLocation;
    shift?: OperatorShift;
    status: OperatorStatus;
    avatarInitials: string;
    operationsCountToday: number;
    totalCollectedToday: number;
    lastLoginAt?: string;
    joinedAt: string;
}

export interface CreateOperatorPayload {
    fullName: string;
    firstName?: string;
    lastName?: string;
    ci: string;
    phone: string;
    email: string;
    garita?: GaritaLocation;
    shift?: OperatorShift;
    status: OperatorStatus;
    temporaryPassword?: string;
}

export interface UpdateOperatorPayload {
    id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    ci?: string;
    phone?: string;
    email?: string;
    garita?: GaritaLocation;
    shift?: OperatorShift;
    status?: OperatorStatus;
}

export interface OperatorPerformanceReport {
    operatorId: string;
    operatorName: string;
    period: 'today' | 'week' | 'month';
    branchName: string;
    totalTickets: number;
    totalRevenue: number;
    averageHandlingSeconds: number;
    shiftHoursCompleted: number;
    incidentsReported: number;
}
