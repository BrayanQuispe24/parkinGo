// src/modules/estacionamientos/application/useParkingLocationState.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LocationCoordinates } from '../../../core/services/geocoding/geocoding.types';
import { useDeviceGeolocation } from '../../../core/services/geocoding/useDeviceGeolocation';
import {
    formatGeocodingAddress,
    useReverseGeocodingMutation,
} from '../../../core/services/geocoding/useReverseGeocoding';

interface UseParkingLocationStateOptions {
    onCoordinatesApplied?: (coords: LocationCoordinates | null) => void;
}

export interface UseParkingLocationStateReturn {
    coordinates: LocationCoordinates | null;
    direccion: string;
    isLocatingDevice: boolean;
    isResolvingAddress: boolean;
    handleDireccionInputChange: (value: string) => void;
    handleCoordinatesChange: (newCoords: LocationCoordinates | null) => Promise<void>;
    setManualCoordinates: (coords: LocationCoordinates | null) => void;
}

/**
 * Orquesta la ubicación inicial desde el dispositivo (con fallback seguro),
 * el marcado manual en el mapa y el autocompletado de dirección con TanStack Query.
 */
export const useParkingLocationState = (
    options: UseParkingLocationStateOptions = {},
): UseParkingLocationStateReturn => {
    const { onCoordinatesApplied } = options;

    const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(null);
    const [direccion, setDireccion] = useState<string>('');

    const hasUserPickedCoordsRef = useRef<boolean>(false);
    const hasUserTypedAddressRef = useRef<boolean>(false);
    const hasAppliedInitialDeviceGeoRef = useRef<boolean>(false);
    const onCoordinatesAppliedRef = useRef(onCoordinatesApplied);
    onCoordinatesAppliedRef.current = onCoordinatesApplied;

    const deviceGeo = useDeviceGeolocation();
    const reverseGeocodeMutation = useReverseGeocodingMutation();
    const mutateReverseGeocode = reverseGeocodeMutation.mutateAsync;

    const resolveAddressForCoords = useCallback(
        async (coords: LocationCoordinates, overwriteManualAddress: boolean) => {
            try {
                const result = await mutateReverseGeocode(coords);
                const resolved = formatGeocodingAddress(result);
                if (!resolved) return;

                if (overwriteManualAddress || !hasUserTypedAddressRef.current) {
                    setDireccion(resolved);
                }
            } catch (err: unknown) {
                console.warn('No se pudo autocompletar la dirección por coordenadas:', err);
            }
        },
        [mutateReverseGeocode],
    );

    useEffect(() => {
        if (!deviceGeo.coordinates) return;
        if (hasUserPickedCoordsRef.current || hasAppliedInitialDeviceGeoRef.current) return;

        hasAppliedInitialDeviceGeoRef.current = true;
        setCoordinates(deviceGeo.coordinates);
        onCoordinatesAppliedRef.current?.(deviceGeo.coordinates);

        if (!deviceGeo.isFallback) {
            void resolveAddressForCoords(deviceGeo.coordinates, false);
        }
    }, [deviceGeo.coordinates, deviceGeo.isFallback, resolveAddressForCoords]);

    const handleDireccionInputChange = useCallback((value: string) => {
        hasUserTypedAddressRef.current = value.trim().length > 0;
        setDireccion(value);
    }, []);

    const handleCoordinatesChange = useCallback(
        async (newCoords: LocationCoordinates | null) => {
            hasUserPickedCoordsRef.current = true;
            setCoordinates(newCoords);
            onCoordinatesAppliedRef.current?.(newCoords);

            if (!newCoords) return;
            await resolveAddressForCoords(newCoords, true);
        },
        [resolveAddressForCoords],
    );

    const setManualCoordinates = useCallback((coords: LocationCoordinates | null) => {
        hasUserPickedCoordsRef.current = true;
        setCoordinates(coords);
    }, []);

    return {
        coordinates,
        direccion,
        isLocatingDevice: deviceGeo.isLocating,
        isResolvingAddress: reverseGeocodeMutation.isPending,
        handleDireccionInputChange,
        handleCoordinatesChange,
        setManualCoordinates,
    };
};

