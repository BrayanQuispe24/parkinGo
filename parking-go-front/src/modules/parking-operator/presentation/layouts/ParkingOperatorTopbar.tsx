// src/modules/parking-operator/presentation/layouts/ParkingOperatorTopbar.tsx
import React from 'react';
import { useLocation } from 'react-router';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface ParkingOperatorTopbarProps {
    onToggleSidebar: () => void;
    collapsed: boolean;
}

export const ParkingOperatorTopbar: React.FC<ParkingOperatorTopbarProps> = ({
    onToggleSidebar,
}) => {
    const location = useLocation();
    const openSettings = useSettingsStore((state) => state.openSettings);

    let pageTitle = 'Mi Perfil Operativo';
    let breadcrumb = 'Caseta de Control / Mi Perfil';

    if (location.pathname.includes('/profile')) {
        pageTitle = 'Mi Perfil Operativo';
        breadcrumb = 'Caseta de Control / Información Personal';
    }

    return (
        <header className="topbar">
            {/* Left: Toggle & Title */}
            <div className="topbar-left">
                <button
                    className="toggle-sidebar-btn"
                    id="toggle-operator-sidebar"
                    onClick={onToggleSidebar}
                    title="Alternar Menú Sidebar"
                    aria-label="Alternar Menú"
                >
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
                <div className="page-title-display">
                    <h1 id="current-page-title">{pageTitle}</h1>
                    <span className="page-breadcrumb" id="current-page-breadcrumb">
                        {breadcrumb}
                    </span>
                </div>
            </div>

            {/* Right Controls */}
            <div className="topbar-right">
                <div className="live-occupancy-badge" style={{ background: '#F0FDF4', borderColor: '#86EFAC', color: '#166534' }}>
                    <div className="pulse-dot"></div>
                    <span>
                        Turno: <strong>Activo en Caseta</strong>
                    </span>
                </div>

                <button
                    type="button"
                    className="quick-action-btn"
                    onClick={openSettings}
                    title="Configuración de Interfaz (Temas y Fuentes)"
                >
                    <i className="fa-solid fa-sliders"></i>
                </button>
            </div>
        </header>
    );
};
