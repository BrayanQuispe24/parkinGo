// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // <-- Nuevo
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { RolesModule } from '../roles/roles.module.js';
import { AuthController } from './controllers/auth.controller.js';
import { RegisterAuthAction } from './actions/register-auth.action.js';
import { LoginAuthAction } from './actions/login-auth.action.js'; // <-- Nuevo

@Module({
  imports: [
    UsuariosModule,
    RolesModule,
    // Configuración del JWT
    JwtModule.register({
      global: true, // Esto hace que el JwtService esté disponible en todo el proyecto
      secret: process.env.JWT_SECRET, // Lee el .env
      signOptions: { expiresIn: '1d' }, // El token expirará en 1 día
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterAuthAction,
    LoginAuthAction, // <-- Nuevo
  ],
})
export class AuthModule { }
