// src/modules/parking-admin/presentation/components/modals/OperatorReportModal.tsx
import { useState } from 'react';
import type { ParkingOperator } from '../../../domain/ParkingOperator';
import { useOperatorReportQuery } from '../../../application/useParkingAdminQueries';

interface OperatorReportModalProps {
    isOpen: boolean;
    operators: ParkingOperator[];
    initialOperatorId?: string;
    onClose: () => void;
}

export const OperatorReportModal = ({
    isOpen,
    operators,
    initialOperatorId,
    onClose,
}: OperatorReportModalProps) => {
    const defaultOpId = initialOperatorId || operators[0]?.id || '';
    const [selectedBranch, setSelectedBranch] = useState('101');
    const [selectedOpId, setSelectedOpId] = useState(defaultOpId);
    const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');

    const activeOpId = selectedOpId || defaultOpId;

    const { data: report, isLoading } = useOperatorReportQuery(
        activeOpId,
        selectedPeriod,
        selectedBranch,
        isOpen
    );

    if (!isOpen) return null;

    return (
        <div
            className="modal-overlay active"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                className="modal-card"
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '680px',
                    boxShadow: 'var(--modal-shadow)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="modal-header-custom"
                    style={{
                        padding: '1.1rem 1.5rem',
                        background: 'var(--bg-secondary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-chart-line" style={{ color: 'var(--border-highlight)' }}></i>
                        <span>Reporte Individual por Operador de Garita</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '1.3rem', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                <div className="modal-body-custom" style={{ padding: '1.5rem' }}>
                    {/* Selectors Bar */}
                    <div
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border-subtle)',
                            padding: '0.9rem',
                            borderRadius: '6px',
                            marginBottom: '1.2rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '0.75rem',
                        }}
                    >
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                                1. Sucursal Parqueo:
                            </label>
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="form-select"
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                            >
                                <option value="101">ParkinGo Equipetrol Central</option>
                                <option value="102">Sucursal Centro Histórico</option>
                                <option value="103">Parqueo San Martín</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                                2. Operador Asignado:
                            </label>
                            <select
                                value={activeOpId}
                                onChange={(e) => setSelectedOpId(e.target.value)}
                                className="form-select"
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                            >
                                {operators.map((op) => (
                                    <option key={op.id} value={op.id}>
                                        {op.fullName} ({op.ci})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.3rem' }}>
                                3. Período:
                            </label>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as 'today' | 'week' | 'month')}
                                className="form-select"
                                style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', color: 'var(--text-main)', outline: 'none' }}
                            >
                                <option value="today">Turno de Hoy</option>
                                <option value="week">Esta Semana</option>
                                <option value="month">Este Mes</option>
                            </select>
                        </div>
                    </div>

                    {/* Report Content */}
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                            <div>Generando métricas del operador...</div>
                        </div>
                    ) : report ? (
                        <div>
                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1.2rem' }}>
                                <div style={{ background: 'rgba(34, 197, 94, 0.12)', border: '1px solid rgba(34, 197, 94, 0.25)', padding: '0.9rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#22C55E', fontWeight: 700 }}>TICKETS EMITIDOS</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22C55E', marginTop: '0.2rem' }}>
                                        {report.totalTickets}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Entradas y salidas</div>
                                </div>

                                <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.25)', padding: '0.9rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700 }}>RECAUDACIÓN EN CAJA</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6', marginTop: '0.2rem' }}>
                                        Bs. {report.totalRevenue.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Efectivo y QR</div>
                                </div>

                                <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.25)', padding: '0.9rem', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#A855F7', fontWeight: 700 }}>TIEMPO MEDIO ATENCIÓN</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#A855F7', marginTop: '0.2rem' }}>
                                        {report.averageHandlingSeconds}s
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Por vehículo en barrera</div>
                                </div>
                            </div>

                            {/* Details Table */}
                            <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', color: 'var(--text-main)' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                                    Ficha Resumen Operativa:
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.82rem' }}>
                                    <div><strong>Operador Titular:</strong> {report.operatorName}</div>
                                    <div><strong>Horas Turno Cumplidas:</strong> {report.shiftHoursCompleted} hrs</div>
                                    <div><strong>Sucursal Evaluada:</strong> {report.branchName}</div>
                                    <div><strong>Incidencias o Anulaciones:</strong> {report.incidentsReported} casos</div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div
                    className="modal-footer-custom"
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'var(--bg-primary)',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-main)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        style={{
                            padding: '0.5rem 1.15rem',
                            background: 'var(--accent-emerald)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: 'var(--glow-shadow)',
                        }}
                        onClick={() => window.print()}
                    >
                        <i className="fa-solid fa-print"></i> Imprimir Reporte
                    </button>
                </div>
            </div>
        </div>
    );
};
