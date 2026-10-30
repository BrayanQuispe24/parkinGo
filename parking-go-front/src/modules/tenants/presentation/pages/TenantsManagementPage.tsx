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
import { TenantDetailPanel } from '../components/TenantDetailPanel';

export const TenantsManagementPage = () => {
    const { user } = useAuthStore();
    const currentRole = user?.role;
    const isParkingAdmin = currentRole === 'PARKING_ADMIN';
    const isHost = currentRole === 'HOST' || currentRole === 'anfitrion';
    const canManageTenants = isParkingAdmin || isHost;
    const isSuperOrGeneralAdmin = currentRole === 'SUPER_ADMIN' || currentRole === 'GENERAL_ADMIN';

    // Tabs: 'list' (tabla) | 'form' (crear/editar) | 'detail' (ficha completa de empresa)
    const [mainTab, setMainTab] = useState<'list' | 'form' | 'detail'>('list');
    const [selectedTenantForEdit, setSelectedTenantForEdit] = useState<Tenant | null>(null);

    // Empresa seleccionada para la pestaña de visualización y modales de confirmación
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

    // Para Anfitrión rige el límite estricto de 1 empresa/propiedad
    const hasReachedHostLimit = isHost && tenants.length >= 1;

    // Mutaciones remotas con TanStack Query
    const createMutation = useCreateTenantMutation();
    const updateMutation = useUpdateTenantMutation();
    const darDeBajaMutation = useDarDeBajaTenantMutation();
    const deleteMutation = useDeleteTenantMutation();

    // Handlers
    const handleCreateTenant = async (payload: CreateTenantPayload) => {
        if (hasReachedHostLimit) {
            showToast('Como Anfitrión particular solo tienes permitido registrar 1 empresa/propiedad.');
            return;
        }
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

            {/* Pestañas de Navegación (Visibles para Admin de Parqueo, Anfitrión o cuando hay una ficha de detalle abierta) */}
            {(canManageTenants || selectedTenantForView !== null) && (
                <div className="tenant-tabs-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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

                    {canManageTenants && (
                        <button
                            type="button"
                            disabled={!selectedTenantForEdit && hasReachedHostLimit}
                            onClick={() => {
                                if (!selectedTenantForEdit && hasReachedHostLimit) {
                                    showToast('Como Anfitrión particular solo tienes permitido registrar 1 empresa/propiedad.');
                                    return;
                                }
                                setSelectedTenantForEdit(null);
                                setMainTab('form');
                            }}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                borderBottom: mainTab === 'form' ? '2.5px solid var(--accent-emerald)' : '2.5px solid transparent',
                                color: (!selectedTenantForEdit && hasReachedHostLimit) ? '#94A3B8' : (mainTab === 'form' ? 'var(--accent-emerald)' : 'var(--text-muted)'),
                                fontWeight: mainTab === 'form' ? 800 : 600,
                                padding: '0.65rem 0.25rem',
                                fontSize: '0.88rem',
                                cursor: (!selectedTenantForEdit && hasReachedHostLimit) ? 'not-allowed' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                opacity: (!selectedTenantForEdit && hasReachedHostLimit) ? 0.6 : 1,
                            }}
                            title={(!selectedTenantForEdit && hasReachedHostLimit) ? 'Límite de 1 empresa alcanzado para el rol Anfitrión' : undefined}
                        >
                            <i className={`fa-solid ${selectedTenantForEdit ? 'fa-pen-to-square' : 'fa-building-circle-check'}`}></i>
                            <span>{selectedTenantForEdit ? 'Editar Empresa' : 'Registrar Nueva Empresa'}</span>
                        </button>
                    )}

                    {/* Badge informativo de Cuota para Anfitrión */}
                    {isHost && (
                        <div
                            style={{
                                marginLeft: 'auto',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '14px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                background: hasReachedHostLimit ? '#FEF3C7' : '#DCFCE7',
                                color: hasReachedHostLimit ? '#92400E' : '#166534',
                                border: hasReachedHostLimit ? '1px solid #FCD34D' : '1px solid #BBF7D0',
                            }}
                        >
                            <i className={`fa-solid ${hasReachedHostLimit ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                            <span>{hasReachedHostLimit ? 'Límite C2C: 1 Empresa Alcanzada' : 'Cuota Anfitrión: 1 Empresa Permitida'}</span>
                        </div>
                    )}

                    {/* Pestaña Dinámica: Ficha Técnica de Empresa */}
                    {selectedTenantForView && (
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                borderBottom: mainTab === 'detail' ? '2.5px solid var(--accent-emerald)' : '2.5px solid transparent',
                                paddingRight: '0.2rem',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setMainTab('detail')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: mainTab === 'detail' ? 'var(--accent-emerald)' : 'var(--text-muted)',
                                    fontWeight: mainTab === 'detail' ? 800 : 600,
                                    padding: '0.65rem 0.25rem',
                                    fontSize: '0.88rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i className="fa-solid fa-building"></i>
                                <span>Ficha: {selectedTenantForView.nombre}</span>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTenantForView(null);
                                    if (mainTab === 'detail') setMainTab('list');
                                }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-muted)',
                                    padding: '0.2rem',
                                    marginLeft: '0.15rem',
                                    borderRadius: '50%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.82rem',
                                }}
                                title="Cerrar pestaña de ficha técnica"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Vista 1: Detalle Completo de la Empresa (Pestaña Dedicada) */}
            {mainTab === 'detail' && selectedTenantForView ? (
                <TenantDetailPanel
                    tenant={selectedTenantForView}
                    canEdit={canManageTenants}
                    onBack={() => setMainTab('list')}
                    onEdit={(tenant) => {
                        setSelectedTenantForEdit(tenant);
                        setMainTab('form');
                    }}
                />
            ) : canManageTenants && mainTab === 'form' ? (
                /* Vista 2: Formulario (Creación o Edición) */
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
                /* Vista 3: Tabla de Empresas */
                <TenantsEnterpriseTable
                    tenants={tenants}
                    loading={isLoading}
                    currentRole={currentRole}
                    onViewTenant={(tenant) => {
                        setSelectedTenantForView(tenant);
                        setMainTab('detail');
                    }}
                    onEditTenant={(tenant) => {
                        setSelectedTenantForEdit(tenant);
                        setMainTab('form');
                    }}
                    onDarDeBajaTenant={(tenant) => setTenantForStatusModal(tenant)}
                    onDeleteTenant={isSuperOrGeneralAdmin ? (tenant) => setTenantForDeleteModal(tenant) : undefined}
                />
            )}

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
