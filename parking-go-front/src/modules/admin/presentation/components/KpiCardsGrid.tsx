// src/modules/admin/presentation/components/KpiCardsGrid.tsx
import type { AdminAnalytics } from '../../domain/AdminAnalytics';

interface KpiCardsGridProps {
    data?: AdminAnalytics;
    loading?: boolean;
}

export const KpiCardsGrid = ({ data, loading }: KpiCardsGridProps) => {
    if (loading) {
        return (
            <>
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card kpi-card" style={{ minHeight: '145px', opacity: 0.6 }}></div>
                    ))}
                </div>
                <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card kpi-card" style={{ minHeight: '145px', opacity: 0.6 }}></div>
                    ))}
                </div>
            </>
        );
    }

    const kpis = data?.kpis;

    return (
        <>
            {/* KPI Cards Grid - Fila 1 (4 métricas globales) */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                {/* 1. Usuarios Totales */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--accent-blue)' }}>
                    <div className="kpi-header">
                        <span>Usuarios Totales</span>
                        <div className="kpi-icon" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--accent-blue)' }}>
                            <i className="fa-solid fa-users"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-total-users">
                            {kpis?.totalUsuarios?.value ? (typeof kpis.totalUsuarios.value === 'number' ? Number(kpis.totalUsuarios.value).toLocaleString('de-DE') : kpis.totalUsuarios.value) : '1.420'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.totalUsuarios?.sublabel || 'Conductores, Admins y Dueños'}
                        </div>
                    </div>
                </div>

                {/* 2. Admins de Parqueo */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--primary-color, #006D36)' }}>
                    <div className="kpi-header">
                        <span>Admins de Parqueo</span>
                        <div className="kpi-icon" style={{ background: 'var(--accent-emerald-light)', color: 'var(--primary-color, #006D36)' }}>
                            <i className="fa-solid fa-user-gear"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-parking-admins">
                            {kpis?.adminsParqueo?.value || '95'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.adminsParqueo?.sublabel || 'Registrados en la plataforma'}
                        </div>
                    </div>
                </div>

                {/* 3. Parqueos Activos */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--accent-emerald)' }}>
                    <div className="kpi-header">
                        <span>Parqueos Activos</span>
                        <div className="kpi-icon" style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)' }}>
                            <i className="fa-solid fa-square-parking"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-active-parkings">
                            {kpis?.parqueosActivos?.value || '48'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.parqueosActivos?.sublabel || 'Operativos en tiempo real'}
                        </div>
                    </div>
                </div>

                {/* 4. Plazas Publicadas */}
                <div className="card kpi-card" style={{ borderLeftColor: '#D97706' }}>
                    <div className="kpi-header">
                        <span>Plazas Publicadas</span>
                        <div className="kpi-icon" style={{ background: 'rgba(217,119,6,0.1)', color: '#D97706' }}>
                            <i className="fa-solid fa-border-all"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-total-slots">
                            {kpis?.plazasPublicadas?.value ? (typeof kpis.plazasPublicadas.value === 'number' ? Number(kpis.plazasPublicadas.value).toLocaleString('de-DE') : kpis.plazasPublicadas.value) : '4.250'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.plazasPublicadas?.sublabel || 'Cupos totales disponibles'}
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Cards Grid - Fila 2 (4 métricas financieras y transaccionales) */}
            <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {/* 5. Reservas Realizadas */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--accent-amber, #F59E0B)' }}>
                    <div className="kpi-header">
                        <span>Reservas Realizadas</span>
                        <div className="kpi-icon" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber, #F59E0B)' }}>
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-transactions">
                            {kpis?.reservasRealizadas?.value ? (typeof kpis.reservasRealizadas.value === 'number' ? Number(kpis.reservasRealizadas.value).toLocaleString('de-DE') : kpis.reservasRealizadas.value) : '38.420'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.reservasRealizadas?.sublabel || 'Transacciones procesadas'}
                        </div>
                    </div>
                </div>

                {/* 6. Ingresos Comisiones */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--accent-emerald)' }}>
                    <div className="kpi-header">
                        <span>Ingresos Comisiones</span>
                        <div className="kpi-icon" style={{ background: 'var(--accent-emerald-light)', color: 'var(--accent-emerald)' }}>
                            <i className="fa-solid fa-wallet"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-revenue">
                            {kpis?.ingresosComisiones?.value || 'Bs. 48.290,50'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.ingresosComisiones?.sublabel || 'Retención 8.5% a parqueos'}
                        </div>
                    </div>
                </div>

                {/* 7. Tarifa de Servicio */}
                <div className="card kpi-card" style={{ borderLeftColor: 'var(--accent-blue)' }}>
                    <div className="kpi-header">
                        <span>Tarifa de Servicio</span>
                        <div className="kpi-icon" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--accent-blue)' }}>
                            <i className="fa-solid fa-hand-holding-dollar"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-service-fees">
                            {kpis?.tarifaServicio?.value || 'Bs. 14.350,00'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.tarifaServicio?.sublabel || 'Bs. 2.50 por reserva conductor'}
                        </div>
                    </div>
                </div>

                {/* 8. Planes Contratados */}
                <div className="card kpi-card" style={{ borderLeftColor: '#8B5CF6' }}>
                    <div className="kpi-header">
                        <span>Planes Contratados</span>
                        <div className="kpi-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6' }}>
                            <i className="fa-solid fa-gem"></i>
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value" id="kpi-plans-breakdown">
                            {kpis?.planesContratados?.value || '45 Planes'}
                        </div>
                        <div className="kpi-subtext">
                            {kpis?.planesContratados?.sublabel || '12 Enterprise • 24 Pro • 9 Básico'}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
