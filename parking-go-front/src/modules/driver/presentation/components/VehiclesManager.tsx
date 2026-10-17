// src/modules/driver/presentation/components/VehiclesManager.tsx
import React, { useState } from 'react';
import type { DriverVehicle, CreateVehiclePayload } from '../../domain/DriverVehicle';

interface VehiclesManagerProps {
    vehicles: DriverVehicle[];
    onAddVehicle: (payload: CreateVehiclePayload) => Promise<void>;
    onSetDefaultVehicle: (vehicleId: string) => Promise<void>;
    isSubmitting?: boolean;
}

export const VehiclesManager: React.FC<VehiclesManagerProps> = ({
    vehicles,
    onAddVehicle,
    onSetDefaultVehicle,
    isSubmitting,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<CreateVehiclePayload>({
        plate: '',
        brand: '',
        model: '',
        color: '',
        vehicleType: 'SEDAN',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onAddVehicle(formData);
        setIsModalOpen(false);
        setFormData({
            plate: '',
            brand: '',
            model: '',
            color: '',
            vehicleType: 'SEDAN',
        });
    };

    return (
        <div>
            {/* Header del Bloque */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}
            >
                <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Mis Vehículos Registrados
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                        Gestiona las placas vinculadas a tu cuenta para lectura automática en barreras de garita.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                    }}
                >
                    <i className="fa-solid fa-plus"></i>
                    <span>Registrar Vehículo</span>
                </button>
            </div>

            {/* Grid de Vehículos */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem',
                }}
            >
                {vehicles.map((v) => (
                    <div
                        key={v.id}
                        style={{
                            background: '#FFFFFF',
                            border: v.isDefault ? '2px solid #006D36' : '1px solid #E2E8F0',
                            borderRadius: '10px',
                            padding: '1.25rem',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '1rem',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                {/* Badge Placa Boliviana */}
                                <div
                                    style={{
                                        background: '#FFFFFF',
                                        border: '2px solid #1E3A8A',
                                        borderRadius: '4px',
                                        padding: '0.15rem 0.6rem',
                                        fontFamily: 'monospace, sans-serif',
                                        fontWeight: 800,
                                        fontSize: '0.95rem',
                                        color: '#1E3A8A',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                    }}
                                >
                                    <span style={{ fontSize: '0.7rem', background: '#1E3A8A', color: '#FFFFFF', padding: '0.05rem 0.3rem', borderRadius: '2px' }}>BOL</span>
                                    <span>{v.plate}</span>
                                </div>

                                {v.isDefault ? (
                                    <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', padding: '0.2rem 0.55rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                                        <i className="fa-solid fa-star" style={{ marginRight: '3px' }}></i> Predeterminado
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onSetDefaultVehicle(v.id)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '4px',
                                            padding: '0.2rem 0.5rem',
                                            fontSize: '0.72rem',
                                            fontWeight: 600,
                                            color: '#64748B',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Hacer Predeterminado
                                    </button>
                                )}
                            </div>

                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                                {v.brand} {v.model}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem' }}>
                                Color: <strong>{v.color}</strong> • Tipo: <strong>{v.vehicleType}</strong>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>
                            <i className="fa-solid fa-shield-check"></i>
                            <span>Habilitado para lectura por cámara OCR / LPR</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Registro de Vehículo */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            width: '100%',
                            maxWidth: '460px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ padding: '1rem 1.25rem', background: '#063D25', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.95rem' }}>
                                <i className="fa-solid fa-car"></i>
                                <span>Registrar Nuevo Vehículo</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '1.25rem', cursor: 'pointer' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                    Número de Placa (Ej: 9912-KLS) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                    placeholder="9912-KLS"
                                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                        Marca *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="Toyota"
                                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                        Modelo *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        placeholder="Corolla"
                                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                        Color *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="Blanco"
                                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                                        Tipo de Vehículo
                                    </label>
                                    <select
                                        value={formData.vehicleType}
                                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as DriverVehicle['vehicleType'] })}
                                        style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem', background: '#FFFFFF' }}
                                    >
                                        <option value="SEDAN">Sedán</option>
                                        <option value="SUV">SUV / 4x4</option>
                                        <option value="CAMIONETA">Camioneta</option>
                                        <option value="ELECTRICO">Eléctrico / EV</option>
                                        <option value="MOTO">Motocicleta</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ padding: '0.45rem 1.15rem', borderRadius: '6px', border: 'none', background: '#006D36', color: '#FFFFFF', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
