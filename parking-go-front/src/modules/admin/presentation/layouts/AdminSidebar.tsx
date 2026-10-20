// src/modules/admin/presentation/layouts/AdminSidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';
import { useAdminEstacionamientosQuery } from '../../../estacionamientos/application/useEstacionamientosQuery';

interface AdminSidebarProps {
    collapsed: boolean;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    onToggleCollapse?: () => void;
}

export const AdminSidebar = ({
    collapsed,
    mobileOpen = false,
    onCloseMobile,
}: AdminSidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logoutState } = useAuthStore();
    const openSettings = useSettingsStore((state) => state.openSettings);

    const { data: solicitudesPendientes = [] } = useAdminEstacionamientosQuery('PENDIENTE');
    const pendingCount = solicitudesPendientes.length;

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
        .toUpperCase() || 'AD';

    const getRoleLabel = (role?: string) => {
        switch (role) {
            case 'SUPER_ADMIN':
                return 'Super Administrador';
            case 'GENERAL_ADMIN':
                return 'Administrador General';
            case 'PARKING_ADMIN':
                return 'Administrador de Parqueo';
            case 'HOST':
                return 'Anfitrión de Parqueo';
            case 'DRIVER':
                return 'Conductor';
            default:
                return role || 'Usuario';
        }
    };

    const getHeaderSubtitle = (role?: string) => {
        switch (role) {
            case 'PARKING_ADMIN':
                return 'ADMIN PARQUEO';
            case 'HOST':
                return 'ANFITRIÓN';
            default:
                return 'ADMIN GENERAL';
        }
    };

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
            id="main-sidebar"
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
                                {getHeaderSubtitle(user?.role)}
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
                <div className="nav-section-label">Módulos de Gestión</div>

                <Link
                    to="/dashboard/admin/reports"
                    className={`nav-item ${isCurrent('/dashboard/admin/reports') || location.pathname === '/dashboard/admin' ? 'active' : ''}`}
                    title="Reportes Generales"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Reportes Generales</span>
                </Link>

                <Link
                    to="/dashboard/admin/users"
                    className={`nav-item ${isCurrent('/dashboard/admin/users') ? 'active' : ''}`}
                    title="Gestión de Usuarios"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-users"></i>
                    <span>Gestión de Usuarios</span>
                </Link>

                <Link
                    to="/dashboard/admin/tenants"
                    className={`nav-item ${isCurrent('/dashboard/admin/tenants') ? 'active' : ''}`}
                    title="Gestión de Tenants Multi-Tenant"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-building-user"></i>
                    <span>Gestión de Tenants</span>
                    {(!collapsed || mobileOpen) && (
                        <span className="badge badge-pending" style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '0.12rem 0.35rem', background: '#006D36', color: '#FFF' }}>
                            SaaS
                        </span>
                    )}
                </Link>

                <Link
                    to="/dashboard/admin/solicitudes"
                    className={`nav-item ${isCurrent('/dashboard/admin/solicitudes') || isCurrent('/dashboard/admin/estacionamientos') ? 'active' : ''}`}
                    title="Solicitudes de Registro de Estacionamientos"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-clipboard-check"></i>
                    <span>Solicitudes</span>
                    {pendingCount > 0 && (!collapsed || mobileOpen) && (
                        <span className="badge badge-pending" id="pending-requests-count" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                            {pendingCount}
                        </span>
                    )}
                </Link>

                <Link
                    to="/dashboard/admin/roles-permissions"
                    className={`nav-item ${isCurrent('/dashboard/admin/roles-permissions') ? 'active' : ''}`}
                    title="Roles y Permisos"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-shield-halved"></i>
                    <span>Roles y Permisos</span>
                </Link>

                <a className="nav-item" href="#planes" title="Planes y Suscripciones" onClick={(e) => { e.preventDefault(); handleLinkClick(); }}>
                    <i className="fa-solid fa-gem"></i>
                    <span>Planes y Suscripciones</span>
                </a>

                <a className="nav-item" href="#comisiones" title="Comisiones" onClick={(e) => { e.preventDefault(); handleLinkClick(); }}>
                    <i className="fa-solid fa-percent"></i>
                    <span>Comisiones</span>
                </a>

                <a className="nav-item" href="#promociones" title="Promociones" onClick={(e) => { e.preventDefault(); handleLinkClick(); }}>
                    <i className="fa-solid fa-ticket"></i>
                    <span>Promociones</span>
                </a>

                <div className="nav-section-label">Seguridad y Auditoría</div>

                <a className="nav-item" href="#denuncias" title="Denuncias y Reportes" onClick={(e) => { e.preventDefault(); handleLinkClick(); }}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    <span>Denuncias y Reportes</span>
                    {!collapsed && (
                        <span className="badge badge-suspended" id="pending-denuncias-count" style={{ marginLeft: 'auto', fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                            2
                        </span>
                    )}
                </a>

                <a className="nav-item" href="#configuracion" title="Configuración General" onClick={(e) => { e.preventDefault(); handleLinkClick(); openSettings(); }}>
                    <i className="fa-solid fa-gears"></i>
                    <span>Configuración Sistema</span>
                </a>

                <a className="nav-item" href="#backups" title="Copias de Seguridad" onClick={(e) => { e.preventDefault(); handleLinkClick(); }}>
                    <i className="fa-solid fa-database"></i>
                    <span>Copias de Seguridad</span>
                </a>

                <div className="nav-section-label">Mi Cuenta</div>

                <Link
                    to="/dashboard/admin/profile"
                    className={`nav-item ${isCurrent('/dashboard/admin/profile') ? 'active' : ''}`}
                    title="Mi Perfil"
                    onClick={handleLinkClick}
                >
                    <i className="fa-solid fa-user-gear"></i>
                    <span>Mi Perfil</span>
                </Link>

            </nav>

            {/* Admin Profile Footer */}
            <div className="sidebar-footer">
                <div
                    className="admin-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        handleLinkClick();
                        navigate('/dashboard/admin/profile');
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
                                <div className="admin-role">{getRoleLabel(user?.role)}</div>
                            </div>
                            <button
                                onClick={handleLogout}
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
