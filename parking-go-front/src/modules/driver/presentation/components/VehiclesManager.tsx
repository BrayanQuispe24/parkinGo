// src/modules/driver/presentation/components/VehiclesManager.tsx
import React, { useState } from 'react';
import type { DriverVehicle, CreateVehiclePayload, TipoVehiculo } from '../../domain/DriverVehicle';

interface VehiclesManagerProps {
    vehicles: DriverVehicle[];
    onAddVehicle: (payload: CreateVehiclePayload) => Promise<void>;
    onSetDefaultVehicle: (vehicleId: string) => Promise<void>;
    onDeleteVehicle?: (vehicleId: string) => Promise<void>;
    isSubmitting?: boolean;
}

const VEHICLE_TYPES: Array<{ type: TipoVehiculo; label: string; icon: string; desc: string }> = [
    { type: 'SEDAN', label: 'Sedán', icon: 'fa-solid fa-car-side', desc: 'Turismo estándar / compacto' },
    { type: 'SUV', label: 'SUV / 4x4', icon: 'fa-solid fa-truck-pickup', desc: 'Familiar, todo terreno' },
    { type: 'CAMIONETA', label: 'Camioneta', icon: 'fa-solid fa-truck-monster', desc: 'Pick-up o carga liviana' },
    { type: 'MOTO', label: 'Motocicleta', icon: 'fa-solid fa-motorcycle', desc: 'Moto, scooter o cuadratrack' },
    { type: 'ELECTRICO', label: 'Eléctrico / EV', icon: 'fa-solid fa-bolt', desc: 'Vehículo eléctrico o híbrido' },
    { type: 'OTRO', label: 'Otro', icon: 'fa-solid fa-van-shuttle', desc: 'Furgón, minivan u otro' },
];

const getVehicleTypeIcon = (tipo: TipoVehiculo) => {
    switch (tipo) {
        case 'MOTO':
            return 'fa-solid fa-motorcycle';
        case 'ELECTRICO':
            return 'fa-solid fa-bolt';
        case 'SUV':
        case 'CAMIONETA':
            return 'fa-solid fa-truck-pickup';
        case 'SEDAN':
        case 'OTRO':
        default:
            return 'fa-solid fa-car-side';
    }
};

const getVehicleTypeLabel = (tipo: TipoVehiculo) => {
    const found = VEHICLE_TYPES.find((t) => t.type === tipo);
    return found ? found.label : tipo;
};

