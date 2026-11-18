// src/core/services/geocoding/geocodingService.ts
import type { GeocodingResult, NominatimReverseResponse } from './geocoding.types';

export class GeocodingService {
    private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/reverse';

    /**
     * Obtiene los datos legibles de dirección y ciudad a partir de coordenadas GPS
     * utilizando OpenStreetMap Nominatim.
     */
    static async reverseGeocode(
        lat: number,
        lng: number,
        signal?: AbortSignal
    ): Promise<GeocodingResult> {
        const url = new URL(this.NOMINATIM_BASE_URL);
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('lat', lat.toString());
        url.searchParams.set('lon', lng.toString());
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('accept-language', 'es');

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            signal,
        });

        if (!response.ok) {
            throw new Error(`Error en servicio de geocodificación: ${response.statusText}`);
        }

        const data: NominatimReverseResponse = await response.json();
        return this.mapToGeocodingResult(data);
    }

    private static mapToGeocodingResult(data: NominatimReverseResponse): GeocodingResult {
        const addr = data.address || {};

        // 1. Resolver Calle o Vía principal
        const road = addr.road || addr.pedestrian || addr.street || addr.footway || '';
        const houseNumber = addr.house_number ? `#${addr.house_number}` : '';
        const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || '';

        let direccion = '';
        if (road) {
            const streetWithNum = houseNumber ? `${road} ${houseNumber}` : road;
            if (neighborhood && !streetWithNum.toLowerCase().includes(neighborhood.toLowerCase())) {
                const cleanNeighborhood = neighborhood.replace(/^Barrio\s+/i, '');
                direccion = `${streetWithNum}, Barrio ${cleanNeighborhood}`;
            } else {
                direccion = streetWithNum;
            }
        } else {
            // Fallback si no hay nombre de calle: primeros fragmentos de display_name
            const fragments = data.display_name.split(',').map((f) => f.trim()).filter(Boolean);
            direccion = fragments.slice(0, 2).join(', ');
        }

        // 2. Resolver Ciudad / Municipio
        let rawCity = addr.city || addr.town || addr.municipality || addr.village || addr.county || '';
        if (!rawCity && addr.state) {
            rawCity = addr.state;
        }

        // Limpiar prefijos comunes como "Municipio de " o "Municipio "
        const cleanedCity = rawCity
            .replace(/^Municipio\s+(de\s+)?/i, '')
            .replace(/^Provincia\s+(de\s+)?/i, '')
            .trim();

        return {
            direccion: direccion || data.display_name || '',
            ciudad: cleanedCity || rawCity || '',
            displayName: data.display_name || '',
        };
    }
}
