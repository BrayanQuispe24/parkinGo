import { TipoVehiculo, Vehiculo } from '@prisma/client';

export interface CreateVehiculoData {
  tipo: TipoVehiculo;
  placa: string;
  modelo: string;
  color: string;
  propietarioId: string;
  esPredeterminado?: boolean;
}

export abstract class VehiculoRepository {
  abstract create(data: CreateVehiculoData): Promise<Vehiculo>;
  abstract findByPropietarioId(propietarioId: string): Promise<Vehiculo[]>;
  abstract findByPlaca(placa: string): Promise<Vehiculo | null>;
  abstract findById(id: string): Promise<Vehiculo | null>;
  abstract setPredeterminado(id: string, propietarioId: string): Promise<Vehiculo>;
  abstract delete(id: string): Promise<void>;
  abstract countByPropietarioId(propietarioId: string): Promise<number>;
}
