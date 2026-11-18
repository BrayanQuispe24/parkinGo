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

import { DriverParkingMapper, type CatalogoEstacionamientoApiDto } from './mappers/DriverParkingMapper';

export class HttpDriverRepository implements DriverRepository {
    async getParkings(): Promise<DriverParking[]> {
        const response = await parkingoApi.get<CatalogoEstacionamientoApiDto[]>('/estacionamientos/catalogo');
        if (response?.data && Array.isArray(response.data)) {
            return DriverParkingMapper.toDomainList(response.data);
        }
        return [];
    }

    async getVehicles(): Promise<DriverVehicle[]> {
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
        return [];
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
            pricePerHour: primerDetalle?.precioUnitarioAplicado ?? 0,
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
        const response = await parkingoApi.get<BoletaReserva[]>('/reservas/mis-reservas');
        if (response?.data && Array.isArray(response.data)) {
            return response.data;
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
        const boletas = await this.getMisReservas();
        const activa = boletas.find(
            (b) =>
                b.estado === 'PENDIENTE_PAGO' ||
                b.estado === 'CONFIRMADA' ||
                b.estado === 'EN_CURSO',
        );
        return activa ? HttpDriverRepository.mapBoletaToDriverBooking(activa) : null;
    }

    async getBookingsHistory(): Promise<DriverBooking[]> {
        const boletas = await this.getMisReservas();
        const historicas = boletas.filter(
            (b) => b.estado === 'COMPLETADA' || b.estado === 'CANCELADA',
        );
        return historicas.map((b) => HttpDriverRepository.mapBoletaToDriverBooking(b));
    }

    async createBooking(payload: CreateBookingPayload): Promise<DriverBooking> {
        const ahora = new Date();
        const fin = new Date(ahora.getTime() + payload.durationHours * 60 * 60 * 1000);

        let vehiculoId = payload.vehiculoId;
        if (!vehiculoId && payload.vehiclePlate) {
            try {
                const vehiculos = await this.getVehicles();
                const encontrado = vehiculos.find(
                    (v) => v.plate.toUpperCase().trim() === payload.vehiclePlate.toUpperCase().trim(),
                );
                if (encontrado) {
                    vehiculoId = encontrado.id;
                }
            } catch {
                // Continuar sin vehiculoId si falla la consulta
            }
        }

        if (payload.detallesEspacios && payload.detallesEspacios.length > 0) {
            const boleta = await this.crearReserva({
                estacionamientoId: payload.parkingId,
                espacios: payload.detallesEspacios.map((d) => ({
                    espacioId: d.espacioId,
                    vehiculoId,
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

        let espacioId = payload.espacioId;
        if (!espacioId) {
            const catalogoRes = await parkingoApi.get<CatalogoEstacionamientoApiDto[]>('/estacionamientos/catalogo');
            const parqueo = catalogoRes.data?.find((p) => p.id === payload.parkingId);
            const primerEspacio = parqueo?.espacios?.find((e) => e.estado === 'DISPONIBLE');
            if (primerEspacio) {
                espacioId = primerEspacio.id;
            }
        }

        if (!espacioId) {
            throw new Error('No hay espacios disponibles registrados para este estacionamiento.');
        }

        const boleta = await this.crearReserva({
            estacionamientoId: payload.parkingId,
            espacios: [
                {
                    espacioId,
                    vehiculoId,
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

    async cancelBooking(bookingId: string): Promise<void> {
        await this.cancelarReserva(bookingId);
    }

    async getReviews(): Promise<DriverReview[]> {
        return [];
    }

    async createReview(_payload: CreateReviewPayload): Promise<DriverReview> {
        throw new Error('Las reseñas de conductor se gestionan mediante el módulo de calificaciones vinculado a una reserva.');
    }

    async updateProfile(userId: string, payload: UpdateDriverProfilePayload): Promise<void> {
        await parkingoApi.patch(`/usuarios/${userId}`, payload);
    }
}

export const driverRepository = new HttpDriverRepository();
