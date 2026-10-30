// src/modules/driver/presentation/components/DriverFichaTecnicaCard.tsx
import React, { useState } from 'react';
import type { DriverParking } from '../../domain/DriverParking';
import { EstadoBadge } from '../../../estacionamientos/presentation/components/EstadoBadge';
import { EstacionamientoMapViewer } from '../../../estacionamientos/presentation/components/EstacionamientoMapViewer';
import { GaleriaFotosEnterprise } from '../../../estacionamientos/presentation/components/GaleriaFotosEnterprise';
import { DriverCroquisViewer } from './DriverCroquisViewer';
import { CalificacionesListPanel } from '../../../calificaciones/presentation/components/CalificacionesListPanel';
import { useCalificacionesEstacionamientoQuery } from '../../../calificaciones/application/useCalificacionesQuery';
import '../../../estacionamientos/presentation/styles/estacionamientos.css';

export type DriverFichaTecnicaTab =
  | 'resumen'
  | 'tarifas'
  | 'servicios'
  | 'horarios'
  | 'galeria'
  | 'espacios'
  | 'croquis'
  | 'resenas';

interface DriverFichaTecnicaCardProps {
  parking: DriverParking;
  onBack: () => void;
  onProceedToBooking: (parking: DriverParking, selectedSpaceCode?: string | null) => void;
  initialTab?: DriverFichaTecnicaTab;
}

