import { useLocation } from 'react-router';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface AdminTopbarProps {
    onToggleSidebar: () => void;
    collapsed: boolean;
}

export const AdminTopbar = ({ onToggleSidebar }: AdminTopbarProps) => {
    const location = useLocation();
    const openSettings = useSettingsStore((state) => state.openSettings);

    // Determinar título y breadcrumb según la ruta activa
    let pageTitle = 'Reportes Generales';
    let breadcrumb = 'ParkinGo Enterprise / Reportes Generales';

    if (location.pathname.includes('/profile')) {
        pageTitle = 'Mi Perfil de Administrador';
        breadcrumb = 'ParkinGo Enterprise / Mi Perfil';
    } else if (location.pathname.includes('/users')) {
        pageTitle = 'Gestión de Usuarios del Sistema';
        breadcrumb = 'ParkinGo Enterprise / Gestión de Usuarios';
    } else if (location.pathname.includes('/roles-permissions')) {
        pageTitle = 'Matriz de Roles y Permisos Enterprise';
        breadcrumb = 'ParkinGo Enterprise / Roles y Permisos';
    } else if (location.pathname.includes('/tenants')) {
        pageTitle = 'Gestión de Tenants & Empresas SaaS';
        breadcrumb = 'ParkinGo Enterprise / Gestión de Tenants';
    } else if (location.pathname.includes('/solicitudes') || location.pathname.includes('/estacionamientos')) {
        pageTitle = 'Solicitudes de Registro de Estacionamientos';
        breadcrumb = 'ParkinGo Enterprise / Solicitudes';
    }

    return (
        <header className="topbar">
            {/* Lado Izquierdo: Botón Toggle y Título */}
            <div className="topbar-left">
                <button
                    className="toggle-sidebar-btn"
                    id="toggle-sidebar"
                    onClick={onToggleSidebar}
                    title="Alternar Menú"
                >
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
                <div className="page-title-display">
                    <h1 id="current-page-title">{pageTitle}</h1>
                    <span className="page-breadcrumb" id="current-page-breadcrumb">{breadcrumb}</span>
                </div>
            </div>

            {/* Centro: Buscador Rápido Enterprise */}
            <div
                className="command-search-box"
                onClick={() => document.getElementById('search-users-input')?.focus()}
                title="Búsqueda Rápida Enterprise"
            >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Buscar por empresa, ID o parqueo...</span>
                <kbd>⌘K</kbd>
            </div>

            {/* Lado Derecho */}
            <div className="topbar-right">
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
