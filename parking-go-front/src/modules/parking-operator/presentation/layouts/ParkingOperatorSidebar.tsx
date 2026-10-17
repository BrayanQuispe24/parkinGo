// src/modules/parking-operator/presentation/layouts/ParkingOperatorSidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface ParkingOperatorSidebarProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    onToggleCollapse?: () => void;
}

export const ParkingOperatorSidebar: React.FC<ParkingOperatorSidebarProps> = ({
    collapsed,
    mobileOpen = false,
    onCloseMobile,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutState } = useAuthStore();
    const openSettings = useSettingsStore((state) => state.openSettings);

    const handleLogout = () => {
        logoutState();
        navigate('/auth?mode=login');
    };

    const isCurrent = (path: string) => location.pathname === path;

    const userInitials = (user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`)
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'OP';

    const handleLinkClick = () => {
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            id="parking-operator-sidebar"
        >
            {/* Header Brand */}
            <div className="sidebar-header" style={{ position: 'relative' }}>
                <Link to="/" className="logo-brand" title="Volver a ParkinGo Landing" onClick={handleLinkClick}>
                    <div className="logo-icon" style={{ background: '#006D36' }}>
                        <i className="fa-solid fa-id-badge"></i>
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <div className="logo-text">
                            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>PARKCONTROL</span>
                            <span style={{ color: '#22C55E', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                OPERADOR DE PARQUEO
                            </span>
                        </div>
                    )}
                </Link>

                {/* Mobile close button */}
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

            {/* Navigation Menu (Exclusivamente "Mi Perfil" y "Configuración") */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Mi Cuenta</div>

                <Link
                    to="/dashboard/operator/profile"
                    className={`nav-item ${isCurrent('/dashboard/operator/profile') || isCurrent('/dashboard/operator') ? 'active' : ''}`}
                    title="Mi Perfil"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-user-gear"></i>
                    <span>Mi Perfil</span>
                </Link>

                <div className="nav-section-label">Sistema</div>

                <a
                    className="nav-item"
                    title="Configuración de Interfaz"
                    onClick={() => {
                        handleLinkClick();
                        openSettings();
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Configuración</span>
                </a>
            </nav>

            {/* Profile Footer */}
            <div className="sidebar-footer">
                <div
                    className="admin-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        handleLinkClick();
                        navigate('/dashboard/operator/profile');
                    }}
                    title="Ver y editar mi perfil"
                >
                    <div className="admin-avatar" style={{ background: '#006D36' }}>{userInitials}</div>
                    {(!collapsed || mobileOpen) && (
                        <>
                            <div className="admin-info" style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    className="admin-name"
                                    title={user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Operador'}
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Operador'}
                                </div>
                                <div className="admin-role">Operador de Caseta</div>
                            </div>
                            <button
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