export const DriverFichaTecnicaCard: React.FC<DriverFichaTecnicaCardProps> = ({
  parking,
  onBack,
  onProceedToBooking,
  initialTab = 'resumen',
}) => {
  const [activeTab, setActiveTab] = useState<DriverFichaTecnicaTab>(initialTab);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedSpaceCode, setSelectedSpaceCode] = useState<string | null>(null);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  const { data: califSummary, isLoading: isLoadingCalif } = useCalificacionesEstacionamientoQuery(parking.id);

  const googleMapsUrl = parking.latitude && parking.longitude
    ? `https://www.google.com/maps?q=${parking.latitude},${parking.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parking.address + ', ' + parking.zone)}`;

  // Normalización de fotos para GaleriaFotosEnterprise
  const fotosModel = (parking.fotos || []).map((url, i) => ({
    id: `foto-${parking.id}-${i}`,
    url,
    createdAt: new Date().toISOString(),
  }));

  // Generación de espacios de respaldo si no vinieran desglosados en el catálogo
  const rawSpaces = parking.spaces && parking.spaces.length > 0 ? parking.spaces : [];
  const spacesList = rawSpaces.length > 0
    ? rawSpaces
    : Array.from({ length: Math.min(parking.totalSpots || 12, 30) }, (_, i) => {
        const isFree = i < (parking.availableSpots || 0);
        const levelName = parking.tags.includes('cubierto')
          ? (i < 12 ? 'Nivel 1' : 'Nivel 2')
          : 'Planta Baja';

        let spaceType = 'AUTO';
        if (parking.tags.includes('ev') && (i === 0 || i === 1)) {
          spaceType = 'ELECTRICO';
        } else if (i % 6 === 2) {
          spaceType = 'MOTO';
        } else if (i % 8 === 4) {
          spaceType = 'CAMIONETA';
        } else if (i === 3) {
          spaceType = 'DISCAPACITADO';
        }

        const codeNum = (i + 1).toString().padStart(2, '0');
        const prefix = levelName === 'Nivel 2' ? 'B' : 'A';
        return {
          id: `slot-${parking.id}-${i}`,
          code: `${prefix}-${codeNum}`,
          type: spaceType,
          level: levelName,
          status: isFree ? 'DISPONIBLE' : 'OCUPADO',
        };
      });

  const uniqueLevels = Array.from(new Set(spacesList.map((s) => s.level).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(spacesList.map((s) => s.type).filter(Boolean)));

  const filteredSpaces = spacesList.filter((s) => {
    const matchLvl = selectedLevelFilter === 'ALL' || s.level === selectedLevelFilter;
    const matchTyp = selectedTypeFilter === 'ALL' || s.type === selectedTypeFilter;
    return matchLvl && matchTyp;
  });

  const availableCount = spacesList.filter((s) => s.status === 'DISPONIBLE').length;

  const getTypeInfo = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MOTO':
        return { label: 'Moto', icon: 'fa-solid fa-motorcycle', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' };
      case 'CAMIONETA':
        return { label: 'SUV / Camioneta', icon: 'fa-solid fa-truck-pickup', bg: '#FEF3C7', color: '#B45309', border: '#FDE68A' };
      case 'ELECTRICO':
        return { label: 'Carga EV ⚡', icon: 'fa-solid fa-charging-station', bg: '#ECFDF5', color: '#047857', border: '#A7F3D0' };
      case 'DISCAPACITADO':
        return { label: 'Preferencial ♿', icon: 'fa-solid fa-wheelchair', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' };
      default:
        return { label: 'Automóvil', icon: 'fa-solid fa-car', bg: '#F8FAFC', color: '#334155', border: '#CBD5E1' };
    }
  };

  const tabsConfig: { id: DriverFichaTecnicaTab; label: string; icon: string; count?: number }[] = [
    { id: 'resumen', label: 'Resumen & Ubicación', icon: 'fa-solid fa-map-location-dot' },
    { id: 'espacios', label: 'Espacios & Boxes', icon: 'fa-solid fa-square-parking', count: availableCount },
    { id: 'tarifas', label: 'Esquema de Tarifas', icon: 'fa-solid fa-tags', count: parking.tarifas?.length },
    { id: 'servicios', label: 'Servicios Extras', icon: 'fa-solid fa-wand-magic-sparkles', count: parking.serviciosExtras?.length },
    { id: 'horarios', label: 'Horarios de Atención', icon: 'fa-regular fa-clock', count: parking.horarios?.length },
    { id: 'galeria', label: 'Galería Multimedia', icon: 'fa-solid fa-camera', count: parking.fotos?.length },
    { id: 'resenas', label: 'Calificaciones', icon: 'fa-solid fa-star', count: califSummary?.total },
    { id: 'croquis', label: 'Croquis (Próximamente)', icon: 'fa-solid fa-map' },
  ];

  return (
    <div
      className="ficha-tecnica-enterprise-container"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        paddingBottom: '5.5rem', // Espacio para la barra de reserva flotante
        position: 'relative',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* 1. Barra de Navegación Superior: Botón Volver + Tabs horizontales */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #CBD5E1',
          gap: '0.35rem',
          overflowX: 'auto',
          background: '#FFFFFF',
          borderRadius: '4px',
          padding: '0.45rem 0.65rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          title="Volver al mapa y listado de parqueos"
          style={{
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            color: '#0F172A',
            fontWeight: 800,
            fontSize: '0.82rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E2E8F0';
            e.currentTarget.style.color = '#006D36';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
            e.currentTarget.style.color = '#0F172A';
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Volver al Mapa</span>
        </button>

        <div
          style={{
            width: '1px',
            height: '24px',
            background: '#CBD5E1',
            margin: '0 0.35rem',
            flexShrink: 0,
          }}
        />

        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid #006D36' : '3px solid transparent',
                color: isActive ? '#006D36' : '#64748B',
                fontWeight: isActive ? 800 : 600,
                padding: '0.65rem 0.95rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#64748B';
              }}
            >
              <i className={tab.icon}></i>
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    background: isActive ? '#DCFCE7' : '#F1F5F9',
                    color: isActive ? '#166534' : '#475569',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Contenido Dinámico de la Pestaña Activa */}
      <div style={{ width: '100%' }}>
        {/* PESTAÑA 1: RESUMEN & UBICACIÓN */}
        {activeTab === 'resumen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Visor de Mapa Satelital/Callejero */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fa-solid fa-square-parking" style={{ color: '#006D36', fontSize: '1.25rem' }}></i>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                      {parking.name}
                    </h3>
                  </div>
                  <EstadoBadge estado="APROBADO" />
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.74rem',
                    color: '#006D36',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '4px',
                  }}
                >
                  <i className="fa-solid fa-map-location-dot"></i>
                  <span>Abrir en Google Maps</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem' }}></i>
                </a>
              </div>

              <div style={{ padding: '0.85rem' }}>
                <EstacionamientoMapViewer
                  latitud={parking.latitude || -17.7682}
                  longitud={parking.longitude || -63.1834}
                  nombre={parking.name}
                  direccion={parking.address}
                  height="360px"
                />
              </div>
            </div>

            {/* Tarjeta de Especificaciones Técnicas */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                padding: '1.25rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1rem' }}>
                <i className="fa-solid fa-sliders" style={{ color: '#006D36', fontSize: '0.85rem' }}></i>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#475569',
                  }}
                >
                  Datos Técnicos del Estacionamiento
                </h4>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.35rem' }}>
                    <i className="fa-solid fa-square-parking" style={{ color: '#006D36' }}></i> Nombre del Establecimiento
                  </span>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                    {parking.name}
                  </div>
                </div>

                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.35rem' }}>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#006D36' }}></i> Estado Operativo Actual
                  </span>
                  <div style={{ marginTop: '0.2rem' }}>
                    <EstadoBadge estado="APROBADO" />
                  </div>
                </div>

                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.35rem' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#006D36' }}></i> Dirección Registrada
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', wordBreak: 'break-word' }}>
                    {parking.address} ({parking.zone})
                  </div>
                </div>

                <div style={{ padding: '0.85rem', background: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.35rem' }}>
                    <i className="fa-solid fa-map-pin" style={{ color: '#006D36' }}></i> Posicionamiento Global (Lat / Lng)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#006D36', fontFamily: 'monospace' }}>
                      {(parking.latitude || -17.7682).toFixed(4)} , {(parking.longitude || -63.1834).toFixed(4)}
                    </span>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Ver en Google Maps"
                      style={{
                        fontSize: '0.7rem',
                        color: '#006D36',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Ver mapa</span>
                      <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.6rem' }}></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* PESTAÑA 3: TARIFAS */}
        {activeTab === 'tarifas' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              padding: '1.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
              <i className="fa-solid fa-tags" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  Esquema de Tarifas Oficiales Vigentes
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Modalidades de cobro habilitadas para los usuarios y conductores en este parqueo.
                </span>
              </div>
            </div>

            {parking.tarifas && parking.tarifas.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {parking.tarifas.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '1rem 1.25rem',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{t.descripcion}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Modalidad: <strong>{t.modalidad}</strong>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#006D36' }}>Bs {t.monto}.00</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>/{t.modalidad.toLowerCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>Tarifa Estándar Diurna</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Tarifa base por hora de estacionamiento</div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#006D36' }}>Bs {parking.pricePerHour}.00 / hora</div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 4: SERVICIOS EXTRAS */}
        {activeTab === 'servicios' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              padding: '1.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                  Servicios Adicionales en el Parqueo
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Servicios y comodidades extra disponibles durante tu estancia.
                </span>
              </div>
            </div>

            {parking.serviciosExtras && parking.serviciosExtras.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {parking.serviciosExtras.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      padding: '1rem 1.25rem',
                      background: '#F8FAFC',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>{s.nombre}</div>
                      <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.2rem' }}>Servicio adicional garantizado</div>
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669' }}>
                      +Bs {s.precio}.00
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.84rem' }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '2rem', color: '#CBD5E1', marginBottom: '0.5rem', display: 'block' }}></i>
                Este parqueo no tiene servicios adicionales configurados actualmente.
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 5: HORARIOS DE ATENCIÓN */}
        {activeTab === 'horarios' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.85rem 1.25rem',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fa-solid fa-clock" style={{ color: '#006D36', fontSize: '0.85rem' }}></i>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#0F172A',
                  }}
                >
                  Horarios de Atención Semanales Configurados
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  background: '#ECFDF5',
                  color: '#065F46',
                  borderRadius: '3px',
                  border: '1px solid #A7F3D0',
                  letterSpacing: '0.03em',
                }}
              >
                {parking.horarios?.length || 7} DÍAS HABILITADOS
              </span>
            </div>

            <div style={{ overflowX: 'auto', padding: '0.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Día de la Semana
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Hora de Apertura
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Hora de Cierre
                    </th>
                    <th style={{ padding: '0.75rem 1rem', fontSize: '0.6875rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.8rem' }}>
                  {parking.horarios && parking.horarios.length > 0 ? (
                    parking.horarios.map((h, idx) => (
                      <tr
                        key={h.dia + idx}
                        style={{ borderBottom: '1px solid #F1F5F9' }}
                      >
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A', textTransform: 'capitalize' }}>
                          {h.dia.toLowerCase()}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#006D36', fontWeight: 700, fontFamily: 'monospace' }}>
                          <i className="fa-regular fa-sun" style={{ marginRight: '0.35rem', color: '#16A34A' }}></i>
                          {h.horaInicio}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>
                          <i className="fa-regular fa-moon" style={{ marginRight: '0.35rem', color: '#64748B' }}></i>
                          {h.horaCierre}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '3px',
                              background: '#F0FDF4',
                              color: '#15803D',
                              border: '1px solid #BBF7D0',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E' }}></span>
                            HABILITADO
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#64748B' }}>
                        Atención continua las 24 horas del día, los 7 días de la semana.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA 6: GALERÍA MULTIMEDIA */}
        {activeTab === 'galeria' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              padding: '1.25rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            }}
          >
            <GaleriaFotosEnterprise fotos={fotosModel} readOnly={true} />
          </div>
        )}



        {/* PESTAÑA 8: ESPACIOS & BOXES */}
        {activeTab === 'espacios' && (
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
              padding: '1.5rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Header del Panel de Espacios */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <i className="fa-solid fa-square-parking" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                    Mapa de Espacios & Plazas de Parqueo
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Selecciona una plaza disponible para apartarla en tu reserva.
                  </span>
                </div>
              </div>

              {/* Filtros por Nivel y Tipo */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {uniqueLevels.length > 1 && (
                  <select
                    value={selectedLevelFilter}
                    onChange={(e) => setSelectedLevelFilter(e.target.value)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#1E293B',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="ALL">Todos los niveles</option>
                    {uniqueLevels.map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                )}

                {uniqueTypes.length > 1 && (
                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      color: '#1E293B',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="ALL">Cualquier tipo de vehículo</option>
                    {uniqueTypes.map((typ) => (
                      <option key={typ} value={typ}>{typ}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Grilla de Tarjetas Representativas de Espacios */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '0.85rem',
                maxHeight: '520px',
                overflowY: 'auto',
                padding: '0.2rem',
              }}
            >
              {filteredSpaces.map((space) => {
                const isAvailable = space.status === 'DISPONIBLE';
                const isSelected = selectedSpaceId === space.id;
                const typeInfo = getTypeInfo(space.type);

                return (
                  <div
                    key={space.id}
                    onClick={() => {
                      if (isAvailable) {
                        if (selectedSpaceId === space.id) {
                          setSelectedSpaceId(null);
                          setSelectedSpaceCode(null);
                        } else {
                          setSelectedSpaceId(space.id);
                          setSelectedSpaceCode(space.code);
                        }
                      }
                    }}
                    style={{
                      background: isSelected ? '#F0FDF4' : isAvailable ? '#FFFFFF' : '#F8FAFC',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #006D36' : isAvailable ? '1.5px solid #BBF7D0' : '1px solid #E2E8F0',
                      borderLeft: isSelected ? '4px solid #006D36' : isAvailable ? '4px solid #22C55E' : '4px solid #CBD5E1',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      opacity: isAvailable ? 1 : 0.65,
                      position: 'relative',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 109, 54, 0.18)' : '0 2px 5px rgba(0, 0, 0, 0.04)',
                      transition: 'all 0.18s ease',
                      transform: isSelected ? 'translateY(-2px)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 900, color: isSelected ? '#006D36' : isAvailable ? '#0F172A' : '#64748B' }}>
                        {space.code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '12px',
                          background: isSelected ? '#DCFCE7' : isAvailable ? '#ECFDF5' : '#F1F5F9',
                          color: isSelected ? '#006D36' : isAvailable ? '#059669' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isAvailable ? '#10B981' : '#94A3B8' }}></span>
                        {isAvailable ? 'Libre' : 'Ocupado'}
                      </span>
                    </div>

                    <div
                      style={{
                        height: '56px',
                        background: isSelected ? '#DCFCE7' : isAvailable ? '#F0FDF4' : '#F1F5F9',
                        borderRadius: '6px',
                        border: isSelected ? '1px dashed #006D36' : isAvailable ? '1px dashed #86EFAC' : '1px dashed #CBD5E1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        margin: '0.25rem 0 0.5rem 0',
                      }}
                    >
                      <i className={typeInfo.icon} style={{ fontSize: '1.35rem', color: isSelected ? '#006D36' : isAvailable ? typeInfo.color : '#94A3B8' }}></i>
                      <span style={{ fontSize: '0.64rem', fontWeight: 700, color: isSelected ? '#006D36' : isAvailable ? '#059669' : '#94A3B8' }}>
                        {isSelected ? 'Seleccionado ✓' : isAvailable ? 'Elegir Box' : 'Ocupado'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                      <span style={{ color: '#64748B', fontWeight: 600 }}>
                        <i className="fa-solid fa-layer-group" style={{ marginRight: '3px', fontSize: '0.6rem' }}></i>
                        {space.level}
                      </span>
                      <span
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 700,
                          padding: '0.08rem 0.35rem',
                          borderRadius: '4px',
                          background: typeInfo.bg,
                          color: typeInfo.color,
                          border: `1px solid ${typeInfo.border}`,
                        }}
                      >
                        {typeInfo.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      title={`Ver el espacio ${space.code} en el plano arquitectónico`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpaceId(space.id);
                        setSelectedSpaceCode(space.code);
                        setActiveTab('croquis');
                      }}
                      style={{
                        marginTop: '0.45rem',
                        width: '100%',
                        padding: '0.3rem 0.45rem',
                        borderRadius: '5px',
                        border: isSelected ? '1.5px solid #006D36' : '1px solid #CBD5E1',
                        background: isSelected ? '#006D36' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#0F172A',
                        fontSize: '0.67rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa-solid fa-map-location-dot" style={{ color: isSelected ? '#FFFFFF' : '#006D36' }}></i>
                      <span>Ver en plano</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedSpaceId && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  border: '1.5px solid #006D36',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  fontSize: '0.82rem',
                  color: '#065F46',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-circle-check" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
                  <span>
                    Has elegido el espacio <strong>{selectedSpaceCode}</strong>. Al presionar "Reservar", este box se asignará automáticamente a tu reserva.
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('croquis')}
                    style={{
                      background: '#006D36',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>Ver en plano →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSpaceId(null);
                      setSelectedSpaceCode(null);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#065F46',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 9: CROQUIS */}
        {activeTab === 'croquis' && (
          <DriverCroquisViewer
            parking={parking}
            selectedSpaceId={selectedSpaceId}
            selectedSpaceCode={selectedSpaceCode}
            onSelectSpace={(spaceId, spaceCode) => {
              setSelectedSpaceId(spaceId);
              setSelectedSpaceCode(spaceCode);
            }}
            onClearSelection={() => {
              setSelectedSpaceId(null);
              setSelectedSpaceCode(null);
            }}
            onProceedToBooking={() => {
              onProceedToBooking(parking, selectedSpaceCode);
            }}
          />
        )}

        {/* PESTAÑA: CALIFICACIONES Y RESEÑAS */}
        {activeTab === 'resenas' && (
          <CalificacionesListPanel
            calificaciones={califSummary?.items || []}
            isLoading={isLoadingCalif}
            title={`Calificaciones sobre ${parking.name}`}
            subtitle="Opiniones y valoraciones verificadas de conductores en este estacionamiento."
          />
        )}
      </div>

      {/* 3. Barra Flotante Inferior de Acción para el Conductor */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '850px',
          background: '#063D25',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          zIndex: 999,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#22C55E',
              fontSize: '1.2rem',
            }}
          >
            <i className="fa-solid fa-square-parking"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>{parking.name}</div>
            <div style={{ fontSize: '0.74rem', color: '#86EFAC' }}>
              Tarifa: <strong>Bs {parking.pricePerHour}.00 / hora</strong> • {availableCount} plazas libres
              {selectedSpaceCode && <span> • Box elegido: <strong>{selectedSpaceCode}</strong></span>}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onProceedToBooking(parking, selectedSpaceCode);
          }}
          style={{
            background: '#22C55E',
            color: '#063D25',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.6rem',
            fontSize: '0.88rem',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
            whiteSpace: 'nowrap',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <i className="fa-solid fa-calendar-check"></i>
          <span>
            {selectedSpaceCode ? `Reservar Box ${selectedSpaceCode}` : 'Reservar Plaza Ahora'}
          </span>
        </button>
      </div>
    </div>
  );
};
