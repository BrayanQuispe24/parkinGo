// src/modules/driver/presentation/components/ParkingCardGrid.tsx
import React, { useState } from 'react';
import type { DriverParking } from '../../domain/DriverParking';
import imgEmpresarial from '../../../../assets/parking_empresarial_1789393502203.png';

interface ParkingCardGridProps {
    parkings: DriverParking[];
    isLoading?: boolean;
    onReserveParking: (parking: DriverParking) => void;
    onViewDetails?: (parking: DriverParking) => void;
    selectedParkingId?: string;
    onHoverParking?: (parkingId: string | null) => void;
}

export const ParkingCardGrid: React.FC<ParkingCardGridProps> = ({
    parkings,
    isLoading = false,
    onReserveParking,
    onViewDetails,
    selectedParkingId,
    onHoverParking,
}) => {
    const [favorites, setFavorites] = useState<Record<string, boolean>>({
        'p-102': true,
    });

    const toggleFavorite = (parkingId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [parkingId]: !prev[parkingId] }));
    };

    if (isLoading) {
        return (
            <div>
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: '180px', height: '24px', background: '#E2E8F0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                    <div style={{ width: '120px', height: '16px', background: '#E2E8F0', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {[1, 2, 3].map((n) => (
                        <div
                            key={n}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid #E2E8F0',
                                height: '320px',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ width: '100%', height: '175px', background: '#F1F5F9', animation: 'pulse 1.5s infinite' }}></div>
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                <div style={{ width: '70%', height: '18px', background: '#E2E8F0', borderRadius: '4px' }}></div>
                                <div style={{ width: '90%', height: '14px', background: '#F1F5F9', borderRadius: '4px' }}></div>
                                <div style={{ width: '40%', height: '14px', background: '#F1F5F9', borderRadius: '4px', marginTop: '0.5rem' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (parkings.length === 0) {
        return (
            <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '3.5rem', textAlign: 'center' }}>
                <i className="fa-solid fa-square-parking" style={{ fontSize: '2rem', color: '#94A3B8', marginBottom: '0.75rem' }}></i>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    No se encontraron parqueos con estos filtros
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                    Intenta cambiar la categoría o buscar por otra calle o zona.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Parqueos Disponibles
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                    Mostrando {parkings.length} parqueo(s)
                </span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                    gap: '1.5rem',
                }}
            >
                {parkings.map((p) => {
                    const isFav = Boolean(favorites[p.id]);
                    const isLow = p.availableSpots <= 10;

                    const isSelected = p.id === selectedParkingId;

                    return (
                        <div
                            key={p.id}
                            className={`driver-card-item ${isSelected ? 'is-selected' : ''}`}
                            onMouseEnter={() => onHoverParking?.(p.id)}
                            onMouseLeave={() => onHoverParking?.(null)}
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: isSelected ? '2px solid #006D36' : '1px solid #E2E8F0',
                                boxShadow: isSelected
                                    ? '0 0 0 3px rgba(0, 109, 54, 0.2), 0 8px 20px rgba(0, 0, 0, 0.08)'
                                    : '0 2px 8px rgba(0,0,0,0.04)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {/* Imagen y Badges */}
                            <div
                                onClick={() => onViewDetails?.(p)}
                                style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden', cursor: 'pointer' }}
                                title="Clic para ver detalles completos del parqueo"
                            >
                                <img
                                    src={p.photoUrl}
                                    alt={p.name}
                                    className="driver-card-img"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = imgEmpresarial;
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />

                                {/* Badge de Vacantes */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        left: '10px',
                                        background: 'rgba(6, 61, 37, 0.92)',
                                        backdropFilter: 'blur(4px)',
                                        color: isLow ? '#FCD34D' : '#34D399',
                                        fontWeight: 800,
                                        fontSize: '0.72rem',
                                        padding: '0.22rem 0.6rem',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    <span
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: isLow ? '#F59E0B' : '#10B981',
                                            display: 'inline-block',
                                        }}
                                    ></span>
                                    <span>{p.availableSpots} de {p.totalSpots} Libres</span>
                                </div>

                                {/* Botón de Favorito */}
                                <button
                                    type="button"
                                    onClick={(e) => toggleFavorite(p.id, e)}
                                    className={`driver-btn-heart ${isFav ? 'favorited' : ''}`}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.9)',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isFav ? '#EF4444' : '#64748B',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    }}
                                    title={isFav ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
                                >
                                    <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
                                </button>
                            </div>

                            {/* Contenido */}
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', gap: '0.75rem' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.25rem 0' }}>
                                        {p.name}
                                    </h4>
                                    <p style={{ fontSize: '0.76rem', color: '#64748B', margin: 0 }}>
                                        <i className="fa-solid fa-location-dot" style={{ color: '#006D36', marginRight: '4px' }}></i>
                                        {p.address}
                                    </p>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                        {p.tags.includes('ev') && (
                                            <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.45rem', borderRadius: '4px' }}>
                                                <i className="fa-solid fa-charging-station" style={{ marginRight: '3px' }}></i> Carga EV
                                            </span>
                                        )}
                                        {p.tags.includes('cubierto') && (
                                            <span style={{ background: '#F1F5F9', color: '#475569', fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.45rem', borderRadius: '4px' }}>
                                                <i className="fa-solid fa-warehouse" style={{ marginRight: '3px' }}></i> Techado
                                            </span>
                                        )}
                                        {p.tags.includes('seguridad') && (
                                            <span style={{ background: '#EFF6FF', color: '#2563EB', fontSize: '0.68rem', fontWeight: 700, padding: '0.12rem 0.45rem', borderRadius: '4px' }}>
                                                <i className="fa-solid fa-shield-halved" style={{ marginRight: '3px' }}></i> Vigilancia 24/7
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer con Precio y Botón Reservar */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                                    <div>
                                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#006D36' }}>
                                             Bs {p.pricePerHour}
                                        </span>
                                        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}> / hora</span>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => onViewDetails?.(p)}
                                            className="driver-btn-view"
                                            style={{
                                                background: '#F1F5F9',
                                                color: '#1E293B',
                                                border: '1px solid #CBD5E1',
                                                borderRadius: '6px',
                                                padding: '0.45rem 0.75rem',
                                                fontSize: '0.76rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                transition: 'background 0.2s ease',
                                            }}
                                            title="Ver información y servicios del parqueo"
                                        >
                                            <i className="fa-solid fa-eye" style={{ color: '#006D36' }}></i>
                                            <span>Ver Parqueo</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => onReserveParking(p)}
                                            className="driver-btn-reserve"
                                            style={{
                                                background: '#006D36',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.45rem 0.85rem',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                boxShadow: '0 2px 4px rgba(0, 109, 54, 0.2)',
                                            }}
                                        >
                                            <i className="fa-solid fa-calendar-plus"></i>
                                            <span>Reservar</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
