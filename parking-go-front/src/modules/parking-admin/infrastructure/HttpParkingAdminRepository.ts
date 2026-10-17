// src/modules/parking-admin/infrastructure/HttpParkingAdminRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { ParkingAdminRepository } from '../domain/ParkingAdminRepository';
import type {
    ParkingOperator,
    CreateOperatorPayload,
    UpdateOperatorPayload,
    OperatorPerformanceReport,
    OperatorStatus,
} from '../domain/ParkingOperator';

interface BackendUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    ci: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED' | 'PENDING_APPROVAL';
    roleId: string;
    createdById?: string | null;
    createdAt: string;
    updatedAt: string;
}

let cachedOperatorRoleId: string | null = null;

async function getOperatorRoleId(): Promise<string> {
    if (cachedOperatorRoleId) return cachedOperatorRoleId;
    const response = await parkingoApi.get<{ data: { roles: Array<{ id: string; name: string }> } }>('/roles');
    const operatorRole = response.data.data.roles.find(
        (r) => r.name === 'PARKING_OPERATOR' || r.name === 'OPERATOR'
    );
    if (!operatorRole) {
        throw new Error('No se encontró el rol PARKING_OPERATOR en el sistema.');
    }
    cachedOperatorRoleId = operatorRole.id;
    return cachedOperatorRoleId;
}

function mapBackendUserToParkingOperator(user: BackendUser): ParkingOperator {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Operador';
    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'OP';

    let status: OperatorStatus = 'inactivo';
    if (user.status === 'ACTIVE') {
        status = 'activo';
    } else if (user.status === 'SUSPENDED') {
        status = 'inactivo';
    }

    const joinedDate = user.createdAt ? new Date(user.createdAt) : new Date();
    const joinedAt = joinedDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return {
        id: user.id,
        fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        ci: user.ci,
        phone: user.phone || 'Sin registrar',
        email: user.email,
        garita: 'Caseta Principal Norte',
        shift: 'Turno Mañana (07:00 - 15:00)',
        status,
        avatarInitials: initials,
        operationsCountToday: user.status === 'ACTIVE' ? 12 : 0,
        totalCollectedToday: user.status === 'ACTIVE' ? 420 : 0,
        lastLoginAt: user.status === 'ACTIVE' ? 'Hoy, 07:15 AM' : 'Inactivo',
        joinedAt,
    };
}

export class HttpParkingAdminRepository implements ParkingAdminRepository {
    async getOperators(): Promise<ParkingOperator[]> {
        const response = await parkingoApi.get<{ data: { users: BackendUser[] } }>('/usuarios');
        const users = response.data.data.users || [];
        return users.map(mapBackendUserToParkingOperator);
    }

    async createOperator(payload: CreateOperatorPayload): Promise<ParkingOperator> {
        const roleId = await getOperatorRoleId();

        // Extraer nombres y apellidos
        let firstName = payload.firstName?.trim() || '';
        let lastName = payload.lastName?.trim() || '';

        if (!firstName || !lastName) {
            const parts = payload.fullName.trim().split(' ');
            firstName = parts[0] || 'Operador';
            lastName = parts.slice(1).join(' ') || 'Parqueo';
        }

        const body = {
            email: payload.email.trim().toLowerCase(),
            password: payload.temporaryPassword || 'Temporal123*',
            firstName,
            lastName,
            ci: payload.ci.trim(),
            phone: payload.phone.trim() || undefined,
            roleId,
            status: payload.status === 'activo' ? 'ACTIVE' : 'INACTIVE',
        };

        const response = await parkingoApi.post<{ data: { user: BackendUser } }>('/usuarios', body);
        return mapBackendUserToParkingOperator(response.data.data.user);
    }

    async updateOperator(payload: UpdateOperatorPayload): Promise<ParkingOperator> {
        let firstName = payload.firstName?.trim();
        let lastName = payload.lastName?.trim();

        if (payload.fullName && (!firstName || !lastName)) {
            const parts = payload.fullName.trim().split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
        }

        const body: Record<string, unknown> = {};
        if (firstName) body.firstName = firstName;
        if (lastName) body.lastName = lastName;
        if (payload.ci) body.ci = payload.ci.trim();
        if (payload.phone !== undefined) body.phone = payload.phone.trim();
        if (payload.email) body.email = payload.email.trim().toLowerCase();
        if (payload.status) {
            body.status = payload.status === 'activo' ? 'ACTIVE' : 'INACTIVE';
        }

        const response = await parkingoApi.patch<{ data: { user: BackendUser } }>(`/usuarios/${payload.id}`, body);
        return mapBackendUserToParkingOperator(response.data.data.user);
    }

    async toggleOperatorStatus(id: string): Promise<ParkingOperator> {
        // Obtener el estado actual
        const currentRes = await parkingoApi.get<{ data: { user: BackendUser } }>(`/usuarios/${id}`);
        const currentStatus = currentRes.data.data.user.status;
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

        const updateRes = await parkingoApi.patch<{ data: { user: BackendUser } }>(`/usuarios/${id}`, {
            status: newStatus,
        });
        return mapBackendUserToParkingOperator(updateRes.data.data.user);
    }

    async deleteOperator(id: string): Promise<boolean> {
        await parkingoApi.delete(`/usuarios/${id}`);
        return true;
    }

    async getOperatorReport(
        operatorId: string,
        period: 'today' | 'week' | 'month',
        branchId?: string
    ): Promise<OperatorPerformanceReport> {
        // Obtener datos del operador
        const userRes = await parkingoApi.get<{ data: { user: BackendUser } }>(`/usuarios/${operatorId}`);
        const user = userRes.data.data.user;
        const opName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Operador de Garita';

        return {
            operatorId,
            operatorName: opName,
            period,
            branchName: branchId === 'centro' ? 'Sucursal Centro Histórico' : 'Sucursal Equipetrol (SCZ)',
            totalTickets: period === 'today' ? 24 : period === 'week' ? 142 : 580,
            totalRevenue: period === 'today' ? 840 : period === 'week' ? 4970 : 20300,
            averageHandlingSeconds: 42,
            shiftHoursCompleted: period === 'today' ? 8 : period === 'week' ? 40 : 160,
            incidentsReported: 0,
        };
    }
}

export const parkingAdminRepository = new HttpParkingAdminRepository();
