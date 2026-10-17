// src/modules/admin/presentation/components/UsersEnterpriseTable.tsx
import React, { useMemo, useState } from 'react';
import type { AdminUser } from '../../domain/AdminUser';

interface UsersEnterpriseTableProps {
    users: AdminUser[];
    loading?: boolean;
    onViewUser: (user: AdminUser) => void;
    onEditUser: (user: AdminUser) => void;
    onRequestToggleStatus: (user: AdminUser) => void;
    statusUpdatingId?: string | null;
}

export const UsersEnterpriseTable: React.FC<UsersEnterpriseTableProps> = ({
    users,
    loading,
    onViewUser,
    onEditUser,
    onRequestToggleStatus,
    statusUpdatingId,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    // Filtrado reactivo en memoria
    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const matchesSearch =
                !searchTerm ||
                u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.ci?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.empresa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.role?.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = selectedRole === 'ALL' || u.role?.name === selectedRole;
            const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, selectedRole, selectedStatus]);

    // Paginación
    const totalItems = filteredUsers.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startRecord = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
    const endRecord = Math.min(validCurrentPage * pageSize, totalItems);

    const paginatedUsers = useMemo(() => {
        const start = (validCurrentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, validCurrentPage, pageSize]);

    // Badges con paleta institucional ParkinGo legibles y proporcionados
    const getRoleBadge = (roleName?: string) => {
        switch (roleName?.toUpperCase()) {
            case 'HOST':
                return {
                    label: 'ANFITRIÓN / DUEÑO',
                    bg: '#ECFDF5',
                    color: '#15803D',
                    border: '#A7F3D0',
                };
            case 'PARKING_ADMIN':
                return {
                    label: 'ADMIN PARQUEO',
                    bg: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '#BFDBFE',
                };
            case 'DRIVER':
                return {
                    label: 'CONDUCTOR',
                    bg: '#FFFBEB',
                    color: '#B45309',
                    border: '#FDE68A',
                };
            case 'SUPER_ADMIN':
                return {
                    label: 'SUPER ADMIN',
                    bg: '#FAF5FF',
                    color: '#7E22CE',
                    border: '#E9D5FF',
                };
            default:
                return {
                    label: roleName || 'USUARIO',
                    bg: '#F1F5F9',
                    color: '#475569',
                    border: '#E2E8F0',
                };
        }
    };

    return (
        <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {/* Toolbar Superior */}
            <div
                style={{
                    padding: '0.9rem 1.15rem',
                    borderBottom: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.85rem',
                }}
            >
                {/* Search Input con icono espacioso */}
                <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '520px' }}>
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94A3B8',
                            fontSize: '0.85rem',
                            pointerEvents: 'none',
                        }}
                    ></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Buscar por nombre, correo, CI o rol..."
                        style={{
                            width: '100%',
                            padding: '0.55rem 2rem 0.55rem 2.45rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            fontSize: '0.84rem',
                            color: '#0F172A',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.15s ease',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = '#006D36')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                padding: '4px',
                            }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Filtros Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Rol:
                        </span>
                        <select
                            value={selectedRole}
                            onChange={(e) => {
                                setSelectedRole(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                fontSize: '0.82rem',
                                color: '#0F172A',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '140px',
                            }}
                        >
                            <option value="ALL">Todos los roles</option>
                            <option value="DRIVER">Conductor</option>
                            <option value="HOST">Anfitrión</option>
                            <option value="PARKING_ADMIN">Admin Parqueo</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                            Estado:
                        </span>
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            style={{
                                padding: '0.45rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                fontSize: '0.82rem',
                                color: '#0F172A',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '120px',
                            }}
                        >
                            <option value="ALL">Todos</option>
                            <option value="ACTIVE">Activos</option>
                            <option value="SUSPENDED">Suspendidos</option>
                            <option value="INACTIVE">Inactivos</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Estado de Carga */}
            {loading && (
                <div style={{ padding: '3.5rem', textAlign: 'center', background: '#FFFFFF' }}>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.75rem', color: '#006D36', marginBottom: '0.75rem' }}></i>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, margin: 0 }}>
                        Cargando registros de usuarios...
                    </p>
                </div>
            )}

            {/* Estado Vacío */}
            {!loading && filteredUsers.length === 0 && (
                <div style={{ padding: '3.5rem', textAlign: 'center', background: '#FFFFFF' }}>
                    <div
                        style={{
                            width: '54px',
                            height: '54px',
                            margin: '0 auto 0.85rem auto',
                            borderRadius: '8px',
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94A3B8',
                        }}
                    >
                        <i className="fa-solid fa-user-slash" style={{ fontSize: '1.5rem' }}></i>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                        No se encontraron usuarios
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: 0 }}>
                        Intenta ajustar los filtros de búsqueda o restablecer los selectores.
                    </p>
                </div>
            )}

            {/* Desktop Table View (hidden md:block) */}
            {!loading && filteredUsers.length > 0 && (
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
                                <th style={{ padding: '0.85rem 1.15rem' }}>IDENTIFICADOR / CORREO</th>
                                <th style={{ padding: '0.85rem 1.15rem' }}>ROL ASIGNADO</th>
                                <th style={{ padding: '0.85rem 1.15rem' }}>EMPRESA / AFILIACIÓN</th>
                                <th style={{ padding: '0.85rem 1.15rem' }}>ESTADO</th>
                                <th style={{ padding: '0.85rem 1.15rem' }}>PARQUEOS</th>
                                <th style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => {
                                const badge = getRoleBadge(user.role?.name);
                                const isActive = user.status === 'ACTIVE';
                                const isUpdating = statusUpdatingId === user.id;

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
                                        {/* Usuario y Correo */}
                                        <td style={{ padding: '0.85rem 1.15rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div
                                                    style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        background: '#DCFCE7',
                                                        border: '1px solid #BBF7D0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 700,
                                                        color: '#15803D',
                                                        fontSize: '0.82rem',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#0F172A' }}>
                                                        {user.fullname || `${user.firstName} ${user.lastName}`}
                                                    </div>
                                                    <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Rol */}
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

                                        {/* Empresa */}
                                        <td style={{ padding: '0.85rem 1.15rem', color: '#475569', fontSize: '0.82rem' }}>
                                            {user.empresa || 'Usuario Particular'}
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
                                                    background: isActive ? '#ECFDF5' : '#FEF2F2',
                                                    color: isActive ? '#15803D' : '#DC2626',
                                                    border: `1px solid ${isActive ? '#BBF7D0' : '#FECACA'}`,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: isActive ? '#16A34A' : '#DC2626',
                                                    }}
                                                ></span>
                                                {isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                                            </span>
                                        </td>

                                        {/* Parqueos */}
                                        <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.82rem', color: '#64748B' }}>
                                            {user.parqueosCount ?? 0} asignados
                                        </td>

                                        {/* Acciones */}
                                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => onViewUser(user)}
                                                    title="Ver detalle de usuario"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #CBD5E1',
                                                        background: '#FFFFFF',
                                                        color: '#64748B',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '0.82rem',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#006D36';
                                                        e.currentTarget.style.color = '#006D36';
                                                        e.currentTarget.style.background = '#F0FDF4';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#CBD5E1';
                                                        e.currentTarget.style.color = '#64748B';
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                    }}
                                                >
                                                    <i className="fa-regular fa-eye"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onEditUser(user)}
                                                    title="Editar usuario"
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '5px',
                                                        border: '1px solid #CBD5E1',
                                                        background: '#FFFFFF',
                                                        color: '#64748B',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '0.82rem',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.borderColor = '#006D36';
                                                        e.currentTarget.style.color = '#006D36';
                                                        e.currentTarget.style.background = '#F0FDF4';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.borderColor = '#CBD5E1';
                                                        e.currentTarget.style.color = '#64748B';
                                                        e.currentTarget.style.background = '#FFFFFF';
                                                    }}
                                                >
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onRequestToggleStatus(user)}
                                                    disabled={isUpdating}
                                                    title={isActive ? 'Suspender cuenta de usuario' : 'Activar cuenta de usuario'}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '5px',
                                                        border: `1px solid ${isActive ? '#FECACA' : '#BBF7D0'}`,
                                                        background: isActive ? '#FEF2F2' : '#F0FDF4',
                                                        color: isActive ? '#DC2626' : '#16A34A',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: isUpdating ? 'wait' : 'pointer',
                                                        fontSize: '0.82rem',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {isUpdating ? (
                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                    ) : (
                                                        <i className={`fa-solid ${isActive ? 'fa-ban' : 'fa-check'}`}></i>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Footer */}
            {!loading && filteredUsers.length > 0 && (
                <div
                    style={{
                        padding: '0.85rem 1.15rem',
                        background: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#64748B',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    <div>
                        Mostrando <strong style={{ color: '#0F172A' }}>{startRecord}</strong> -{' '}
                        <strong style={{ color: '#0F172A' }}>{endRecord}</strong> de{' '}
                        <strong style={{ color: '#0F172A' }}>{totalItems}</strong> registros
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={validCurrentPage === 1}
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '4px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#475569',
                                cursor: validCurrentPage === 1 ? 'not-allowed' : 'pointer',
                                opacity: validCurrentPage === 1 ? 0.4 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ‹
                        </button>
                        <span
                            style={{
                                minWidth: '30px',
                                height: '28px',
                                padding: '0 8px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: '#006D36',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {validCurrentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={validCurrentPage === totalPages}
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '4px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#475569',
                                cursor: validCurrentPage === totalPages ? 'not-allowed' : 'pointer',
                                opacity: validCurrentPage === totalPages ? 0.4 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
