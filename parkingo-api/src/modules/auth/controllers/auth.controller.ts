// src/modules/auth/controllers/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { LoginAuthDto } from '../dto/login-auth.dto.js';
import { LoginAuthAction } from '../actions/login-auth.action.js';
import { RegisterAuthAction } from '../actions/register-auth.action.js';
import { RegisterAuthDto } from '../dto/register-auth.dto.js';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerAuthAction: RegisterAuthAction,
        private readonly loginAuthAction: LoginAuthAction,
    ) { }

    @ApiOperation({ summary: 'Registrar un nuevo usuario', description: 'Crea un nuevo usuario público con rol HOST, PARKING_ADMIN o DRIVER.' })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos o el usuario ya existe.' })
    @ApiBody({ type: RegisterAuthDto })
    @Throttle({ default: { limit: 2, ttl: 60000 } })
    @HttpCode(HttpStatus.CREATED) // Por defecto POST devuelve 201, pero un registro suele ser 201 Created
    @Post('register')
    register(@Body() dto: RegisterAuthDto) {
        return this.registerAuthAction.execute(dto);
    }

    @ApiOperation({ summary: 'Iniciar sesión', description: 'Permite a un usuario autenticarse y obtener un token JWT.' })
    @ApiResponse({ status: 200, description: 'Login exitoso, retorna el token JWT.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiBody({ type: LoginAuthDto })
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    @HttpCode(HttpStatus.OK) // Por defecto POST devuelve 201, pero un login suele ser 200 OK
    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.loginAuthAction.execute(dto);
    }
}
