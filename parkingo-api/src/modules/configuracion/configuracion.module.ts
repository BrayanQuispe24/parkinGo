import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma/prisma.module.js';
import { ConfiguracionController } from './controllers/configuracion.controller.js';
import { GetTerminosCondicionesAction } from './actions/get-terminos-condiciones.action.js';
import { CreateTerminoCondicionAction } from './actions/create-termino-condicion.action.js';
import { UpdateTerminoCondicionAction } from './actions/update-termino-condicion.action.js';
import { DeleteTerminoCondicionAction } from './actions/delete-termino-condicion.action.js';
import { TerminosCondicionesRepository } from './repositories/terminos-condiciones.repository.js';
import { PrismaTerminosCondicionesRepository } from './repositories/prisma-terminos-condiciones.repository.js';

@Module({
    imports: [PrismaModule],
    controllers: [ConfiguracionController],
    providers: [
        GetTerminosCondicionesAction,
        CreateTerminoCondicionAction,
        UpdateTerminoCondicionAction,
        DeleteTerminoCondicionAction,
        {
            provide: TerminosCondicionesRepository,
            useClass: PrismaTerminosCondicionesRepository,
        },
    ],
    exports: [
        TerminosCondicionesRepository,
        GetTerminosCondicionesAction,
    ],
})
export class ConfiguracionModule {}
