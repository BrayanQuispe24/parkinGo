// src/modules/tenants/presentation/components/TenantDetailModal.tsx
import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Tenant } from '../../domain/Tenant';

interface TenantDetailModalProps {
    tenant: Tenant | null;
    onClose: () => void;
    onEdit?: (tenant: Tenant) => void;
    canEdit?: boolean;
}

// Icono personalizado de pin para el mapa en vista Enterprise
const createEnterprisePinIcon = () => {
    return L.divIcon({
        className: 'company-enterprise-pin',
        html: `
            <div style="
                background: linear-gradient(135deg, #006D36 0%, #063D25 100%);
                width: 34px;
                height: 34px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0, 109, 54, 0.4);
                border: 2px solid #FFFFFF;
            ">
                <i class="fa-solid fa-building" style="
                    transform: rotate(45deg);
                    color: #FFFFFF;
                    font-size: 13px;
                "></i>
            </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
    });
};

export const TenantDetailModal: React.FC<TenantDetailModalProps> = ({
    tenant,
    onClose,
    onEdit,
    canEdit = false,
}) => {
    const pinIcon = useMemo(() => createEnterprisePinIcon(), []);
    const [copiedId, setCopiedId] = useState(false);
    const [copiedGps, setCopiedGps] = useState(false);

    if (!tenant) return null;

    const isActivo = tenant.estado === 'ACTIVO';
    const hasCoordinates = tenant.latitud != null && tenant.longitud != null;
    const hasAnyLocation = Boolean(tenant.ciudad || tenant.direccion || hasCoordinates);

    const formattedCreatedAt = new Date(tenant.createdAt).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const formattedUpdatedAt = new Date(tenant.updatedAt).toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const googleMapsUrl = hasCoordinates
        ? `https://www.google.com/maps?q=${tenant.latitud},${tenant.longitud}`
        : null;

    const handleCopyId = () => {
        navigator.clipboard.writeText(tenant.id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    const handleCopyGps = () => {
        if (!hasCoordinates) return;
        navigator.clipboard.writeText(`${tenant.latitud}, ${tenant.longitud}`);
        setCopiedGps(true);
        setTimeout(() => setCopiedGps(false), 2000);
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2500,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.25rem',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '6px',
                    width: '100%',
                    maxWidth: '860px',
                    maxHeight: '92vh',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #CBD5E1',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Header Enterprise */}
                <div
                    style={{
                        padding: '1rem 1.4rem',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#F8FAFC',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '4px',
                                background: isActivo ? '#DCFCE7' : '#FEF3C7',
                                color: isActivo ? '#006D36' : '#D97706',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                border: isActivo ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                                flexShrink: 0,
                            }}
                        >
                            <i className="fa-solid fa-building"></i>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                                    {tenant.nombre}
                                </h3>
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.3rem',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '3px',
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        background: isActivo ? '#DCFCE7' : '#FEF3C7',
                                        color: isActivo ? '#166534' : '#92400E',
                                        border: isActivo ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                                    }}
                                >
                                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActivo ? '#16A34A' : '#D97706' }}></span>
                                    {tenant.estado}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.15rem', fontSize: '0.75rem', color: '#64748B' }}>
                                <span>NIT: <strong style={{ color: '#1E293B', fontFamily: 'monospace' }}>{tenant.nit}</strong></span>
                                <span style={{ color: '#CBD5E1' }}>•</span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    ID: <span style={{ fontFamily: 'monospace', color: '#475569' }}>{tenant.id.slice(0, 13)}...</span>
                                    <button
                                        type="button"
                                        onClick={handleCopyId}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.1rem 0.25rem',
                                            color: copiedId ? '#006D36' : '#94A3B8',
                                            fontSize: '0.72rem',
                                        }}
                                        title="Copiar ID completo"
                                    >
                                        <i className={`fa-solid ${copiedId ? 'fa-check' : 'fa-copy'}`}></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748B',
                            fontSize: '1.15rem',
                            cursor: 'pointer',
                            padding: '0.35rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Cerrar ventana"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* 2. Body: Split View 2 Columnas (High-Density) */}
                <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                            gap: '1.25rem',
                            alignItems: 'stretch',
                        }}
                    >
                        {/* COLUMNA IZQUIERDA: Ficha Técnica & Fiscal */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                            {/* Bloque 1: Identificación Legal */}
                            <div
                                style={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '4px',
                                    background: '#FFFFFF',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0.5rem 0.85rem',
                                        background: '#F8FAFC',
                                        borderBottom: '1px solid #E2E8F0',
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        color: '#475569',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    <i className="fa-solid fa-file-invoice" style={{ color: '#006D36' }}></i>
                                    Identificación Legal & Fiscal
                                </div>
                                <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
                                            Razón Social Completa
                                        </div>
                                        <div style={{ fontWeight: 600, color: '#0F172A', marginTop: '0.1rem' }}>
                                            {tenant.razonSocial}
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
                                                NIT
                                            </div>
                                            <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: '0.1rem' }}>
                                                {tenant.nit}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.05em' }}>
                                                Estado
                                            </div>
                                            <div style={{ fontWeight: 700, color: isActivo ? '#15803D' : '#B45309', marginTop: '0.1rem' }}>
                                                {tenant.estado}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bloque 2: Administrador Responsable */}
                            <div
                                style={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '4px',
                                    background: '#FFFFFF',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        padding: '0.5rem 0.85rem',
                                        background: '#F8FAFC',
                                        borderBottom: '1px solid #E2E8F0',
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        color: '#475569',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    <i className="fa-solid fa-user-shield" style={{ color: '#006D36' }}></i>
                                    Administrador Responsable
                                </div>
                                <div style={{ padding: '0.85rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                                    {tenant.usuario ? (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                <div
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '4px',
                                                        background: '#F1F5F9',
                                                        border: '1px solid #CBD5E1',
                                                        color: '#006D36',
                                                        fontWeight: 800,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {tenant.usuario.firstName.charAt(0)}{tenant.usuario.lastName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#0F172A' }}>
                                                        {tenant.usuario.firstName} {tenant.usuario.lastName}
                                                    </div>
                                                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                                        {tenant.usuario.email}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem' }}>
                                                <div>
                                                    <span style={{ color: '#94A3B8' }}>Cédula: </span>
                                                    <span style={{ fontWeight: 600, color: '#334155' }}>{tenant.usuario.ci}</span>
                                                </div>
                                                {tenant.usuario.phone && (
                                                    <div>
                                                        <span style={{ color: '#94A3B8' }}>Teléfono: </span>
                                                        <span style={{ fontWeight: 600, color: '#334155' }}>{tenant.usuario.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ color: '#94A3B8', fontStyle: 'italic', fontSize: '0.78rem' }}>
                                            No se han vinculado datos adicionales del usuario.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bloque 3: Auditoría & Metadata */}
                            <div
                                style={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '4px',
                                    background: '#F8FAFC',
                                    padding: '0.65rem 0.85rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.72rem',
                                    color: '#64748B',
                                }}
                            >
                                <div>
                                    <span>Creado: </span>
                                    <strong style={{ color: '#334155' }}>{formattedCreatedAt}</strong>
                                </div>
                                <div>
                                    <span>Actualizado: </span>
                                    <strong style={{ color: '#334155' }}>{formattedUpdatedAt}</strong>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: Ubicación & Georreferenciación */}
                        <div
                            style={{
                                border: '1px solid #E2E8F0',
                                borderRadius: '4px',
                                background: '#FFFFFF',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Subheader de Ubicación */}
                            <div
                                style={{
                                    padding: '0.5rem 0.85rem',
                                    background: '#F8FAFC',
                                    borderBottom: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase',
                                        color: '#475569',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    <i className="fa-solid fa-map-location-dot" style={{ color: '#006D36' }}></i>
                                    Georreferenciación & Ubicación
                                </div>

                                {googleMapsUrl && (
                                    <a
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            fontSize: '0.7rem',
                                            color: '#006D36',
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                            background: '#E6F4EA',
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '3px',
                                        }}
                                        title="Abrir punto exacto en Google Maps"
                                    >
                                        <span>Google Maps</span>
                                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.65rem' }}></i>
                                    </a>
                                )}
                            </div>

                            {/* Contenido de Ubicación */}
                            <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {hasAnyLocation ? (
                                    <>
                                        {/* Ficha Resumen de Ciudad y Dirección */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: tenant.ciudad && tenant.direccion ? '1fr 1fr' : '1fr',
                                                gap: '0.65rem',
                                                fontSize: '0.8rem',
                                                background: '#F8FAFC',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '4px',
                                                padding: '0.65rem 0.85rem',
                                            }}
                                        >
                                            {tenant.ciudad && (
                                                <div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                                                        Ciudad / Municipio
                                                    </span>
                                                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                                                        <i className="fa-solid fa-city" style={{ color: '#006D36', fontSize: '0.75rem' }}></i>
                                                        {tenant.ciudad}
                                                    </span>
                                                </div>
                                            )}

                                            {tenant.direccion && (
                                                <div>
                                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                                                        Dirección Física
                                                    </span>
                                                    <span style={{ color: '#334155', fontWeight: 600, marginTop: '0.1rem', display: 'block' }}>
                                                        {tenant.direccion}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Barra de Coordenadas GPS Técnicas */}
                                        {hasCoordinates && (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.4rem 0.75rem',
                                                    background: '#F0FDF4',
                                                    border: '1px solid #BBF7D0',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                    <i className="fa-solid fa-location-crosshairs" style={{ color: '#006D36' }}></i>
                                                    <span style={{ color: '#166534', fontWeight: 600 }}>Coordenadas:</span>
                                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#064E3B' }}>
                                                        {tenant.latitud?.toFixed(5)}, {tenant.longitud?.toFixed(5)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyGps}
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 700,
                                                        color: copiedGps ? '#006D36' : '#15803D',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                    }}
                                                >
                                                    <i className={`fa-solid ${copiedGps ? 'fa-check' : 'fa-copy'}`}></i>
                                                    <span>{copiedGps ? 'Copiado' : 'Copiar'}</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Mapa Leaflet de Proporción Compacta */}
                                        {hasCoordinates && (
                                            <div
                                                style={{
                                                    height: '230px',
                                                    width: '100%',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                    border: '1px solid #CBD5E1',
                                                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                                                }}
                                            >
                                                <MapContainer
                                                    center={[tenant.latitud!, tenant.longitud!]}
                                                    zoom={15}
                                                    scrollWheelZoom={false}
                                                    style={{ height: '100%', width: '100%' }}
                                                >
                                                    <TileLayer
                                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    />
                                                    <Marker
                                                        position={[tenant.latitud!, tenant.longitud!]}
                                                        icon={pinIcon}
                                                    />
                                                </MapContainer>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            margin: 'auto 0',
                                            padding: '2.5rem 1rem',
                                            textAlign: 'center',
                                            color: '#94A3B8',
                                            background: '#F8FAFC',
                                            borderRadius: '4px',
                                            border: '1px dashed #CBD5E1',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                background: '#E2E8F0',
                                                color: '#64748B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                margin: '0 auto 0.75rem auto',
                                                fontSize: '1.1rem',
                                            }}
                                        >
                                            <i className="fa-solid fa-location-dot"></i>
                                        </div>
                                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
                                            Sin Ubicación Registrada
                                        </div>
                                        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.75rem', color: '#94A3B8', maxWidth: '280px', marginInline: 'auto' }}>
                                            Esta empresa no tiene dirección física ni coordenadas GPS asociadas (campo opcional).
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Footer Enterprise */}
                <div
                    style={{
                        padding: '0.85rem 1.4rem',
                        background: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.65rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                            padding: '0.45rem 1.15rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        Cerrar
                    </button>

                    {canEdit && onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(tenant)}
                            style={{
                                background: '#006D36',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '0.45rem 1.25rem',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                boxShadow: '0 1px 3px rgba(0, 109, 54, 0.25)',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <i className="fa-solid fa-pen-to-square"></i>
                            <span>Editar Empresa</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
