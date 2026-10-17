// src/modules/reports/controllers/reports.controller.ts
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GetGeneralAnalyticsAction } from '../actions/get-general-analytics.action.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

@ApiTags('Reportes y Analítica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly getGeneralAnalyticsAction: GetGeneralAnalyticsAction) { }

    @ApiOperation({
        summary: 'Obtener métricas y KPIs generales de la plataforma',
        description: 'Retorna KPIs consolidados, series mensuales y estado del sistema. Exclusivo para SUPER_ADMIN.',
    })
    @ApiResponse({ status: 200, description: 'Métricas analíticas obtenidas exitosamente.' })
    @Roles('SUPER_ADMIN')
    @Get('general')
    @HttpCode(HttpStatus.OK)
    async getGeneralAnalytics() {
        const analytics = await this.getGeneralAnalyticsAction.execute();
        return {
            success: true,
            message: 'Métricas analíticas obtenidas exitosamente',
            data: analytics,
        };
    }
}
