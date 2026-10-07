import type { ParkingRepository } from '../../domain/repositories/ParkingRepository';
import type { Parking } from '../../domain/models/Parking';

export class MockParkingRepository implements ParkingRepository {
  async getFeaturedParkings(): Promise<Parking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Parqueo Centro Empresarial',
            type: 'Comercial',
            address: 'Calle 24 de Septiembre, Santa Cruz',
            pricePerHour: 15,
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1590674899484-131297b1eb2b?w=800&q=80',
            isAvailable: true
          },
          {
            id: '2',
            name: 'Garaje Residencial Norte',
            type: 'Residencial',
            address: 'Equipetrol Calle 5',
            pricePerHour: 10,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80',
            isAvailable: true
          },
          {
            id: '3',
            name: 'Lote Seguro Banzer',
            type: 'Lote',
            address: 'Av. Banzer 4to Anillo',
            pricePerHour: 8,
            rating: 4.2,
            imageUrl: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&q=80',
            isAvailable: false
          }
        ]);
      }, 800);
    });
  }
}
