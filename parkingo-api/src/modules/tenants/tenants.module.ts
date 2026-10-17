import { Module } from '@nestjs/common';
import { TenantsController } from './controllers/tenants.controller.js';
import { TenantRepository } from './repositories/tenant.repository.js';
import { PrismaTenantRepository } from './repositories/prisma-tenant.repository.js';
import { CreateTenantAction } from './actions/create-tenant.action.js';
import { GetTenantsAction } from './actions/get-tenants.action.js';
import { GetTenantByIdAction } from './actions/get-tenant-by-id.action.js';
import { UpdateTenantAction } from './actions/update-tenant.action.js';
import { DarDeBajaTenantAction } from './actions/dar-de-baja-tenant.action.js';
import { DeleteTenantAction } from './actions/delete-tenant.action.js';
import { MailerModule } from '../mailer/mailer.module.js';
import { RolesModule } from '../roles/roles.module.js';

@Module({
  imports: [MailerModule, RolesModule],
  controllers: [TenantsController],
  providers: [
    {
      provide: TenantRepository,
      useClass: PrismaTenantRepository,
    },
    CreateTenantAction,
    GetTenantsAction,
    GetTenantByIdAction,
    UpdateTenantAction,
    DarDeBajaTenantAction,
    DeleteTenantAction,
  ],
  exports: [TenantRepository],
})
export class TenantsModule {}
