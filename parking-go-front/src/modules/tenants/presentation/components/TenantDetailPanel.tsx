// src/modules/tenants/presentation/components/TenantDetailPanel.tsx
import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Tenant } from '../../domain/Tenant';

interface TenantDetailPanelProps {
    tenant: Tenant;
    onBack: () => void;
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

export const TenantDetailPanel: React.FC<TenantDetailPanelProps> = ({
    tenant,
    onBack,
    onEdit,
    canEdit = false,
}) => {
    const pinIcon = useMemo(() => createEnterprisePinIcon(), []);
    const [copiedId, setCopiedId] = useState(false);
    const [copiedGps, setCopiedGps] = useState(false);

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
                background: 'var(--bg-card, #FFFFFF)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle, #CBD5E1)',
                boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0,0,0,0.05))',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header de la Ficha Técnica */}
            <div
                style={{
                    padding: '1.15rem 1.4rem',
                    borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-primary, #F8FAFC)',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            background: isActivo ? '#DCFCE7' : '#FEF3C7',
                            color: isActivo ? '#006D36' : '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            border: isActivo ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                            flexShrink: 0,
                        }}
                    >
                        <i className="fa-solid fa-building"></i>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #0F172A)' }}>
                                {tenant.nombre}
                            </h2>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '20px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    background: isActivo ? '#DCFCE7' : '#FEF3C7',
                                    color: isActivo ? '#166534' : '#92400E',
                                    border: isActivo ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: isActivo ? '#16A34A' : '#D97706',
                                    }}
                                ></span>
                                {tenant.estado}
                            </span>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginTop: '0.25rem',
                                fontSize: '0.78rem',
                                color: 'var(--text-muted, #64748B)',
                                flexWrap: 'wrap',
                            }}
                        >
                            <span>
                                NIT: <strong style={{ color: 'var(--text-main, #1E293B)', fontFamily: 'monospace' }}>{tenant.nit}</strong>
                            </span>
                            <span style={{ color: '#CBD5E1' }}>•</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                ID: <span style={{ fontFamily: 'monospace', color: 'var(--text-dim, #475569)' }}>{tenant.id}</span>
                                <button
                                    type="button"
                                    onClick={handleCopyId}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.1rem 0.25rem',
                                        color: copiedId ? '#006D36' : '#94A3B8',
                                        fontSize: '0.74rem',
                                    }}
                                    title="Copiar ID completo"
                                >
                                    <i className={`fa-solid ${copiedId ? 'fa-check' : 'fa-copy'}`}></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Acciones del Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                        type="button"
                        onClick={onBack}
                        style={{
                            background: 'var(--bg-card, #FFFFFF)',
                            border: '1px solid var(--border-strong, #CBD5E1)',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--text-main, #475569)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>Volver al Listado</span>
                    </button>

                    {canEdit && onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(tenant)}
                            style={{
                                background: '#006D36',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 1.15rem',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
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

            {/* Cuerpo de la Ficha Técnica (Split View 2 Columnas) */}
            <div style={{ padding: '1.4rem' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '1.4rem',
                        alignItems: 'stretch',
                    }}
                >
                    {/* COLUMNA IZQUIERDA: Información Legal, Fiscal y Responsable */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Bloque 1: Identificación Legal */}
                        <div
                            style={{
                                border: '1px solid var(--border-subtle, #E2E8F0)',
                                borderRadius: '6px',
                                background: 'var(--bg-card, #FFFFFF)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0.65rem 1rem',
                                    background: 'var(--bg-primary, #F8FAFC)',
                                    borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted, #475569)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i className="fa-solid fa-file-invoice" style={{ color: '#006D36' }}></i>
                                Identificación Legal & Fiscal
                            </div>
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim, #64748B)', letterSpacing: '0.05em' }}>
                                        Razón Social Completa
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-main, #0F172A)', marginTop: '0.15rem' }}>
                                        {tenant.razonSocial}
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim, #64748B)', letterSpacing: '0.05em' }}>
                                            NIT
                                        </div>
                                        <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-main, #0F172A)', marginTop: '0.15rem' }}>
                                            {tenant.nit}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim, #64748B)', letterSpacing: '0.05em' }}>
                                            Estado de Operación
                                        </div>
                                        <div style={{ fontWeight: 700, color: isActivo ? '#15803D' : '#B45309', marginTop: '0.15rem' }}>
                                            {tenant.estado}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bloque 2: Administrador Responsable */}
                        <div
                            style={{
                                border: '1px solid var(--border-subtle, #E2E8F0)',
                                borderRadius: '6px',
                                background: 'var(--bg-card, #FFFFFF)',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    padding: '0.65rem 1rem',
                                    background: 'var(--bg-primary, #F8FAFC)',
                                    borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted, #475569)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i className="fa-solid fa-user-shield" style={{ color: '#006D36' }}></i>
                                Administrador Responsable
                            </div>
                            <div style={{ padding: '1rem', fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {tenant.usuario ? (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '6px',
                                                    background: '#F1F5F9',
                                                    border: '1px solid #CBD5E1',
                                                    color: '#006D36',
                                                    fontWeight: 800,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.85rem',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {tenant.usuario.firstName.charAt(0)}{tenant.usuario.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-main, #0F172A)' }}>
                                                    {tenant.usuario.firstName} {tenant.usuario.lastName}
                                                </div>
                                                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted, #64748B)' }}>
                                                    {tenant.usuario.email}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle, #F1F5F9)', fontSize: '0.78rem' }}>
                                            <div>
                                                <span style={{ color: 'var(--text-dim, #94A3B8)' }}>Cédula: </span>
                                                <span style={{ fontWeight: 600, color: 'var(--text-main, #334155)' }}>{tenant.usuario.ci}</span>
                                            </div>
                                            {tenant.usuario.phone && (
                                                <div>
                                                    <span style={{ color: 'var(--text-dim, #94A3B8)' }}>Teléfono: </span>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-main, #334155)' }}>{tenant.usuario.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ color: 'var(--text-dim, #94A3B8)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                        No se han vinculado datos adicionales del usuario responsable.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bloque 3: Auditoría & Metadata */}
                        <div
                            style={{
                                border: '1px solid var(--border-subtle, #E2E8F0)',
                                borderRadius: '6px',
                                background: 'var(--bg-primary, #F8FAFC)',
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                color: 'var(--text-muted, #64748B)',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                            }}
                        >
                            <div>
                                <span>Fecha de Registro: </span>
                                <strong style={{ color: 'var(--text-main, #334155)' }}>{formattedCreatedAt}</strong>
                            </div>
                            <div>
                                <span>Última Actualización: </span>
                                <strong style={{ color: 'var(--text-main, #334155)' }}>{formattedUpdatedAt}</strong>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Ubicación & Georreferenciación */}
                    <div
                        style={{
                            border: '1px solid var(--border-subtle, #E2E8F0)',
                            borderRadius: '6px',
                            background: 'var(--bg-card, #FFFFFF)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Subheader de Ubicación */}
                        <div
                            style={{
                                padding: '0.65rem 1rem',
                                background: 'var(--bg-primary, #F8FAFC)',
                                borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase',
                                    color: 'var(--text-muted, #475569)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
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
                                        gap: '0.35rem',
                                        fontSize: '0.74rem',
                                        color: '#006D36',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        background: '#E6F4EA',
                                        padding: '0.2rem 0.55rem',
                                        borderRadius: '4px',
                                    }}
                                    title="Abrir ubicación en Google Maps"
                                >
                                    <span>Google Maps</span>
                                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.68rem' }}></i>
                                </a>
                            )}
                        </div>

                        {/* Contenido de Ubicación */}
                        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {hasAnyLocation ? (
                                <>
                                    {/* Ficha Resumen de Ciudad y Dirección */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: tenant.ciudad && tenant.direccion ? '1fr 1fr' : '1fr',
                                            gap: '0.75rem',
                                            fontSize: '0.82rem',
                                            background: 'var(--bg-primary, #F8FAFC)',
                                            border: '1px solid var(--border-subtle, #E2E8F0)',
                                            borderRadius: '6px',
                                            padding: '0.75rem 1rem',
                                        }}
                                    >
                                        {tenant.ciudad && (
                                            <div>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                                                    Ciudad / Municipio
                                                </span>
                                                <span style={{ fontWeight: 700, color: 'var(--text-main, #0F172A)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                                    <i className="fa-solid fa-city" style={{ color: '#006D36', fontSize: '0.8rem' }}></i>
                                                    {tenant.ciudad}
                                                </span>
                                            </div>
                                        )}

                                        {tenant.direccion && (
                                            <div>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                                                    Dirección Física
                                                </span>
                                                <span style={{ color: 'var(--text-main, #334155)', fontWeight: 600, marginTop: '0.15rem', display: 'block' }}>
                                                    {tenant.direccion}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Barra de Coordenadas GPS */}
                                    {hasCoordinates && (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.45rem 0.85rem',
                                                background: '#F0FDF4',
                                                border: '1px solid #BBF7D0',
                                                borderRadius: '6px',
                                                fontSize: '0.78rem',
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
                                                    fontSize: '0.74rem',
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

                                    {/* Mapa Leaflet */}
                                    {hasCoordinates && (
                                        <div
                                            style={{
                                                height: '280px',
                                                width: '100%',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                border: '1px solid var(--border-strong, #CBD5E1)',
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
                                        color: 'var(--text-dim, #94A3B8)',
                                        background: 'var(--bg-primary, #F8FAFC)',
                                        borderRadius: '6px',
                                        border: '1px dashed var(--border-strong, #CBD5E1)',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            background: '#E2E8F0',
                                            color: '#64748B',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 0.75rem auto',
                                            fontSize: '1.2rem',
                                        }}
                                    >
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main, #475569)' }}>
                                        Sin Ubicación Registrada
                                    </div>
                                    <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted, #94A3B8)', maxWidth: '300px', marginInline: 'auto' }}>
                                        Esta empresa no cuenta con dirección física ni coordenadas GPS registradas.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
