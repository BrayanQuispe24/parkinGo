// src/modules/admin/presentation/pages/RolesPermissionsPage.tsx
import { useEffect, useState } from 'react';
import { adminRepository } from '../../infrastructure/HttpAdminRepository';
import type { PermissionItem, RoleWithPermissions } from '../../domain/RolePermission';
import { RolesMatrixTable } from '../components/RolesMatrixTable';

export const RolesPermissionsPage = () => {
    const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
    const [permissions, setPermissions] = useState<PermissionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const loadData = async () => {
        try {
            setLoading(true);
            const [rolesData, permsData] = await Promise.all([
                adminRepository.getRoles(),
                adminRepository.getPermissions(),
            ]);
            setRoles(rolesData);
            setPermissions(permsData);
        } catch (error) {
            console.error('Error al cargar roles y permisos:', error);
            showToast('Error al conectar con el servidor para roles y permisos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSaveRole = async (roleId: string, roleName: string, permissionIds: string[]) => {
        try {
            // Filtrar solo UUIDs válidos (evitar IDs simulados como perm-1)
            const validUuids = permissionIds.filter((id) =>
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
            );

            await adminRepository.updateRolePermissions(roleId, roleName, validUuids);
            showToast(`Permisos para el rol ${roleName} actualizados correctamente en base de datos`);
            await loadData();
        } catch (error) {
            console.error('Error al guardar matriz:', error);
            showToast('No se pudieron guardar los permisos para este rol');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Feedback Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: '#064e3b',
                        color: '#d1fae5',
                        border: '1px solid #059669',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '8px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                    }}
                >
                    <i className="fa-solid fa-circle-check" style={{ color: '#34d399' }}></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Header de la Vista */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Matriz de Roles y Permisos Enterprise
                    </h2>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                        Control granular de accesos por roles (RBAC) y asignación de privilegios en el sistema.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                        onClick={() => alert('Para crear un nuevo rol personalizado, contacte la consola o ejecute seeder.')}
                        style={{
                            background: '#006D36',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.55rem 1.15rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 1px 3px rgba(0, 109, 54, 0.25)',
                        }}
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Crear Rol</span>
                    </button>
                </div>
            </div>

            {/* Matriz Interactiva de Permisos */}
            <RolesMatrixTable
                roles={roles}
                permissions={permissions}
                loading={loading}
                onSaveMatrix={handleSaveRole}
            />
        </div>
    );
};
export default RolesPermissionsPage;
