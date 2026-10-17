// src/modules/admin/presentation/pages/UsersManagementPage.tsx
import { useState } from 'react';
import type { AdminUser, CreateAdminUserPayload } from '../../domain/AdminUser';
import { useRolesQuery, useUsersQuery } from '../../application/useUsersQuery';
import { useCreateUserMutation, useUpdateUserMutation, useToggleUserStatusMutation } from '../../application/useUsersMutations';
import { UsersEnterpriseTable } from '../components/UsersEnterpriseTable';
import { UsersPendingApprovalTable } from '../components/UsersPendingApprovalTable';
import { UserFormPanel } from '../components/UserFormPanel';
import { UserStatusConfirmModal } from '../components/UserStatusConfirmModal';

export const UsersManagementPage = () => {
    // Estado de vistas en pestañas (Blueprint 1)
    const [mainTab, setMainTab] = useState<'list' | 'pending' | 'form'>('list');
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);

    // Estado del modal de confirmación destructiva
    const [userForStatusModal, setUserForStatusModal] = useState<AdminUser | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [evaluatingUserId, setEvaluatingUserId] = useState<string | null>(null);

    // Consultas remotas con TanStack Query
    const { data: users = [], isLoading: loadingUsers, error: usersError } = useUsersQuery();
    const { data: roles = [] } = useRolesQuery();

    // Mutaciones remotas con TanStack Query
    const createUserMutation = useCreateUserMutation();
    const updateUserMutation = useUpdateUserMutation();
    const toggleStatusMutation = useToggleUserStatusMutation();

    // Separación reactiva entre usuarios aprobados/generales y registros pendientes de aprobación
    const generalUsers = users.filter((u) => u.status !== 'PENDING_APPROVAL');
    const pendingApprovalUsers = users.filter((u) => u.status === 'PENDING_APPROVAL');

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleCreateOrUpdateUser = async (payload: CreateAdminUserPayload) => {
        try {
            if (selectedUserForEdit) {
                await updateUserMutation.mutateAsync({
                    id: selectedUserForEdit.id,
                    payload: {
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        ci: payload.ci,
                        roleId: payload.roleId,
                        phone: payload.phone,
                        gender: payload.gender,
                        password: payload.password || undefined,
                    },
                });
                showToast('Usuario actualizado exitosamente en el sistema.');
            } else {
                await createUserMutation.mutateAsync(payload);
                showToast('Usuario registrado exitosamente en el sistema.');
            }
            setSelectedUserForEdit(null);
            setMainTab('list');
        } catch (error) {
            console.error('Error al guardar usuario:', error);
            const msg = error instanceof Error ? error.message : 'Error al guardar el usuario';
            showToast(msg);
            throw error;
        }
    };

    const handleEditUser = (user: AdminUser) => {
        setSelectedUserForEdit(user);
        setMainTab('form');
    };

    const handleViewUser = (user: AdminUser) => {
        alert(
            `Ficha de Usuario ParkinGo Enterprise:\n\n` +
            `Nombre: ${user.fullname || `${user.firstName} ${user.lastName}`}\n` +
            `Correo: ${user.email}\n` +
            `C.I.: ${user.ci}\n` +
            `Rol: ${user.role?.name || 'N/A'}\n` +
            `Estado: ${user.status}\n` +
            `Empresa: ${user.empresa || 'Particular'}\n` +
            `Parqueos: ${user.parqueosCount ?? 0}`
        );
    };

    const handleConfirmStatusChange = async () => {
        if (!userForStatusModal) return;
        const newStatus = userForStatusModal.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

        try {
            await toggleStatusMutation.mutateAsync({
                id: userForStatusModal.id,
                newStatus,
            });
            showToast(
                `Estado de ${userForStatusModal.fullname || userForStatusModal.email} cambiado a ${
                    newStatus === 'ACTIVE' ? 'ACTIVO' : 'SUSPENDIDO'
                }.`
            );
            setUserForStatusModal(null);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            showToast('No se pudo actualizar el estado del usuario');
        }
    };

    const handleApprovePendingUser = async (user: AdminUser) => {
        try {
            setEvaluatingUserId(user.id);
            await toggleStatusMutation.mutateAsync({
                id: user.id,
                newStatus: 'ACTIVE',
            });
            showToast(`Solicitud de ${user.fullname || user.email} aprobada exitosamente.`);
        } catch (error) {
            console.error('Error al aprobar usuario:', error);
            showToast('No se pudo aprobar la solicitud del usuario.');
        } finally {
            setEvaluatingUserId(null);
        }
    };

    const handleRejectPendingUser = async (user: AdminUser) => {
        const confirmed = window.confirm(
            `¿Está seguro de que desea rechazar la solicitud de ${user.fullname || user.email}?`
        );
        if (!confirmed) return;

        try {
            setEvaluatingUserId(user.id);
            await toggleStatusMutation.mutateAsync({
                id: user.id,
                newStatus: 'INACTIVE',
            });
            showToast(`Solicitud de ${user.fullname || user.email} rechazada.`);
        } catch (error) {
            console.error('Error al rechazar usuario:', error);
            showToast('No se pudo rechazar la solicitud del usuario.');
        } finally {
            setEvaluatingUserId(null);
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

            {/* Error Banner si falla la carga inicial */}
            {usersError && (
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
                    <span>Ocurrió un error al cargar la lista de usuarios desde el servidor.</span>
                </div>
            )}

            {/* Blueprint 1: Tab Navigation Bar Sin Bordes Nativos Feos */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #E2E8F0', gap: '0.5rem' }}>
                {/* TAB 1: Listado de Usuarios Generales */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedUserForEdit(null);
                        setMainTab('list');
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: mainTab === 'list' ? '2.5px solid #006D36' : '2.5px solid transparent',
                        color: mainTab === 'list' ? '#006D36' : '#64748B',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        padding: '0.65rem 1.15rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        outline: 'none',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <i className="fa-solid fa-users" style={{ fontSize: '0.88rem' }}></i>
                    <span>Listado de Usuarios ({generalUsers.length})</span>
                </button>

                {/* TAB 2: Pendientes de Aprobación */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedUserForEdit(null);
                        setMainTab('pending');
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: mainTab === 'pending' ? '2.5px solid #006D36' : '2.5px solid transparent',
                        color: mainTab === 'pending' ? '#006D36' : '#64748B',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        padding: '0.65rem 1.15rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        outline: 'none',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <i
                        className="fa-solid fa-id-card-clip"
                        style={{
                            fontSize: '0.88rem',
                            color: mainTab === 'pending' ? '#006D36' : pendingApprovalUsers.length > 0 ? '#D97706' : '#64748B',
                        }}
                    ></i>
                    <span>Pendientes de Aprobación</span>
                    {pendingApprovalUsers.length > 0 && (
                        <span
                            style={{
                                background: mainTab === 'pending' ? '#DCFCE7' : '#FEF3C7',
                                color: mainTab === 'pending' ? '#15803D' : '#B45309',
                                border: mainTab === 'pending' ? '1px solid #86EFAC' : '1px solid #FDE68A',
                                padding: '0.12rem 0.5rem',
                                borderRadius: '10px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                marginLeft: '0.15rem',
                            }}
                        >
                            {pendingApprovalUsers.length}
                        </span>
                    )}
                </button>

                {/* TAB 3: Registrar Nuevo Usuario */}
                <button
                    type="button"
                    onClick={() => {
                        setSelectedUserForEdit(null);
                        setMainTab('form');
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: mainTab === 'form' ? '2.5px solid #006D36' : '2.5px solid transparent',
                        color: mainTab === 'form' ? '#006D36' : '#64748B',
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        padding: '0.65rem 1.15rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        outline: 'none',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <i
                        className={`fa-solid ${
                            selectedUserForEdit ? 'fa-pen-to-square' : 'fa-user-plus'
                        }`}
                        style={{ fontSize: '0.88rem' }}
                    ></i>
                    <span>
                        {selectedUserForEdit
                            ? `Editar: ${selectedUserForEdit.firstName}`
                            : 'Registrar Nuevo Usuario'}
                    </span>
                </button>
            </div>

            {/* VISTA 1: TAB LISTADO (Enterprise Table Proporcionada) */}
            {mainTab === 'list' && (
                <UsersEnterpriseTable
                    users={generalUsers}
                    loading={loadingUsers}
                    onViewUser={handleViewUser}
                    onEditUser={handleEditUser}
                    onRequestToggleStatus={(user) => setUserForStatusModal(user)}
                    statusUpdatingId={toggleStatusMutation.isPending ? userForStatusModal?.id : null}
                />
            )}

            {/* VISTA 2: TAB PENDIENTES DE APROBACIÓN */}
            {mainTab === 'pending' && (
                <UsersPendingApprovalTable
                    users={pendingApprovalUsers}
                    loading={loadingUsers}
                    onApproveUser={handleApprovePendingUser}
                    onRejectUser={handleRejectPendingUser}
                    updatingUserId={evaluatingUserId}
                />
            )}

            {/* VISTA 3: TAB FORMULARIO (Centered Form Panel w-full lg:w-3/5 mx-auto) */}
            {mainTab === 'form' && (
                <UserFormPanel
                    userToEdit={selectedUserForEdit}
                    roles={roles}
                    isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
                    onSubmit={handleCreateOrUpdateUser}
                    onCancel={() => {
                        setSelectedUserForEdit(null);
                        setMainTab('list');
                    }}
                />
            )}

            {/* Blueprint 4: Modal de Confirmación Destructiva para Suspender/Activar */}
            <UserStatusConfirmModal
                isOpen={Boolean(userForStatusModal)}
                user={userForStatusModal}
                isUpdating={toggleStatusMutation.isPending}
                onConfirm={handleConfirmStatusChange}
                onClose={() => setUserForStatusModal(null)}
            />
        </div>
    );
};

export default UsersManagementPage;
