// src/modules/driver/application/useDriverMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverRepository } from '../infrastructure/HttpDriverRepository';
import { DRIVER_KEYS } from './useDriverQueries';
import type { CreateVehiclePayload } from '../domain/DriverVehicle';
import type { CreateBookingPayload } from '../domain/DriverBooking';
import type { CreateReviewPayload } from '../domain/DriverReview';
import type { UpdateDriverProfilePayload } from '../domain/DriverProfile';

export const useCreateBookingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateBookingPayload) => driverRepository.createBooking(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.activeBooking() });
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.bookingsHistory() });
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.parkings() });
        },
    });
};

export const useCancelBookingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: string) => driverRepository.cancelBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.activeBooking() });
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.bookingsHistory() });
        },
    });
};

export const useAddVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateVehiclePayload) => driverRepository.addVehicle(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.vehicles() });
        },
    });
};

export const useSetDefaultVehicleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vehicleId: string) => driverRepository.setDefaultVehicle(vehicleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.vehicles() });
        },
    });
};

export const useCreateReviewMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateReviewPayload) => driverRepository.createReview(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.reviews() });
        },
    });
};

export const useUpdateDriverProfileMutation = () => {
    return useMutation({
        mutationFn: ({ userId, payload }: { userId: string; payload: UpdateDriverProfilePayload }) =>
            driverRepository.updateProfile(userId, payload),
    });
};
