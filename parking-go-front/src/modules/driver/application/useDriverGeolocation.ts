// src/modules/driver/application/useDriverGeolocation.ts
import { useState, useEffect, useCallback } from 'react';
import type { Coordinates } from '../../../core/utils/geoDistance';

export interface UseDriverGeolocationReturn {
  coordinates: Coordinates | null;
  isLocating: boolean;
  hasGpsPermission: boolean;
  error: string | null;
  refreshLocation: () => void;
}

// Ubicación por defecto de referencia (Cochabamba / Santa Cruz) si no hay GPS
const DEFAULT_FALLBACK_COORDINATES: Coordinates = {
  lat: -17.3935,
  lng: -66.157,
};

export const useDriverGeolocation = (): UseDriverGeolocationReturn => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);
  const [hasGpsPermission, setHasGpsPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const requestPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no es soportada por este navegador.');
      setIsLocating(false);
      setCoordinates(DEFAULT_FALLBACK_COORDINATES);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setHasGpsPermission(true);
        setIsLocating(false);
        setError(null);
      },
      (err) => {
        console.warn('No se pudo obtener la ubicación GPS precisa del conductor:', err.message);
        setError(err.message);
        setHasGpsPermission(false);
        setIsLocating(false);
        // Si no hay coordenadas previas, aplicar fallback
        setCoordinates((prev) => prev || DEFAULT_FALLBACK_COORDINATES);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  }, []);

  useEffect(() => {
    requestPosition();
  }, [requestPosition]);

  return {
    coordinates,
    isLocating,
    hasGpsPermission,
    error,
    refreshLocation: requestPosition,
  };
};
