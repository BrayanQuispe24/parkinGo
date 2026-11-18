import React from 'react';

interface TableSkeletonRowsProps {
  rowsCount?: number;
}

/**
 * Filas fantasma con animación Shimmer para tablas de estacionamientos.
 * Mantiene la geometría visual exacta de las celdas para evitar saltos de layout (CLS).
 */
export const TableSkeletonRows: React.FC<TableSkeletonRowsProps> = ({ rowsCount = 2 }) => {
  const rows = Array.from({ length: rowsCount });

  return (
    <>
      {rows.map((_, index) => (
        <tr
          key={`skeleton-row-${index}`}
          style={{
            borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
          }}
        >
          {/* Columna 1: Estacionamiento (Icono + Nombre + Dirección) */}
          <td style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                className="skeleton-shimmer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%', maxWidth: '220px' }}>
                <div
                  className="skeleton-shimmer"
                  style={{ width: '75%', height: '15px' }}
                />
                <div
                  className="skeleton-shimmer"
                  style={{ width: '50%', height: '12px' }}
                />
              </div>
            </div>
          </td>

          {/* Columna 2: Ubicación (Coordenadas Lat/Long) */}
          <td style={{ padding: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: '110px', height: '14px' }}
            />
          </td>

          {/* Columna 3: Horarios */}
          <td style={{ padding: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: '120px', height: '14px' }}
            />
          </td>

          {/* Columna 4: Fotos */}
          <td style={{ padding: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: '70px', height: '14px' }}
            />
          </td>

          {/* Columna 5: Estado (Badge) */}
          <td style={{ padding: '1rem' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: '105px', height: '24px', borderRadius: '12px' }}
            />
          </td>

          {/* Columna 6: Acciones (Botón) */}
          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', justifyContent: 'flex-end', width: '100%' }}>
              <div
                className="skeleton-shimmer"
                style={{ width: '92px', height: '30px', borderRadius: '6px' }}
              />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

