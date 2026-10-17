// src/modules/admin/presentation/layouts/AdminLayout.tsx
import { useState } from 'react';
import { Outlet } from 'react-router';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

export const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleToggleSidebar = () => {
        if (window.innerWidth <= 992) {
            setMobileOpen((prev) => !prev);
        } else {
            setCollapsed((prev) => !prev);
        }
    };

    return (
        <div className="app-container">
            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-mobile-backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Navigation */}
            <AdminSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />

            {/* Main Workspace Content */}
            <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
                {/* Enterprise System Banner */}
                <div
                    className="enterprise-alert-bar"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                    }}
                >
                    <div>
                        <i className="fa-solid fa-shield-halved" style={{ marginRight: '0.4rem' }}></i>{' '}
                        <strong>SISTEMA OPERATIVO:</strong> Producción v2.4 • SLA Garantizado 99.9%
                    </div>
                    <div>
                        <span>
                            Entorno: <strong>Santa Cruz, Bolivia (Bs.)</strong> | Sincronización en tiempo real{' '}
                            <i className="fa-solid fa-rotate" style={{ marginLeft: '0.25rem' }}></i>
                        </span>
                    </div>
                </div>

                {/* Topbar */}
                <AdminTopbar collapsed={collapsed} onToggleSidebar={handleToggleSidebar} />

                {/* Content Canvas */}
                <main className="content-canvas" style={{ padding: '1.25rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default AdminLayout;
