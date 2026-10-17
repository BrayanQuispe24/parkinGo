// src/modules/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller.js';
import { GetGeneralAnalyticsAction } from './actions/get-general-analytics.action.js';

@Module({
    controllers: [ReportsController],
    providers: [GetGeneralAnalyticsAction],
    exports: [GetGeneralAnalyticsAction],
})
export class ReportsModule {}
