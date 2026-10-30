// src/core/utils/geoDistance.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Radio medio de la Tierra en kilómetros.
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convierte grados a radianes.
 */
const toRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Calcula la distancia ortodrómica en kilómetros entre dos coordenadas geográficas
 * utilizando la fórmula del Haversine.
 */
export const calculateHaversineDistance = (
  from: Coordinates,
  to: Coordinates,
): number => {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);

  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 10) / 10;
};

/**
 * Estima los minutos de conducción urbana asumiendo una velocidad promedio (por defecto 25 km/h).
 * Asegura un mínimo de 1 minuto si hay distancia.
 */
export const estimateDrivingMinutes = (
  distanceKm: number,
  averageSpeedKmh: number = 25,
): number => {
  if (distanceKm <= 0.05) return 1;
  const hours = distanceKm / averageSpeedKmh;
  const minutes = Math.round(hours * 60);
  return Math.max(1, minutes);
};

/**
 * Formatea una distancia en metros si es menor a 1 km o en kilómetros con 1 decimal.
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};
