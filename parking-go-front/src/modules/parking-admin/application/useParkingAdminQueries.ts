// src/modules/parking-admin/application/useParkingAdminQueries.ts
import { useQuery } from '@tanstack/react-query';
import { parkingAdminRepository } from '../infrastructure/HttpParkingAdminRepository';
import type { ParkingOperator, OperatorPerformanceReport } from '../domain/ParkingOperator';

export const PARKING_ADMIN_KEYS = {
    operators: ['parking-admin', 'operators'] as const,
    operatorReport: (id: string, period: string, branch?: string) =>
        ['parking-admin', 'operator-report', id, period, branch] as const,
};

export const useParkingOperatorsQuery = () => {
    return useQuery<ParkingOperator[]>({
        queryKey: PARKING_ADMIN_KEYS.operators,
        queryFn: () => parkingAdminRepository.getOperators(),
        staleTime: 1000 * 60 * 3, // 3 minutos
    });
};

export const useOperatorReportQuery = (
    operatorId: string,
    period: 'today' | 'week' | 'month',
    branchId = '101',
    enabled = true
) => {
    return useQuery<OperatorPerformanceReport>({
        queryKey: PARKING_ADMIN_KEYS.operatorReport(operatorId, period, branchId),
        queryFn: () => parkingAdminRepository.getOperatorReport(operatorId, period, branchId),
        enabled: Boolean(operatorId) && enabled,
    });
};
