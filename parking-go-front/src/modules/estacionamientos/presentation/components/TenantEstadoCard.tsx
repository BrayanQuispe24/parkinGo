import React, { useState } from 'react';
import type { EstacionamientoModel } from '../../domain/Estacionamiento';
import { EstadoBadge } from './EstadoBadge';
import { GaleriaFotosEnterprise } from './GaleriaFotosEnterprise';
import { EstacionamientoMapViewer } from './EstacionamientoMapViewer';
import { TenantTarifasPanel } from './TenantTarifasPanel';
import { TenantServiciosExtrasPanel } from './TenantServiciosExtrasPanel';
import { TenantNivelesPanel } from './TenantNivelesPanel';
import { TenantEspaciosPanel } from './TenantEspaciosPanel';
import { TenantCroquisPanel } from './TenantCroquisPanel';

export type FichaTecnicaTab =
  | 'resumen'
  | 'tarifas'
  | 'servicios'
  | 'horarios'
  | 'galeria'
  | 'niveles'
  | 'espacios'
  | 'croquis';

interface TenantEstadoCardProps {
  estacionamiento: EstacionamientoModel;
  onBack?: () => void;
  initialTab?: FichaTecnicaTab;
}

export const TenantEstadoCard: React.FC<TenantEstadoCardProps> = ({
  estacionamiento,
  onBack,
  initialTab = 'resumen',
}) => {
  const [activeTab, setActiveTab] = useState<FichaTecnicaTab>(initialTab);
  const [selectedNivelIdForEspacios, setSelectedNivelIdForEspacios] = useState<string | undefined>(undefined);
  const googleMapsUrl = `https://www.google.com/maps?q=${estacionamiento.latitud},${estacionamiento.longitud}`;

  const getBanner = () => {
    switch (estacionamiento.estado) {
      case 'PENDIENTE':
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '3px',
              border: '1px solid #FCD34D',
              background: '#FFFBEB',
              color: '#92400E',
              fontSize: '0.78rem',
            }}
          >
            <i className="fa-solid fa-hourglass-half" style={{ color: '#D97706', fontSize: '0.85rem' }}></i>
            <div>
              <strong>En Revisión:</strong> Solicitud pendiente de evaluación por administración antes de habilitar reservas.
            </div>
          </div>
        );
      case 'RECHAZADO':
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '3px',
              border: '1px solid #FECACA',
              background: '#FEF2F2',
              color: '#991B1B',
              fontSize: '0.78rem',
            }}
          >
            <i className="fa-solid fa-circle-exclamation" style={{ color: '#DC2626', fontSize: '0.85rem' }}></i>
            <div>
              <strong>Solicitud Rechazada:</strong> "{estacionamiento.motivoRechazo || 'Sin motivo detallado'}"
            </div>
          </div>
        );
      case 'INHABILITADO':
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '3px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              color: '#475569',
              fontSize: '0.78rem',
            }}
          >
            <i className="fa-solid fa-ban" style={{ color: '#64748B', fontSize: '0.85rem' }}></i>
            <div>
              <strong>Inhabilitado:</strong> Este parqueo se encuentra en pausa operativa temporal.
            </div>
          </div>
        );
      case 'APROBADO':
      default:
        return null;
    }
  };

  const tabsConfig: { id: FichaTecnicaTab; label: string; icon: string; count?: number }[] = [
    { id: 'resumen', label: 'Resumen & Ubicación', icon: 'fa-solid fa-map-location-dot' },
    { id: 'tarifas', label: 'Esquema de Tarifas', icon: 'fa-solid fa-tags' },
    { id: 'servicios', label: 'Servicios Extras', icon: 'fa-solid fa-wand-magic-sparkles' },
    { id: 'horarios', label: 'Horarios de Atención', icon: 'fa-regular fa-clock', count: estacionamiento.horarios?.length },
    { id: 'galeria', label: 'Galería Multimedia', icon: 'fa-solid fa-camera', count: estacionamiento.fotos?.length },
    { id: 'niveles', label: 'Niveles / Pisos', icon: 'fa-solid fa-layer-group' },
    { id: 'espacios', label: 'Espacios & Boxes', icon: 'fa-solid fa-square-parking' },
    { id: 'croquis', label: 'Croquis (Próximamente)', icon: 'fa-solid fa-map' },
  ];

  return (
    <div
      className="ficha-tecnica-enterprise-container"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* 1. Toolbar Superior Compacto Enterprise */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          padding: '0.65rem 1rem',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Lado Izquierdo: Botón Volver + Nombre del Parqueo + Estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Volver al listado general"
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '3px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E2E8F0';
                e.currentTarget.style.borderColor = '#94A3B8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.borderColor = '#CBD5E1';
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
              <span>Volver</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <i className="fa-solid fa-square-parking" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
            <h1
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.2,
              }}
            >
              {estacionamiento.nombre}
            </h1>
          </div>

          <EstadoBadge estado={estacionamiento.estado} />
        </div>

        {/* Lado Derecho: Dirección y Coordenadas con acceso directo a Maps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#006D36' }}></i>
            <span style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={estacionamiento.direccion}>
              {estacionamiento.direccion}
            </span>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir ubicación en Google Maps"
            style={{
              fontSize: '0.72rem',
              color: '#006D36',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '3px',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
            }}
          >
            <i className="fa-solid fa-map-pin"></i>
            <span>{estacionamiento.latitud.toFixed(4)}, {estacionamiento.longitud.toFixed(4)}</span>
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.6rem' }}></i>
          </a>
        </div>
      </div>

      {/* 2. Banner de Estado (Solo si es PENDIENTE, RECHAZADO o INHABILITADO) */}
      {getBanner()}

      {/* 3. Barra de Pestañas Propias de la Ficha Técnica */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid #CBD5E1',
          gap: '0.5rem',
          overflowX: 'auto',
          background: '#FFFFFF',
          borderRadius: '4px 4px 0 0',
          padding: '0 0.5rem',
        }}
      >
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
                padding: '0.75rem 1rem',
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

      {/* 4. Contenido Dinámico de la Pestaña Activa */}
      <div style={{ width: '100%' }}>
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
                  padding: '0.75rem 1.15rem',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <i className="fa-solid fa-map-location-dot" style={{ color: '#006D36', fontSize: '0.85rem' }}></i>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#0F172A',
                    }}
                  >
                    Ubicación Geográfica en Mapa Satelital / Callejero
                  </span>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.72rem', color: '#006D36', fontWeight: 700, textDecoration: 'none' }}
                >
                  Abrir en Google Maps <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem' }}></i>
                </a>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <EstacionamientoMapViewer
                  latitud={estacionamiento.latitud}
                  longitud={estacionamiento.longitud}
                  nombre={estacionamiento.nombre}
                  direccion={estacionamiento.direccion}
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
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#475569',
                }}
              >
                Datos Técnicos del Estacionamiento
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '3px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.2rem' }}>
                    Dirección Registrada
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    {estacionamiento.direccion}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '3px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.2rem' }}>
                    Posicionamiento Global (Lat / Lng)
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#006D36', fontFamily: 'monospace' }}>
                    {estacionamiento.latitud} , {estacionamiento.longitud}
                  </div>
                </div>

                <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '3px', border: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.2rem' }}>
                    Estado Operativo Actual
                  </span>
                  <div style={{ marginTop: '0.25rem' }}>
                    <EstadoBadge estado={estacionamiento.estado} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tarifas' && (
          <TenantTarifasPanel embedded={false} />
        )}

        {activeTab === 'servicios' && (
          <TenantServiciosExtrasPanel embedded={false} />
        )}

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
                {estacionamiento.horarios.length} DÍAS ACTIVOS
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
                  {estacionamiento.horarios.map((h) => (
                    <tr
                      key={h.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        {h.dia}
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'galeria' && (
          <GaleriaFotosEnterprise fotos={estacionamiento.fotos ?? []} readOnly={false} />
        )}

        {activeTab === 'niveles' && (
          <TenantNivelesPanel
            readOnly={false}
            onSelectNivelParaEspacios={(nivelId) => {
              setSelectedNivelIdForEspacios(nivelId);
              setActiveTab('espacios');
            }}
          />
        )}

        {activeTab === 'espacios' && (
          <TenantEspaciosPanel
            readOnly={false}
            initialNivelId={selectedNivelIdForEspacios}
            onGoToNiveles={() => setActiveTab('niveles')}
          />
        )}

        {activeTab === 'croquis' && (
          <TenantCroquisPanel
            onGoToNiveles={() => setActiveTab('niveles')}
            onGoToEspacios={() => setActiveTab('espacios')}
          />
        )}
      </div>
    </div>
  );
};
