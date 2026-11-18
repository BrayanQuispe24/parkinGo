// src/core/services/geocoding/geocoding.types.ts

export interface LocationCoordinates {
    lat: number;
    lng: number;
}

export interface NominatimAddress {
    road?: string;
    pedestrian?: string;
    footway?: string;
    street?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    residential?: string;
    city_district?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
}

export interface NominatimReverseResponse {
    place_id: number;
    licence?: string;
    osm_type?: string;
    osm_id?: number;
    lat: string;
    lon: string;
    display_name: string;
    address?: NominatimAddress;
    boundingbox?: string[];
}

export interface GeocodingResult {
    direccion: string;
    ciudad: string;
    displayName: string;
}
