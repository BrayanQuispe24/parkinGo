import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RolesModule } from './modules/roles/roles.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RolesModule,
    UsuariosModule,
    AuthModule,
    JwtModule.register({
      global: true, // Esto hace que el JwtService esté disponible en todo el proyecto
      secret: process.env.JWT_SECRET, // Lee el .env
      signOptions: { expiresIn: '1d' }, // El token expirará en 1 día
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Tiempo en milisegundos (60 segundos)
      limit: 20,  // Máximo 10 peticiones en ese tiempo
    }]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // <-- Esto aplica el ThrottlerGuard a TODOS los controladores del proyecto
    }
  ],
  exports: []
})
export class AppModule { }
