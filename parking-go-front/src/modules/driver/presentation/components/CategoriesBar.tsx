// src/modules/driver/presentation/components/CategoriesBar.tsx
import React from 'react';
import type { ParkingTag } from '../../domain/DriverParking';

interface CategoriesBarProps {
    activeCategory: ParkingTag;
    onSelectCategory: (cat: ParkingTag) => void;
    showMap: boolean;
    onToggleMap: () => void;
}

export const CategoriesBar: React.FC<CategoriesBarProps> = ({
    activeCategory,
    onSelectCategory,
    showMap,
    onToggleMap,
}) => {
    const categories: Array<{ id: ParkingTag; label: string; icon: string; iconColor?: string }> = [
        { id: 'all', label: 'Todos', icon: 'fa-solid fa-border-all' },
        { id: 'ev', label: 'Carga EV', icon: 'fa-solid fa-charging-station', iconColor: '#10B981' },
        { id: 'cubierto', label: 'Techados', icon: 'fa-solid fa-warehouse' },
        { id: 'seguridad', label: 'Seguridad 24/7', icon: 'fa-solid fa-shield-halved' },
    ];

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.75rem',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '0.75rem',
                overflowX: 'auto',
                marginBottom: '1.5rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                {categories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                        <div
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id)}
                            className="driver-category-pill"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem',
                                cursor: 'pointer',
                                paddingBottom: '0.35rem',
                                borderBottom: isActive ? '2px solid #006D36' : '2px solid transparent',
                                color: isActive ? '#006D36' : '#64748B',
                                fontWeight: isActive ? 700 : 500,
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <i
                                className={cat.icon}
                                style={{
                                    fontSize: '1.15rem',
                                    color: cat.iconColor || (isActive ? '#006D36' : '#64748B'),
                                    transition: 'color 0.2s ease, transform 0.2s ease',
                                }}
                            ></i>
                            <span style={{ fontSize: '0.78rem' }}>{cat.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Botón Toggle Mapa */}
            <button
                type="button"
                onClick={onToggleMap}
                className="driver-btn-reserve"
                style={{
                    marginLeft: 'auto',
                    border: '1px solid #CBD5E1',
                    borderRadius: '20px',
                    padding: '0.4rem 0.9rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: '#FFFFFF',
                    color: '#0F172A',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    flexShrink: 0,
                }}
            >
                <i className={`fa-solid ${showMap ? 'fa-eye-slash' : 'fa-map'}`} style={{ color: '#006D36' }}></i>
                <span>{showMap ? 'Ocultar Mapa' : 'Mostrar Mapa'}</span>
            </button>
        </div>
    );
};
