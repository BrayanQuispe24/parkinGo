// src/modules/driver/infrastructure/HttpDriverRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { DriverRepository } from '../domain/DriverRepository';
import type { DriverParking } from '../domain/DriverParking';
import type { DriverVehicle, CreateVehiclePayload } from '../domain/DriverVehicle';
import type { DriverBooking, CreateBookingPayload } from '../domain/DriverBooking';
import type { DriverReview, CreateReviewPayload } from '../domain/DriverReview';
import type { UpdateDriverProfilePayload } from '../domain/DriverProfile';

import imgCentro from '../../../assets/parking_centro_1789393632373.png';
import imgEmpresarial from '../../../assets/parking_empresarial_1789393502203.png';
import imgAeropuerto from '../../../assets/parking_aeropuerto_1789393564642.png';

export class HttpDriverRepository implements DriverRepository {
    // Datos en memoria reactivos para soportar interacción completa del conductor
    private static parkingsState: DriverParking[] = [
        {
            id: 'p-101',
            name: 'ParkinGo Equipetrol Central',
            address: 'Av. San Martín #450, Equipetrol Norte',
            zone: 'Equipetrol Norte',
            pricePerHour: 10,
            totalSpots: 60,
            availableSpots: 42,
            photoUrl: imgEmpresarial,
            tags: ['ev', 'cubierto', 'seguridad'],
            mapPosition: { topPercent: 42, leftPercent: 52 },
            distanceKm: 0.4,
            estimatedMinutes: 2,
            isFavorite: false,
        },
        {
            id: 'p-102',
            name: 'ParkinGo Centro Histórico',
            address: 'Calle Junín esq. Libertad, Casco Viejo',
            zone: 'Centro Histórico',
            pricePerHour: 8,
            totalSpots: 40,
            availableSpots: 15,
            photoUrl: imgCentro,
            tags: ['cubierto', 'seguridad'],
            mapPosition: { topPercent: 58, leftPercent: 72 },
            distanceKm: 1.8,
            estimatedMinutes: 6,
            isFavorite: true,
        },
        {
            id: 'p-103',
            name: 'ParkinGo Plaza Abaroa',
            address: 'Av. 20 de Octubre #1820',
            zone: 'Sopocachi / Plaza Abaroa',
            pricePerHour: 12,
            totalSpots: 35,
            availableSpots: 8,
            photoUrl: imgAeropuerto,
            tags: ['ev', 'seguridad'],
            mapPosition: { topPercent: 35, leftPercent: 32 },
            distanceKm: 2.3,
            estimatedMinutes: 8,
            isFavorite: false,
        },
    ];

    private static vehiclesState: DriverVehicle[] = [
        {
            id: 'veh-1',
            plate: '9912-KLS',
            brand: 'Toyota',
            model: 'Corolla Sedan',
            color: 'Blanco Perlado',
            vehicleType: 'SEDAN',
            isDefault: true,
            createdAt: '2026-02-10',
        },
        {
            id: 'veh-2',
            plate: '4410-QWE',
            brand: 'Tesla',
            model: 'Model 3 (Carga EV)',
            color: 'Azul Eléctrico',
            vehicleType: 'ELECTRICO',
            isDefault: false,
            createdAt: '2026-03-01',
        },
    ];

    private static activeBookingState: DriverBooking | null = {
        id: 'bk-active-1',
        bookingNumber: 'TKT-2026-8842',
        parkingId: 'p-101',
        parkingName: 'ParkinGo Equipetrol Central',
        parkingAddress: 'Av. San Martín #450, Equipetrol Norte',
        spotNumber: 'P2 - Nivel 2 (Spot #24)',
        vehiclePlate: '9912-KLS',
        vehicleModel: 'Toyota Corolla Sedan',
        entryTime: 'Hoy, 16:30',
        durationHours: 2,
        pricePerHour: 10,
        totalAmount: 20,
        status: 'ACTIVE',
        qrCodeText: 'PARKINGO:TKT-2026-8842:9912-KLS:P2-24',
        createdAt: new Date().toISOString(),
    };

    private static bookingsHistoryState: DriverBooking[] = [
        {
            id: 'bk-hist-1',
            bookingNumber: 'TKT-2026-7910',
            parkingId: 'p-102',
            parkingName: 'ParkinGo Centro Histórico',
            parkingAddress: 'Calle Junín esq. Libertad',
            spotNumber: 'A-12',
            vehiclePlate: '9912-KLS',
            vehicleModel: 'Toyota Corolla',
            entryTime: '12 Octubre 2026 • 14:00 - 17:30',
            durationHours: 3.5,
            pricePerHour: 8,
            totalAmount: 28,
            status: 'COMPLETED',
            qrCodeText: 'PARKINGO:TKT-2026-7910',
            createdAt: '2026-10-12T14:00:00Z',
        },
        {
            id: 'bk-hist-2',
            bookingNumber: 'TKT-2026-7122',
            parkingId: 'p-103',
            parkingName: 'ParkinGo Plaza Abaroa',
            parkingAddress: 'Av. 20 de Octubre #1820',
            spotNumber: 'B-04',
            vehiclePlate: '4410-QWE',
            vehicleModel: 'Tesla Model 3',
            entryTime: '08 Octubre 2026 • 10:15 - 12:15',
            durationHours: 2,
            pricePerHour: 12,
            totalAmount: 24,
            status: 'COMPLETED',
            qrCodeText: 'PARKINGO:TKT-2026-7122',
            createdAt: '2026-10-08T10:15:00Z',
        },
    ];

