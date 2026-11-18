import React from 'react';

/**
 * Fallback suave tipo Skeleton para el lienzo de trabajo (Outlet) dentro de los layouts.
 * Reemplaza el spinner central tosco por una silueta visual con Shimmer que armoniza
 * con la barra lateral y superior ya montadas, erradicando el salto y la percepción de "doble carga".
 */
export const CanvasSuspenseFallback: React.FC = () => {
  return (
    <div
      style={{
        padding: '0.5rem 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* 1. Header & Breadcrumb Skeleton */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '260px' }}>
          <div className="skeleton-shimmer" style={{ width: '100%', height: '24px', borderRadius: '4px' }} />
          <div className="skeleton-shimmer" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton-shimmer" style={{ width: '130px', height: '36px', borderRadius: '6px' }} />
      </div>

      {/* 2. Pestañas de Navegación Skeleton */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid var(--border-subtle, #E2E8F0)', paddingBottom: '0.5rem' }}>
        <div className="skeleton-shimmer" style={{ width: '180px', height: '22px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '140px', height: '22px', borderRadius: '4px' }} />
      </div>

      {/* 3. Panel Contenedor de Tabla con Shimmer */}
      <div
        style={{
          background: 'var(--surface-card, #FFFFFF)',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle, #CBD5CE)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {/* Barra de herramientas fantasma */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            background: '#FAFCFA',
          }}
        >
          <div className="skeleton-shimmer" style={{ width: '280px', height: '36px', borderRadius: '6px' }} />
          <div className="skeleton-shimmer" style={{ width: '120px', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* Filas de tabla fantasma */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((item) => (
            <div
              key={`canvas-skeleton-row-${item}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                paddingBottom: '0.85rem',
                borderBottom: item < 3 ? '1px solid var(--border-subtle, #F1F5F9)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 2 }}>
                <div className="skeleton-shimmer" style={{ width: '38px', height: '38px', borderRadius: '6px', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '70%' }}>
                  <div className="skeleton-shimmer" style={{ width: '80%', height: '15px' }} />
                  <div className="skeleton-shimmer" style={{ width: '50%', height: '12px' }} />
                </div>
              </div>
              <div className="skeleton-shimmer" style={{ width: '100px', height: '16px', flex: 1 }} />
              <div className="skeleton-shimmer" style={{ width: '90px', height: '24px', borderRadius: '12px' }} />
              <div className="skeleton-shimmer" style={{ width: '85px', height: '32px', borderRadius: '6px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

