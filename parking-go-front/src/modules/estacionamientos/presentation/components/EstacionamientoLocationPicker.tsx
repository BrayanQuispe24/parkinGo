import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

interface EstacionamientoLocationPickerProps {
  coordinates: LocationCoordinates | null;
  onChangeCoordinates: (coords: LocationCoordinates | null) => void;
  disabled?: boolean;
}

// Icono personalizado ParkinGo para el marcador del estacionamiento
const createParkingPinIcon = () => {
  return L.divIcon({
    className: 'parking-location-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #006D36 0%, #063D25 100%);
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 109, 54, 0.45);
        border: 2px solid #FFFFFF;
        cursor: grab;
      ">
        <i class="fa-solid fa-square-parking" style="
          transform: rotate(45deg);
          color: #FFFFFF;
          font-size: 16px;
        "></i>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });
};

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

export const EstacionamientoLocationPicker: React.FC<EstacionamientoLocationPickerProps> = ({
  coordinates,
  onChangeCoordinates,
  disabled = false,
}) => {
  // Centro por defecto: Bolivia (-17.3935, -66.1570 Cochabamba / -17.7833, -63.1880 Santa Cruz)
  const defaultCenter: [number, number] = [-17.3935, -66.157];
  const markerIcon = useMemo(() => createParkingPinIcon(), []);
  const markerRef = useRef<L.Marker | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Detección automática mediante HTML5 Geolocation API
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
      },
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleDetectCurrentLocation}
            disabled={disabled || isLocating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
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
            {isLocating ? 'Detectando GPS...' : 'Usar mi ubicación actual (GPS)'}
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
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <i className="fa-solid fa-trash-can" style={{ fontSize: '0.75rem', color: '#EF4444' }}></i>
              Quitar marcador
            </button>
          )}
        </div>

        {/* Badge de coordenadas seleccionadas */}
        <div style={{ fontSize: '0.8rem', color: '#475569' }}>
          {coordinates ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.65rem',
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '6px',
                color: '#065F46',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              <i className="fa-solid fa-map-pin" style={{ color: '#006D36' }}></i>
              Lat: {coordinates.lat.toFixed(6)}, Lng: {coordinates.lng.toFixed(6)}
            </span>
          ) : (
            <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>
              Sin coordenadas fijadas (Haz clic en el mapa)
            </span>
          )}
        </div>
      </div>

      {/* Error de geolocalización */}
      {geoError && (
        <div
          style={{
            padding: '0.5rem 0.75rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            color: '#991B1B',
            fontSize: '0.8rem',
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
          height: '280px',
          width: '100%',
          borderRadius: '10px',
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

          <MapClickHandler
            onPickLocation={(coords) => onChangeCoordinates(coords)}
            disabled={disabled}
          />

          <MapCenterUpdater coords={coordinates} />

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

      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
        💡 <strong>Tip:</strong> Puedes hacer clic directamente sobre el mapa, arrastrar el pin para
        ajustar la entrada del parqueo, o pulsar en <em>"Usar mi ubicación actual"</em>.
      </p>
    </div>
  );
};
