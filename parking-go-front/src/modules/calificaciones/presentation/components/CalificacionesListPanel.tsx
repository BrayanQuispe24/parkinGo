// src/modules/calificaciones/presentation/components/CalificacionesListPanel.tsx
import React, { useMemo } from 'react';
import type { CalificacionModel } from '../../domain/Calificacion';

interface CalificacionesListPanelProps {
  calificaciones: CalificacionModel[];
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
}

export const CalificacionesListPanel: React.FC<CalificacionesListPanelProps> = ({
  calificaciones,
  isLoading = false,
  title = 'Calificaciones y Reseñas Recibidas',
  subtitle = 'Opiniones reales de los conductores que han estacionado en tus instalaciones.',
}) => {
  // Estadísticas calculadas
  const stats = useMemo(() => {
    if (calificaciones.length === 0) {
      return { promedio: 0, total: 0, breakdown: [0, 0, 0, 0, 0] };
    }
    const total = calificaciones.length;
    const sum = calificaciones.reduce((acc, curr) => acc + curr.puntaje, 0);
    const promedio = Number((sum / total).toFixed(1));

    // Desglose por estrellas (5, 4, 3, 2, 1)
    const breakdown = [5, 4, 3, 2, 1].map(
      (star) => calificaciones.filter((c) => c.puntaje === star).length,
    );

    return { promedio, total, breakdown };
  }, [calificaciones]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 2rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#006D36' }}></i>
        <p style={{ margin: '0.75rem 0 0', fontWeight: 600, color: '#64748B' }}>
          Cargando opiniones de conductores...
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header y Resumen Estadístico */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #CBD5CE',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
            {title}
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            {subtitle}
          </p>
        </div>

        {stats.total > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
              background: '#F8FAFC',
              borderRadius: '8px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Puntuación General */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#063D25',
                  lineHeight: 1,
                }}
              >
                {stats.promedio}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '0.35rem 0' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <i
                    key={s}
                    className="fa-solid fa-star"
                    style={{
                      color: s <= Math.round(stats.promedio) ? '#F59E0B' : '#CBD5E1',
                      fontSize: '1rem',
                    }}
                  ></i>
                ))}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                Basado en {stats.total} reseña(s)
              </span>
            </div>

            {/* Barras de Desglose */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[5, 4, 3, 2, 1].map((star, idx) => {
                const count = stats.breakdown[idx];
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;

                return (
                  <div
                    key={star}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.74rem',
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: '22px' }}>{star}★</span>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        background: '#E2E8F0',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: '#006D36',
                          borderRadius: '3px',
                        }}
                      ></div>
                    </div>
                    <span style={{ width: '25px', textAlign: 'right', color: '#64748B' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              background: '#F8FAFC',
              borderRadius: '8px',
              border: '1.5px dashed #CBD5E1',
            }}
          >
            <i className="fa-regular fa-star" style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '0.5rem' }}></i>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>
              Aún no tienes calificaciones registradas
            </h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
              Cuando los conductores utilicen tu estacionamiento y emitan sus valoraciones, aparecerán detalladas aquí.
            </p>
          </div>
        )}
      </div>

      {/* Lista Cronológica de Opiniones */}
      {calificaciones.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {calificaciones.map((item) => {
            const fechaStr = new Date(item.fechaCreado).toLocaleDateString('es-BO', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            const iniciales = (item.clienteNombre || 'Conductor')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  padding: '1.15rem',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: '#DCFCE7',
                        color: '#006D36',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                      }}
                    >
                      {iniciales}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                        {item.clienteNombre}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        Parqueo: <strong style={{ color: '#006D36' }}>{item.estacionamientoNombre}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'flex-end' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <i
                          key={s}
                          className="fa-solid fa-star"
                          style={{
                            color: s <= item.puntaje ? '#F59E0B' : '#E2E8F0',
                            fontSize: '0.85rem',
                          }}
                        ></i>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{fechaStr}</span>
                  </div>
                </div>

                <p
                  style={{
                    margin: '0.25rem 0 0',
                    fontSize: '0.84rem',
                    color: '#334155',
                    lineHeight: 1.45,
                    fontStyle: 'italic',
                    background: '#F8FAFC',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '6px',
                    borderLeft: '3px solid #006D36',
                  }}
                >
                  "{item.comentario}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
