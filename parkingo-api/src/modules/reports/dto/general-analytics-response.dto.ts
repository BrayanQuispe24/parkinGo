// src/modules/reports/dto/general-analytics-response.dto.ts

export interface KpiMetric {
    title: string;
    value: string | number;
    sublabel: string;
    icon: string;
    change?: string;
    isPositive?: boolean;
}

export interface MonthlyChartPoint {
    month: string;
    ingresosComisiones: number; // en Bs o USD
    transacciones: number;
}

export interface GeneralAnalyticsResponseDto {
    kpis: {
        totalUsuarios: KpiMetric;
        adminsParqueo: KpiMetric;
        parqueosActivos: KpiMetric;
        plazasPublicadas: KpiMetric;
        reservasRealizadas: KpiMetric;
        ingresosComisiones: KpiMetric;
        tarifaServicio: KpiMetric;
        planesContratados: KpiMetric;
    };
    chartData: {
        year: number;
        points: MonthlyChartPoint[];
    };
    networkInfo: {
        networkName: string;
        ocupacionGlobal: number; // 78.4
        sla: string; // 99.9%
        sistemaOperativoVersion: string; // Producción v2.4
    };
}
