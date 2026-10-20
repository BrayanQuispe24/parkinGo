import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EstacionamientoMapViewerProps {
  latitud: number;
  longitud: number;
  nombre: string;
  direccion?: string;
  height?: string;
}

// Marcador distintivo de ParkinGo para el mapa
const createParkinGoPinIcon = () => {
  return L.divIcon({
    className: 'parking-location-viewer-pin',
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
      ">
        <i class="fa-solid fa-square-parking" style="
          transform: rotate(45deg);
          color: #FFFFFF;
          font-size: 16px;
        "></i>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Componente para recentrar el mapa suavemente
const MapRecenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15, { animate: true });
  }, [lat, lng, map]);
  return null;
};

export const EstacionamientoMapViewer: React.FC<EstacionamientoMapViewerProps> = ({
  latitud,
  longitud,
  nombre,
  direccion,
  height = '280px',
}) => {
  const pinIcon = React.useMemo(() => createParkinGoPinIcon(), []);
  const googleMapsUrl = `https://www.google.com/maps?q=${latitud},${longitud}`;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle, #DDE3DE)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ height, width: '100%', position: 'relative' }}>
        <MapContainer
          center={[latitud, longitud]}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitud, longitud]} icon={pinIcon}>
            <Popup>
              <div style={{ padding: '0.2rem', fontFamily: 'inherit' }}>
                <strong style={{ color: '#006D36', fontSize: '0.9rem', display: 'block' }}>
                  {nombre}
                </strong>
                {direccion && (
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                    {direccion}
                  </span>
                )}
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.76rem',
                      color: '#006D36',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    Abrir en Google Maps <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
          <MapRecenter lat={latitud} lng={longitud} />
        </MapContainer>

        {/* Botón flotante para abrir directamente en Google Maps */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Ver ubicación exacta en Google Maps"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 1000,
            background: '#FFFFFF',
            color: '#1E293B',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '0.45rem 0.85rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
            (e.currentTarget as HTMLElement).style.color = '#006D36';
            (e.currentTarget as HTMLElement).style.borderColor = '#006D36';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#FFFFFF';
            (e.currentTarget as HTMLElement).style.color = '#1E293B';
            (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1';
          }}
        >
          <i className="fa-brands fa-google" style={{ color: '#EA4335', fontSize: '0.9rem' }}></i>
          <span>Ver en Google Maps</span>
          <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem', color: '#64748B' }}></i>
        </a>
      </div>
    </div>
  );
};
