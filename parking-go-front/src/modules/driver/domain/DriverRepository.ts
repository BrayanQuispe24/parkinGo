// src/modules/driver/domain/DriverRepository.ts
import type { DriverParking } from './DriverParking';
import type { DriverVehicle, CreateVehiclePayload } from './DriverVehicle';
import type { DriverBooking, CreateBookingPayload } from './DriverBooking';
import type { DriverReview, CreateReviewPayload } from './DriverReview';
import type { UpdateDriverProfilePayload } from './DriverProfile';

export interface DriverRepository {
    getParkings(): Promise<DriverParking[]>;
    getVehicles(): Promise<DriverVehicle[]>;
    addVehicle(payload: CreateVehiclePayload): Promise<DriverVehicle>;
    setDefaultVehicle(vehicleId: string): Promise<DriverVehicle>;
    getActiveBooking(): Promise<DriverBooking | null>;
    getBookingsHistory(): Promise<DriverBooking[]>;
    createBooking(payload: CreateBookingPayload): Promise<DriverBooking>;
    cancelBooking(bookingId: string): Promise<void>;
    getReviews(): Promise<DriverReview[]>;
    createReview(payload: CreateReviewPayload): Promise<DriverReview>;
    updateProfile(userId: string, payload: UpdateDriverProfilePayload): Promise<void>;
}
