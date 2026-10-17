// src/modules/driver/application/useDriverQueries.ts
import { useQuery } from '@tanstack/react-query';
import { driverRepository } from '../infrastructure/HttpDriverRepository';

export const DRIVER_KEYS = {
    all: ['driver'] as const,
    parkings: () => [...DRIVER_KEYS.all, 'parkings'] as const,
    vehicles: () => [...DRIVER_KEYS.all, 'vehicles'] as const,
    activeBooking: () => [...DRIVER_KEYS.all, 'activeBooking'] as const,
    bookingsHistory: () => [...DRIVER_KEYS.all, 'bookingsHistory'] as const,
    reviews: () => [...DRIVER_KEYS.all, 'reviews'] as const,
};

export const useDriverParkingsQuery = () => {
    return useQuery({
        queryKey: DRIVER_KEYS.parkings(),
        queryFn: () => driverRepository.getParkings(),
        staleTime: 1000 * 60 * 2,
    });
};

export const useDriverVehiclesQuery = () => {
    return useQuery({
        queryKey: DRIVER_KEYS.vehicles(),
        queryFn: () => driverRepository.getVehicles(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useDriverActiveBookingQuery = () => {
    return useQuery({
        queryKey: DRIVER_KEYS.activeBooking(),
        queryFn: () => driverRepository.getActiveBooking(),
        staleTime: 1000 * 30, // 30 segundos para reflejar cambios en tiempo real
    });
};

export const useDriverBookingsHistoryQuery = () => {
    return useQuery({
        queryKey: DRIVER_KEYS.bookingsHistory(),
        queryFn: () => driverRepository.getBookingsHistory(),
        staleTime: 1000 * 60 * 2,
    });
};

export const useDriverReviewsQuery = () => {
    return useQuery({
        queryKey: DRIVER_KEYS.reviews(),
        queryFn: () => driverRepository.getReviews(),
        staleTime: 1000 * 60 * 5,
    });
};
