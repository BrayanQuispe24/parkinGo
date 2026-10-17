// src/modules/admin/presentation/components/AnalyticsChartCard.tsx
import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import type { MonthlyDataPoint } from '../../domain/AdminAnalytics';

interface AnalyticsChartCardProps {
    points?: MonthlyDataPoint[];
}

export const AnalyticsChartCard = ({ points = [] }: AnalyticsChartCardProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    const [selectedRange, setSelectedRange] = useState('Año 2026 (Global)');

    const defaultPoints: MonthlyDataPoint[] = [
        { month: 'Ene', ingresosComisiones: 10000, transacciones: 12000 },
        { month: 'Feb', ingresosComisiones: 14500, transacciones: 15500 },
        { month: 'Mar', ingresosComisiones: 18000, transacciones: 19000 },
        { month: 'Abr', ingresosComisiones: 21500, transacciones: 23000 },
        { month: 'May', ingresosComisiones: 25000, transacciones: 27500 },
        { month: 'Jun', ingresosComisiones: 31000, transacciones: 32000 },
        { month: 'Jul', ingresosComisiones: 35000, transacciones: 36000 },
        { month: 'Ago', ingresosComisiones: 42000, transacciones: 39500 },
        { month: 'Sep', ingresosComisiones: 48290.5, transacciones: 42000 },
    ];

    const data = points.length > 0 ? points : defaultPoints;

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Limpiar instancia previa si existe
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }

        const gradientIncome = ctx.createLinearGradient(0, 0, 0, 300);
        gradientIncome.addColorStop(0, 'rgba(0, 109, 54, 0.25)');
        gradientIncome.addColorStop(1, 'rgba(0, 109, 54, 0.0)');

        const gradientTx = ctx.createLinearGradient(0, 0, 0, 300);
        gradientTx.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
        gradientTx.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((d) => d.month),
                datasets: [
                    {
                        label: 'Ingresos Comisiones ($)',
                        data: data.map((d) => d.ingresosComisiones),
                        borderColor: '#006D36',
                        backgroundColor: gradientIncome,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Total Transacciones',
                        data: data.map((d) => d.transacciones),
                        borderColor: '#2563EB',
                        backgroundColor: gradientTx,
                        borderWidth: 2,
                        borderDash: [4, 4],
                        fill: false,
                        tension: 0.3,
                        yAxisID: 'y1',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#66736B',
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
                        },
                    },
                    tooltip: {
                        backgroundColor: '#17211B',
                        titleColor: '#FFFFFF',
                        bodyColor: '#DDE3DE',
                        borderColor: '#006D36',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                    },
                },
                scales: {
                    x: {
                        grid: { color: '#E2E8F0' },
                        ticks: { color: '#66736B', font: { family: 'Plus Jakarta Sans' } },
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: '#E2E8F0' },
                        ticks: {
                            color: '#006D36',
                            font: { family: 'Plus Jakarta Sans' },
                            callback: (value) => '$' + Number(value).toLocaleString(),
                        },
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: {
                            color: '#2563EB',
                            font: { family: 'Plus Jakarta Sans' },
                            callback: (value) => Number(value).toLocaleString(),
                        },
                    },
                },
            },
        });

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return (
        <div className="card chart-container-card">
            <div className="chart-header">
                <div>
                    <h3>Ingresos Mensuales vs Transacciones</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Comparativa de ingresos por comisiones e volumen transaccional diario.
                    </p>
                </div>
                <select
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                >
                    <option value="Año 2026 (Global)">Año 2026 (Global)</option>
                    <option value="Últimos 6 meses">Últimos 6 meses</option>
                </select>
            </div>
            <div className="chart-wrapper">
                <canvas ref={canvasRef} id="incomeChart"></canvas>
            </div>
        </div>
    );
};
