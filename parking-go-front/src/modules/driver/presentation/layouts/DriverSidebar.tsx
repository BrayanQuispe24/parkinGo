// src/modules/driver/presentation/layouts/DriverSidebar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';

export type DriverViewKey = 'mapa-busqueda' | 'ticket-activo' | 'mis-vehiculos' | 'mis-reservas' | 'calificar' | 'mi-perfil';

interface DriverSidebarProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    activeView: DriverViewKey;
    onSelectView: (view: DriverViewKey) => void;
    hasActiveBooking?: boolean;
}

export const DriverSidebar: React.FC<DriverSidebarProps> = ({
    collapsed,
    mobileOpen = false,
    onCloseMobile,
    activeView,
    onSelectView,
    hasActiveBooking,
}) => {
    const navigate = useNavigate();
    const { user, logoutState } = useAuthStore();
    const openSettings = useSettingsStore((state) => state.openSettings);

    const handleLogout = () => {
        logoutState();
        navigate('/auth?mode=login');
    };

    const handleSelectView = (view: DriverViewKey) => {
        onSelectView(view);
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    const userInitials = (user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`)
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'CD';

    const displayName = user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'Conductor';

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            id="driver-sidebar"
        >
            {/* Header Brand */}
            <div className="sidebar-header" style={{ position: 'relative' }}>
                <Link
                    to="/"
                    className="logo-brand"
                    title="Volver a ParkinGo Landing"
                    onClick={() => onCloseMobile?.()}
                >
                    <div className="logo-icon">
                        <i className="fa-solid fa-square-parking"></i>
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <div className="logo-text">
                            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>PARKINGO</span>
                            <span style={{ color: '#22C55E', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                PORTAL CONDUCTOR
                            </span>
                        </div>
                    )}
                </Link>

                {mobileOpen && (
                    <button
                        onClick={onCloseMobile}
                        className="mobile-close-sidebar-btn"
                        aria-label="Cerrar menú"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent',
                            border: 'none',
                            color: '#CBD5CE',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            padding: '0.5rem',
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Servicios de Conductor</div>

                <a
                    href="#buscar"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('mapa-busqueda');
                    }}
                    className={`nav-item ${activeView === 'mapa-busqueda' ? 'active' : ''}`}
                    title="Buscar Parqueos"
                >
                    <i className="fa-solid fa-map-location-dot"></i>
                    <span>Buscar Parqueos</span>
                </a>

                <a
                    href="#ticket"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('ticket-activo');
                    }}
                    className={`nav-item ${activeView === 'ticket-activo' ? 'active' : ''}`}
                    title="Ticket & Reserva Activa"
                >
                    <i className="fa-solid fa-qrcode"></i>
                    <span>Ticket & Reserva Activa</span>
                    {!collapsed && hasActiveBooking && (
                        <span
                            className="badge badge-success"
                            style={{
                                marginLeft: 'auto',
                                fontSize: '0.7rem',
                                background: '#22C55E',
                                color: '#063D25',
                                fontWeight: 800,
                                padding: '0.12rem 0.45rem',
                                borderRadius: '10px',
                            }}
                        >
                            1
                        </span>
                    )}
                </a>

                <a
                    href="#vehiculos"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('mis-vehiculos');
                    }}
                    className={`nav-item ${activeView === 'mis-vehiculos' ? 'active' : ''}`}
                    title="Mis Vehículos"
                >
                    <i className="fa-solid fa-car"></i>
                    <span>Mis Vehículos</span>
                </a>

                <a
                    href="#reservas"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('mis-reservas');
                    }}
                    className={`nav-item ${activeView === 'mis-reservas' ? 'active' : ''}`}
                    title="Historial de Reservas"
                >
                    <i className="fa-solid fa-receipt"></i>
                    <span>Historial de Reservas</span>
                </a>

                <a
                    href="#calificar"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('calificar');
                    }}
                    className={`nav-item ${activeView === 'calificar' ? 'active' : ''}`}
                    title="Calificar Servicio"
                >
                    <i className="fa-solid fa-star"></i>
                    <span>Calificar Servicio</span>
                </a>

                <a
                    href="#perfil"
                    onClick={(e) => {
                        e.preventDefault();
                        handleSelectView('mi-perfil');
                    }}
                    className={`nav-item ${activeView === 'mi-perfil' ? 'active' : ''}`}
                    title="Mi Perfil"
                >
                    <i className="fa-solid fa-user-gear"></i>
                    <span>Mi Perfil</span>
                </a>

                <a
                    href="#configuracion"
                    className="nav-item"
                    title="Configuración de Interfaz (Temas y Fuentes)"
                    onClick={(e) => {
                        e.preventDefault();
                        if (onCloseMobile) onCloseMobile();
                        openSettings();
                    }}
                >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Configuración</span>
                </a>
            </nav>

            {/* Driver Profile Footer */}
            <div className="sidebar-footer">
                <div
                    className="admin-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectView('mi-perfil')}
                    title="Ver y editar mi perfil"
                >
                    <div className="admin-avatar">{userInitials}</div>
                    {(!collapsed || mobileOpen) && (
                        <>
                            <div className="admin-info" style={{ flex: 1, minWidth: 0 }}>
                                <div className="admin-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {displayName}
                                </div>
                                <div className="admin-role" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fa-solid fa-car-side" style={{ color: '#22C55E' }}></i>
                                    <span>Conductor Verificado</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleLogout();
                                }}
                                title="Cerrar Sesión"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#f87171',
                                    cursor: 'pointer',
                                    padding: '0.3rem',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <i className="fa-solid fa-power-off"></i>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
};
