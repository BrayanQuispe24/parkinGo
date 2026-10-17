// src/modules/driver/domain/DriverParking.ts

export type ParkingTag = 'all' | 'ev' | 'cubierto' | 'seguridad';

export interface DriverParking {
    id: string;
    name: string;
    address: string;
    zone: string;
    pricePerHour: number;
    totalSpots: number;
    availableSpots: number;
    photoUrl: string;
    tags: ('ev' | 'cubierto' | 'seguridad')[];
    mapPosition: {
        topPercent: number;
        leftPercent: number;
    };
    distanceKm: number;
    estimatedMinutes: number;
    isFavorite?: boolean;
}
