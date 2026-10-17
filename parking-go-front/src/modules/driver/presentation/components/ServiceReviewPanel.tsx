// src/modules/driver/presentation/components/ServiceReviewPanel.tsx
import React, { useState } from 'react';
import type { DriverReview, CreateReviewPayload } from '../../domain/DriverReview';

interface ServiceReviewPanelProps {
    reviews: DriverReview[];
    parkingNames: string[];
    onSubmitReview: (payload: CreateReviewPayload) => Promise<void>;
    isSubmitting?: boolean;
}

export const ServiceReviewPanel: React.FC<ServiceReviewPanelProps> = ({
    reviews,
    parkingNames,
    onSubmitReview,
    isSubmitting,
}) => {
    const [rating, setRating] = useState<number>(5);
    const [selectedParking, setSelectedParking] = useState<string>(parkingNames[0] || 'ParkinGo Equipetrol Central');
    const [comment, setComment] = useState<string>('');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        await onSubmitReview({
            parkingName: selectedParking,
            rating,
            comment: comment.trim(),
        });
        setComment('');
        setRating(5);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
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
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Selecciona el Parqueo *
                        </label>
                        <select
                            value={selectedParking}
                            onChange={(e) => setSelectedParking(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.85rem',
                                background: '#FFFFFF',
                            }}
                        >
                            {parkingNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Estrellas Interactivas */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Tu Calificación
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
                                    }}
                                    title={`${star} estrellas`}
                                >
                                    ★
                                </button>
                            ))}
                            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#D97706', marginLeft: '0.5rem' }}>
                                {rating} de 5 estrellas
                            </span>
                        </div>
                    </div>

                    {/* Comentario */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Comentario u observaciones *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="¿Cómo fue la atención, limpieza, iluminación y rapidez en la talanquera?..."
                            style={{
                                width: '100%',
                                padding: '0.65rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.85rem',
                                outline: 'none',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
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
                        }}
                    >
                        {isSubmitting ? 'Enviando...' : 'Publicar Calificación'}
                    </button>
                </form>
            </div>

            {/* Listado de Opiniones de la Comunidad */}
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
                    Opiniones Recientes de la Comunidad
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {reviews.map((r) => (
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
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '6px',
                                            background: '#063D25',
                                            color: '#FFFFFF',
                                            fontWeight: 800,
                                            fontSize: '0.78rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {r.driverName
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A' }}>
                                            {r.driverName}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                            {r.parkingName} • {r.date}
                                        </div>
                                    </div>
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
                                    ★ {r.rating}.0
                                </div>
                            </div>

                            <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0, lineHeight: 1.45 }}>
                                "{r.comment}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
