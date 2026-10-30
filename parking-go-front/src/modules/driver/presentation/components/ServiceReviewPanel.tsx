// src/modules/driver/presentation/components/ServiceReviewPanel.tsx
import React, { useState, useEffect } from 'react';
import type { DriverParking } from '../../domain/DriverParking';
import type { CalificacionModel, CrearCalificacionPayload } from '../../../calificaciones/domain/Calificacion';

interface ServiceReviewPanelProps {
  parkings: DriverParking[];
  reviews: CalificacionModel[];
  onSubmitReview: (payload: CrearCalificacionPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export const ServiceReviewPanel: React.FC<ServiceReviewPanelProps> = ({
  parkings,
  reviews,
  onSubmitReview,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [selectedParkingId, setSelectedParkingId] = useState<string>(
    parkings[0]?.id || '',
  );
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (parkings.length > 0 && !selectedParkingId) {
      setSelectedParkingId(parkings[0].id);
    }
  }, [parkings, selectedParkingId]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !selectedParkingId) return;

    await onSubmitReview({
      estacionamientoId: selectedParkingId,
      puntaje: rating,
      comentario: comment.trim(),
    });
    setComment('');
    setRating(5);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      {/* Formulario de Calificación */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #CBD5CE',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <i className="fa-solid fa-star" style={{ color: '#F59E0B', fontSize: '1.25rem' }}></i>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Calificar Experiencia
          </h3>
        </div>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.35rem',
              }}
            >
              Selecciona el Parqueo *
            </label>
            <select
              value={selectedParkingId}
              onChange={(e) => setSelectedParkingId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                background: '#FFFFFF',
                outline: 'none',
              }}
            >
              {parkings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.address})
                </option>
              ))}
            </select>
          </div>

          {/* Estrellas Interactivas */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.35rem',
              }}
            >
              Tu Calificación: <strong style={{ color: '#F59E0B' }}>{rating} de 5 estrellas</strong>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.75rem',
                    cursor: 'pointer',
                    color: star <= rating ? '#F59E0B' : '#E2E8F0',
                    transition: 'transform 0.15s ease',
                    padding: '0 2px',
                  }}
                  title={`${star} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.35rem',
              }}
            >
              Comentario u Opinión *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Escribe tu opinión honesta sobre la seguridad, facilidad de acceso, amabilidad y estado del espacio..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.65rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.84rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            style={{
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.65rem 1.25rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: isSubmitting ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
              opacity: isSubmitting || !comment.trim() ? 0.65 : 1,
            }}
          >
            <i className="fa-solid fa-paper-plane"></i>
            <span>{isSubmitting ? 'Publicando...' : 'Publicar Calificación'}</span>
          </button>
        </form>
      </div>

      {/* Listado de Opiniones de la Comunidad */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
          Tus Reseñas y Calificaciones Recientes
        </h3>

        {reviews.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px dashed #CBD5E1',
              borderRadius: '8px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <i className="fa-regular fa-star" style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '0.5rem' }}></i>
            <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.92rem', color: '#1E293B' }}>
              Aún no has calificado ningún parqueo
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
              Utiliza el formulario de la izquierda para valorar los estacionamientos donde hayas aparcado.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {reviews.map((r) => {
              const fechaStr = new Date(r.fechaCreado).toLocaleDateString('es-BO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={r.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #006D36',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>
                        {r.estacionamientoNombre}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{fechaStr}</div>
                    </div>

                    <div
                      style={{
                        background: '#FEF3C7',
                        color: '#D97706',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #FDE68A',
                      }}
                    >
                      ★ {r.puntaje}.0
                    </div>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                    "{r.comentario}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
