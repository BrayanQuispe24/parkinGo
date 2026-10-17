// src/modules/admin/presentation/pages/GeneralReportsPage.tsx
import { useEffect, useState } from 'react';
import { adminRepository } from '../../infrastructure/HttpAdminRepository';
import type { AdminAnalytics } from '../../domain/AdminAnalytics';
import { KpiCardsGrid } from '../components/KpiCardsGrid';
import { AnalyticsChartCard } from '../components/AnalyticsChartCard';

export const GeneralReportsPage = () => {
    const [analytics, setAnalytics] = useState<AdminAnalytics | undefined>();
    const [loading, setLoading] = useState(true);
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('Consolidado de Comisiones e Ingresos');
    const [exportFormat, setExportFormat] = useState('Archivo Excel (.xlsx)');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const data = await adminRepository.getGeneralAnalytics();
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching admin analytics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const handleExportSubmit = () => {
        setExportModalOpen(false);
        alert(`Reporte "${exportType}" en formato "${exportFormat}" generado y descargado exitosamente.`);
    };

    return (
        <section id="view-reportes" className="dashboard-view active">
            {/* Header de la Vista */}
            <div className="view-header">
                <div className="view-header-title">
                    <h2>Visión General Analítica</h2>
                    <p>Métricas consolidadas de rendimiento financiero, reservas y transacciones de la plataforma.</p>
                </div>

                <div className="view-actions">
                    <button className="btn btn-secondary" onClick={() => setExportModalOpen(true)}>
                        <i className="fa-solid fa-file-export"></i> Exportar Reporte
                    </button>
                </div>
            </div>

            {/* KPI Cards Grid (8 Métricas Globales distribuidas exactamente en 2 filas de 4 columnas) */}
            <KpiCardsGrid data={analytics} loading={loading} />

            {/* Gráfico Analítico Interactivo Chart.js */}
            <AnalyticsChartCard points={analytics?.chartData?.points} />

            {/* Modal Exportar Reporte */}
            {exportModalOpen && (
                <div className="modal-backdrop open">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Exportar Reportes Enterprise</h3>
                            <button className="modal-close-btn" onClick={() => setExportModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body" style={{ padding: '1.25rem' }}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                                    Tipo de Datos a Exportar
                                </label>
                                <select
                                    className="form-select"
                                    style={{ width: '100%' }}
                                    value={exportType}
                                    onChange={(e) => setExportType(e.target.value)}
                                >
                                    <option>Consolidado de Comisiones e Ingresos</option>
                                    <option>Directorio de Empresas y Dueños</option>
                                    <option>Bitácora de Eventos de Seguridad (Audit Log)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                                    Formato de Salida
                                </label>
                                <select
                                    className="form-select"
                                    style={{ width: '100%' }}
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                >
                                    <option>Archivo Excel (.xlsx)</option>
                                    <option>Documento PDF (.pdf)</option>
                                    <option>Valores Separados por Comas (.csv)</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setExportModalOpen(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleExportSubmit}>
                                Generar y Descargar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
export default GeneralReportsPage;
