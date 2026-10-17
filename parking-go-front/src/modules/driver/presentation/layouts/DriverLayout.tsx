// src/modules/driver/presentation/layouts/DriverLayout.tsx
import React, { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { DriverSidebar, type DriverViewKey } from './DriverSidebar';

interface DriverLayoutProps {
    children: React.ReactNode;
    activeView: DriverViewKey;
    onSelectView: (view: DriverViewKey) => void;
    hasActiveBooking?: boolean;
}

export const DriverLayout: React.FC<DriverLayoutProps> = ({
    children,
    activeView,
    onSelectView,
    hasActiveBooking,
}) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuthStore();

    const handleToggleSidebar = () => {
        if (window.innerWidth <= 992) {
            setMobileOpen((prev) => !prev);
        } else {
            setSidebarCollapsed((prev) => !prev);
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
        <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-mobile-backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar del Conductor */}
            <DriverSidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                activeView={activeView}
                onSelectView={onSelectView}
                hasActiveBooking={hasActiveBooking}
            />

            {/* Wrapper Principal */}
            <div className={`main-wrapper ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--bg-primary)' }}>
                {/* Topbar Header */}
                <header
                    className="topbar"
                    style={{
                        height: '64px',
                        background: 'var(--bg-card)',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 1.25rem',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={handleToggleSidebar}
                            className="icon-btn"
                            title="Alternar Menú"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.1rem',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                            }}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <div style={{ position: 'relative', width: '280px', display: 'flex', alignItems: 'center' }}>
                            <i
                                className="fa-solid fa-magnifying-glass"
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    color: 'var(--text-dim)',
                                    fontSize: '0.82rem',
                                }}
                            ></i>
                            <input
                                type="text"
                                placeholder="Buscar por ciudad, avenida o zona..."
                                style={{
                                    width: '100%',
                                    padding: '0.45rem 1rem 0.45rem 2.2rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    fontSize: '0.82rem',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Campana de Notificaciones */}
                        <button
                            type="button"
                            className="icon-btn"
                            title="Notificaciones"
                            style={{
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.15rem',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                position: 'relative',
                            }}
                        >
                            <i className="fa-regular fa-bell"></i>
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '2px',
                                    right: '2px',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#EF4444',
                                }}
                            ></span>
                        </button>

                        {/* Perfil del Conductor */}
                        <div
                            onClick={() => onSelectView('mi-perfil')}
                            title="Editar mi perfil"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                borderLeft: '1px solid var(--border-subtle)',
                                paddingLeft: '0.85rem',
                                cursor: 'pointer',
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    background: '#063D25',
                                    color: '#FFFFFF',
                                    fontWeight: 800,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid #006D36',
                                }}
                            >
                                {userInitials}
                            </div>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                {displayName}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Content Canvas */}
                <main style={{ padding: '1.5rem', flexGrow: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', background: 'var(--bg-primary)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};
