// src/modules/driver/presentation/components/InteractiveGpsMap.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { DriverParking } from '../../domain/DriverParking';
import { useDriverGeolocation } from '../../application/useDriverGeolocation';
import {
  calculateHaversineDistance,
  estimateDrivingMinutes,
  formatDistance,
  type Coordinates,
} from '../../../../core/utils/geoDistance';
import '../styles/driver-gps-map.css';

interface InteractiveGpsMapProps {
  parkings: DriverParking[];
  onSelectParking: (parking: DriverParking) => void;
  selectedParkingId?: string;
  onHoverParking?: (parkingId: string | null) => void;
}

// Icono personalizado para el Conductor (GPS en vivo)
const createDriverUserIcon = () => {
  return L.divIcon({
    className: 'driver-leaflet-marker',
    html: `
      <div class="driver-gps-user-pin" title="Tu ubicación GPS actual">
        <div class="driver-gps-user-pulse"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Icono personalizado ParkinGo para cada estacionamiento
const createParkingPinIcon = (
  parking: DriverParking,
  isSelected: boolean,
) => {
  const isFull = parking.availableSpots <= 0;
  const isLow = parking.availableSpots <= 5;
  const bg = isSelected ? '#006D36' : isFull ? '#DC2626' : isLow ? '#D97706' : '#006D36';

  const cleanName = parking.name.replace('ParkinGo ', '').trim();

  return L.divIcon({
    className: 'driver-leaflet-marker',
    html: `
      <div 
        class="driver-map-pin-badge ${isSelected ? 'is-selected' : ''}" 
        style="background: ${bg};"
        title="${parking.name} - ${parking.availableSpots} plazas libres"
      >
        <i class="fa-solid fa-square-parking" style="font-size: 0.85rem;"></i>
        <span>${cleanName} (${parking.availableSpots} Plazas) – Bs ${parking.pricePerHour}/h</span>
      </div>
    `,
    iconSize: [220, 36],
    iconAnchor: [110, 18],
  });
};

// Controlador interno de Leaflet para centrado suave, ajuste de límites e invalidación de tamaño
interface MapControllerProps {
  centerCoords: Coordinates;
  targetFlyCoords: Coordinates | null;
  parkings: DriverParking[];
}

const MapController: React.FC<MapControllerProps> = ({
  centerCoords,
  targetFlyCoords,
  parkings,
}) => {
  const map = useMap();
  const hasFittedBoundsRef = useRef<boolean>(false);

  // Asegurar que el mapa no se renderice con tiles grises o cortados al montarse
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  // Si el usuario hace click en un parqueo, volar hacia él
  useEffect(() => {
    if (targetFlyCoords) {
      map.flyTo([targetFlyCoords.lat, targetFlyCoords.lng], 16, {
        duration: 1.2,
      });
    }
  }, [map, targetFlyCoords]);

  // Encuadrar todos los puntos al cargar por primera vez si hay parqueos
  useEffect(() => {
    if (parkings.length > 0 && !hasFittedBoundsRef.current) {
      const validPoints: [number, number][] = parkings
        .filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number')
        .map((p) => [p.latitude as number, p.longitude as number]);

      if (validPoints.length > 0) {
        // Incluir la posición del usuario en el encuadre inicial
        validPoints.push([centerCoords.lat, centerCoords.lng]);
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        hasFittedBoundsRef.current = true;
      }
    }
  }, [map, parkings, centerCoords]);

  return null;
};

export const InteractiveGpsMap: React.FC<InteractiveGpsMapProps> = ({
  parkings,
  onSelectParking,
  selectedParkingId: externalSelectedId,
}) => {
  // Geolocalización del Conductor
  const { coordinates: userCoords, isLocating, refreshLocation } = useDriverGeolocation();

  // Coordenadas base de referencia
  const driverPosition: Coordinates = userCoords || {
    lat: -17.3935,
    lng: -66.157,
  };

  // Parqueo seleccionado local o externamente
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    parkings[0]?.id || '',
  );

  const activeParkingId = externalSelectedId || internalSelectedId;

  // Coordenadas para volar al seleccionar un marcador
  const [flyToCoords, setFlyToCoords] = useState<Coordinates | null>(null);

  // Calcular distancias y tiempos reales desde la posición del conductor
  const parkingsWithDistance = useMemo(() => {
    return parkings.map((p) => {
      const lat = typeof p.latitude === 'number' && p.latitude !== 0 ? p.latitude : -17.3935;
      const lng = typeof p.longitude === 'number' && p.longitude !== 0 ? p.longitude : -66.157;
      const pCoords: Coordinates = { lat, lng };

      const distanceKm = calculateHaversineDistance(driverPosition, pCoords);
      const estimatedMinutes = estimateDrivingMinutes(distanceKm);

      return {
        ...p,
        latitude: lat,
        longitude: lng,
        realDistanceKm: distanceKm,
        realEstimatedMinutes: estimatedMinutes,
      };
    });
  }, [parkings, driverPosition]);

  // Determinar el parqueo más cercano al conductor en tiempo real
  const closestParking = useMemo(() => {
    if (parkingsWithDistance.length === 0) return null;
    return [...parkingsWithDistance].sort(
      (a, b) => a.realDistanceKm - b.realDistanceKm,
    )[0];
  }, [parkingsWithDistance]);

  const activeParking =
    parkingsWithDistance.find((p) => p.id === activeParkingId) ||
    closestParking ||
    parkingsWithDistance[0];

  const handleSelect = (parking: (typeof parkingsWithDistance)[0]) => {
    setInternalSelectedId(parking.id);
    setFlyToCoords({ lat: parking.latitude, lng: parking.longitude });
  };

  const handleRecenter = () => {
    refreshLocation();
    setFlyToCoords(driverPosition);
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #CBD5CE',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        marginBottom: '1.5rem',
      }}
    >
      {/* Header del Mapa con indicador de baliza GPS */}
      <div
        style={{
          padding: '0.65rem 1.15rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#0F172A',
          }}
        >
          <i className="fa-solid fa-map-location-dot" style={{ color: '#006D36' }}></i>
          <span>Mapa de Disponibilidad en Vivo</span>
        </div>

        <div
          style={{
            fontSize: '0.74rem',
            color: '#64748B',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <span className="driver-gps-beacon-wrapper">
            <span className="driver-gps-beacon-ping"></span>
            <span className="driver-gps-beacon-dot"></span>
          </span>
          <span>
            {isLocating
              ? 'OBTENIENDO GPS...'
              : `UBICACIÓN: ${activeParking?.zone ? activeParking.zone.toUpperCase() : 'ZONA METROPOLITANA'}`}
          </span>
        </div>
      </div>

      {/* Contenedor del Mapa Leaflet Cartográfico */}
      <div className="driver-map-leaflet-container">
        {/* Botón flotante de Recentrado GPS */}
        <button
          type="button"
          onClick={handleRecenter}
          className="driver-map-recenter-btn"
          title="Centrar mapa en mi ubicación GPS actual"
        >
          <i className="fa-solid fa-crosshairs" style={{ color: '#006D36' }}></i>
          <span>Mi Ubicación</span>
        </button>

        <MapContainer
          center={[driverPosition.lat, driverPosition.lng]}
          zoom={14}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            centerCoords={driverPosition}
            targetFlyCoords={flyToCoords}
            parkings={parkingsWithDistance}
          />

          {/* Marcador de Tu Ubicación GPS */}
          <Marker position={[driverPosition.lat, driverPosition.lng]} icon={createDriverUserIcon()}>
            <Popup>
              <div style={{ padding: '0.45rem 0.65rem', textAlign: 'center' }}>
                <strong style={{ fontSize: '0.82rem', color: '#1E293B', display: 'block' }}>
                  Tu Posición Actual
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  GPS de búsqueda activo
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Marcadores de los Estacionamientos Disponibles */}
          {parkingsWithDistance.map((p) => {
            const isSelected = p.id === activeParking?.id;

            return (
              <Marker
                key={p.id}
                position={[p.latitude, p.longitude]}
                icon={createParkingPinIcon(p, isSelected)}
                eventHandlers={{
                  click: () => handleSelect(p),
                }}
              >
                <Popup>
                  <div className="driver-leaflet-popup-card">
                    {p.photoUrl && (
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="driver-leaflet-popup-img"
                      />
                    )}
                    <div className="driver-leaflet-popup-body">
                      <h4 className="driver-leaflet-popup-title">{p.name}</h4>
                      <div className="driver-leaflet-popup-address">
                        <i className="fa-solid fa-location-dot" style={{ color: '#006D36' }}></i>
                        <span>{p.address}</span>
                      </div>

                      <div className="driver-leaflet-popup-meta">
                        <div>
                          <span style={{ fontSize: '0.68rem', color: '#64748B', display: 'block' }}>
                            Tarifa
                          </span>
                          <span className="driver-leaflet-popup-price">
                            Bs. {p.pricePerHour}/h
                          </span>
                        </div>
                        <span
                          className={`driver-leaflet-popup-badge ${
                            p.availableSpots <= 5 ? 'low' : 'avail'
                          }`}
                        >
                          {p.availableSpots} Libres
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectParking(p)}
                        className="driver-leaflet-popup-btn"
                      >
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>Reservar Plaza Ahora</span>
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Tarjeta Flotante Inferior: Parqueo Más Cercano o Seleccionado */}
        {activeParking && (
          <div
            className="driver-map-floating-card"
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #CBD5CE',
              borderRadius: '8px',
              padding: '0.75rem 1.15rem',
              boxShadow: '0 4px 15px rgba(23, 33, 27, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              zIndex: 1000,
            }}
          >
            <div style={{ minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fa-solid fa-car-side" style={{ color: '#006D36' }}></i>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                  {activeParking.id === closestParking?.id ? 'Más cercano: ' : 'Seleccionado: '}
                  {activeParking.name} ({formatDistance(activeParking.realDistanceKm)})
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>
                Tiempo estimado: {activeParking.realEstimatedMinutes} mins • Lectura de placa automatizada
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectParking(activeParking)}
              className="driver-btn-reserve"
              style={{
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.45rem 1.15rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
              }}
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Reservar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
