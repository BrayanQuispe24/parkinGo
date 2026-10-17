// src/modules/driver/domain/DriverBooking.ts

export type BookingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface DriverBooking {
    id: string;
    bookingNumber: string;
    parkingId: string;
    parkingName: string;
    parkingAddress: string;
    spotNumber: string;
    vehiclePlate: string;
    vehicleModel: string;
    entryTime: string;
    durationHours: number;
    pricePerHour: number;
    totalAmount: number;
    status: BookingStatus;
    qrCodeText: string;
    createdAt: string;
}

export interface CreateBookingPayload {
    parkingId: string;
    vehiclePlate: string;
    durationHours: number;
}
