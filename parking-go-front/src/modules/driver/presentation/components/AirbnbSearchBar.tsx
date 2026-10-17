// src/modules/driver/presentation/components/AirbnbSearchBar.tsx
import React from 'react';
import type { DriverVehicle } from '../../domain/DriverVehicle';

interface AirbnbSearchBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    vehicles: DriverVehicle[];
    selectedVehiclePlate: string;
    onSelectVehicle: (plate: string) => void;
    durationLabel: string;
    onOpenDurationModal?: () => void;
    onSearchSubmit?: () => void;
}

export const AirbnbSearchBar: React.FC<AirbnbSearchBarProps> = ({
    searchQuery,
    onSearchChange,
    vehicles,
    selectedVehiclePlate,
    onSelectVehicle,
    durationLabel,
    onOpenDurationModal,
    onSearchSubmit,
}) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
            <div
                className="driver-searchbar-capsule"
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #DDDDDD',
                    borderRadius: '40px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.4rem 0.6rem 0.4rem 1.4rem',
                    width: '100%',
                    maxWidth: '860px',
                    gap: '0.5rem',
                }}
            >
                {/* Segmento 1: Dónde aparcar */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1.2, minWidth: 0 }}>
                    <label
                        style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#15803D',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            marginBottom: '0.15rem',
                        }}
                    >
                        <i className="fa-solid fa-location-dot"></i>
                        <span>Dónde aparcar</span>
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por parqueo, zona o calle..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            width: '100%',
                        }}
                    />
                </div>

                <div style={{ width: '1px', height: '32px', background: '#E2E8F0', flexShrink: 0 }}></div>

                {/* Segmento 2: Fecha & Duración */}
                <div
                    onClick={onOpenDurationModal}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        cursor: 'pointer',
                        minWidth: 0,
                    }}
                >
                    <label
                        style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            marginBottom: '0.15rem',
                        }}
                    >
                        <i className="fa-solid fa-calendar"></i>
                        <span>Fecha & Duración</span>
                    </label>
                    <span
                        style={{
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            color: '#334155',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {durationLabel || 'Hoy • 2 Horas'}
                    </span>
                </div>

                <div style={{ width: '1px', height: '32px', background: '#E2E8F0', flexShrink: 0 }}></div>

                {/* Segmento 3: Vehículo */}
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <label
                        style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            color: '#475569',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            marginBottom: '0.15rem',
                        }}
                    >
                        <i className="fa-solid fa-car"></i>
                        <span>Vehículo</span>
                    </label>
                    <select
                        value={selectedVehiclePlate}
                        onChange={(e) => onSelectVehicle(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            color: '#0F172A',
                            cursor: 'pointer',
                            width: '100%',
                        }}
                    >
                        {vehicles.map((v) => (
                            <option key={v.id} value={v.plate}>
                                {v.plate} ({v.model})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón Circular Esmeralda */}
                <button
                    type="button"
                    onClick={onSearchSubmit}
                    className="driver-search-btn"
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        flexShrink: 0,
                        boxShadow: '0 4px 10px rgba(0, 109, 54, 0.3)',
                    }}
                    title="Buscar Parqueo"
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    );
};
