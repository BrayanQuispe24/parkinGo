import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';
import { EstacionamientosModule } from '../estacionamientos/estacionamientos.module.js';
import { CalificacionesController } from './controllers/calificaciones.controller.js';
import { CalificacionRepository } from './repositories/calificacion.repository.js';
import { PrismaCalificacionRepository } from './repositories/prisma-calificacion.repository.js';
import { CrearCalificacionAction } from './actions/crear-calificacion.action.js';
import { GetCalificacionesTenantAction } from './actions/get-calificaciones-tenant.action.js';
import { GetCalificacionesByEstacionamientoAction } from './actions/get-calificaciones-by-estacionamiento.action.js';
import { GetMisCalificacionesAction } from './actions/get-mis-calificaciones.action.js';

@Module({
  imports: [PrismaModule, TenantsModule, EstacionamientosModule],
  controllers: [CalificacionesController],
  providers: [
    {
      provide: CalificacionRepository,
      useClass: PrismaCalificacionRepository,
    },
    CrearCalificacionAction,
    GetCalificacionesTenantAction,
    GetCalificacionesByEstacionamientoAction,
    GetMisCalificacionesAction,
  ],
  exports: [CalificacionRepository],
})
export class CalificacionesModule {}
