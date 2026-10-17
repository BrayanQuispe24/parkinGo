// src/modules/parking-admin/application/useParkingAdminMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingAdminRepository } from '../infrastructure/HttpParkingAdminRepository';
import { PARKING_ADMIN_KEYS } from './useParkingAdminQueries';
import type { CreateOperatorPayload, UpdateOperatorPayload } from '../domain/ParkingOperator';

export const useCreateOperatorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateOperatorPayload) => parkingAdminRepository.createOperator(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARKING_ADMIN_KEYS.operators });
        },
    });
};

export const useUpdateOperatorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateOperatorPayload) => parkingAdminRepository.updateOperator(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARKING_ADMIN_KEYS.operators });
        },
    });
};

export const useToggleOperatorStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => parkingAdminRepository.toggleOperatorStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARKING_ADMIN_KEYS.operators });
        },
    });
};

export const useDeleteOperatorMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => parkingAdminRepository.deleteOperator(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PARKING_ADMIN_KEYS.operators });
        },
    });
};
