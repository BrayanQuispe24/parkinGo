// src/modules/driver/domain/DriverVehicle.ts

export interface DriverVehicle {
    id: string;
    plate: string;
    brand: string;
    model: string;
    color: string;
    vehicleType: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO';
    isDefault: boolean;
    createdAt?: string;
}

export interface CreateVehiclePayload {
    plate: string;
    brand: string;
    model: string;
    color: string;
    vehicleType: 'SEDAN' | 'SUV' | 'CAMIONETA' | 'MOTO' | 'ELECTRICO';
}
