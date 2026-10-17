// src/modules/tenants/presentation/components/TenantFormPanel.tsx
import React, { useState } from 'react';
import type { Tenant, TenantStatus, CreateTenantPayload, UpdateTenantPayload, LocationCoordinates } from '../../domain/Tenant';
import { TenantLocationPicker } from './TenantLocationPicker';

interface TenantFormPanelProps {
    tenantToEdit: Tenant | null;
    isSubmitting: boolean;
    onSubmitCreate: (payload: CreateTenantPayload) => Promise<void>;
    onSubmitUpdate: (payload: UpdateTenantPayload) => Promise<void>;
    onCancel: () => void;
}

export const TenantFormPanel: React.FC<TenantFormPanelProps> = ({
    tenantToEdit,
    isSubmitting,
    onSubmitCreate,
    onSubmitUpdate,
    onCancel,
}) => {
    const isEdit = Boolean(tenantToEdit);

    const [nombre, setNombre] = useState(tenantToEdit?.nombre || '');
    const [nit, setNit] = useState(tenantToEdit?.nit || '');
    const [razonSocial, setRazonSocial] = useState(tenantToEdit?.razonSocial || '');
    const [estado, setEstado] = useState<TenantStatus>(tenantToEdit?.estado || 'ACTIVO');

    // Campos opcionales de ubicación
    const [direccion, setDireccion] = useState(tenantToEdit?.direccion || '');
    const [ciudad, setCiudad] = useState(tenantToEdit?.ciudad || '');
    const [coordinates, setCoordinates] = useState<LocationCoordinates | null>(
        tenantToEdit?.latitud != null && tenantToEdit?.longitud != null
            ? { lat: tenantToEdit.latitud, lng: tenantToEdit.longitud }
            : null
    );
    const [showLocationSection, setShowLocationSection] = useState<boolean>(
        Boolean(tenantToEdit?.direccion || tenantToEdit?.ciudad || tenantToEdit?.latitud)
    );

    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!nombre.trim() || !nit.trim() || !razonSocial.trim()) {
            setFormError('Por favor completa todos los campos requeridos (*).');
            return;
        }

        const locationPayload = {
            direccion: direccion.trim() ? direccion.trim() : undefined,
            ciudad: ciudad.trim() ? ciudad.trim() : undefined,
            latitud: coordinates ? coordinates.lat : undefined,
            longitud: coordinates ? coordinates.lng : undefined,
        };

        try {
            if (isEdit) {
                await onSubmitUpdate({
                    nombre: nombre.trim(),
                    nit: nit.trim(),
                    razonSocial: razonSocial.trim(),
                    estado,
                    ...locationPayload,
                });
            } else {
                await onSubmitCreate({
                    nombre: nombre.trim(),
                    nit: nit.trim(),
                    razonSocial: razonSocial.trim(),
                    ...locationPayload,
                });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al procesar la empresa.';
            setFormError(message);
        }
    };

    return (
        <div className="tenant-form-panel">
            {/* Header del Formulario */}
            <div className="tenant-form-header">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                            background: '#DCFCE7',
                            color: '#006D36',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.1rem',
                            flexShrink: 0,
                            marginTop: '2px',
                        }}
                    >
                        <i className={`fa-solid ${isEdit ? 'fa-pen-to-square' : 'fa-building-circle-check'}`}></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                            {isEdit ? 'Editar Información de la Empresa' : 'Registrar Nueva Empresa / Tenant'}
                        </h3>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                            {isEdit
                                ? 'Actualiza los datos comerciales y tributarios del tenant'
                                : 'Completa los datos de la empresa. Se habilitará automáticamente y recibirás confirmación por correo'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748B',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        flexShrink: 0,
                        padding: '0.25rem',
                    }}
                    title="Cerrar formulario"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="tenant-form-body">
                {formError && (
                    <div
                        style={{
                            background: '#FEF2F2',
                            color: '#991B1B',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            padding: '0.75rem 1rem',
                            fontSize: '0.82rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                    >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>{formError}</span>
                    </div>
                )}

                {!isEdit && (
                    <div
                        style={{
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            borderRadius: '6px',
                            padding: '0.85rem 1.15rem',
                            fontSize: '0.82rem',
                            color: '#166534',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                        }}
                    >
                        <i className="fa-solid fa-circle-info" style={{ marginTop: '2px', color: '#006D36' }}></i>
                        <div>
                            <strong>Activación Inmediata & Correo:</strong> Como Administrador de Parqueo, al registrar tu empresa se activará inmediatamente en el sistema y recibirás un correo electrónico de respaldo con la ficha técnica creada.
                        </div>
                    </div>
                )}

                <div className="tenant-form-grid">
                    {/* Nombre Comercial */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                            Nombre Comercial de la Empresa <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej. AutoPark Equipetrol SRL"
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '0.55rem 0.85rem',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                color: '#0F172A',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* NIT */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                            NIT (Número de Identificación Tributaria) <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            placeholder="Ej. 10293847019"
                            required
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '0.55rem 0.85rem',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                color: '#0F172A',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Razón Social Legal */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', width: '100%' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                        Razón Social Completa <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                        type="text"
                        value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
                        placeholder="Ej. AutoPark Equipetrol Sociedad de Responsabilidad Limitada"
                        required
                        style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '0.55rem 0.85rem',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            color: '#0F172A',
                            outline: 'none',
                        }}
                    />
                </div>

                {/* Estado (solo en edición) */}
                {isEdit && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem', maxWidth: '300px', width: '100%' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                            Estado de la Empresa
                        </label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value as TenantStatus)}
                            style={{
                                width: '100%',
                                boxSizing: 'border-box',
                                padding: '0.55rem 0.85rem',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                color: '#0F172A',
                                outline: 'none',
                                background: '#FFFFFF',
                            }}
                        >
                            <option value="ACTIVO">ACTIVO (Habilitada)</option>
                            <option value="INACTIVO">INACTIVO (Dada de baja)</option>
                        </select>
                    </div>
                )}

                {/* Sección de Ubicación Geográfica (Opcional) */}
                <div
                    style={{
                        marginBottom: '1.5rem',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        background: '#F8FAFC',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        onClick={() => setShowLocationSection(!showLocationSection)}
                        style={{
                            padding: '0.75rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            background: showLocationSection ? '#F1F5F9' : '#FFFFFF',
                            borderBottom: showLocationSection ? '1px solid #E2E8F0' : 'none',
                            userSelect: 'none',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    background: '#DCFCE7',
                                    color: '#006D36',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.85rem',
                                }}
                            >
                                <i className="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                                    Ubicación de la Empresa
                                </span>
                                <span
                                    style={{
                                        marginLeft: '0.5rem',
                                        fontSize: '0.7rem',
                                        color: '#006D36',
                                        background: '#E6F4EA',
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Opcional
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748B', fontSize: '0.8rem' }}>
                            <span>{showLocationSection ? 'Ocultar mapa' : 'Agregar o editar ubicación'}</span>
                            <i className={`fa-solid ${showLocationSection ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>
                    </div>

                    {showLocationSection && (
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="tenant-form-grid" style={{ marginBottom: 0 }}>
                                {/* Dirección física */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                                        Dirección Física (Calle, Av., Número)
                                    </label>
                                    <input
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        placeholder="Ej. Av. San Martín #450, Barrio Equipetrol"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '0.55rem 0.85rem',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            color: '#0F172A',
                                            outline: 'none',
                                            background: '#FFFFFF',
                                        }}
                                    />
                                </div>

                                {/* Ciudad */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                                        Ciudad / Municipio
                                    </label>
                                    <input
                                        type="text"
                                        value={ciudad}
                                        onChange={(e) => setCiudad(e.target.value)}
                                        placeholder="Ej. Santa Cruz de la Sierra"
                                        style={{
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            padding: '0.55rem 0.85rem',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px',
                                            fontSize: '0.85rem',
                                            color: '#0F172A',
                                            outline: 'none',
                                            background: '#FFFFFF',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Selector Interactivo Leaflet con GPS */}
                            <TenantLocationPicker
                                coordinates={coordinates}
                                onChangeCoordinates={setCoordinates}
                                disabled={isSubmitting}
                            />
                        </div>
                    )}
                </div>

                {/* Acciones */}
                <div className="tenant-form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            padding: '0.5rem 1.25rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            background: '#006D36',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1.45rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>{isEdit ? 'Actualizando...' : 'Registrando y notificando...'}</span>
                            </>
                        ) : (
                            <>
                                <i className={`fa-solid ${isEdit ? 'fa-check' : 'fa-building-circle-check'}`}></i>
                                <span>{isEdit ? 'Guardar Cambios' : 'Registrar Empresa'}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
