import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { VehiculosController } from './controllers/vehiculos.controller.js';
import { VehiculoRepository } from './repositories/vehiculo.repository.js';
import { PrismaVehiculoRepository } from './repositories/prisma-vehiculo.repository.js';
import { CrearVehiculoAction } from './actions/crear-vehiculo.action.js';
import { GetMisVehiculosAction } from './actions/get-mis-vehiculos.action.js';
import { SetVehiculoPredeterminadoAction } from './actions/set-vehiculo-predeterminado.action.js';
import { EliminarVehiculoAction } from './actions/eliminar-vehiculo.action.js';

@Module({
  imports: [PrismaModule],
  controllers: [VehiculosController],
  providers: [
    {
      provide: VehiculoRepository,
      useClass: PrismaVehiculoRepository,
    },
    CrearVehiculoAction,
    GetMisVehiculosAction,
    SetVehiculoPredeterminadoAction,
    EliminarVehiculoAction,
  ],
  exports: [VehiculoRepository],
})
export class VehiculosModule {}
