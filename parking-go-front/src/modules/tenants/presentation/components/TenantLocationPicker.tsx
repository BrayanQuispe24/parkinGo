// src/modules/tenants/presentation/components/TenantLocationPicker.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LocationCoordinates } from '../../domain/Tenant';

interface TenantLocationPickerProps {
    coordinates: LocationCoordinates | null;
    onChangeCoordinates: (coords: LocationCoordinates | null) => void;
    disabled?: boolean;
}

// Icono personalizado ParkinGo para el marcador en el mapa
const createCompanyPinIcon = () => {
    return L.divIcon({
        className: 'company-location-pin',
        html: `
            <div style="
                background: linear-gradient(135deg, #006D36 0%, #063D25 100%);
                width: 36px;
                height: 36px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 109, 54, 0.45);
                border: 2px solid #FFFFFF;
                cursor: grab;
            ">
                <i class="fa-solid fa-building" style="
                    transform: rotate(45deg);
                    color: #FFFFFF;
                    font-size: 14px;
                "></i>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    });
};

// Subcomponente para capturar clics en el mapa
function MapClickHandler({
    onPickLocation,
    disabled,
}: {
    onPickLocation: (coords: LocationCoordinates) => void;
    disabled?: boolean;
}) {
    useMapEvents({
        click(e) {
            if (disabled) return;
            onPickLocation({
                lat: Number(e.latlng.lat.toFixed(6)),
                lng: Number(e.latlng.lng.toFixed(6)),
            });
        },
    });
    return null;
}

// Subcomponente para centrar el mapa suavemente cuando cambian las coordenadas externamente
function MapCenterUpdater({ coords }: { coords: LocationCoordinates | null }) {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 15), {
                duration: 1.2,
            });
        }
    }, [coords, map]);
    return null;
}

export const TenantLocationPicker: React.FC<TenantLocationPickerProps> = ({
    coordinates,
    onChangeCoordinates,
    disabled = false,
}) => {
    // Coordenadas por defecto (Santa Cruz de la Sierra, Bolivia)
    const defaultCenter: [number, number] = [-17.7833, -63.188];
    const markerIcon = useMemo(() => createCompanyPinIcon(), []);
    const markerRef = useRef<L.Marker | null>(null);

    const [isLocating, setIsLocating] = useState(false);
    const [geoError, setGeoError] = useState<string | null>(null);

    // Detección automática mediante HTML5 Geolocation API (Opción 2)
    const handleDetectCurrentLocation = () => {
        if (disabled) return;
        setGeoError(null);

        if (!navigator.geolocation) {
            setGeoError('Tu navegador no soporta geolocalización GPS.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                onChangeCoordinates({
                    lat: Number(position.coords.latitude.toFixed(6)),
                    lng: Number(position.coords.longitude.toFixed(6)),
                });
            },
            (error) => {
                setIsLocating(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setGeoError('Permiso de ubicación denegado por el navegador.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setGeoError('La señal GPS no está disponible en este momento.');
                        break;
                    case error.TIMEOUT:
                        setGeoError('Tiempo de espera agotado al consultar ubicación.');
                        break;
                    default:
                        setGeoError('No se pudo obtener tu ubicación actual.');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    const handleClearLocation = () => {
        if (disabled) return;
        setGeoError(null);
        onChangeCoordinates(null);
    };

    return (
        <div style={{ marginTop: '0.5rem' }}>
            {/* Barra de Herramientas de Ubicación */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.6rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={handleDetectCurrentLocation}
                        disabled={disabled || isLocating}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid #BBF7D0',
                            background: '#F0FDF4',
                            color: '#166534',
                            cursor: disabled || isLocating ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <i
                            className={`fa-solid ${
                                isLocating ? 'fa-spinner fa-spin' : 'fa-location-crosshairs'
                            }`}
                            style={{ color: '#006D36' }}
                        ></i>
                        {isLocating ? 'Detectando GPS...' : 'Usar mi ubicación actual'}
                    </button>

                    {coordinates && (
                        <button
                            type="button"
                            onClick={handleClearLocation}
                            disabled={disabled}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                borderRadius: '6px',
                                border: '1px solid #E2E8F0',
                                background: '#FFFFFF',
                                color: '#64748B',
                                cursor: disabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <i className="fa-solid fa-trash-can" style={{ fontSize: '0.75rem', color: '#EF4444' }}></i>
                            Quitar pin GPS
                        </button>
                    )}
                </div>

                {/* Badge de estado de coordenadas */}
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                    {coordinates ? (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.2rem 0.55rem',
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                borderRadius: '4px',
                                color: '#065F46',
                                fontFamily: 'monospace',
                                fontWeight: 600,
                            }}
                        >
                            <i className="fa-solid fa-map-pin" style={{ color: '#006D36' }}></i>
                            {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                        </span>
                    ) : (
                        <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>
                            Sin coordenadas GPS (Haz clic en el mapa)
                        </span>
                    )}
                </div>
            </div>

            {/* Mensaje de advertencia o error GPS si ocurre */}
            {geoError && (
                <div
                    style={{
                        padding: '0.45rem 0.75rem',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '6px',
                        color: '#991B1B',
                        fontSize: '0.75rem',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                    }}
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>{geoError}</span>
                </div>
            )}

            {/* Contenedor del Mapa Leaflet */}
            <div
                style={{
                    height: '240px',
                    width: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #CBD5E1',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                    position: 'relative',
                }}
            >
                <MapContainer
                    center={coordinates ? [coordinates.lat, coordinates.lng] : defaultCenter}
                    zoom={coordinates ? 15 : 13}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Listener de clic sobre el mapa */}
                    <MapClickHandler
                        onPickLocation={(coords) => onChangeCoordinates(coords)}
                        disabled={disabled}
                    />

                    {/* Centrador de vista automático */}
                    <MapCenterUpdater coords={coordinates} />

                    {/* Marcador Arrastrable si hay coordenadas */}
                    {coordinates && (
                        <Marker
                            position={[coordinates.lat, coordinates.lng]}
                            icon={markerIcon}
                            draggable={!disabled}
                            ref={markerRef}
                            eventHandlers={{
                                dragend() {
                                    const marker = markerRef.current;
                                    if (marker) {
                                        const latLng = marker.getLatLng();
                                        onChangeCoordinates({
                                            lat: Number(latLng.lat.toFixed(6)),
                                            lng: Number(latLng.lng.toFixed(6)),
                                        });
                                    }
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.72rem', color: '#94A3B8' }}>
                💡 Puedes hacer clic directamente sobre el mapa o arrastrar el marcador para precisar la ubicación.
            </p>
        </div>
    );
};
