// src/modules/parking-operator/presentation/pages/ParkingOperatorProfilePage.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useUpdateUserProfileMutation } from '../../../auth/application/useUserProfileMutation';
import { SharedProfilePanel } from '../../../auth/presentation/components/SharedProfilePanel';
import type { UpdateUserProfilePayload } from '../../../auth/domain/UserProfile';

export const ParkingOperatorProfilePage: React.FC = () => {
    const { user, updateUserProfile } = useAuthStore();
    const updateProfileMutation = useUpdateUserProfileMutation();
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleUpdateProfile = async (payload: UpdateUserProfilePayload) => {
        if (!user?.id) {
            updateUserProfile(payload);
            showToast('Información de perfil actualizada en tu sesión local.');
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                userId: user.id,
                payload,
            });
            updateUserProfile(payload);
            showToast('¡Perfil de operador de parqueo actualizado exitosamente!');
        } catch (error) {
            console.error('Error al actualizar perfil de operador:', error);
            updateUserProfile(payload);
            showToast('Datos de perfil guardados en tu sesión local.');
        }
    };

    return (
        <div className="admin-page-content" style={{ padding: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        background: '#063D25',
                        color: '#FFFFFF',
                        padding: '0.85rem 1.4rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        zIndex: 9999,
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        border: '1px solid #006D36',
                    }}
                >
                    <i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }}></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            <SharedProfilePanel
                user={user}
                roleBadgeLabel="OPERADOR DE PARQUEO"
                roleIconClass="fa-solid fa-id-badge"
                subtitle="Gestiona y mantén actualizada tu información de contacto personal en caseta de operaciones."
                onUpdateProfile={handleUpdateProfile}
                isUpdating={updateProfileMutation.isPending}
            />
        </div>
    );
};

export default ParkingOperatorProfilePage;
