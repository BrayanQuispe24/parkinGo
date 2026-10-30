// src/modules/driver/presentation/components/ParkingDetailModal.tsx
import React, { useState } from 'react';
import type { DriverParking } from '../../domain/DriverParking';
import imgEmpresarial from '../../../../assets/parking_empresarial_1789393502203.png';

interface ParkingDetailModalProps {
    isOpen: boolean;
    parking: DriverParking | null;
    onClose: () => void;
    onProceedToBooking: (parking: DriverParking, selectedSpaceCode?: string | null) => void;
}

export const ParkingDetailModal: React.FC<ParkingDetailModalProps> = ({
    isOpen,
    parking,
    onClose,
    onProceedToBooking,
}) => {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'espacios' | 'info' | 'horarios' | 'tarifas' | 'servicios'>('espacios');
    const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
    const [selectedSpaceCode, setSelectedSpaceCode] = useState<string | null>(null);

    if (!isOpen || !parking) return null;

    const photos = parking.fotos && parking.fotos.length > 0 ? parking.fotos : [parking.photoUrl || imgEmpresarial];
    const currentPhoto = photos[selectedPhotoIndex] || photos[0] || imgEmpresarial;

    const isLowCapacity = parking.availableSpots <= 10;
    const capacityPercent = parking.totalSpots > 0 ? Math.round((parking.availableSpots / parking.totalSpots) * 100) : 0;

    const mapsUrl = parking.latitude && parking.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${parking.latitude},${parking.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parking.address + ', ' + parking.zone)}`;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(5px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                overflowY: 'auto',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid #CBD5E1',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.2s ease',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera del Modal */}
                <div
                    style={{
                        padding: '1.1rem 1.4rem',
                        background: '#063D25',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.12)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#22C55E',
                                fontSize: '1.1rem',
                            }}
                        >
                            <i className="fa-solid fa-square-parking"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{parking.name}</h3>
                            <span style={{ fontSize: '0.74rem', color: '#86EFAC' }}>
                                <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }}></i>
                                {parking.zone}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#FFFFFF',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease',
                        }}
                        title="Cerrar modal"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Contenedor desplazable de contenido */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem' }}>
                    {/* Galería de Fotos */}
                    <div style={{ position: 'relative', width: '100%', height: '230px', borderRadius: '12px', overflow: 'hidden', background: '#0F172A' }}>
                        <img
                            src={currentPhoto}
                            alt={parking.name}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = imgEmpresarial;
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />

                        {/* Badge de Plazas flotante */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'rgba(6, 61, 37, 0.95)',
                                color: isLowCapacity ? '#FCD34D' : '#34D399',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                padding: '0.28rem 0.75rem',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
                            }}
                        >
                            <span
                                style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: isLowCapacity ? '#F59E0B' : '#10B981',
                                }}
                            ></span>
                            <span>{parking.availableSpots} de {parking.totalSpots} Plazas Libres ({capacityPercent}%)</span>
                        </div>

                        {/* Botón rápido para abrir en Google Maps */}
                        <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                position: 'absolute',
                                bottom: '12px',
                                right: '12px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                color: '#0F172A',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                padding: '0.35rem 0.75rem',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            }}
                        >
                            <i className="fa-solid fa-diamond-turn-right" style={{ color: '#006D36' }}></i>
                            <span>Cómo llegar (GPS)</span>
                        </a>
                    </div>

                    {/* Selector de miniaturas de galería si hay más de 1 foto */}
                    {photos.length > 1 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.65rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                            {photos.map((url, i) => (
                                <button
                                    key={url + i}
                                    type="button"
                                    onClick={() => setSelectedPhotoIndex(i)}
                                    style={{
                                        border: selectedPhotoIndex === i ? '2.5px solid #006D36' : '1px solid #E2E8F0',
                                        borderRadius: '6px',
                                        width: '64px',
                                        height: '46px',
                                        padding: 0,
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        opacity: selectedPhotoIndex === i ? 1 : 0.65,
                                    }}
                                >
                                    <img
                                        src={url}
                                        alt={`Foto ${i + 1}`}
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = imgEmpresarial;
                                        }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Resumen Clave de Tarifa y Dirección */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '0.85rem',
                            margin: '1rem 0',
                            padding: '0.85rem 1rem',
                            background: '#F8FAFC',
                            borderRadius: '10px',
                            border: '1px solid #E2E8F0',
                        }}
                    >
                        <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Tarifa Base</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#006D36' }}>Bs {parking.pricePerHour}</span>
                                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>/ hora</span>
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Dirección Registrada</span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B' }}>{parking.address}</span>
                        </div>
                    </div>

                    {/* Barra de Pestañas Internas */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', marginBottom: '1rem', gap: '0.4rem', overflowX: 'auto', paddingBottom: '2px' }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab('espacios')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0.55rem 0.85rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: activeTab === 'espacios' ? '#006D36' : '#64748B',
                                borderBottom: activeTab === 'espacios' ? '2.5px solid #006D36' : '2.5px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                            }}
                        >
                            <i className="fa-solid fa-square-parking"></i>
                            <span>Plazas Libres</span>
                            <span
                                style={{
                                    background: activeTab === 'espacios' ? '#006D36' : '#E2E8F0',
                                    color: activeTab === 'espacios' ? '#FFFFFF' : '#475569',
                                    fontSize: '0.68rem',
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '12px',
                                    fontWeight: 800,
                                }}
                            >
                                {parking.availableSpots}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('info')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0.55rem 0.85rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: activeTab === 'info' ? '#006D36' : '#64748B',
                                borderBottom: activeTab === 'info' ? '2.5px solid #006D36' : '2.5px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <i className="fa-solid fa-circle-info" style={{ marginRight: '6px' }}></i> Información
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('horarios')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0.55rem 0.85rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: activeTab === 'horarios' ? '#006D36' : '#64748B',
                                borderBottom: activeTab === 'horarios' ? '2.5px solid #006D36' : '2.5px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <i className="fa-solid fa-clock" style={{ marginRight: '6px' }}></i> Horarios
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('tarifas')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0.55rem 0.85rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: activeTab === 'tarifas' ? '#006D36' : '#64748B',
                                borderBottom: activeTab === 'tarifas' ? '2.5px solid #006D36' : '2.5px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <i className="fa-solid fa-money-bill-wave" style={{ marginRight: '6px' }}></i> Tarifas
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('servicios')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                padding: '0.55rem 0.85rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: activeTab === 'servicios' ? '#006D36' : '#64748B',
                                borderBottom: activeTab === 'servicios' ? '2.5px solid #006D36' : '2.5px solid transparent',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px' }}></i> Servicios Extras
                        </button>
                    </div>

                    {/* Contenido Pestaña 1: Información & Amenidades */}
                    {activeTab === 'info' && (
                        <div>
                            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                                Características del Estacionamiento
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.55rem 0.75rem', borderRadius: '8px', background: '#F1F5F9' }}>
                                    <i className="fa-solid fa-shield-halved" style={{ color: '#2563EB', fontSize: '1.1rem' }}></i>
                                    <div>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>Vigilancia y Seguridad</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Cámaras y personal de turno</span>
                                    </div>
                                </div>
                                {parking.tags.includes('cubierto') && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.55rem 0.75rem', borderRadius: '8px', background: '#F1F5F9' }}>
                                        <i className="fa-solid fa-warehouse" style={{ color: '#059669', fontSize: '1.1rem' }}></i>
                                        <div>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>Plaza Techada</span>
                                            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Protegido de sol y lluvia</span>
                                        </div>
                                    </div>
                                )}
                                {parking.tags.includes('ev') && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.55rem 0.75rem', borderRadius: '8px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                                        <i className="fa-solid fa-charging-station" style={{ color: '#059669', fontSize: '1.1rem' }}></i>
                                        <div>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065F46', display: 'block' }}>Punto de Carga EV</span>
                                            <span style={{ fontSize: '0.7rem', color: '#047857' }}>Compatible Tipo 2 / CCS2</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Contenido Pestaña 2: Espacios / Plazas Disponibles */}
                    {activeTab === 'espacios' && (() => {
                        // Si hay espacios en BD los usamos; si no, generamos tarjetas representativas según totalSpots y availableSpots
                        const rawSpaces = parking.spaces && parking.spaces.length > 0 ? parking.spaces : [];
                        const spacesList: typeof rawSpaces = rawSpaces.length > 0
                            ? rawSpaces
                            : Array.from({ length: Math.min(parking.totalSpots || 12, 30) }, (_, i) => {
                                const isFree = i < (parking.availableSpots || 0);
                                const levelName = parking.tags.includes('cubierto')
                                    ? (i < 12 ? 'Nivel 1' : 'Nivel 2')
                                    : 'Planta Baja';

                                let spaceType = 'AUTO';
                                if (parking.tags.includes('ev') && (i === 0 || i === 1)) {
                                    spaceType = 'ELECTRICO';
                                } else if (i % 6 === 2) {
                                    spaceType = 'MOTO';
                                } else if (i % 8 === 4) {
                                    spaceType = 'CAMIONETA';
                                } else if (i === 3) {
                                    spaceType = 'DISCAPACITADO';
                                }

                                const codeNum = (i + 1).toString().padStart(2, '0');
                                const prefix = levelName === 'Nivel 2' ? 'B' : 'A';
                                return {
                                    id: `slot-${parking.id}-${i}`,
                                    code: `${prefix}-${codeNum}`,
                                    type: spaceType,
                                    level: levelName,
                                    status: isFree ? 'DISPONIBLE' : 'OCUPADO',
                                };
                            });

                        const uniqueLevels = Array.from(new Set(spacesList.map((s) => s.level).filter(Boolean)));
                        const uniqueTypes = Array.from(new Set(spacesList.map((s) => s.type).filter(Boolean)));

                        const filteredSpaces = spacesList.filter((s) => {
                            const matchLvl = selectedLevelFilter === 'ALL' || s.level === selectedLevelFilter;
                            const matchTyp = selectedTypeFilter === 'ALL' || s.type === selectedTypeFilter;
                            return matchLvl && matchTyp;
                        });

                        const availableCount = spacesList.filter((s) => s.status === 'DISPONIBLE').length;
                        const occupiedCount = spacesList.length - availableCount;

                        const getTypeInfo = (type: string) => {
                            switch (type?.toUpperCase()) {
                                case 'MOTO':
                                    return {
                                        label: 'Moto',
                                        icon: 'fa-solid fa-motorcycle',
                                        bg: '#EFF6FF',
                                        color: '#1D4ED8',
                                        border: '#BFDBFE',
                                    };
                                case 'CAMIONETA':
                                    return {
                                        label: 'SUV / Camioneta',
                                        icon: 'fa-solid fa-truck-pickup',
                                        bg: '#FEF3C7',
                                        color: '#B45309',
                                        border: '#FDE68A',
                                    };
                                case 'ELECTRICO':
                                    return {
                                        label: 'Carga EV ⚡',
                                        icon: 'fa-solid fa-charging-station',
                                        bg: '#ECFDF5',
                                        color: '#047857',
                                        border: '#A7F3D0',
                                    };
                                case 'DISCAPACITADO':
                                    return {
                                        label: 'Preferencial ♿',
                                        icon: 'fa-solid fa-wheelchair',
                                        bg: '#F5F3FF',
                                        color: '#6D28D9',
                                        border: '#DDD6FE',
                                    };
                                default:
                                    return {
                                        label: 'Automóvil',
                                        icon: 'fa-solid fa-car',
                                        bg: '#F8FAFC',
                                        color: '#334155',
                                        border: '#CBD5E1',
                                    };
                            }
                        };

                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                                {/* Panel de Resumen de Disponibilidad */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '0.65rem',
                                        background: '#F8FAFC',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, display: 'block' }}>Total Espacios</span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>{parking.totalSpots}</span>
                                    </div>
                                    <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#16A34A', fontWeight: 700, display: 'block' }}>
                                            <i className="fa-solid fa-circle" style={{ fontSize: '0.55rem', marginRight: '4px' }}></i>
                                            Plazas Libres
                                        </span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16A34A' }}>{availableCount}</span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 600, display: 'block' }}>
                                            <i className="fa-solid fa-circle" style={{ fontSize: '0.55rem', marginRight: '4px' }}></i>
                                            Ocupadas
                                        </span>
                                        <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#64748B' }}>{occupiedCount}</span>
                                    </div>
                                </div>

                                {/* Filtros interactivos */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <i className="fa-solid fa-cubes-stacked" style={{ color: '#006D36' }}></i>
                                        Boxes y Bahías del Parqueo:
                                    </span>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                        {/* Filtro por Nivel */}
                                        {uniqueLevels.length > 1 && (
                                            <select
                                                value={selectedLevelFilter}
                                                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    borderRadius: '6px',
                                                    border: '1px solid #CBD5E1',
                                                    background: '#FFFFFF',
                                                    color: '#1E293B',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <option value="ALL">Todos los niveles</option>
                                                {uniqueLevels.map((lvl) => (
                                                    <option key={lvl} value={lvl}>{lvl}</option>
                                                ))}
                                            </select>
                                        )}

                                        {/* Filtro por Tipo */}
                                        {uniqueTypes.length > 1 && (
                                            <select
                                                value={selectedTypeFilter}
                                                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    borderRadius: '6px',
                                                    border: '1px solid #CBD5E1',
                                                    background: '#FFFFFF',
                                                    color: '#1E293B',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <option value="ALL">Cualquier tipo de vehículo</option>
                                                {uniqueTypes.map((typ) => (
                                                    <option key={typ} value={typ}>{typ}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                {/* Grilla de Tarjetas Representativas de Espacios */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                        gap: '0.75rem',
                                        maxHeight: '300px',
                                        overflowY: 'auto',
                                        padding: '0.2rem',
                                    }}
                                >
                                    {filteredSpaces.map((space) => {
                                        const isAvailable = space.status === 'DISPONIBLE';
                                        const isSelected = selectedSpaceId === space.id;
                                        const typeInfo = getTypeInfo(space.type);

                                        return (
                                            <div
                                                key={space.id}
                                                onClick={() => {
                                                    if (isAvailable) {
                                                        if (selectedSpaceId === space.id) {
                                                            setSelectedSpaceId(null);
                                                            setSelectedSpaceCode(null);
                                                        } else {
                                                            setSelectedSpaceId(space.id);
                                                            setSelectedSpaceCode(space.code);
                                                        }
                                                    }
                                                }}
                                                style={{
                                                    background: isSelected
                                                        ? '#F0FDF4'
                                                        : isAvailable
                                                            ? '#FFFFFF'
                                                            : '#F8FAFC',
                                                    borderRadius: '10px',
                                                    border: isSelected
                                                        ? '2px solid #006D36'
                                                        : isAvailable
                                                            ? '1.5px solid #BBF7D0'
                                                            : '1px solid #E2E8F0',
                                                    borderLeft: isSelected
                                                        ? '4px solid #006D36'
                                                        : isAvailable
                                                            ? '4px solid #22C55E'
                                                            : '4px solid #CBD5E1',
                                                    padding: '0.65rem 0.65rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                                                    opacity: isAvailable ? 1 : 0.65,
                                                    position: 'relative',
                                                    boxShadow: isSelected
                                                        ? '0 4px 12px rgba(0, 109, 54, 0.18)'
                                                        : '0 2px 5px rgba(0, 0, 0, 0.04)',
                                                    transition: 'all 0.18s ease',
                                                    transform: isSelected ? 'translateY(-2px)' : 'none',
                                                }}
                                            >
                                                {/* Header de la Tarjeta del Espacio */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                                                    <span
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            fontWeight: 900,
                                                            color: isSelected ? '#006D36' : isAvailable ? '#0F172A' : '#64748B',
                                                            letterSpacing: '0.3px',
                                                        }}
                                                    >
                                                        {space.code}
                                                    </span>

                                                    {/* Badge de Estado con punto LED */}
                                                    <span
                                                        style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: 800,
                                                            padding: '0.15rem 0.45rem',
                                                            borderRadius: '12px',
                                                            background: isSelected
                                                                ? '#DCFCE7'
                                                                : isAvailable
                                                                    ? '#ECFDF5'
                                                                    : '#F1F5F9',
                                                            color: isSelected
                                                                ? '#006D36'
                                                                : isAvailable
                                                                    ? '#059669'
                                                                    : '#94A3B8',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                width: '5px',
                                                                height: '5px',
                                                                borderRadius: '50%',
                                                                background: isAvailable ? '#10B981' : '#94A3B8',
                                                            }}
                                                        ></span>
                                                        {isAvailable ? 'Libre' : 'Ocupado'}
                                                    </span>
                                                </div>

                                                {/* Representación Visual de Bahía / Plaza */}
                                                <div
                                                    style={{
                                                        height: '52px',
                                                        background: isSelected
                                                            ? '#DCFCE7'
                                                            : isAvailable
                                                                ? '#F0FDF4'
                                                                : '#F1F5F9',
                                                        borderRadius: '6px',
                                                        border: isSelected
                                                            ? '1px dashed #006D36'
                                                            : isAvailable
                                                                ? '1px dashed #86EFAC'
                                                                : '1px dashed #CBD5E1',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.2rem',
                                                        margin: '0.2rem 0 0.45rem 0',
                                                    }}
                                                >
                                                    <i
                                                        className={typeInfo.icon}
                                                        style={{
                                                            fontSize: '1.25rem',
                                                            color: isSelected
                                                                ? '#006D36'
                                                                : isAvailable
                                                                    ? typeInfo.color
                                                                    : '#94A3B8',
                                                        }}
                                                    ></i>
                                                    <span
                                                        style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: 700,
                                                            color: isSelected ? '#006D36' : isAvailable ? '#059669' : '#94A3B8',
                                                        }}
                                                    >
                                                        {isSelected
                                                            ? 'Seleccionado ✓'
                                                            : isAvailable
                                                                ? 'Elegir Box'
                                                                : 'Ocupado'}
                                                    </span>
                                                </div>

                                                {/* Footer de la tarjeta con Nivel y Tipo */}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.65rem' }}>
                                                    <span style={{ color: '#64748B', fontWeight: 600 }}>
                                                        <i className="fa-solid fa-layer-group" style={{ marginRight: '3px', fontSize: '0.6rem' }}></i>
                                                        {space.level}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontSize: '0.62rem',
                                                            fontWeight: 700,
                                                            padding: '0.08rem 0.35rem',
                                                            borderRadius: '4px',
                                                            background: typeInfo.bg,
                                                            color: typeInfo.color,
                                                            border: `1px solid ${typeInfo.border}`,
                                                        }}
                                                    >
                                                        {typeInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Banner interactivo cuando se selecciona una tarjeta de espacio */}
                                {selectedSpaceId && (
                                    <div
                                        style={{
                                            padding: '0.65rem 0.95rem',
                                            borderRadius: '8px',
                                            background: '#ECFDF5',
                                            border: '1.5px solid #006D36',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '0.78rem',
                                            color: '#065F46',
                                            boxShadow: '0 2px 8px rgba(0, 109, 54, 0.1)',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: '#006D36',
                                                    color: '#FFFFFF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                }}
                                            >
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                            <span>
                                                Has elegido el espacio{' '}
                                                <strong>{spacesList.find((s) => s.id === selectedSpaceId)?.code}</strong> ({spacesList.find((s) => s.id === selectedSpaceId)?.level}).
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedSpaceId(null);
                                                setSelectedSpaceCode(null);
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: '#065F46',
                                                fontSize: '0.74rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            Cambiar plaza
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {/* Contenido Pestaña 2: Horarios de Atención */}
                    {activeTab === 'horarios' && (
                        <div>
                            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                                Días y Horarios de Atención
                            </h4>
                            {parking.horarios && parking.horarios.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    {parking.horarios.map((h, idx) => (
                                        <div
                                            key={h.dia + idx}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.45rem 0.75rem',
                                                borderRadius: '6px',
                                                background: '#F8FAFC',
                                                border: '1px solid #F1F5F9',
                                                fontSize: '0.78rem',
                                            }}
                                        >
                                            <span style={{ fontWeight: 700, color: '#1E293B', textTransform: 'capitalize' }}>
                                                {h.dia.toLowerCase()}
                                            </span>
                                            <span style={{ color: '#006D36', fontWeight: 600 }}>
                                                {h.horaInicio} - {h.horaCierre}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                                    Atención continua 24 horas los 7 días de la semana.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Contenido Pestaña 3: Tarifas */}
                    {activeTab === 'tarifas' && (
                        <div>
                            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                                Esquemas de Tarifas Vigentes
                            </h4>
                            {parking.tarifas && parking.tarifas.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                    {parking.tarifas.map((t) => (
                                        <div
                                            key={t.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.6rem 0.85rem',
                                                borderRadius: '8px',
                                                background: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                            }}
                                        >
                                            <div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>
                                                    {t.descripcion}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                                    Modalidad: {t.modalidad}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#006D36' }}>
                                                Bs {t.monto}.00
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>Tarifa Estándar Diurna</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#006D36' }}>Bs {parking.pricePerHour}.00 / hora</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Contenido Pestaña 4: Servicios Extras */}
                    {activeTab === 'servicios' && (
                        <div>
                            <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                                Servicios Adicionales Disponibles
                            </h4>
                            {parking.serviciosExtras && parking.serviciosExtras.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                    {parking.serviciosExtras.map((s) => (
                                        <div
                                            key={s.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '0.6rem 0.85rem',
                                                borderRadius: '8px',
                                                background: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                            }}
                                        >
                                            <div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', display: 'block' }}>
                                                    {s.nombre}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Servicio opcional en parqueo</span>
                                            </div>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                                                +Bs {s.precio}.00
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                                    Este parqueo no tiene servicios adicionales configurados actualmente.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer de Acciones del Modal */}
                <div
                    style={{
                        padding: '1rem 1.4rem',
                        background: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            padding: '0.55rem 1.15rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#475569',
                            cursor: 'pointer',
                        }}
                    >
                        Cerrar
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onProceedToBooking(parking, selectedSpaceCode);
                        }}
                        style={{
                            background: '#006D36',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.6rem 1.45rem',
                            fontSize: '0.84rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 12px rgba(0, 109, 54, 0.25)',
                        }}
                    >
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>
                            {selectedSpaceCode
                                ? `Reservar Box ${selectedSpaceCode}`
                                : 'Reservar Plaza Ahora'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};
