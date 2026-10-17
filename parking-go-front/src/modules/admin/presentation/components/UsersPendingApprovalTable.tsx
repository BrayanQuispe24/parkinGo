import React from 'react';
import type { AdminUser } from '../../domain/AdminUser';

interface UsersPendingApprovalTableProps {
    users: AdminUser[];
    loading?: boolean;
    onApproveUser: (user: AdminUser) => Promise<void>;
    onRejectUser: (user: AdminUser) => Promise<void>;
    updatingUserId?: string | null;
}

export const UsersPendingApprovalTable: React.FC<UsersPendingApprovalTableProps> = ({
    users,
    loading,
    onApproveUser,
    onRejectUser,
    updatingUserId,
}) => {
    const getRoleBadge = (roleName?: string) => {
        if (roleName === 'HOST') {
            return {
                label: 'ANFITRIÓN DE PARQUEO',
                bg: '#ECFDF5',
                color: '#15803D',
                border: '#A7F3D0',
            };
        }
        return {
            label: 'ADMINISTRADOR DE PARQUEO',
            bg: '#EFF6FF',
            color: '#1D4ED8',
            border: '#BFDBFE',
        };
    };

    if (loading) {
        return (
            <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '3.5rem', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.75rem', color: '#006D36', marginBottom: '0.75rem' }}></i>
                <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, margin: 0 }}>
                    Cargando solicitudes pendientes de aprobación...
                </p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '3.5rem', textAlign: 'center' }}>
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        margin: '0 auto 0.85rem auto',
                        borderRadius: '8px',
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A',
                    }}
                >
                    <i className="fa-solid fa-check-double" style={{ fontSize: '1.6rem' }}></i>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    ¡Al día! No hay usuarios pendientes de aprobación
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Todos los registros de Anfitriones y Administradores de Parqueo han sido evaluados y aprobados.
                </p>
            </div>
        );
    }

    return (
        <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {/* Header del Bloque */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <i className="fa-solid fa-shield-halved" style={{ color: '#D97706', fontSize: '1.1rem' }}></i>
                    <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400E' }}>
                            Bandeja de Verificación de Socios y Anfitriones
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#B45309' }}>
                            Revisa el documento PDF adjunto antes de autorizar o rechazar la solicitud en la plataforma.
                        </div>
                    </div>
                </div>

                <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.74rem', fontWeight: 800 }}>
                    {users.length} {users.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
                </span>
            </div>

            {/* Tabla de Usuarios Pendientes */}
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr
                            style={{
                                background: '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: '#475569',
                                userSelect: 'none',
                            }}
                        >
                            <th style={{ padding: '0.85rem 1.15rem' }}>SOLICITANTE / CORREO</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>ROL SOLICITADO</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>DOCUMENTACIÓN PDF</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>ESTADO</th>
                            <th style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>EVALUACIÓN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const badge = getRoleBadge(user.role?.name);
                            const isUpdating = updatingUserId === user.id;
                            const doc = user.verificationDocuments?.[0];

                            return (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: '1px solid #F1F5F9',
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                >
                                    {/* Solicitante */}
                                    <td style={{ padding: '0.85rem 1.15rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div
                                                style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '6px',
                                                    background: '#FEF3C7',
                                                    border: '1px solid #FDE68A',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    color: '#B45309',
                                                    fontSize: '0.82rem',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <i className="fa-solid fa-clock"></i>
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0F172A' }}>
                                                    {user.fullname || `${user.firstName} ${user.lastName}`}
                                                </div>
                                                <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                                    {user.email} • CI: <strong>{user.ci}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rol Solicitado */}
                                    <td style={{ padding: '0.85rem 1.15rem' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                padding: '0.22rem 0.65rem',
                                                borderRadius: '4px',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.02em',
                                                textTransform: 'uppercase',
                                                background: badge.bg,
                                                color: badge.color,
                                                border: `1px solid ${badge.border}`,
                                            }}
                                        >
                                            {badge.label}
                                        </span>
                                    </td>

                                    {/* Documento PDF Adjunto */}
                                    <td style={{ padding: '0.85rem 1.15rem' }}>
                                        {doc ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const url = doc.fileUrl.startsWith('http')
                                                            ? doc.fileUrl
                                                            : `http://localhost:3000${doc.fileUrl.startsWith('/') ? '' : '/'}${doc.fileUrl}`;
                                                        window.open(url, '_blank');
                                                    }}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.45rem',
                                                        padding: '0.35rem 0.65rem',
                                                        borderRadius: '5px',
                                                        border: '1px solid #FECACA',
                                                        background: '#FEF2F2',
                                                        color: '#B91C1C',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}
                                                    title="Abrir documento PDF"
                                                >
                                                    <i className="fa-solid fa-file-pdf" style={{ fontSize: '0.9rem', color: '#DC2626' }}></i>
                                                    <span>{doc.fileName || 'Documento_Respaldo.pdf'}</span>
                                                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.7rem', opacity: 0.7 }}></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '4px', color: '#F59E0B' }}></i>
                                                Sin documento cargado
                                            </span>
                                        )}
                                    </td>

                                    {/* Estado */}
                                    <td style={{ padding: '0.85rem 1.15rem' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                padding: '0.22rem 0.65rem',
                                                borderRadius: '4px',
                                                fontSize: '0.72rem',
                                                fontWeight: 700,
                                                background: '#FFFBEB',
                                                color: '#B45309',
                                                border: '1px solid #FDE68A',
                                            }}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }}></span>
                                            PENDIENTE APROBACIÓN
                                        </span>
                                    </td>

                                    {/* Acciones de Evaluación */}
                                    <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button
                                                type="button"
                                                onClick={() => onApproveUser(user)}
                                                disabled={isUpdating}
                                                style={{
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '5px',
                                                    border: '1px solid #006D36',
                                                    background: '#006D36',
                                                    color: '#FFFFFF',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 700,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    cursor: isUpdating ? 'wait' : 'pointer',
                                                    boxShadow: '0 1px 2px rgba(0, 109, 54, 0.2)',
                                                }}
                                                title="Aprobar usuario y habilitar cuenta"
                                            >
                                                {isUpdating ? (
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className="fa-solid fa-check"></i>
                                                )}
                                                <span>Aprobar</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => onRejectUser(user)}
                                                disabled={isUpdating}
                                                style={{
                                                    padding: '0.35rem 0.65rem',
                                                    borderRadius: '5px',
                                                    border: '1px solid #CBD5E1',
                                                    background: '#FFFFFF',
                                                    color: '#DC2626',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 600,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    cursor: isUpdating ? 'wait' : 'pointer',
                                                }}
                                                title="Rechazar solicitud"
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                                <span>Rechazar</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
