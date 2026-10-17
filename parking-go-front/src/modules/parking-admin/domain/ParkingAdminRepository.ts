// src/modules/parking-admin/domain/ParkingAdminRepository.ts
import type {
    ParkingOperator,
    CreateOperatorPayload,
    UpdateOperatorPayload,
    OperatorPerformanceReport,
} from './ParkingOperator';

export interface ParkingAdminRepository {
    getOperators(): Promise<ParkingOperator[]>;
    createOperator(payload: CreateOperatorPayload): Promise<ParkingOperator>;
    updateOperator(payload: UpdateOperatorPayload): Promise<ParkingOperator>;
    toggleOperatorStatus(id: string): Promise<ParkingOperator>;
    deleteOperator(id: string): Promise<boolean>;
    getOperatorReport(
        operatorId: string,
        period: 'today' | 'week' | 'month',
        branchId?: string
    ): Promise<OperatorPerformanceReport>;
}
