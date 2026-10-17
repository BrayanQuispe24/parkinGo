// src/modules/driver/presentation/components/DriverProfilePanel.tsx
import React from 'react';
import type { User } from '../../../auth/domain/User';
import type { UpdateDriverProfilePayload } from '../../domain/DriverProfile';
import { SharedProfilePanel } from '../../../auth/presentation/components/SharedProfilePanel';

interface DriverProfilePanelProps {
    user: User | null;
    onUpdateProfile: (payload: UpdateDriverProfilePayload) => Promise<void>;
    isUpdating?: boolean;
}

export const DriverProfilePanel: React.FC<DriverProfilePanelProps> = ({
    user,
    onUpdateProfile,
    isUpdating,
}) => {
    return (
        <SharedProfilePanel
            user={user}
            roleBadgeLabel="CONDUCTOR VERIFICADO"
            roleIconClass="fa-solid fa-car-side"
            subtitle="Actualiza tus datos para notificaciones de reservas, cobros y validaciones de garita."
            onUpdateProfile={onUpdateProfile}
            isUpdating={isUpdating}
        />
    );
};

export default DriverProfilePanel;

