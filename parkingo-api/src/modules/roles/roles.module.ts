import { Module } from "@nestjs/common";
import { PrismaModule } from "../../database/prisma/prisma.module.js";
import { CreateRoleAction } from "./actions/create-role.action.js";
import { GetRolesAction } from "./actions/get-roles.action.js";
import { RolesController } from "./controllers/roles.controller.js";
import { PrismaRoleRepository } from "./repositories/prisma-role.repository.js";
import { RoleRepository } from "./repositories/role.repository.js";
import { PermissionsController } from './controllers/permissions.controller.js';
import { GetPermissionAction } from "./actions/get-permission.action.js";
import { PermissionRepository } from "./repositories/permission.repository.js";
import { PrismaPermissionRepository } from "./repositories/prisma-permission.repository.js";
import { UpdateRoleAction } from "./actions/update-role.action.js";
import { DeleteRoleAction } from "./actions/delete-role.action.js";

/**
 * Módulo de Roles (NestJS).
 * Es el "pegamento" que une los controladores, los casos de uso (Actions) y los repositorios.
 * Aquí se define que cuando alguien pida el 'RoleRepository', Nest inyectará 'PrismaRoleRepository'.
 */
@Module({
    // 1. imports: Otros módulos externos de los que dependemos.
    // Al importar PrismaModule, permitimos que nuestras clases inyecten PrismaService.
    imports: [PrismaModule],

    // 2. controllers: Las clases que reciben y responden las peticiones HTTP (GET, POST, etc.).
    // NestJS creará los endpoints basados en lo que definamos aquí.
    controllers: [RolesController, PermissionsController],

    // 3. providers: Son todos los componentes inyectables (@Injectable) de nuestro módulo.
    providers: [
        // Registramos nuestros Casos de Uso (Actions) para que el Controller los pueda recibir en su constructor.
        CreateRoleAction,
        UpdateRoleAction,
        DeleteRoleAction,
        GetRolesAction,
        GetPermissionAction,

        // 4. Inversión de Dependencias (El Patrón más importante de esta arquitectura):
        // Le decimos a NestJS: "Cuando una clase (como el CreateRoleAction) pida el contrato 'RoleRepository'..."
        {
            provide: RoleRepository,

            // "...entrégale una instaancia funcional de la clase 'PrismaRoleRepository'."
            // Esto permite que el día de mañana cambies a MongoDB, crees un 'MongoRoleRepository',
            // lo cambies aquí, ¡y no tengas que modificar ni una sola línea de los Actions!
            useClass: PrismaRoleRepository
        },
        {
            provide: PermissionRepository,

            useClass: PrismaPermissionRepository
        },

    ],
    exports: [RoleRepository],
})
export class RolesModule { }