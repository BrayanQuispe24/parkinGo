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
import { CroquisController } from './controllers/croquis.controller.js';
import { EstacionamientoOperadoresController } from './controllers/estacionamiento-operadores.controller.js';

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
import { CroquisRepository } from './repositories/croquis.repository.js';
import { PrismaCroquisRepository } from './repositories/prisma-croquis.repository.js';
import { EstacionamientoOperadorRepository } from './repositories/estacionamiento-operador.repository.js';
import { PrismaEstacionamientoOperadorRepository } from './repositories/prisma-estacionamiento-operador.repository.js';

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
import { GetCroquisByNivelAction } from './actions/get-croquis-by-nivel.action.js';
import { GetCroquisPublicoByNivelAction } from './actions/get-croquis-publico-by-nivel.action.js';
import { GuardarCroquisAction } from './actions/guardar-croquis.action.js';
import { SubirFondoCroquisAction } from './actions/subir-fondo-croquis.action.js';
import { GetOperadoresEstacionamientoAction } from './actions/get-operadores-estacionamiento.action.js';
import { GetOperadoresDisponiblesAction } from './actions/get-operadores-disponibles.action.js';
import { AsignarOperadoresAction } from './actions/asignar-operadores.action.js';
import { DesasignarOperadorAction } from './actions/desasignar-operador.action.js';
import { ListarEstacionamientosCatalogoAction } from './actions/listar-estacionamientos-catalogo.action.js';
import { HostDefaultStructureFactory } from './factories/host-default-structure.factory.js';
import { CommercialParkingProvisioningStrategy } from './strategies/commercial-parking-provisioning.strategy.js';
import { HostResidentialProvisioningStrategy } from './strategies/host-residential-provisioning.strategy.js';
import { EstacionamientoProvisioningContext } from './strategies/estacionamiento-provisioning.context.js';

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
    CroquisController,
    EstacionamientoOperadoresController,
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
    {
      provide: CroquisRepository,
      useClass: PrismaCroquisRepository,
    },
    {
      provide: EstacionamientoOperadorRepository,
      useClass: PrismaEstacionamientoOperadorRepository,
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
    GetCroquisByNivelAction,
    GetCroquisPublicoByNivelAction,
    GuardarCroquisAction,
    SubirFondoCroquisAction,
    GetOperadoresEstacionamientoAction,
    GetOperadoresDisponiblesAction,
    AsignarOperadoresAction,
    DesasignarOperadorAction,
    ListarEstacionamientosCatalogoAction,
    HostDefaultStructureFactory,
    CommercialParkingProvisioningStrategy,
    HostResidentialProvisioningStrategy,
    EstacionamientoProvisioningContext,
  ],
  exports: [
    EstacionamientoRepository,
    ServicioExtraRepository,
    TarifaRepository,
    NivelRepository,
    EspacioRepository,
    CroquisRepository,
    EstacionamientoOperadorRepository,
    EstacionamientoProvisioningContext,
  ],
})
export class EstacionamientosModule {}

