// src/modules/driver/domain/DriverBooking.ts

export type EstadoReserva =
    | 'PENDIENTE_PAGO'
    | 'CONFIRMADA'
    | 'EN_CURSO'
    | 'COMPLETADA'
    | 'CANCELADA';

export type BookingStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | EstadoReserva;

export interface ServicioExtraContratado {
    id?: string;
    servicioExtraId: string;
    nombre: string;
    cantidad: number;
    precioUnitarioAplicado: number;
    subtotal: number;
}

export interface DetalleBoletaEspacio {
    id?: string;
    espacioId: string;
    codigoEspacio: string;
    tipoEspacio: string;
    vehiculoPlaca?: string | null;
    vehiculoModelo?: string | null;
    inicioReserva: string;
    finReserva: string;
    precioUnitarioAplicado: number;
    subtotal: number;
    estado?: string;
    serviciosExtras: ServicioExtraContratado[];
}

export interface BoletaReserva {
    id: string;
    codigoReserva: string;
    qrToken: string;
    total: number;
    estado: EstadoReserva;
    modalidad: 'HORA' | 'DIA' | 'MES';
    estacionamientoId: string;
    estacionamientoNombre: string;
    estacionamientoDireccion: string;
    clienteId: string;
    clienteNombre: string;
    clienteEmail: string;
    operadorNombre?: string | null;
    detalles: DetalleBoletaEspacio[];
    fechaCreacion: string;
}

export interface CotizarServicioExtraItem {
    servicioExtraId: string;
    cantidad?: number;
}

export interface CotizarEspacioItem {
    espacioId: string;
    duracionHoras: number;
    vehiculoId?: string;
    serviciosExtras?: CotizarServicioExtraItem[];
}

export interface CotizarReservaPayload {
    estacionamientoId: string;
    espacios: CotizarEspacioItem[];
}

export interface CotizacionReservaResult {
    estacionamientoNombre: string;
    detallesEspacios: Array<{
        espacioId: string;
        codigoEspacio: string;
        precioBaseUnitario: number;
        duracionHoras: number;
        subtotalBaseEspacio: number;
        serviciosExtras: Array<{
            servicioExtraId: string;
            nombre: string;
            precioUnitario: number;
            cantidad: number;
            subtotal: number;
        }>;
        subtotalTotalEspacio: number;
    }>;
    totalGeneral: number;
}

export interface CrearServicioExtraItem {
    servicioExtraId: string;
    cantidad?: number;
}

export interface CrearEspacioItem {
    espacioId: string;
    inicioReserva: string;
    finReserva: string;
    vehiculoId?: string;
    serviciosExtras?: CrearServicioExtraItem[];
}

export interface CrearReservaPayload {
    estacionamientoId: string;
    modalidad?: 'HORA' | 'DIA' | 'MES';
    clienteId?: string;
    espacios: CrearEspacioItem[];
}

// Interfaz para compatibilidad con vistas previas existentes del dashboard
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
    boletaOriginal?: BoletaReserva;
}

export interface CreateBookingPayload {
    parkingId: string;
    vehiclePlate: string;
    durationHours: number;
    espacioId?: string;
    serviciosExtrasIds?: string[];
    detallesEspacios?: Array<{
        espacioId: string;
        serviciosExtrasIds: string[];
    }>;
}

