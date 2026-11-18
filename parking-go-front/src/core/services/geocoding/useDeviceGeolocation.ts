// src/core/services/geocoding/useDeviceGeolocation.ts
import { useState, useEffect, useCallback } from 'react';
import type { LocationCoordinates } from './geocoding.types';

// Plaza Principal 24 de Septiembre, Santa Cruz de la Sierra (ubicación por defecto si no hay GPS/Wi-Fi)
export const DEFAULT_FALLBACK_COORDINATES: LocationCoordinates = {
    lat: -17.7833,
    lng: -63.1821,
};

export interface UseDeviceGeolocationOptions {
    autoLocate?: boolean;
    fallback?: LocationCoordinates;
    timeoutMs?: number;
}

export interface UseDeviceGeolocationReturn {
    coordinates: LocationCoordinates | null;
    isLocating: boolean;
    hasGpsPermission: boolean;
    isFallback: boolean;
    error: string | null;
    refreshLocation: () => void;
}

const roundCoord = (value: number): number => Number(value.toFixed(6));

/**
 * Obtiene la ubicación geográfica actual del dispositivo mediante la API
 * HTML5 Geolocation con fallback controlado si no hay permisos o soporte.
 */
export const useDeviceGeolocation = (
    options: UseDeviceGeolocationOptions = {},
): UseDeviceGeolocationReturn => {
    const {
        autoLocate = true,
        fallback = DEFAULT_FALLBACK_COORDINATES,
        timeoutMs = 8000,
    } = options;

    const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
    const [isLocating, setIsLocating] = useState<boolean>(autoLocate);
    const [hasGpsPermission, setHasGpsPermission] = useState<boolean>(false);
    const [isFallback, setIsFallback] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const requestPosition = useCallback(() => {
        if (!navigator.geolocation) {
            setError('La geolocalización no es soportada por este navegador.');
            setIsLocating(false);
            setHasGpsPermission(false);
            setIsFallback(true);
            setCoordinates(fallback);
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    lat: roundCoord(position.coords.latitude),
                    lng: roundCoord(position.coords.longitude),
                });
                setHasGpsPermission(true);
                setIsFallback(false);
                setIsLocating(false);
                setError(null);
            },
            (err) => {
                console.warn('No se pudo obtener la ubicación del dispositivo:', err.message);
                setError(err.message);
                setHasGpsPermission(false);
                setIsFallback(true);
                setIsLocating(false);
                setCoordinates((prev) => prev || fallback);
            },
            {
                enableHighAccuracy: true,
                timeout: timeoutMs,
                maximumAge: 60000,
            },
        );
    }, [fallback, timeoutMs]);

    useEffect(() => {
        if (!autoLocate) return;
        requestPosition();
    }, [autoLocate, requestPosition]);

    return {
        coordinates,
        isLocating,
        hasGpsPermission,
        isFallback,
        error,
        refreshLocation: requestPosition,
    };
};

