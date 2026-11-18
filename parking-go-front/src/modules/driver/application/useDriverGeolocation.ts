// src/modules/driver/application/useDriverGeolocation.ts
import type { Coordinates } from '../../../core/utils/geoDistance';
import {
  DEFAULT_FALLBACK_COORDINATES,
  useDeviceGeolocation,
} from '../../../core/services/geocoding/useDeviceGeolocation';

export interface UseDriverGeolocationReturn {
  coordinates: Coordinates | null;
  isLocating: boolean;
  hasGpsPermission: boolean;
  isFallback: boolean;
  error: string | null;
  refreshLocation: () => void;
}

/**
 * Obtiene la ubicación del conductor usando el servicio compartido de geolocalización.
 * Si el dispositivo no dispone de GPS o Wi-Fi, posiciona por defecto en Plaza 24 de Septiembre.
 */
export const useDriverGeolocation = (): UseDriverGeolocationReturn => {
  return useDeviceGeolocation({
    autoLocate: true,
    fallback: DEFAULT_FALLBACK_COORDINATES,
    timeoutMs: 8000,
  });
};
