import type { EspacioRealtimeEvent } from '../../../core/realtime/realtimeEvents';
import type {
  DriverParking,
  DriverParkingSpace,
} from '../domain/DriverParking';

function mapEventToDriverSpace(
  event: EspacioRealtimeEvent,
  existing?: DriverParkingSpace,
): DriverParkingSpace {
  return {
    id: event.espacioId,
    code: event.codigoEspacio,
    type: event.tipo,
    level: event.nivelCodigo ?? existing?.level ?? 'Nivel',
    levelId: event.nivelId,
    status: event.estado,
  };
}

export function applyEspacioEventToParkings(
  parkings: DriverParking[] | undefined,
  event: EspacioRealtimeEvent,
): DriverParking[] | undefined {
  if (!parkings || parkings.length === 0) {
    return parkings;
  }

  let didChange = false;

  const updatedParkings = parkings.map((parking) => {
    if (parking.id !== event.estacionamientoId) {
      return parking;
    }

    didChange = true;
    const currentSpaces = parking.spaces ? [...parking.spaces] : [];
    const existingIndex = currentSpaces.findIndex(
      (space) => space.id === event.espacioId,
    );

    let nextSpaces: DriverParkingSpace[];

    if (event.action === 'DELETED') {
      nextSpaces = currentSpaces.filter(
        (space) => space.id !== event.espacioId,
      );
    } else if (existingIndex >= 0) {
      const existing = currentSpaces[existingIndex];
      currentSpaces[existingIndex] = mapEventToDriverSpace(event, existing);
      nextSpaces = currentSpaces;
    } else {
      nextSpaces = [...currentSpaces, mapEventToDriverSpace(event)];
    }

    const availableCount = nextSpaces.filter(
      (space) => space.status === 'DISPONIBLE',
    ).length;

    return {
      ...parking,
      spaces: nextSpaces,
      totalSpots: nextSpaces.length,
      availableSpots: availableCount,
    };
  });

  return didChange ? updatedParkings : parkings;
}

