import { useLocation } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';

interface ParkingAdminTopbarProps {
    onToggleSidebar: () => void;
    collapsed: boolean;
}

export const ParkingAdminTopbar = ({
    onToggleSidebar,
}: ParkingAdminTopbarProps) => {
    const location = useLocation();
    const { user } = useAuthStore();
    const openSettings = useSettingsStore((state) => state.openSettings);
    const isHost = user?.role === 'HOST' || user?.role === 'anfitrion';

    let pageTitle = isHost ? 'Panel del Anfitrión' : 'Gestión de Operadores';
    let breadcrumb = isHost ? 'Mi Espacio / Panel de Control' : 'ParkinGo Equipetrol / Gestión de Operadores';

    if (location.pathname.includes('/profile')) {
        pageTitle = isHost ? 'Mi Perfil de Anfitrión' : 'Mi Perfil';
        breadcrumb = isHost ? 'Mi Espacio / Mi Perfil' : 'ParkinGo Equipetrol / Mi Perfil';
    } else if (location.pathname.includes('/tenants')) {
        pageTitle = 'Gestión de Empresas & Tenants';
        breadcrumb = 'ParkinGo Equipetrol / Empresas & Tenants';
    } else if (location.pathname.includes('/estacionamiento')) {
        pageTitle = 'Mis Estacionamientos';
        breadcrumb = 'ParkinGo Equipetrol / Mis Estacionamientos';
    }

    return (
        <header className="topbar">
            {/* Left: Toggle & Title */}
            <div className="topbar-left">
                <button
                    className="toggle-sidebar-btn"
                    id="toggle-sidebar"
                    onClick={onToggleSidebar}
                    title="Alternar Menú Sidebar"
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

            {/* Middle: Command Search Box */}
            <div
                className="command-search-box"
                onClick={() => document.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]')?.focus()}
                title="Buscar operador por nombre, CI, teléfono o garita..."
            >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>Buscar por nombre, CI o garita...</span>
                <kbd>⌘K</kbd>
            </div>

            {/* Right Controls */}
            <div className="topbar-right">
                <select className="org-selector" title="Seleccionar Sucursal de Parqueo" defaultValue="equipetrol">
                    <option value="equipetrol">Equipetrol (SCZ)</option>
                    <option value="centro">Centro Histórico</option>
                </select>

                <div className="live-occupancy-badge">
                    <div className="pulse-dot"></div>
                    <span>
                        Ocupación: <strong>17/24 (70.8%)</strong>
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
