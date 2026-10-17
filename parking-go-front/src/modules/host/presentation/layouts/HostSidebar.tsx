// src/modules/host/presentation/layouts/HostSidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface HostSidebarProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    onToggleCollapse?: () => void;
}

export const HostSidebar: React.FC<HostSidebarProps> = ({
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

    const handleLinkClick = () => {
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
        .toUpperCase() || 'AF';

    const displayName =
        user?.fullname ||
        `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
        user?.email ||
        'Anfitrión';

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            id="host-sidebar"
        >
            {/* Header Brand Anfitrión */}
            <div className="sidebar-header" style={{ position: 'relative' }}>
                <Link to="/" className="logo-brand" title="Volver a ParkinGo Landing" onClick={handleLinkClick}>
                    <div
                        className="logo-icon"
                        style={{
                            background: 'linear-gradient(135deg, #006D36 0%, #15803D 100%)',
                            boxShadow: '0 2px 8px rgba(0, 109, 54, 0.35)',
                        }}
                    >
                        <i className="fa-solid fa-house-chimney-user"></i>
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <div className="logo-text">
                            <span style={{ color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.02em' }}>
                                PARKCONTROL
                            </span>
                            <span
                                style={{
                                    color: '#22C55E',
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                }}
                            >
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22C55E' }}></span>
                                ANFITRIÓN C2C
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

            {/* Navigation Menu Anfitrión */}
            <nav className="sidebar-nav">
                <div className="nav-section-label">Mi Espacio Particular</div>

                <a
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/users') || isCurrent('/dashboard/parking-admin') ? 'active' : ''}`}
                    href="#mis-espacios"
                    title="Mis Cocheras y Garajes Residenciales"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-warehouse"></i>
                    <span>Mis Garajes & Espacios</span>
                    {!collapsed && (
                        <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                            1 Activo
                        </span>
                    )}
                </a>

                <a
                    className="nav-item"
                    href="#disponibilidad"
                    title="Control de Horarios y Disponibilidad"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>Disponibilidad & Cupos</span>
                </a>

                <div className="nav-section-label">Gestión de Reservas C2C</div>

                <a
                    className="nav-item"
                    href="#reservas-recibidas"
                    title="Solicitudes y Reservas de Conductores"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Reservas Recibidas</span>
                    {!collapsed && (
                        <span
                            style={{
                                marginLeft: 'auto',
                                background: '#E6F4EA',
                                color: '#006D36',
                                padding: '0.15rem 0.45rem',
                                borderRadius: '12px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                            }}
                        >
                            En Vivo
                        </span>
                    )}
                </a>

                <a
                    className="nav-item"
                    href="#tarifas-anfitrion"
                    title="Precios por Hora, Día o Mensualidad"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-tags"></i>
                    <span>Tarifas por Hora/Día</span>
                </a>

                <a
                    className="nav-item"
                    href="#billetera"
                    title="Ingresos Recaudados y Retiros"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-wallet"></i>
                    <span>Billetera & Ganancias</span>
                </a>

                <a
                    className="nav-item"
                    href="#calificaciones"
                    title="Reputación y Reseñas de Huéspedes"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                    }}
                >
                    <i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i>
                    <span>Reseñas de Conductores</span>
                </a>

                <div className="nav-section-label">Mi Cuenta</div>

                <Link
                    to="/dashboard/parking-admin/profile"
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/profile') ? 'active' : ''}`}
                    title="Mi Perfil y Documentación"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-user-shield"></i>
                    <span>Mi Perfil de Anfitrión</span>
                </Link>

                <a
                    href="#configuracion"
                    className="nav-item"
                    title="Configuración de Interfaz (Temas y Fuentes)"
                    onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick();
                        openSettings();
                    }}
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
                        navigate('/dashboard/parking-admin/profile');
                    }}
                    title="Ver y editar mi perfil de anfitrión"
                >
                    <div
                        className="admin-avatar"
                        style={{
                            background: 'linear-gradient(135deg, #166534 0%, #15803D 100%)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                        }}
                    >
                        {userInitials}
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <>
                            <div className="admin-info" style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    className="admin-name"
                                    title={displayName}
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {displayName}
                                </div>
                                <div className="admin-role">Anfitrión de Parqueo</div>
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
                                    borderRadius: '4px',
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
