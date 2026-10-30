// src/modules/driver/domain/DriverVehicle.ts

export type TipoVehiculo = 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO' | 'OTRO';

export interface DriverVehicle {
    id: string;
    plate: string;
    brand?: string;
    model: string;
    color: string;
    vehicleType: TipoVehiculo;
    isDefault: boolean;
    createdAt?: string;
}

export interface CreateVehiclePayload {
    plate: string;
    brand?: string;
    model: string;
    color: string;
    vehicleType: TipoVehiculo;
    isDefault?: boolean;
}
