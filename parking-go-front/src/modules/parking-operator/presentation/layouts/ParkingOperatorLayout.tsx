// src/modules/parking-operator/presentation/layouts/ParkingOperatorLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router';
import { ParkingOperatorSidebar } from './ParkingOperatorSidebar';
import { ParkingOperatorTopbar } from './ParkingOperatorTopbar';

export const ParkingOperatorLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

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
            <ParkingOperatorSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />

            {/* Main Workspace Wrapper */}
            <div className={`main-wrapper ${collapsed ? 'collapsed' : ''}`}>
                {/* Enterprise Operational Alert Banner */}
                <div
                    className="enterprise-alert-bar"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        background: '#063D25',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        borderBottom: '1px solid #006D36',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#22C55E' }}></i>
                        <span>
                            <strong>PUESTO DE CONTROL:</strong> Caseta de Operación Conectada |{' '}
                            <strong>Operador de Parqueo en Turno</strong>
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <i className="fa-solid fa-clock"></i> Hora local:{' '}
                        <strong style={{ color: '#22C55E' }}>{currentTime || '11:30:00 a.m.'}</strong>
                    </div>
                </div>

                {/* Topbar */}
                <ParkingOperatorTopbar
                    collapsed={collapsed}
                    onToggleSidebar={handleToggleSidebar}
                />

                {/* Main Content Canvas */}
                <main className="content-canvas" style={{ padding: '1.25rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
