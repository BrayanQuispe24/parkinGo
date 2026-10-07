import { useState, useEffect } from 'react';
import type { Parking } from '../../domain/models/Parking';
import { GetFeaturedParkingsUseCase } from '../../application/useCases/GetFeaturedParkingsUseCase';
import { MockParkingRepository } from '../../infrastructure/repositories/MockParkingRepository';

// Instanciación manual (idealmente usar contenedor DI)
const repository = new MockParkingRepository();
const getFeaturedParkingsUseCase = new GetFeaturedParkingsUseCase(repository);

export function useFeaturedParkings() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getFeaturedParkingsUseCase.execute()
      .then(setParkings)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { parkings, loading, error };
}
