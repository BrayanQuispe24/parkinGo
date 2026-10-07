import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RolesModule
  ],
})
export class AppModule { }
