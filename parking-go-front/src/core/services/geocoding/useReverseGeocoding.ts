// src/core/services/geocoding/useReverseGeocoding.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GeocodingService } from './geocodingService';
import type { GeocodingResult, LocationCoordinates } from './geocoding.types';

export const REVERSE_GEOCODE_QUERY_KEY = 'reverse-geocode';

/**
 * Formatea un resultado de geocodificación en una dirección legible completa
 * evitando duplicar la ciudad si ya forma parte de la cadena de dirección.
 */
export const formatGeocodingAddress = (result: GeocodingResult): string => {
    const direccion = result.direccion.trim();
    const ciudad = result.ciudad.trim();

    if (!direccion) {
        return ciudad || result.displayName.trim();
    }

    if (ciudad && !direccion.toLowerCase().includes(ciudad.toLowerCase())) {
        return `${direccion}, ${ciudad}`;
    }

    return direccion;
};

/**
 * Hook compartido para geocodificación inversa disparada por interacción en el mapa.
 * Utiliza TanStack Query para deduplicar, cachear por coordenadas y exponer isPending.
 */
export const useReverseGeocodingMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<GeocodingResult, Error, LocationCoordinates>({
        mutationFn: async (coords: LocationCoordinates) => {
            const cacheKey = [REVERSE_GEOCODE_QUERY_KEY, coords.lat, coords.lng];
            const cached = queryClient.getQueryData<GeocodingResult>(cacheKey);
            if (cached) {
                return cached;
            }

            const result = await GeocodingService.reverseGeocode(coords.lat, coords.lng);
            queryClient.setQueryData(cacheKey, result);
            return result;
        },
    });
};

