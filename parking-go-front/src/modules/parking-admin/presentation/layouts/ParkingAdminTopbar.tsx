import { useLocation } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { useSettingsStore } from '../../../../store/useSettingsStore';
import { isHostRole } from '../../../auth/domain/roleRouting';
import { useMiEstacionamientoQuery } from '../../../estacionamientos/application/useEstacionamientosQuery';

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
    const isHost = isHostRole(user?.role);
    const { data: miEstacionamiento } = useMiEstacionamientoQuery();
    const parkingLabel = miEstacionamiento?.nombre || 'Mi Estacionamiento';

    let pageTitle = isHost ? 'Panel del Anfitrión' : 'Gestión de Operadores';
    let breadcrumb = isHost ? 'Mi Espacio / Panel de Control' : `${parkingLabel} / Gestión de Operadores`;

    if (location.pathname.includes('/profile')) {
        pageTitle = isHost ? 'Mi Perfil de Anfitrión' : 'Mi Perfil';
        breadcrumb = isHost ? 'Mi Espacio / Mi Perfil' : `${parkingLabel} / Mi Perfil`;
    } else if (location.pathname.includes('/tenants')) {
        pageTitle = isHost ? 'Mi Empresa / Propiedad' : 'Gestión de Empresas & Tenants';
        breadcrumb = isHost ? 'Mi Espacio / Mi Empresa' : `${parkingLabel} / Empresas & Tenants`;
    } else if (location.pathname.includes('/estacionamiento')) {
        pageTitle = isHost ? 'Mi Cochera & Garaje' : 'Mis Estacionamientos';
        breadcrumb = isHost ? 'Mi Espacio / Mi Cochera & Garaje' : `${parkingLabel} / Mis Estacionamientos`;
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
                title={isHost ? 'Buscar en mi espacio...' : 'Buscar operador por nombre, CI, teléfono o garita...'}
            >
                <i className="fa-solid fa-magnifying-glass"></i>
                <span>{isHost ? 'Buscar en mi espacio...' : 'Buscar por nombre, CI o garita...'}</span>
                <kbd>⌘K</kbd>
            </div>

            {/* Right Controls */}
            <div className="topbar-right">
                {isHost ? (
                    <div className="live-occupancy-badge" title="Modalidad residencial sin operadores">
                        <div className="pulse-dot"></div>
                        <span>
                            Modalidad: <strong>Anfitrión C2C</strong>
                        </span>
                    </div>
                ) : (
                    <div className="live-occupancy-badge" title="Estacionamiento administrado actualmente">
                        <div className="pulse-dot"></div>
                        <span>
                            {miEstacionamiento ? (
                                <>
                                    Parqueo: <strong>{miEstacionamiento.nombre}</strong> ({miEstacionamiento.estado})
                                </>
                            ) : (
                                <strong>Sin estacionamiento asignado</strong>
                            )}
                        </span>
                    </div>
                )}

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
