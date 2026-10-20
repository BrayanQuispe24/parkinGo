// src/modules/parking-admin/presentation/layouts/ParkingAdminSidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface ParkingAdminSidebarProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    onToggleCollapse?: () => void;
}

export const ParkingAdminSidebar = ({
    collapsed,
    mobileOpen = false,
    onCloseMobile,
}: ParkingAdminSidebarProps) => {
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
        .toUpperCase() || 'AP';

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            id="parking-admin-sidebar"
        >
            {/* Header Brand */}
            <div className="sidebar-header" style={{ position: 'relative' }}>
                <Link to="/" className="logo-brand" title="Volver a ParkinGo Landing" onClick={handleLinkClick}>
                    <div className="logo-icon">
                        <i className="fa-solid fa-square-parking"></i>
                    </div>
                    {(!collapsed || mobileOpen) && (
                        <div className="logo-text">
                            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>PARKCONTROL</span>
                            <span style={{ color: '#22C55E', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                ADMIN PARQUEO
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
                <div className="nav-section-label">Operaciones de Parqueo</div>

                <Link
                    to="/dashboard/parking-admin/users"
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/users') || isCurrent('/dashboard/parking-admin') ? 'active' : ''}`}
                    title="Gestión de Operadores del Parqueo"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-users-gear"></i>
                    <span>Gestión de Operadores</span>
                </Link>

                <Link
                    to="/dashboard/parking-admin/tenants"
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/tenants') ? 'active' : ''}`}
                    title="Gestión de Empresas & Tenants"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-building"></i>
                    <span>Empresas & Tenants</span>
                </Link>

                <Link
                    to="/dashboard/parking-admin/estacionamiento"
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/estacionamiento') ? 'active' : ''}`}
                    title="Mis Estacionamientos"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-square-parking"></i>
                    <span>Mis Estacionamientos</span>
                </Link>

                <a
                    className="nav-item"
                    href="#croquis"
                    title="Croquis & Monitoreo 24/7"
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fa-solid fa-border-all"></i>
                    <span>Croquis & Plazas</span>
                    {!collapsed && (
                        <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                            24
                        </span>
                    )}
                </a>

                <a
                    className="nav-item"
                    href="#reservas"
                    title="Gestión de Reservas y Abonados"
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Reservas & Abonados</span>
                </a>

                <a
                    className="nav-item"
                    href="#mora"
                    title="Control de Mora y Lista Negra"
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Mora & Lista Negra</span>
                    {!collapsed && (
                        <span className="badge badge-danger" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                            2
                        </span>
                    )}
                </a>

                <a
                    className="nav-item"
                    href="#tarifas"
                    title="Tarifas & Parámetros Operativos"
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fa-solid fa-sliders"></i>
                    <span>Tarifas & Reglas</span>
                </a>

                <a
                    className="nav-item"
                    href="#reportes"
                    title="Analíticas & Reseñas de Conductores"
                    onClick={(e) => e.preventDefault()}
                >
                    <i className="fa-solid fa-chart-line"></i>
                    <span>Analíticas & Reseñas</span>
                </a>

                <div className="nav-section-label">Mi Cuenta</div>

                <Link
                    to="/dashboard/parking-admin/profile"
                    className={`nav-item ${isCurrent('/dashboard/parking-admin/profile') ? 'active' : ''}`}
                    title="Mi Perfil"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-user-gear"></i>
                    <span>Mi Perfil</span>
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
                    title="Ver y editar mi perfil"
                >
                    <div className="admin-avatar">{userInitials}</div>
                    {(!collapsed || mobileOpen) && (
                        <>
                            <div className="admin-info" style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    className="admin-name"
                                    title={user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Administrador'}
                                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                >
                                    {user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Administrador'}
                                </div>
                                <div className="admin-role">
                                    {user?.role === 'HOST' || user?.role === 'anfitrion'
                                        ? 'Anfitrión de Parqueo'
                                        : 'Administrador de Parqueo'}
                                </div>
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
