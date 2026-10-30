// src/modules/driver/infrastructure/HttpDriverRepository.ts
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { DriverRepository } from '../domain/DriverRepository';
import type { DriverParking } from '../domain/DriverParking';
import type { DriverVehicle, CreateVehiclePayload } from '../domain/DriverVehicle';
import type {
    DriverBooking,
    CreateBookingPayload,
    BoletaReserva,
    CotizarReservaPayload,
    CotizacionReservaResult,
    CrearReservaPayload,
} from '../domain/DriverBooking';
import type { DriverReview, CreateReviewPayload } from '../domain/DriverReview';
import type { UpdateDriverProfilePayload } from '../domain/DriverProfile';

import imgCentro from '../../../assets/parking_centro_1789393632373.png';
import imgEmpresarial from '../../../assets/parking_empresarial_1789393502203.png';
import imgAeropuerto from '../../../assets/parking_aeropuerto_1789393564642.png';
import { DriverParkingMapper, type CatalogoEstacionamientoApiDto } from './mappers/DriverParkingMapper';

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
            const response = await parkingoApi.get<CatalogoEstacionamientoApiDto[]>('/estacionamientos/catalogo');
            if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
                return DriverParkingMapper.toDomainList(response.data);
            }
        } catch (error) {
            console.warn('No se pudo obtener el catálogo de estacionamientos de la API. Usando respaldo de diseño.', error);
        }
        return [...HttpDriverRepository.parkingsState];
    }

    async getVehicles(): Promise<DriverVehicle[]> {
        try {
            const response = await parkingoApi.get<Array<{
                id: string;
                tipo: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO' | 'OTRO';
                placa: string;
                modelo: string;
                color: string;
                propietarioId: string;
                esPredeterminado: boolean;
                fechaCreado: string;
                fechaActualizado: string;
            }>>('/vehiculos/mis-vehiculos');

            if (response?.data && Array.isArray(response.data)) {
                return response.data.map((v) => ({
                    id: v.id,
                    plate: v.placa,
                    model: v.modelo,
                    color: v.color,
                    vehicleType: v.tipo,
                    isDefault: v.esPredeterminado,
                    createdAt: v.fechaCreado,
                }));
            }
        } catch (error) {
            console.warn('Error al obtener vehículos del backend. Usando respaldo de diseño:', error);
        }
        return [...HttpDriverRepository.vehiclesState];
    }

    async addVehicle(payload: CreateVehiclePayload): Promise<DriverVehicle> {
        try {
            const modeloFinal = payload.brand
                ? `${payload.brand} ${payload.model}`.trim()
                : payload.model.trim();

            const response = await parkingoApi.post<{
                id: string;
                tipo: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO' | 'OTRO';
                placa: string;
                modelo: string;
                color: string;
                propietarioId: string;
                esPredeterminado: boolean;
                fechaCreado: string;
                fechaActualizado: string;
            }>('/vehiculos', {
                tipo: payload.vehicleType,
                placa: payload.plate.toUpperCase().trim(),
                modelo: modeloFinal,
                color: payload.color.trim(),
                esPredeterminado: payload.isDefault,
            });

            const v = response.data;
            const newVehicle: DriverVehicle = {
                id: v.id,
                plate: v.placa,
                brand: payload.brand?.trim() ?? '',
                model: v.modelo,
                color: v.color,
                vehicleType: v.tipo,
                isDefault: v.esPredeterminado,
                createdAt: v.fechaCreado,
            };
            HttpDriverRepository.vehiclesState = [newVehicle, ...HttpDriverRepository.vehiclesState];
            return newVehicle;
        } catch (error) {
            console.error('Error al registrar vehículo en la API:', error);
            throw error;
        }
    }

    async setDefaultVehicle(vehicleId: string): Promise<DriverVehicle> {
        try {
            const response = await parkingoApi.patch<{
                id: string;
                tipo: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO' | 'OTRO';
                placa: string;
                modelo: string;
                color: string;
                propietarioId: string;
                esPredeterminado: boolean;
                fechaCreado: string;
                fechaActualizado: string;
            }>(`/vehiculos/${vehicleId}/predeterminado`);

            const v = response.data;
            return {
                id: v.id,
                plate: v.placa,
                model: v.modelo,
                color: v.color,
                vehicleType: v.tipo,
                isDefault: v.esPredeterminado,
                createdAt: v.fechaCreado,
            };
        } catch (error) {
            console.error('Error al establecer vehículo predeterminado en la API:', error);
            throw error;
        }
    }

    async deleteVehicle(vehicleId: string): Promise<void> {
        try {
            await parkingoApi.delete(`/vehiculos/${vehicleId}`);
            HttpDriverRepository.vehiclesState = HttpDriverRepository.vehiclesState.filter(
                (v) => v.id !== vehicleId,
            );
        } catch (error) {
            console.error('Error al eliminar vehículo en la API:', error);
            throw error;
        }
    }

    private static mapBoletaToDriverBooking(b: BoletaReserva): DriverBooking {
        const primerDetalle = b.detalles[0];
        const spotNumber =
            b.detalles.length === 1
                ? `Plaza ${primerDetalle?.codigoEspacio || 'Asignada'}`
                : `${b.detalles.length} Plazas (${b.detalles.map((d) => d.codigoEspacio).join(', ')})`;

        const fechaIngreso = new Date(primerDetalle?.inicioReserva || b.fechaCreacion);
        const fechaFin = new Date(primerDetalle?.finReserva || b.fechaCreacion);
        const duracionHoras = Math.max(
            1,
            Math.round((fechaFin.getTime() - fechaIngreso.getTime()) / (1000 * 60 * 60)) || 1,
        );

        return {
            id: b.id,
            bookingNumber: b.codigoReserva,
            parkingId: b.estacionamientoId,
            parkingName: b.estacionamientoNombre,
            parkingAddress: b.estacionamientoDireccion,
            spotNumber,
            vehiclePlate: primerDetalle?.vehiculoPlaca || 'Sin vehículo',
            vehicleModel: primerDetalle?.vehiculoModelo || 'Vehículo Registrado',
            entryTime: fechaIngreso.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
            durationHours: duracionHoras,
            pricePerHour: primerDetalle?.precioUnitarioAplicado || 10,
            totalAmount: b.total,
            status:
                b.estado === 'CANCELADA'
                    ? 'CANCELLED'
                    : b.estado === 'COMPLETADA'
                      ? 'COMPLETED'
                      : 'ACTIVE',
            qrCodeText: b.qrToken,
            createdAt: b.fechaCreacion,
            boletaOriginal: b,
        };
    }

    async getMisReservas(): Promise<BoletaReserva[]> {
        try {
            const response = await parkingoApi.get<BoletaReserva[]>('/reservas/mis-reservas');
            if (response?.data && Array.isArray(response.data)) {
                return response.data;
            }
        } catch (error) {
            console.warn('Error al obtener mis reservas de la API:', error);
        }
        return [];
    }

    async cotizarReserva(payload: CotizarReservaPayload): Promise<CotizacionReservaResult> {
        const response = await parkingoApi.post<CotizacionReservaResult>('/reservas/cotizar', payload);
        return response.data;
    }

    async crearReserva(payload: CrearReservaPayload): Promise<BoletaReserva> {
        const response = await parkingoApi.post<BoletaReserva>('/reservas', payload);
        return response.data;
    }

    async cancelarReserva(reservaId: string): Promise<BoletaReserva> {
        const response = await parkingoApi.patch<BoletaReserva>(`/reservas/${reservaId}/cancelar`);
        return response.data;
    }

    async getActiveBooking(): Promise<DriverBooking | null> {
        try {
            const boletas = await this.getMisReservas();
            const activa = boletas.find(
                (b) =>
                    b.estado === 'PENDIENTE_PAGO' ||
                    b.estado === 'CONFIRMADA' ||
                    b.estado === 'EN_CURSO',
            );
            if (activa) {
                return HttpDriverRepository.mapBoletaToDriverBooking(activa);
            }
        } catch (error) {
            console.warn('No se pudo cargar la reserva activa de la API. Usando estado local:', error);
        }
        return HttpDriverRepository.activeBookingState;
    }

    async getBookingsHistory(): Promise<DriverBooking[]> {
        try {
            const boletas = await this.getMisReservas();
            const historicas = boletas.filter(
                (b) => b.estado === 'COMPLETADA' || b.estado === 'CANCELADA',
            );
            if (historicas.length > 0) {
                return historicas.map((b) => HttpDriverRepository.mapBoletaToDriverBooking(b));
            }
        } catch (error) {
            console.warn('No se pudo cargar el historial de reservas de la API:', error);
        }
        return [...HttpDriverRepository.bookingsHistoryState];
    }

    async createBooking(payload: CreateBookingPayload): Promise<DriverBooking> {
        try {
            // Intentar registrar mediante el endpoint real de la API si es posible
            const ahora = new Date();
            const fin = new Date(ahora.getTime() + payload.durationHours * 60 * 60 * 1000);

            // Obtener espacios disponibles del estacionamiento si no se envió espacioId
            let espacioId = payload.espacioId;
            if (!espacioId) {
                try {
                    const catalogoRes = await parkingoApi.get<Array<{
                        id: string;
                        niveles?: Array<{
                            espacios?: Array<{ id: string; estado: string }>;
                        }>;
                    }>>('/estacionamientos/catalogo');
                    const parqueo = catalogoRes.data?.find((p) => p.id === payload.parkingId);
                    const primerEspacio = parqueo?.niveles
                        ?.flatMap((n) => n.espacios || [])
                        ?.find((e) => e.estado === 'DISPONIBLE');
                    if (primerEspacio) {
                        espacioId = primerEspacio.id;
                    }
                } catch (e) {
                    console.warn('No se pudo autoseleccionar espacio del catálogo:', e);
                }
            }

            if (payload.detallesEspacios && payload.detallesEspacios.length > 0) {
                const boleta = await this.crearReserva({
                    estacionamientoId: payload.parkingId,
                    espacios: payload.detallesEspacios.map((d) => ({
                        espacioId: d.espacioId,
                        inicioReserva: ahora.toISOString(),
                        finReserva: fin.toISOString(),
                        serviciosExtras: (d.serviciosExtrasIds || []).map((id) => ({
                            servicioExtraId: id,
                            cantidad: 1,
                        })),
                    })),
                });
                return HttpDriverRepository.mapBoletaToDriverBooking(boleta);
            }

            if (espacioId) {
                const boleta = await this.crearReserva({
                    estacionamientoId: payload.parkingId,
                    espacios: [
                        {
                            espacioId,
                            inicioReserva: ahora.toISOString(),
                            finReserva: fin.toISOString(),
                            serviciosExtras: (payload.serviciosExtrasIds || []).map((id) => ({
                                servicioExtraId: id,
                                cantidad: 1,
                            })),
                        },
                    ],
                });

                return HttpDriverRepository.mapBoletaToDriverBooking(boleta);
            }
        } catch (error) {
            console.warn('Error al registrar reserva en el endpoint real de la API:', error);
        }

        // Respaldo reactivo local si la llamada no cuenta con espacioId
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
        try {
            await this.cancelarReserva(bookingId);
        } catch (error) {
            console.warn('No se pudo cancelar la reserva en la API:', error);
        }
        if (HttpDriverRepository.activeBookingState?.id === bookingId) {
            const finishedBooking: DriverBooking = {
                ...HttpDriverRepository.activeBookingState,
                status: 'CANCELLED',
            };
            HttpDriverRepository.bookingsHistoryState = [
                finishedBooking,
                ...HttpDriverRepository.bookingsHistoryState,
            ];
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
