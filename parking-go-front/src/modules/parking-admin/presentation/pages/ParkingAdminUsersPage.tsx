// src/modules/parking-admin/presentation/pages/ParkingAdminUsersPage.tsx
import { useState } from 'react';
import type { ParkingOperator, CreateOperatorPayload, UpdateOperatorPayload } from '../../domain/ParkingOperator';
import { useParkingOperatorsQuery } from '../../application/useParkingAdminQueries';
import {
    useCreateOperatorMutation,
    useUpdateOperatorMutation,
    useToggleOperatorStatusMutation,
    useDeleteOperatorMutation,
} from '../../application/useParkingAdminMutations';
import { OperatorEnterpriseTable } from '../components/OperatorEnterpriseTable';
import { OperatorFormPanel } from '../components/OperatorFormPanel';
import { OperatorStatusConfirmModal } from '../components/OperatorStatusConfirmModal';
import { OperatorDeleteConfirmModal } from '../components/modals/OperatorDeleteConfirmModal';
import { OperatorReportModal } from '../components/modals/OperatorReportModal';

export const ParkingAdminUsersPage = () => {
    // Estado de vistas en pestañas (idéntico a UsersManagementPage)
    const [mainTab, setMainTab] = useState<'list' | 'form'>('list');
    const [selectedOperatorForEdit, setSelectedOperatorForEdit] = useState<ParkingOperator | null>(null);

    // Modal de confirmación de estado
    const [operatorForStatusModal, setOperatorForStatusModal] = useState<ParkingOperator | null>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Modal de confirmación de eliminación
    const [operatorForDeleteModal, setOperatorForDeleteModal] = useState<ParkingOperator | null>(null);
    const [isDeletingOperator, setIsDeletingOperator] = useState(false);

    // Modal de reporte individual
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportOperatorId, setReportOperatorId] = useState<string>('');

    // Feedback Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Queries remotas con TanStack Query
    const { data: operators = [], isLoading, error } = useParkingOperatorsQuery();

    // Mutaciones remotas con TanStack Query
    const createMutation = useCreateOperatorMutation();
    const updateMutation = useUpdateOperatorMutation();
    const toggleStatusMutation = useToggleOperatorStatusMutation();
    const deleteMutation = useDeleteOperatorMutation();

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleCreateOperator = async (payload: CreateOperatorPayload) => {
        try {
            await createMutation.mutateAsync(payload);
            showToast(`¡Operador ${payload.fullName} registrado! Se enviaron las credenciales a su correo.`);
            setMainTab('list');
            setSelectedOperatorForEdit(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al registrar operador';
            showToast(msg);
            throw err;
        }
    };

    const handleUpdateOperator = async (payload: UpdateOperatorPayload) => {
        try {
            await updateMutation.mutateAsync(payload);
            showToast('Datos del operador actualizados exitosamente.');
            setMainTab('list');
            setSelectedOperatorForEdit(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error al actualizar operador';
            showToast(msg);
            throw err;
        }
    };

    const handleEditOperator = (op: ParkingOperator) => {
        setSelectedOperatorForEdit(op);
        setMainTab('form');
    };

    const handleViewOperator = (op: ParkingOperator) => {
        setReportOperatorId(op.id);
        setIsReportModalOpen(true);
    };

    const handleRequestToggleStatus = (op: ParkingOperator) => {
        setOperatorForStatusModal(op);
    };

    const handleConfirmStatusChange = async () => {
        if (!operatorForStatusModal) return;
        try {
            setIsUpdatingStatus(true);
            await toggleStatusMutation.mutateAsync(operatorForStatusModal.id);
            const action = operatorForStatusModal.status === 'inactivo' ? 'habilitado' : 'suspendido';
            showToast(`Operador ${operatorForStatusModal.fullName} ha sido ${action}.`);
            setOperatorForStatusModal(null);
        } catch {
            showToast('No se pudo actualizar el estado del operador');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleRequestDelete = (op: ParkingOperator) => {
        setOperatorForDeleteModal(op);
    };

    const handleConfirmDelete = async () => {
        if (!operatorForDeleteModal) return;
        try {
            setIsDeletingOperator(true);
            await deleteMutation.mutateAsync(operatorForDeleteModal.id);
            showToast(`Operador ${operatorForDeleteModal.fullName} eliminado exitosamente.`);
            setOperatorForDeleteModal(null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'No se pudo eliminar el operador';
            showToast(msg);
        } finally {
            setIsDeletingOperator(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Feedback Toast Notifier */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '6px',
                        background: '#064E3B',
                        color: '#D1FAE5',
                        border: '1px solid #059669',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                    }}
                >
                    <i className="fa-solid fa-circle-check" style={{ color: '#34D399', fontSize: '1rem' }}></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Error Banner si falla la carga */}
            {error && (
                <div
                    style={{
                        padding: '0.85rem 1.15rem',
                        borderRadius: '6px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        color: '#DC2626',
                        fontSize: '0.84rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Ocurrió un error al cargar la lista de operadores del parqueo.</span>
                </div>
            )}

            {/* Tab Navigation Bar (Idéntico a UsersManagementPage) */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', gap: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {/* TAB 1: Listado de Operadores */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedOperatorForEdit(null);
                        setMainTab('list');
                    }}
                    className="admin-page-tab-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: mainTab === 'list' ? '2.5px solid var(--border-highlight)' : '2.5px solid transparent',
                        color: mainTab === 'list' ? 'var(--border-highlight)' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        padding: '0.65rem 0.95rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        outline: 'none',
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                    }}
                >
                    <i className="fa-solid fa-users" style={{ fontSize: '0.88rem' }}></i>
                    <span className="tab-desktop-text">Listado de Operadores ({operators.length})</span>
                    <span className="tab-mobile-text">Operadores ({operators.length})</span>
                </button>

                {/* TAB 2: Registrar / Editar Operador */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedOperatorForEdit(null);
                        setMainTab('form');
                    }}
                    className="admin-page-tab-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: mainTab === 'form' ? '2.5px solid var(--border-highlight)' : '2.5px solid transparent',
                        color: mainTab === 'form' ? 'var(--border-highlight)' : 'var(--text-muted)',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        padding: '0.65rem 0.95rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        outline: 'none',
                        transition: 'all 0.15s ease',
                        flexShrink: 0,
                    }}
                >
                    <i
                        className={`fa-solid ${
                            selectedOperatorForEdit ? 'fa-pen-to-square' : 'fa-user-plus'
                        }`}
                        style={{ fontSize: '0.88rem' }}
                    ></i>
                    <span className="tab-desktop-text">
                        {selectedOperatorForEdit
                            ? `Editar: ${selectedOperatorForEdit.fullName}`
                            : 'Registrar Nuevo Operador'}
                    </span>
                    <span className="tab-mobile-text">
                        {selectedOperatorForEdit ? 'Editar' : 'Registrar'}
                    </span>
                </button>
            </div>

            {/* Contenido según la pestaña activa */}
            {mainTab === 'list' && (
                <OperatorEnterpriseTable
                    operators={operators}
                    loading={isLoading}
                    onViewOperator={handleViewOperator}
                    onEditOperator={handleEditOperator}
                    onRequestToggleStatus={handleRequestToggleStatus}
                    onDeleteOperator={handleRequestDelete}
                />
            )}


            {mainTab === 'form' && (
                <OperatorFormPanel
                    operatorToEdit={selectedOperatorForEdit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    onSubmitCreate={handleCreateOperator}
                    onSubmitUpdate={handleUpdateOperator}
                    onCancel={() => {
                        setSelectedOperatorForEdit(null);
                        setMainTab('list');
                    }}
                />
            )}

            {/* Modal de confirmación de cambio de estado */}
            <OperatorStatusConfirmModal
                operator={operatorForStatusModal}
                isUpdating={isUpdatingStatus}
                onClose={() => setOperatorForStatusModal(null)}
                onConfirm={handleConfirmStatusChange}
            />

            {/* Modal de confirmación de eliminación */}
            <OperatorDeleteConfirmModal
                operator={operatorForDeleteModal}
                isDeleting={isDeletingOperator}
                onClose={() => setOperatorForDeleteModal(null)}
                onConfirm={handleConfirmDelete}
            />

            {/* Modal de reporte de desempeño individual */}
            <OperatorReportModal
                isOpen={isReportModalOpen}
                operators={operators}
                initialOperatorId={reportOperatorId}
                onClose={() => setIsReportModalOpen(false)}
            />
        </div>
    );
};
