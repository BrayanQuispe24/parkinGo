import React from 'react';
import { useMisNivelesQuery } from '../../application/useNivelesQuery';

export interface TenantCroquisPanelProps {
  onGoToNiveles?: () => void;
  onGoToEspacios?: () => void;
}

export const TenantCroquisPanel: React.FC<TenantCroquisPanelProps> = ({
  onGoToNiveles,
  onGoToEspacios,
}) => {
  const { data: niveles = [] } = useMisNivelesQuery();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
      }}
    >
      {/* 1. Barra de cabecera */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <i className="fa-solid fa-map" style={{ color: '#006D36' }}></i>
            <span>Plano y Croquis de Distribución Espacial</span>
          </h2>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              margin: '0.15rem 0 0 0',
            }}
          >
            Visualización gráfica, diagramación y mapeo interactivo de slots y bahías por planta.
          </p>
        </div>

        {/* Badge Próximamente */}
        <div
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.3rem 0.65rem',
            borderRadius: '12px',
            background: '#FEF3C7',
            color: '#92400E',
            border: '1px solid #FCD34D',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i className="fa-solid fa-compass-drafting"></i>
          <span>En Preparación / Próximamente</span>
        </div>
      </div>

      {/* 2. Tarjeta Enterprise Informativa y Demostrativa */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#F0FDF4',
            border: '2px solid #BBF7D0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#006D36',
            fontSize: '1.75rem',
            marginBottom: '1rem',
          }}
        >
          <i className="fa-solid fa-draw-polygon"></i>
        </div>

        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 0.5rem 0',
          }}
        >
          Editor y Visor Interactivo de Croquis
        </h3>

        <p
          style={{
            fontSize: '0.8rem',
            color: '#64748B',
            maxWidth: '520px',
            lineHeight: 1.5,
            margin: '0 0 1.5rem 0',
          }}
        >
          Este módulo está preparado a nivel de modelo de base de datos para almacenar la relación con cada nivel. Actualmente se encuentra pendiente de la integración de la librería especializada de renderizado canvas / SVG interactivo para permitir arrastrar, rotar y diagramar los espacios directamente sobre el plano.
        </p>

        {/* Pasos / Capacidades futuras */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            width: '100%',
            maxWidth: '680px',
            marginBottom: '1.75rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              padding: '0.85rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
            }}
          >
            <div style={{ color: '#006D36', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
              Plano por Nivel
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Cada piso o nivel dispondrá de su propio lienzo y coordenadas escalables.
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
            }}
          >
            <div style={{ color: '#006D36', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <i className="fa-solid fa-arrows-up-down-left-right"></i>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
              Arrastrar & Soltar
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Posicionamiento visual de cajas vehiculares, rampas de acceso y columnas.
            </div>
          </div>

          <div
            style={{
              padding: '0.85rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '4px',
            }}
          >
            <div style={{ color: '#006D36', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <i className="fa-solid fa-satellite-dish"></i>
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>
              Estado en Vivo
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Pintado cromático en tiempo real según ocupación o reserva del espacio.
            </div>
          </div>
        </div>

        {/* Acciones directas hacia lo ya funcional */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {onGoToNiveles && (
            <button
              type="button"
              onClick={onGoToNiveles}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#334155',
                borderRadius: '3px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-stairs"></i>
              <span>Gestionar Niveles ({niveles.length})</span>
            </button>
          )}

          {onGoToEspacios && (
            <button
              type="button"
              onClick={onGoToEspacios}
              style={{
                background: '#006D36',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '3px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-square-parking"></i>
              <span>Ver Lista de Espacios</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