export const VehiclesManager: React.FC<VehiclesManagerProps> = ({
    vehicles,
    onAddVehicle,
    onSetDefaultVehicle,
    onDeleteVehicle,
    isSubmitting,
}) => {
    // Pestaña activa: 'lista' o 'registrar'
    const [activeTab, setActiveTab] = useState<'lista' | 'registrar'>('lista');
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateVehiclePayload>({
        plate: '',
        brand: '',
        model: '',
        color: '',
        vehicleType: 'SEDAN',
        isDefault: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await onAddVehicle(formData);
            // Volver a la pestaña de listado tras guardar exitosamente
            setActiveTab('lista');
            setFormData({
                plate: '',
                brand: '',
                model: '',
                color: '',
                vehicleType: 'SEDAN',
                isDefault: false,
            });
        } catch (error: unknown) {
            const errorMsg =
                error && typeof error === 'object' && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Error al registrar el vehículo'
                    : 'Error al registrar el vehículo. Por favor verifica los datos.';
            setFormError(errorMsg);
        }
    };

    const handleDelete = async (vehicleId: string, plate: string) => {
        if (!onDeleteVehicle) return;
        const confirm = window.confirm(`¿Seguro que deseas eliminar el vehículo con placa ${plate}?`);
        if (!confirm) return;

        try {
            setDeletingId(vehicleId);
            await onDeleteVehicle(vehicleId);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            {/* Header del Módulo */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}
            >
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                        Mis Vehículos Registrados
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                        Gestiona las placas vinculadas a tu cuenta para lectura automática en garitas OCR y reservas instantáneas.
                    </p>
                </div>
            </div>

            {/* Pestañas de Navegación (Tabs Bar) */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderBottom: '1px solid #E2E8F0',
                    marginBottom: '1.5rem',
                }}
            >
                <button
                    type="button"
                    onClick={() => setActiveTab('lista')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'lista' ? '3px solid #006D36' : '3px solid transparent',
                        color: activeTab === 'lista' ? '#006D36' : '#64748B',
                        fontWeight: activeTab === 'lista' ? 800 : 600,
                        fontSize: '0.88rem',
                        padding: '0.65rem 1rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <i className="fa-solid fa-car"></i>
                    <span>Mis Vehículos</span>
                    <span
                        style={{
                            background: activeTab === 'lista' ? '#DCFCE7' : '#F1F5F9',
                            color: activeTab === 'lista' ? '#15803D' : '#64748B',
                            fontSize: '0.72rem',
                            padding: '0.1rem 0.5rem',
                            borderRadius: '999px',
                            fontWeight: 800,
                        }}
                    >
                        {vehicles.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('registrar')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'registrar' ? '3px solid #006D36' : '3px solid transparent',
                        color: activeTab === 'registrar' ? '#006D36' : '#64748B',
                        fontWeight: activeTab === 'registrar' ? 800 : 600,
                        fontSize: '0.88rem',
                        padding: '0.65rem 1rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <i className="fa-solid fa-circle-plus"></i>
                    <span>Registrar Nuevo Vehículo</span>
                </button>
            </div>

            {/* CONTENIDO PESTAÑA 1: LISTADO DE VEHÍCULOS */}
            {activeTab === 'lista' && (
                <div>
                    {vehicles.length === 0 ? (
                        <div
                            style={{
                                background: '#FFFFFF',
                                border: '2px dashed #CBD5E1',
                                borderRadius: '12px',
                                padding: '3.5rem 2rem',
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '64px',
                                    height: '64px',
                                    background: '#F1F5F9',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.25rem auto',
                                    color: '#64748B',
                                    fontSize: '1.75rem',
                                }}
                            >
                                <i className="fa-solid fa-car"></i>
                            </div>
                            <h4 style={{ margin: '0 0 0.4rem 0', color: '#1E293B', fontWeight: 800, fontSize: '1.1rem' }}>
                                No tienes vehículos registrados
                            </h4>
                            <p style={{ margin: '0 auto 1.5rem auto', color: '#64748B', fontSize: '0.85rem', maxWidth: '440px', lineHeight: 1.5 }}>
                                Registra tu vehículo (placa, modelo, tipo y color) para acceder a los parqueos de manera automática y sin demoras.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveTab('registrar')}
                                style={{
                                    background: '#006D36',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.65rem 1.4rem',
                                    fontSize: '0.86rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 2px 8px rgba(0, 109, 54, 0.25)',
                                }}
                            >
                                <i className="fa-solid fa-plus"></i>
                                <span>Registrar mi Primer Vehículo</span>
                            </button>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1.25rem',
                            }}
                        >
                            {vehicles.map((v) => (
                                <div
                                    key={v.id}
                                    style={{
                                        background: '#FFFFFF',
                                        border: v.isDefault ? '2px solid #006D36' : '1px solid #E2E8F0',
                                        borderRadius: '12px',
                                        padding: '1.35rem',
                                        boxShadow: v.isDefault ? '0 4px 14px rgba(0, 109, 54, 0.1)' : '0 2px 6px rgba(0,0,0,0.03)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        gap: '1.2rem',
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            {/* Placa Estilo Oficial Boliviana */}
                                            <div
                                                style={{
                                                    background: '#FFFFFF',
                                                    border: '2px solid #1E3A8A',
                                                    borderRadius: '6px',
                                                    padding: '0.2rem 0.65rem',
                                                    fontFamily: 'monospace, sans-serif',
                                                    fontWeight: 800,
                                                    fontSize: '1rem',
                                                    color: '#1E3A8A',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                                                }}
                                            >
                                                <span style={{ fontSize: '0.7rem', background: '#1E3A8A', color: '#FFFFFF', padding: '0.05rem 0.35rem', borderRadius: '3px' }}>BOL</span>
                                                <span style={{ letterSpacing: '0.05em' }}>{v.plate}</span>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                {v.isDefault ? (
                                                    <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        <i className="fa-solid fa-star"></i> Predeterminado
                                                    </span>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => onSetDefaultVehicle(v.id)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #CBD5E1',
                                                            borderRadius: '6px',
                                                            padding: '0.25rem 0.6rem',
                                                            fontSize: '0.74rem',
                                                            fontWeight: 600,
                                                            color: '#475569',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        title="Hacer este vehículo el predeterminado para tus reservas"
                                                    >
                                                        Predeterminar
                                                    </button>
                                                )}

                                                {onDeleteVehicle && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(v.id, v.plate)}
                                                        disabled={deletingId === v.id}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '1px solid #FEE2E2',
                                                            color: '#EF4444',
                                                            borderRadius: '6px',
                                                            padding: '0.25rem 0.55rem',
                                                            fontSize: '0.74rem',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        title="Eliminar vehículo"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '10px',
                                                    background: v.isDefault ? '#F0FDF4' : '#F1F5F9',
                                                    color: v.isDefault ? '#006D36' : '#475569',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.15rem',
                                                }}
                                            >
                                                <i className={getVehicleTypeIcon(v.vehicleType)}></i>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                                    {v.model}
                                                </div>
                                                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                                                    Tipo: <strong style={{ color: '#334155' }}>{getVehicleTypeLabel(v.vehicleType)}</strong> • Color: <strong style={{ color: '#334155' }}>{v.color}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                                        <i className="fa-solid fa-shield-check"></i>
                                        <span>Habilitado para lectura OCR / LPR en barreras</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* CONTENIDO PESTAÑA 2: FORMULARIO DE REGISTRO EN PESTAÑA */}
            {activeTab === 'registrar' && (
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                        overflow: 'hidden',
                        maxWidth: '780px',
                        margin: '0 auto',
                    }}
                >
                    {/* Header del Panel */}
                    <div
                        style={{
                            padding: '1.25rem 1.75rem',
                            background: 'linear-gradient(135deg, #063D25 0%, #006D36 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.05rem' }}>
                                <i className="fa-solid fa-car-side"></i>
                                <span>Nuevo Registro de Vehículo</span>
                            </div>
                            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#A7F3D0' }}>
                                Completa los datos para vincular tu vehículo a tu perfil de conductor
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setActiveTab('lista')}
                            style={{
                                background: 'rgba(255,255,255,0.15)',
                                border: 'none',
                                color: '#FFFFFF',
                                borderRadius: '6px',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.35rem' }}></i>
                            Volver a la lista
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
                        {formError && (
                            <div
                                style={{
                                    marginBottom: '1.25rem',
                                    padding: '0.75rem 1rem',
                                    background: '#FEF2F2',
                                    border: '1px solid #FCA5A5',
                                    borderRadius: '8px',
                                    color: '#991B1B',
                                    fontSize: '0.84rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                    fontWeight: 600,
                                }}
                            >
                                <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1rem', color: '#EF4444' }}></i>
                                <span>{formError}</span>
                            </div>
                        )}

                        {/* Selector Visual de Tipo de Vehículo */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.65rem' }}>
                                1. Selecciona el Tipo de Vehículo (Enum) *
                            </label>
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))',
                                    gap: '0.65rem',
                                }}
                            >
                                {VEHICLE_TYPES.map((vt) => {
                                    const isSelected = formData.vehicleType === vt.type;
                                    return (
                                        <div
                                            key={vt.type}
                                            onClick={() => setFormData({ ...formData, vehicleType: vt.type })}
                                            style={{
                                                border: isSelected ? '2px solid #006D36' : '1px solid #E2E8F0',
                                                background: isSelected ? '#F0FDF4' : '#FFFFFF',
                                                borderRadius: '8px',
                                                padding: '0.75rem 0.5rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                boxShadow: isSelected ? '0 2px 8px rgba(0, 109, 54, 0.15)' : 'none',
                                            }}
                                        >
                                            <i
                                                className={vt.icon}
                                                style={{
                                                    fontSize: '1.4rem',
                                                    color: isSelected ? '#006D36' : '#64748B',
                                                    display: 'block',
                                                    marginBottom: '0.35rem',
                                                }}
                                            ></i>
                                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSelected ? '#006D36' : '#1E293B' }}>
                                                {vt.label}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Datos de Placa y Modelo */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1E293B', marginBottom: '0.65rem' }}>
                                2. Datos de Identificación del Vehículo
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                                        Número de Placa *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.plate}
                                        onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                        placeholder="Ej: 9912-KLS"
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.9rem',
                                            textTransform: 'uppercase',
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                        }}
                                    />
                                    <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem', display: 'block' }}>
                                        Formato de placa estándar de 3 a 12 caracteres.
                                    </span>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                                        Color Predominante *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="Ej: Blanco Perlado, Gris, Negro"
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.88rem',
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                                        Marca
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="Ej: Toyota, Nissan, Tesla"
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.88rem',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                                        Modelo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        placeholder="Ej: Corolla 2024 / Hilux 4x4"
                                        style={{
                                            width: '100%',
                                            padding: '0.6rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            fontSize: '0.88rem',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Opción Predeterminado */}
                        <div
                            style={{
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '0.85rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.65rem',
                                marginBottom: '1.75rem',
                            }}
                        >
                            <input
                                type="checkbox"
                                id="isDefaultCheckTab"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#006D36' }}
                            />
                            <label htmlFor="isDefaultCheckTab" style={{ fontSize: '0.82rem', color: '#1E293B', cursor: 'pointer', fontWeight: 600 }}>
                                Marcar como mi vehículo predeterminado para reservas directas y rápidas
                            </label>
                        </div>

                        {/* Botones de Acción */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTab('lista')}
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    borderRadius: '8px',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#475569',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '0.6rem 1.6rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#006D36',
                                    color: '#FFFFFF',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0, 109, 54, 0.25)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>
                                <span>{isSubmitting ? 'Guardando vehículo...' : 'Guardar y Registrar Vehículo'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
