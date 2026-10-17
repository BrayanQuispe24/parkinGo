// src/modules/admin/presentation/components/UsersTable.tsx
import { useState } from 'react';
import type { AdminUser } from '../../domain/AdminUser';

interface UsersTableProps {
    users: AdminUser[];
    loading?: boolean;
    onToggleStatus: (userId: string, currentStatus: string) => Promise<void>;
}

export const UsersTable = ({ users, loading, onToggleStatus }: UsersTableProps) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUsers(users.map((u) => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter((uId) => uId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleStatusClick = async (user: AdminUser) => {
        try {
            setUpdatingId(user.id);
            await onToggleStatus(user.id, user.status);
        } finally {
            setUpdatingId(null);
        }
    };

    // Estilos de badges por rol
    const getRoleBadge = (roleName?: string) => {
        switch (roleName?.toUpperCase()) {
            case 'HOST':
                return {
                    label: 'DUEÑO DE EMPRESA',
                    bg: '#dcfce7',
                    color: '#15803d',
                    border: '#bbf7d0',
                };
            case 'PARKING_ADMIN':
                return {
                    label: 'ADMINISTRADOR DE PARQUEO',
                    bg: '#e0e7ff',
                    color: '#4338ca',
                    border: '#c7d2fe',
                };
            case 'DRIVER':
                return {
                    label: 'CONDUCTOR',
                    bg: '#fef3c7',
                    color: '#b45309',
                    border: '#fde68a',
                };
            case 'SUPER_ADMIN':
                return {
                    label: 'SUPER ADMIN',
                    bg: '#f3e8ff',
                    color: '#7e22ce',
                    border: '#e9d5ff',
                };
            default:
                return {
                    label: roleName || 'USUARIO',
                    bg: '#f1f5f9',
                    color: '#475569',
                    border: '#e2e8f0',
                };
        }
    };

    if (loading) {
        return (
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: '#006D36', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Cargando usuarios del sistema...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '2.5rem', textAlign: 'center' }}>
                <i className="fa-solid fa-user-slash" style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '0.5rem' }}></i>
                <h4 style={{ margin: 0, color: '#1e293b' }}>No se encontraron usuarios</h4>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0.25rem 0 0 0' }}>Intenta ajustar los filtros de búsqueda.</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === users.length && users.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th style={{ padding: '0.75rem 1rem' }}>USUARIO / CORREO</th>
                            <th style={{ padding: '0.75rem 1rem' }}>ROL ASIGNADO</th>
                            <th style={{ padding: '0.75rem 1rem' }}>EMPRESA / TIPO</th>
                            <th style={{ padding: '0.75rem 1rem' }}>TELÉFONO</th>
                            <th style={{ padding: '0.75rem 1rem' }}>ESTADO</th>
                            <th style={{ padding: '0.75rem 1rem' }}>PARQUEOS</th>
                            <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const badge = getRoleBadge(user.role?.name);
                            const isActive = user.status === 'ACTIVE';
                            const isUpdating = updatingId === user.id;

                            return (
                                <tr
                                    key={user.id}
                                    style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectOne(user.id)}
                                        />
                                    </td>

                                    {/* Usuario y Correo */}
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                            <div
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '4px',
                                                    border: `1px solid ${badge.border}`,
                                                    background: badge.bg,
                                                    color: badge.color,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    fontSize: '0.8rem',
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {user.firstName?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                                                    {user.fullname || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
                                                </div>
                                                <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rol Asignado */}
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span
                                            style={{
                                                background: badge.bg,
                                                color: badge.color,
                                                border: `1px solid ${badge.border}`,
                                                borderRadius: '4px',
                                                padding: '0.2rem 0.5rem',
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.02em',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {badge.label}
                                        </span>
                                    </td>

                                    {/* Empresa / Tipo */}
                                    <td style={{ padding: '0.75rem 1rem', color: '#334155', fontWeight: 500 }}>
                                        {user.empresa ? user.empresa : <span style={{ color: '#94a3b8' }}>-</span>}
                                    </td>

                                    {/* Teléfono */}
                                    <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                                        {user.phone ? user.phone : <span style={{ color: '#94a3b8' }}>-</span>}
                                    </td>

                                    {/* Estado */}
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                                color: isActive ? '#16a34a' : '#dc2626',
                                                fontWeight: 600,
                                                fontSize: '0.72rem',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: isActive ? '#22c55e' : '#ef4444',
                                                }}
                                            ></span>
                                            {isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                                        </span>
                                    </td>

                                    {/* Parqueos */}
                                    <td style={{ padding: '0.75rem 1rem' }}>
                                        {user.parqueosCount !== undefined && user.parqueosCount !== null ? (
                                            <span
                                                style={{
                                                    background: '#eff6ff',
                                                    color: '#2563eb',
                                                    border: '1px solid #bfdbfe',
                                                    borderRadius: '4px',
                                                    padding: '0.15rem 0.45rem',
                                                    fontSize: '0.68rem',
                                                    fontWeight: 700,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                }}
                                            >
                                                <i className="fa-solid fa-square-parking" style={{ fontSize: '0.65rem' }}></i>
                                                <span>{user.parqueosCount} PARQUEOS</span>
                                            </span>
                                        ) : (
                                            <span style={{ color: '#94a3b8' }}>-</span>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <button
                                                style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.4rem', color: '#64748b', cursor: 'pointer' }}
                                                title="Ver detalle"
                                                onClick={() => alert(`Detalles de ${user.fullname || user.email}\nC.I.: ${user.ci}`)}
                                            >
                                                <i className="fa-regular fa-eye" style={{ fontSize: '0.72rem' }}></i>
                                            </button>

                                            <button
                                                style={{ background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.25rem 0.4rem', color: '#64748b', cursor: 'pointer' }}
                                                title="Editar"
                                                onClick={() => alert(`Editar usuario: ${user.email}`)}
                                            >
                                                <i className="fa-regular fa-pen-to-square" style={{ fontSize: '0.72rem' }}></i>
                                            </button>

                                            <button
                                                onClick={() => handleStatusClick(user)}
                                                disabled={isUpdating}
                                                style={{
                                                    background: isActive ? '#fef2f2' : '#f0fdf4',
                                                    border: `1px solid ${isActive ? '#fecaca' : '#bbf7d0'}`,
                                                    color: isActive ? '#dc2626' : '#16a34a',
                                                    borderRadius: '4px',
                                                    padding: '0.25rem 0.55rem',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    cursor: isUpdating ? 'wait' : 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.25rem',
                                                }}
                                                title={isActive ? 'Suspender cuenta de usuario' : 'Activar cuenta de usuario'}
                                            >
                                                {isUpdating ? (
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className={`fa-solid ${isActive ? 'fa-ban' : 'fa-check'}`}></i>
                                                )}
                                                <span>{isActive ? 'Suspender' : 'Activar'}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div
                style={{
                    padding: '0.65rem 1rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem',
                    color: '#64748b',
                }}
            >
                <span>Mostrando 1 - {users.length} de {users.length} registros</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                        ‹
                    </button>
                    <button style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #006D36', background: '#006D36', color: '#fff', fontWeight: 'bold' }}>
                        1
                    </button>
                    <button style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
};
