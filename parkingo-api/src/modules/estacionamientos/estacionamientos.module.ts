import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { TenantsModule } from '../tenants/tenants.module.js';

import { EstacionamientosController } from './controllers/estacionamientos.controller.js';
import { AdminEstacionamientosController } from './controllers/admin-estacionamientos.controller.js';
import { TenantHorariosController } from './controllers/tenant-horarios.controller.js';
import { ServiciosExtrasController } from './controllers/servicios-extras.controller.js';
import { TarifasController } from './controllers/tarifas.controller.js';
import { NivelesController } from './controllers/niveles.controller.js';
import { EspaciosController } from './controllers/espacios.controller.js';

import { EstacionamientoRepository } from './repositories/estacionamiento.repository.js';
import { PrismaEstacionamientoRepository } from './repositories/prisma-estacionamiento.repository.js';
import { ServicioExtraRepository } from './repositories/servicio-extra.repository.js';
import { PrismaServicioExtraRepository } from './repositories/prisma-servicio-extra.repository.js';
import { TarifaRepository } from './repositories/tarifa.repository.js';
import { PrismaTarifaRepository } from './repositories/prisma-tarifa.repository.js';
import { NivelRepository } from './repositories/nivel.repository.js';
import { PrismaNivelRepository } from './repositories/prisma-nivel.repository.js';
import { EspacioRepository } from './repositories/espacio.repository.js';
import { PrismaEspacioRepository } from './repositories/prisma-espacio.repository.js';

import { RegistrarEstacionamientoAction } from './actions/registrar-estacionamiento.action.js';
import { GetMiEstacionamientoAction } from './actions/get-mi-estacionamiento.action.js';
import { ListarSolicitudesAction } from './actions/listar-solicitudes.action.js';
import { AprobarEstacionamientoAction } from './actions/aprobar-estacionamiento.action.js';
import { RechazarEstacionamientoAction } from './actions/rechazar-estacionamiento.action.js';
import { InhabilitarEstacionamientoAction } from './actions/inhabilitar-estacionamiento.action.js';
import { ActualizarHorariosAction } from './actions/actualizar-horarios.action.js';
import { GetTenantHorariosAction } from './actions/get-tenant-horarios.action.js';
import { ActualizarTenantHorariosAction } from './actions/actualizar-tenant-horarios.action.js';
import { CrearServicioExtraAction } from './actions/crear-servicio-extra.action.js';
import { GetMisServiciosExtrasAction } from './actions/get-mis-servicios-extras.action.js';
import { GetServiciosExtrasByEstacionamientoAction } from './actions/get-servicios-extras-by-estacionamiento.action.js';
import { ActualizarServicioExtraAction } from './actions/actualizar-servicio-extra.action.js';
import { EliminarServicioExtraAction } from './actions/eliminar-servicio-extra.action.js';
import { SubirFotosAction } from './actions/subir-fotos.action.js';
import { EliminarFotoAction } from './actions/eliminar-foto.action.js';
import { CrearTarifaAction } from './actions/crear-tarifa.action.js';
import { GetMisTarifasAction } from './actions/get-mis-tarifas.action.js';
import { GetTarifasByEstacionamientoAction } from './actions/get-tarifas-by-estacionamiento.action.js';
import { ActualizarTarifaAction } from './actions/actualizar-tarifa.action.js';
import { EliminarTarifaAction } from './actions/eliminar-tarifa.action.js';
import { CrearNivelAction } from './actions/crear-nivel.action.js';
import { GetMisNivelesAction } from './actions/get-mis-niveles.action.js';
import { EliminarNivelAction } from './actions/eliminar-nivel.action.js';
import { CrearEspacioAction } from './actions/crear-espacio.action.js';
import { GetMisEspaciosAction } from './actions/get-mis-espacios.action.js';
import { ActualizarEspacioAction } from './actions/actualizar-espacio.action.js';
import { EliminarEspacioAction } from './actions/eliminar-espacio.action.js';

@Module({
  imports: [PrismaModule, TenantsModule],
  controllers: [
    EstacionamientosController,
    AdminEstacionamientosController,
    TenantHorariosController,
    ServiciosExtrasController,
    TarifasController,
    NivelesController,
    EspaciosController,
  ],
  providers: [
    {
      provide: EstacionamientoRepository,
      useClass: PrismaEstacionamientoRepository,
    },
    {
      provide: ServicioExtraRepository,
      useClass: PrismaServicioExtraRepository,
    },
    {
      provide: TarifaRepository,
      useClass: PrismaTarifaRepository,
    },
    {
      provide: NivelRepository,
      useClass: PrismaNivelRepository,
    },
    {
      provide: EspacioRepository,
      useClass: PrismaEspacioRepository,
    },
    RegistrarEstacionamientoAction,
    GetMiEstacionamientoAction,
    ActualizarHorariosAction,
    GetTenantHorariosAction,
    ActualizarTenantHorariosAction,
    ListarSolicitudesAction,
    AprobarEstacionamientoAction,
    RechazarEstacionamientoAction,
    InhabilitarEstacionamientoAction,
    CrearServicioExtraAction,
    GetMisServiciosExtrasAction,
    GetServiciosExtrasByEstacionamientoAction,
    ActualizarServicioExtraAction,
    EliminarServicioExtraAction,
    SubirFotosAction,
    EliminarFotoAction,
    CrearTarifaAction,
    GetMisTarifasAction,
    GetTarifasByEstacionamientoAction,
    ActualizarTarifaAction,
    EliminarTarifaAction,
    CrearNivelAction,
    GetMisNivelesAction,
    EliminarNivelAction,
    CrearEspacioAction,
    GetMisEspaciosAction,
    ActualizarEspacioAction,
    EliminarEspacioAction,
  ],
  exports: [
    EstacionamientoRepository,
    ServicioExtraRepository,
    TarifaRepository,
    NivelRepository,
    EspacioRepository,
  ],
})
export class EstacionamientosModule {}

