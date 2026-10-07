import type { Parking } from '../models/Parking';

export interface ParkingRepository {
  getFeaturedParkings(): Promise<Parking[]>;
}
