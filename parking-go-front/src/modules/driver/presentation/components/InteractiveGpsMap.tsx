// src/modules/driver/presentation/components/InteractiveGpsMap.tsx
import React, { useState } from 'react';
import type { DriverParking } from '../../domain/DriverParking';

interface InteractiveGpsMapProps {
    parkings: DriverParking[];
    onSelectParking: (parking: DriverParking) => void;
}

export const InteractiveGpsMap: React.FC<InteractiveGpsMapProps> = ({
    parkings,
    onSelectParking,
}) => {
    const [selectedParkingId, setSelectedParkingId] = useState<string>(
        parkings[0]?.id || ''
    );

    const activeParking = parkings.find((p) => p.id === selectedParkingId) || parkings[0];

    return (
        <div
            style={{
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5CE',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                marginBottom: '1.5rem',
            }}
        >
            {/* Header del Mapa */}
            <div
                style={{
                    padding: '0.65rem 1.15rem',
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                    <i className="fa-solid fa-map-location-dot" style={{ color: '#006D36' }}></i>
                    <span>Mapa de Disponibilidad en Vivo</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="driver-gps-beacon-wrapper">
                        <span className="driver-gps-beacon-ping"></span>
                        <span className="driver-gps-beacon-dot"></span>
                    </span>
                    <span>UBICACIÓN: EQUIPETROL NORTE</span>
                </div>
            </div>

            {/* Canvas GPS Simulador */}
            <div
                style={{
                    height: '320px',
                    backgroundColor: '#F0F4F1',
                    backgroundImage: `
                        radial-gradient(circle at 50% 50%, rgba(0, 109, 54, 0.08) 0%, transparent 70%),
                        linear-gradient(#DDE3DE 1px, transparent 1px),
                        linear-gradient(90deg, #DDE3DE 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 36px 36px, 36px 36px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Líneas de Calles simuladas */}
                <div style={{ position: 'absolute', top: '48%', left: 0, right: 0, height: '14px', background: '#FFFFFF', borderTop: '1px solid #CBD5CE', borderBottom: '1px solid #CBD5CE' }}></div>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '45%', width: '14px', background: '#FFFFFF', borderLeft: '1px solid #CBD5CE', borderRight: '1px solid #CBD5CE' }}></div>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '70%', width: '10px', background: '#FFFFFF', borderLeft: '1px solid #CBD5CE', borderRight: '1px solid #CBD5CE' }}></div>

                {/* Pins flotantes */}
                {parkings.map((p) => {
                    const isSelected = p.id === activeParking?.id;
                    const isLow = p.availableSpots <= 10;
                    const bg = isSelected ? '#006D36' : isLow ? '#D97706' : '#2563EB';

                    return (
                        <div
                            key={p.id}
                            onClick={() => setSelectedParkingId(p.id)}
                            className={`driver-map-pin ${isSelected ? 'is-active' : ''}`}
                            style={{
                                position: 'absolute',
                                top: `${p.mapPosition.topPercent}%`,
                                left: `${p.mapPosition.leftPercent}%`,
                                transform: 'translate(-50%, -100%)',
                                background: bg,
                                color: '#FFFFFF',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                boxShadow: isSelected
                                    ? '0 6px 16px rgba(0, 109, 54, 0.35)'
                                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                border: isSelected ? '2.5px solid #FFFFFF' : '1.5px solid #FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                zIndex: isSelected ? 5 : 2,
                                whiteSpace: 'nowrap',
                            }}
                            title={`${p.name} - ${p.availableSpots} plazas libres`}
                        >
                            <i className="fa-solid fa-square-parking"></i>
                            <span>
                                {p.name.replace('ParkinGo ', '')} ({p.availableSpots} Plazas) – Bs {p.pricePerHour}/h
                            </span>
                        </div>
                    );
                })}

                {/* Card Flotante Inferior de Parqueo Seleccionado / Recomendado */}
                {activeParking && (
                    <div
                        key={activeParking.id}
                        className="driver-map-floating-card"
                        style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            right: '12px',
                            background: 'rgba(255, 255, 255, 0.96)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid #CBD5CE',
                            borderRadius: '8px',
                            padding: '0.75rem 1.15rem',
                            boxShadow: '0 4px 15px rgba(23, 33, 27, 0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem',
                            zIndex: 10,
                        }}
                    >
                        <div style={{ minWidth: '220px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <i className="fa-solid fa-car-side" style={{ color: '#006D36' }}></i>
                                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A' }}>
                                    Más cercano: {activeParking.name} ({activeParking.distanceKm} km)
                                </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '0.15rem' }}>
                                Tiempo estimado: {activeParking.estimatedMinutes} mins • Lectura de placa automatizada
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onSelectParking(activeParking)}
                            className="driver-btn-reserve"
                            style={{
                                background: '#006D36',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.45rem 1.15rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                            }}
                        >
                            <i className="fa-solid fa-calendar-check"></i>
                            <span>Reservar</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

