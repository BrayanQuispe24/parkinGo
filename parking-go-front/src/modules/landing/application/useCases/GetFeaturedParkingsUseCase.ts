import type { Parking } from '../../domain/models/Parking';
import type { ParkingRepository } from '../../domain/repositories/ParkingRepository';

export class GetFeaturedParkingsUseCase {
  private parkingRepository: ParkingRepository;

  constructor(parkingRepository: ParkingRepository) {
    this.parkingRepository = parkingRepository;
  }

  async execute(): Promise<Parking[]> {
    return this.parkingRepository.getFeaturedParkings();
  }
}