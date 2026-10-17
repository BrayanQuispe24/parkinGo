// src/modules/tenants/presentation/components/TenantsEnterpriseTable.tsx
import React, { useMemo, useState } from 'react';
import type { Tenant } from '../../domain/Tenant';

interface TenantsEnterpriseTableProps {
    tenants: Tenant[];
    loading?: boolean;
    currentRole?: string;
    onViewTenant?: (tenant: Tenant) => void;
    onEditTenant?: (tenant: Tenant) => void;
    onDarDeBajaTenant?: (tenant: Tenant) => void;
    onDeleteTenant?: (tenant: Tenant) => void;
}

export const TenantsEnterpriseTable: React.FC<TenantsEnterpriseTableProps> = ({
    tenants,
    loading,
    currentRole,
    onViewTenant,
    onEditTenant,
    onDarDeBajaTenant,
    onDeleteTenant,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVO' | 'INACTIVO'>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const isSuperOrGeneralAdmin = currentRole === 'SUPER_ADMIN' || currentRole === 'GENERAL_ADMIN';
    const isParkingAdmin = currentRole === 'PARKING_ADMIN';

    // Filtrado reactivo en memoria
    const filteredTenants = useMemo(() => {
        return tenants.filter((t) => {
            const matchesSearch =
                !searchTerm.trim() ||
                t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (t.ciudad && t.ciudad.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (t.direccion && t.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (t.usuario && `${t.usuario.firstName} ${t.usuario.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesStatus = statusFilter === 'ALL' || t.estado === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [tenants, searchTerm, statusFilter]);

    // Paginación
    const totalItems = filteredTenants.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startRecord = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
    const endRecord = Math.min(validCurrentPage * pageSize, totalItems);

    const paginatedTenants = useMemo(() => {
        const start = (validCurrentPage - 1) * pageSize;
        return filteredTenants.slice(start, start + pageSize);
    }, [filteredTenants, validCurrentPage, pageSize]);

    return (
        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
            {/* Toolbar Superior */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.85rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
                    {/* Buscador */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: '0.85rem' }}></i>
                        <input
                            type="text"
                            placeholder="Buscar empresa por nombre, NIT, razón social o responsable..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                                fontSize: '0.84rem',
                                border: '1px solid var(--border-strong)',
                                borderRadius: '6px',
                                outline: 'none',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                            }}
                        />
                    </div>

                    {/* Filtro de Estado */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value as 'ALL' | 'ACTIVO' | 'INACTIVO');
                            setCurrentPage(1);
                        }}
                        style={{
                            padding: '0.55rem 1rem',
                            fontSize: '0.84rem',
                            border: '1px solid var(--border-strong)',
                            borderRadius: '6px',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            outline: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="ALL">Todos los Estados</option>
                        <option value="ACTIVO">Activos (Operando)</option>
                        <option value="INACTIVO">Inactivos (Dados de baja)</option>
                    </select>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Total: <strong style={{ color: 'var(--text-main)' }}>{totalItems}</strong> empresa(s)
                </div>
            </div>

            {/* Contenido / Tabla */}
            {loading ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748B' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.75rem', color: '#006D36', marginBottom: '0.75rem' }}></i>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Cargando empresas del sistema...</p>
                </div>
            ) : paginatedTenants.length === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem auto' }}>
                        <i className="fa-solid fa-building-circle-exclamation"></i>
                    </div>
                    <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                        No se encontraron empresas
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
                        {searchTerm || statusFilter !== 'ALL'
                            ? 'Intenta ajustar los criterios de búsqueda o filtros.'
                            : isParkingAdmin
                            ? 'Aún no tienes empresas registradas. Utiliza la pestaña de registro para crear tu primer tenant.'
                            : 'No hay tenants registrados en la plataforma.'}
                    </p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Empresa / Nombre</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>NIT</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Razón Social</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Ubicación</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Estado</th>
                                <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Usuario Responsable</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTenants.map((t) => {
                                const isActivo = t.estado === 'ACTIVO';
                                const userDisplayName = t.usuario
                                    ? `${t.usuario.firstName} ${t.usuario.lastName}`.trim()
                                    : `ID: ${t.usuarioId.slice(0, 8)}...`;

                                return (
                                    <tr
                                        key={t.id}
                                        style={{
                                            borderBottom: '1px solid var(--border-subtle)',
                                            transition: 'background-color 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                    >
                                        {/* Nombre Comercial */}
                                        <td style={{ padding: '0.9rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                <div
                                                    style={{
                                                        width: '34px',
                                                        height: '34px',
                                                        borderRadius: '6px',
                                                        background: isActivo ? '#E6F4EA' : '#FEF3C7',
                                                        color: isActivo ? '#006D36' : '#D97706',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.95rem',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <i className="fa-solid fa-building"></i>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                                                        {t.nombre}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                                                        ID: {t.id.slice(0, 8)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* NIT */}
                                        <td style={{ padding: '0.9rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-main)' }}>
                                            {t.nit}
                                        </td>

                                        {/* Razón Social */}
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', maxWidth: '220px' }}>
                                            <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {t.razonSocial}
                                            </span>
                                        </td>

                                        {/* Ubicación (Opcional) */}
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                            {t.ciudad || t.direccion || (t.latitud != null && t.longitud != null) ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                                    {t.ciudad && (
                                                        <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                            <i className="fa-solid fa-city" style={{ color: '#006D36', fontSize: '0.75rem' }}></i>
                                                            {t.ciudad}
                                                        </span>
                                                    )}
                                                    {t.direccion && (
                                                        <span
                                                            style={{
                                                                fontSize: '0.74rem',
                                                                color: 'var(--text-muted)',
                                                                maxWidth: '180px',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                            title={t.direccion}
                                                        >
                                                            {t.direccion}
                                                        </span>
                                                    )}
                                                    {t.latitud != null && t.longitud != null && (
                                                        <span style={{ fontSize: '0.7rem', color: '#006D36', fontFamily: 'monospace' }}>
                                                            📍 {t.latitud.toFixed(4)}, {t.longitud.toFixed(4)}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                                                    No registrada
                                                </span>
                                            )}
                                        </td>

                                        {/* Estado */}
                                        <td style={{ padding: '0.9rem 1rem' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.2rem 0.65rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    background: isActivo ? '#DCFCE7' : '#FEF3C7',
                                                    color: isActivo ? '#166534' : '#92400E',
                                                    border: isActivo ? '1px solid #BBF7D0' : '1px solid #FDE68A',
                                                }}
                                            >
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActivo ? '#16A34A' : '#D97706' }}></span>
                                                {t.estado}
                                            </span>
                                        </td>

                                        {/* Usuario Responsable */}
                                        <td style={{ padding: '0.9rem 1rem', color: 'var(--text-main)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <i className="fa-solid fa-user-tie" style={{ color: '#006D36', fontSize: '0.85rem' }}></i>
                                                <span style={{ fontWeight: 600 }}>{userDisplayName}</span>
                                            </div>
                                            {t.usuario?.email && (
                                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginLeft: '1.25rem' }}>
                                                    {t.usuario.email}
                                                </span>
                                            )}
                                        </td>

                                        {/* Acciones por Rol */}
                                        <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                {/* Botón Ver Ficha y Ubicación (Para todos los roles) */}
                                                <button
                                                    type="button"
                                                    onClick={() => onViewTenant?.(t)}
                                                    style={{
                                                        background: '#E6F4EA',
                                                        border: '1px solid #BBF7D0',
                                                        color: '#006D36',
                                                        padding: '0.35rem 0.65rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                    title="Ver detalle completo de la empresa y ubicación en mapa"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                    <span>Ver</span>
                                                </button>

                                                {/* Administrador de Parqueo: Editar y Dar de Baja */}
                                                {isParkingAdmin && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => onEditTenant?.(t)}
                                                            style={{
                                                                background: '#F1F5F9',
                                                                border: '1px solid #E2E8F0',
                                                                color: '#0F172A',
                                                                padding: '0.35rem 0.6rem',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.78rem',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem',
                                                            }}
                                                            title="Editar datos de la empresa"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                            <span>Editar</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => onDarDeBajaTenant?.(t)}
                                                            style={{
                                                                background: isActivo ? '#FEF3C7' : '#DCFCE7',
                                                                border: isActivo ? '1px solid #FDE68A' : '1px solid #BBF7D0',
                                                                color: isActivo ? '#92400E' : '#166534',
                                                                padding: '0.35rem 0.65rem',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.78rem',
                                                                fontWeight: 700,
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.3rem',
                                                            }}
                                                            title={isActivo ? 'Dar de baja a la empresa' : 'Reactivar empresa'}
                                                        >
                                                            <i className={`fa-solid ${isActivo ? 'fa-arrow-down-long' : 'fa-arrow-up-long'}`}></i>
                                                            <span>{isActivo ? 'Dar de Baja' : 'Reactivar'}</span>
                                                        </button>
                                                    </>
                                                )}

                                                {/* Administrador General o Superadmin: Eliminar del Sistema */}
                                                {isSuperOrGeneralAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onDeleteTenant?.(t)}
                                                        style={{
                                                            background: '#FEF2F2',
                                                            border: '1px solid #FECACA',
                                                            color: '#DC2626',
                                                            padding: '0.35rem 0.65rem',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.78rem',
                                                            fontWeight: 700,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                        }}
                                                        title="Eliminar permanentemente del sistema"
                                                    >
                                                        <i className="fa-solid fa-trash-can"></i>
                                                        <span>Eliminar</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Paginación Inferior */}
            {totalItems > 0 && (
                <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div>
                        Mostrando <strong>{startRecord}</strong> a <strong>{endRecord}</strong> de <strong>{totalItems}</strong> empresas
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={validCurrentPage <= 1}
                            style={{
                                padding: '0.35rem 0.75rem',
                                border: '1px solid var(--border-strong)',
                                borderRadius: '4px',
                                background: validCurrentPage <= 1 ? 'var(--bg-primary)' : 'var(--bg-card)',
                                color: validCurrentPage <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
                                cursor: validCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            &lt; Anterior
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={validCurrentPage >= totalPages}
                            style={{
                                padding: '0.35rem 0.75rem',
                                border: '1px solid var(--border-strong)',
                                borderRadius: '4px',
                                background: validCurrentPage >= totalPages ? 'var(--bg-primary)' : 'var(--bg-card)',
                                color: validCurrentPage >= totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                                cursor: validCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Siguiente &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
