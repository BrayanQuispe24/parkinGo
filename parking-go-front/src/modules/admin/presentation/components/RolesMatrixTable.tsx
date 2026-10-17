// src/modules/admin/presentation/components/RolesMatrixTable.tsx
import { useState } from 'react';
import type { PermissionItem, RoleWithPermissions } from '../../domain/RolePermission';

interface RolesMatrixTableProps {
    roles: RoleWithPermissions[];
    permissions: PermissionItem[];
    loading?: boolean;
    onSaveMatrix: (roleId: string, roleName: string, permissionIds: string[]) => Promise<void>;
}

export const RolesMatrixTable = ({ roles, permissions, loading, onSaveMatrix }: RolesMatrixTableProps) => {
    // Mapa: roleId -> Set<permissionId>
    const [assignedMap, setAssignedMap] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {};
        roles.forEach((role) => {
            initial[role.id] = (role.permissions || []).map((p) => p.id);
        });
        return initial;
    });

    const [savingRole, setSavingRole] = useState<string | null>(null);

    // Lista complementaria de permisos para mostrar una matriz completa
    const defaultPermissionsList: PermissionItem[] = [
        { id: 'perm-1', name: 'CREATE_ROLE', description: 'Creación de nuevos roles de acceso' },
        { id: 'perm-2', name: 'UPDATE_ROLE', description: 'Modificación de atributos y roles' },
        { id: 'perm-3', name: 'DELETE_ROLE', description: 'Eliminación y baja de roles' },
        { id: 'perm-4', name: 'VIEW_REPORTS', description: 'Acceso a métricas y analítica general' },
        { id: 'perm-5', name: 'MANAGE_USERS', description: 'Gestión, activación y suspensión de cuentas' },
        { id: 'perm-6', name: 'MANAGE_PARKINGS', description: 'Alta y supervisión de garajes y plazas' },
        { id: 'perm-7', name: 'RESERVE_PARKING', description: 'Capacidad de realizar reservas y pagos' },
        { id: 'perm-8', name: 'AUDIT_LOG_VIEW', description: 'Consulta de bitácora y eventos de seguridad' },
    ];

    const displayPermissions = permissions.length > 0 ? permissions : defaultPermissionsList;

    const togglePermission = (roleId: string, permId: string) => {
        // SUPER_ADMIN tiene todos los permisos fijos
        const role = roles.find((r) => r.id === roleId);
        if (role?.name === 'SUPER_ADMIN') {
            return;
        }

        setAssignedMap((prev) => {
            const currentList = prev[roleId] || [];
            const exists = currentList.includes(permId);
            const updated = exists ? currentList.filter((id) => id !== permId) : [...currentList, permId];
            return {
                ...prev,
                [roleId]: updated,
            };
        });
    };

    const handleSaveRole = async (role: RoleWithPermissions) => {
        try {
            setSavingRole(role.id);
            const currentPerms = assignedMap[role.id] || [];
            await onSaveMatrix(role.id, role.name, currentPerms);
        } finally {
            setSavingRole(null);
        }
    };

    if (loading) {
        return (
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '2rem', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: '#006D36', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Cargando matriz de roles y permisos...</p>
            </div>
        );
    }

    return (
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                            <th style={{ padding: '0.85rem 1.25rem', minWidth: '220px' }}>PERMISO / ACCESO</th>
                            {roles.map((role) => (
                                <th key={role.id} style={{ padding: '0.85rem 0.75rem', textAlign: 'center', minWidth: '120px' }}>
                                    <div style={{ fontWeight: 700, color: role.name === 'SUPER_ADMIN' ? '#7e22ce' : '#0f172a' }}>
                                        {role.name}
                                    </div>
                                    {role.name !== 'SUPER_ADMIN' && (
                                        <button
                                            onClick={() => handleSaveRole(role)}
                                            disabled={savingRole === role.id}
                                            style={{
                                                marginTop: '0.25rem',
                                                background: '#f1f5f9',
                                                border: '1px solid #cbd5e1',
                                                borderRadius: '4px',
                                                padding: '0.15rem 0.45rem',
                                                fontSize: '0.65rem',
                                                cursor: 'pointer',
                                                color: '#334155',
                                            }}
                                        >
                                            {savingRole === role.id ? 'Guardando...' : 'Guardar'}
                                        </button>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayPermissions.map((perm) => (
                            <tr
                                key={perm.id}
                                style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                {/* Nombre del Permiso */}
                                <td style={{ padding: '0.75rem 1.25rem' }}>
                                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{perm.name}</div>
                                    <div style={{ color: '#64748b', fontSize: '0.7rem' }}>
                                        {perm.description || 'Privilegio de ejecución del sistema'}
                                    </div>
                                </td>

                                {/* Columnas de Roles */}
                                {roles.map((role) => {
                                    const isSuper = role.name === 'SUPER_ADMIN';
                                    const isAssigned =
                                        isSuper || (assignedMap[role.id] && assignedMap[role.id].includes(perm.id));

                                    return (
                                        <td key={role.id} style={{ padding: '0.75rem 0.75rem', textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={!!isAssigned}
                                                disabled={isSuper}
                                                onChange={() => togglePermission(role.id, perm.id)}
                                                style={{
                                                    cursor: isSuper ? 'not-allowed' : 'pointer',
                                                    accentColor: '#006D36',
                                                    width: '16px',
                                                    height: '16px',
                                                }}
                                                title={isSuper ? 'Inmutable para SUPER_ADMIN' : 'Alternar permiso'}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Informativo */}
            <div style={{ padding: '0.75rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.74rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>● Los permisos para SUPER_ADMIN están bloqueados por seguridad operacional del sistema.</span>
                <span style={{ color: '#006D36', fontWeight: 600 }}>RBAC Protegido con JWT & RolesGuard</span>
            </div>
        </div>
    );
};
