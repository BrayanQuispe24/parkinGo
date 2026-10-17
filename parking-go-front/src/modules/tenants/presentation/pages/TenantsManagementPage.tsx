// src/modules/tenants/presentation/pages/TenantsManagementPage.tsx
import { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import type { Tenant, CreateTenantPayload, UpdateTenantPayload, TenantStatus } from '../../domain/Tenant';
import { useTenantsQuery } from '../../application/useTenantsQuery';
import {
    useCreateTenantMutation,
    useUpdateTenantMutation,
    useDarDeBajaTenantMutation,
    useDeleteTenantMutation,
} from '../../application/useTenantsMutations';

import { TenantsEnterpriseTable } from '../components/TenantsEnterpriseTable';
import { TenantFormPanel } from '../components/TenantFormPanel';
import { TenantStatusConfirmModal } from '../components/TenantStatusConfirmModal';
import { TenantDeleteConfirmModal } from '../components/TenantDeleteConfirmModal';
import { TenantDetailModal } from '../components/TenantDetailModal';

export const TenantsManagementPage = () => {
    const { user } = useAuthStore();
    const currentRole = user?.role;
    const isParkingAdmin = currentRole === 'PARKING_ADMIN';
    const isSuperOrGeneralAdmin = currentRole === 'SUPER_ADMIN' || currentRole === 'GENERAL_ADMIN';

    // Tabs: Para PARKING_ADMIN 'list' | 'form'. Para GENERAL_ADMIN/SUPER_ADMIN siempre 'list'.
    const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
    const [selectedTenantForEdit, setSelectedTenantForEdit] = useState<Tenant | null>(null);

    // Modales de confirmación y vista
    const [selectedTenantForView, setSelectedTenantForView] = useState<Tenant | null>(null);
    const [tenantForStatusModal, setTenantForStatusModal] = useState<Tenant | null>(null);
    const [tenantForDeleteModal, setTenantForDeleteModal] = useState<Tenant | null>(null);

    // Toast de Feedback
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3800);
    };

    // Consultas remotas con TanStack Query
    const { data: tenants = [], isLoading } = useTenantsQuery();

    // Mutaciones remotas con TanStack Query
    const createMutation = useCreateTenantMutation();
    const updateMutation = useUpdateTenantMutation();
    const darDeBajaMutation = useDarDeBajaTenantMutation();
    const deleteMutation = useDeleteTenantMutation();

    // Handlers
    const handleCreateTenant = async (payload: CreateTenantPayload) => {
        try {
            await createMutation.mutateAsync(payload);
            showToast(`¡Empresa "${payload.nombre}" registrada y habilitada! Se envió un correo con la confirmación.`);
            setMainTab('list');
            setSelectedTenantForEdit(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al registrar la empresa';
            showToast(msg);
            throw err;
        }
    };

    const handleUpdateTenant = async (payload: UpdateTenantPayload) => {
        if (!selectedTenantForEdit) return;
        try {
            await updateMutation.mutateAsync({
                id: selectedTenantForEdit.id,
                payload,
            });
            showToast('Información de la empresa actualizada exitosamente.');
            setMainTab('list');
            setSelectedTenantForEdit(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al actualizar la empresa';
            showToast(msg);
            throw err;
        }
    };

    const handleConfirmStatusToggle = async () => {
        if (!tenantForStatusModal) return;
        try {
            const willBeStatus: TenantStatus =
                tenantForStatusModal.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
            await darDeBajaMutation.mutateAsync({
                id: tenantForStatusModal.id,
                estado: willBeStatus,
            });
            showToast(
                willBeStatus === 'ACTIVO'
                    ? `Empresa "${tenantForStatusModal.nombre}" reactivada con éxito.`
                    : `Empresa "${tenantForStatusModal.nombre}" dada de baja temporalmente.`
            );
            setTenantForStatusModal(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al cambiar estado de la empresa';
            showToast(msg);
        }
    };

    const handleConfirmDelete = async () => {
        if (!tenantForDeleteModal) return;
        try {
            await deleteMutation.mutateAsync(tenantForDeleteModal.id);
            showToast(`Empresa "${tenantForDeleteModal.nombre}" eliminada definitivamente del sistema.`);
            setTenantForDeleteModal(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al eliminar empresa del sistema';
            showToast(msg);
        }
    };

    return (
        <div className="tenant-page-container">
            {/* Feedback Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 3000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '6px',
                        background: '#064E3B',
                        color: '#D1FAE5',
                        border: '1px solid #059669',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                    }}
                >
                    <i className="fa-solid fa-circle-check" style={{ color: '#34D399', fontSize: '1rem' }}></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Pestañas de Navegación (Solo para Administrador de Parqueo) */}
            {isParkingAdmin && (
                <div className="tenant-tabs-nav">
                    <button
                        type="button"
                        onClick={() => {
                            setMainTab('list');
                            setSelectedTenantForEdit(null);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: mainTab === 'list' ? '2.5px solid var(--accent-emerald)' : '2.5px solid transparent',
                            color: mainTab === 'list' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            fontWeight: mainTab === 'list' ? 800 : 600,
                            padding: '0.65rem 0.25rem',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                        }}
                    >
                        <i className="fa-solid fa-table-list"></i>
                        <span>Listado de Empresas ({tenants.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedTenantForEdit(null);
                            setMainTab('form');
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: mainTab === 'form' ? '2.5px solid var(--accent-emerald)' : '2.5px solid transparent',
                            color: mainTab === 'form' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                            fontWeight: mainTab === 'form' ? 800 : 600,
                            padding: '0.65rem 0.25rem',
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                        }}
                    >
                        <i className={`fa-solid ${selectedTenantForEdit ? 'fa-pen-to-square' : 'fa-building-circle-check'}`}></i>
                        <span>{selectedTenantForEdit ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</span>
                    </button>
                </div>
            )}

            {/* Vista 1: Formulario (Creación o Edición) */}
            {isParkingAdmin && mainTab === 'form' ? (
                <TenantFormPanel
                    tenantToEdit={selectedTenantForEdit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    onSubmitCreate={handleCreateTenant}
                    onSubmitUpdate={handleUpdateTenant}
                    onCancel={() => {
                        setMainTab('list');
                        setSelectedTenantForEdit(null);
                    }}
                />
            ) : (
                /* Vista 2: Tabla de Empresas */
                <TenantsEnterpriseTable
                    tenants={tenants}
                    loading={isLoading}
                    currentRole={currentRole}
                    onViewTenant={(tenant) => setSelectedTenantForView(tenant)}
                    onEditTenant={(tenant) => {
                        setSelectedTenantForEdit(tenant);
                        setMainTab('form');
                    }}
                    onDarDeBajaTenant={(tenant) => setTenantForStatusModal(tenant)}
                    onDeleteTenant={isSuperOrGeneralAdmin ? (tenant) => setTenantForDeleteModal(tenant) : undefined}
                />
            )}

            {/* Modal de Detalle Completo de la Empresa y Ubicación en Mapa */}
            <TenantDetailModal
                tenant={selectedTenantForView}
                onClose={() => setSelectedTenantForView(null)}
                canEdit={isParkingAdmin}
                onEdit={(tenant) => {
                    setSelectedTenantForView(null);
                    setSelectedTenantForEdit(tenant);
                    setMainTab('form');
                }}
            />

            {/* Modal de Confirmación de Estado (Dar de Baja / Reactivar) */}
            <TenantStatusConfirmModal
                tenant={tenantForStatusModal}
                isUpdating={darDeBajaMutation.isPending}
                onClose={() => setTenantForStatusModal(null)}
                onConfirm={handleConfirmStatusToggle}
            />

            {/* Modal de Confirmación de Eliminación Definitiva (Superadmin / General Admin) */}
            <TenantDeleteConfirmModal
                tenant={tenantForDeleteModal}
                isDeleting={deleteMutation.isPending}
                onClose={() => setTenantForDeleteModal(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};
