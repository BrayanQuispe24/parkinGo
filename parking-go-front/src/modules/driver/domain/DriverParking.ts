// src/modules/driver/domain/DriverParking.ts

export type ParkingTag = 'all' | 'ev' | 'cubierto' | 'seguridad';

export type SpaceType = 'AUTO' | 'MOTO' | 'CAMIONETA' | 'DISCAPACITADO' | 'ELECTRICO';
export type SpaceStatus = 'DISPONIBLE' | 'OCUPADO' | 'RESERVADO' | 'MANTENIMIENTO';

export interface DriverParkingSpace {
    id: string;
    code: string;
    type: SpaceType | string;
    level: string;
    levelId?: string;
    status: SpaceStatus | string;
}

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
    latitude?: number;
    longitude?: number;
    mapPosition?: {
        topPercent: number;
        leftPercent: number;
    };
    distanceKm: number;
    estimatedMinutes: number;
    isFavorite?: boolean;
    fotos?: string[];
    horarios?: Array<{ dia: string; horaInicio: string; horaCierre: string }>;
    tarifas?: Array<{ id: string; descripcion: string; monto: number; modalidad: string }>;
    serviciosExtras?: Array<{ id: string; nombre: string; precio: number }>;
    spaces?: DriverParkingSpace[];
}
