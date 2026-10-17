// src/modules/admin/domain/AdminAnalytics.ts

export interface KpiItem {
    title: string;
    value: string | number;
    sublabel: string;
    icon: string;
    change?: string;
    isPositive?: boolean;
}

export interface MonthlyDataPoint {
    month: string;
    ingresosComisiones: number;
    transacciones: number;
}

export interface AdminAnalytics {
    kpis: {
        totalUsuarios: KpiItem;
        adminsParqueo: KpiItem;
        parqueosActivos: KpiItem;
        plazasPublicadas: KpiItem;
        reservasRealizadas: KpiItem;
        ingresosComisiones: KpiItem;
        tarifaServicio: KpiItem;
        planesContratados: KpiItem;
    };
    chartData: {
        year: number;
        points: MonthlyDataPoint[];
    };
    networkInfo: {
        networkName: string;
        ocupacionGlobal: number;
        sla: string;
        sistemaOperativoVersion: string;
    };
}