    private static reviewsState: DriverReview[] = [
        {
            id: 'rev-1',
            parkingName: 'ParkinGo Equipetrol Central',
            driverName: 'Carlos Mendizábal',
            rating: 5,
            comment: 'Excelente experiencia. Reconocimiento de placa instantáneo en la barrera y la plaza techada impecable.',
            date: 'Hace 2 días',
            verifiedStay: true,
        },
        {
            id: 'rev-2',
            parkingName: 'ParkinGo Centro Histórico',
            driverName: 'Lucía Fernández',
            rating: 4,
            comment: 'Muy seguro y cómodo en pleno centro. Bastante iluminado.',
            date: 'Hace 5 días',
            verifiedStay: true,
        },
    ];

    async getParkings(): Promise<DriverParking[]> {
        try {
            // Intenta consultar la API si existe endpoint /parqueos
            const response = await parkingoApi.get('/parqueos').catch(() => null);
            if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
        } catch {
            // Fallback a los datos iniciales de diseño
        }
        return [...HttpDriverRepository.parkingsState];
    }

    async getVehicles(): Promise<DriverVehicle[]> {
        return [...HttpDriverRepository.vehiclesState];
    }

    async addVehicle(payload: CreateVehiclePayload): Promise<DriverVehicle> {
        const newVehicle: DriverVehicle = {
            id: `veh-${Date.now()}`,
            plate: payload.plate.toUpperCase().trim(),
            brand: payload.brand.trim(),
            model: payload.model.trim(),
            color: payload.color.trim(),
            vehicleType: payload.vehicleType,
            isDefault: HttpDriverRepository.vehiclesState.length === 0,
            createdAt: new Date().toISOString().split('T')[0],
        };
        HttpDriverRepository.vehiclesState = [newVehicle, ...HttpDriverRepository.vehiclesState];
        return newVehicle;
    }

    async setDefaultVehicle(vehicleId: string): Promise<DriverVehicle> {
        HttpDriverRepository.vehiclesState = HttpDriverRepository.vehiclesState.map((v) => ({
            ...v,
            isDefault: v.id === vehicleId,
        }));
        const found = HttpDriverRepository.vehiclesState.find((v) => v.id === vehicleId);
        if (!found) throw new Error('Vehículo no encontrado');
        return found;
    }

    async getActiveBooking(): Promise<DriverBooking | null> {
        return HttpDriverRepository.activeBookingState;
    }

    async getBookingsHistory(): Promise<DriverBooking[]> {
        return [...HttpDriverRepository.bookingsHistoryState];
    }

    async createBooking(payload: CreateBookingPayload): Promise<DriverBooking> {
        const parking = HttpDriverRepository.parkingsState.find((p) => p.id === payload.parkingId);
        const parkingName = parking?.name ?? 'ParkinGo Estación';
        const price = parking?.pricePerHour ?? 10;
        const total = price * payload.durationHours;

        const newBooking: DriverBooking = {
            id: `bk-${Date.now()}`,
            bookingNumber: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            parkingId: payload.parkingId,
            parkingName,
            parkingAddress: parking?.address ?? 'Ubicación céntrica',
            spotNumber: `Plaza #${Math.floor(1 + Math.random() * 40)}`,
            vehiclePlate: payload.vehiclePlate,
            vehicleModel: 'Vehículo Conductor',
            entryTime: `Hoy, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            durationHours: payload.durationHours,
            pricePerHour: price,
            totalAmount: total,
            status: 'ACTIVE',
            qrCodeText: `PARKINGO:${payload.parkingId}:${payload.vehiclePlate}`,
            createdAt: new Date().toISOString(),
        };

        HttpDriverRepository.activeBookingState = newBooking;
        return newBooking;
    }

    async cancelBooking(bookingId: string): Promise<void> {
        if (HttpDriverRepository.activeBookingState?.id === bookingId) {
            const finishedBooking: DriverBooking = {
                ...HttpDriverRepository.activeBookingState,
                status: 'COMPLETED',
            };
            HttpDriverRepository.bookingsHistoryState = [finishedBooking, ...HttpDriverRepository.bookingsHistoryState];
            HttpDriverRepository.activeBookingState = null;
        }
    }

    async getReviews(): Promise<DriverReview[]> {
        return [...HttpDriverRepository.reviewsState];
    }

    async createReview(payload: CreateReviewPayload): Promise<DriverReview> {
        const newReview: DriverReview = {
            id: `rev-${Date.now()}`,
            parkingName: payload.parkingName,
            driverName: 'Conductor Verificado',
            rating: payload.rating,
            comment: payload.comment,
            date: 'Hace un momento',
            verifiedStay: true,
        };
        HttpDriverRepository.reviewsState = [newReview, ...HttpDriverRepository.reviewsState];
        return newReview;
    }

    async updateProfile(userId: string, payload: UpdateDriverProfilePayload): Promise<void> {
        await parkingoApi.patch(`/usuarios/${userId}`, payload);
    }
}

export const driverRepository = new HttpDriverRepository();
