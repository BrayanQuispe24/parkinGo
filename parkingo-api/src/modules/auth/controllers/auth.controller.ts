// src/modules/auth/controllers/auth.controller.ts
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { LoginAuthAction } from '../actions/login-auth.action.js';
import { RegisterAuthAction } from '../actions/register-auth.action.js';
import { ResendOtpAuthAction } from '../actions/resend-otp-auth.action.js';
import { VerifyOtpAuthAction } from '../actions/verify-otp-auth.action.js';
import { LoginAuthDto } from '../dto/login-auth.dto.js';
import { RegisterAuthDto } from '../dto/register-auth.dto.js';
import { ResendOtpDto } from '../dto/resend-otp.dto.js';
import { VerifyOtpDto } from '../dto/verify-otp.dto.js';

import type { UploadedDocumentFile } from '../strategies/verification/user-verification-strategy.interface.js';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerAuthAction: RegisterAuthAction,
        private readonly loginAuthAction: LoginAuthAction,
        private readonly verifyOtpAuthAction: VerifyOtpAuthAction,
        private readonly resendOtpAuthAction: ResendOtpAuthAction,
    ) {}

    @ApiOperation({
        summary: 'Registrar un nuevo usuario',
        description:
            'Crea un nuevo usuario público con rol HOST, PARKING_ADMIN o DRIVER. Si el rol es HOST o PARKING_ADMIN, es obligatorio adjuntar documentación en PDF.',
    })
    @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente. Requiere verificación OTP.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos, dominio falso o falta de PDF requerido.' })
    @ApiConsumes('multipart/form-data', 'application/json')
    @ApiBody({ type: RegisterAuthDto })
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('document'))
    @Post('register')
    register(
        @Body() dto: RegisterAuthDto,
        @UploadedFile() file?: UploadedDocumentFile,
    ) {
        return this.registerAuthAction.execute(dto, file);
    }

    @ApiOperation({ summary: 'Iniciar sesión', description: 'Permite a un usuario autenticarse y obtener un token JWT.' })
    @ApiResponse({ status: 200, description: 'Login exitoso, retorna el token JWT.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @ApiBody({ type: LoginAuthDto })
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto: LoginAuthDto) {
        return this.loginAuthAction.execute(dto);
    }

    @ApiOperation({
        summary: 'Verificar código OTP de 6 dígitos',
        description: 'Valida el código OTP recibido por correo, marca la cuenta como isVerified=true y retorna el token JWT.',
    })
    @ApiResponse({ status: 200, description: 'Código verificado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Código incorrecto, expirado o excedió el límite de intentos.' })
    @ApiBody({ type: VerifyOtpDto })
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @Post('verify-otp')
    verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.verifyOtpAuthAction.execute(dto);
    }

    @ApiOperation({
        summary: 'Reenviar código OTP de verificación',
        description: 'Genera y envía un nuevo código de 6 dígitos al correo (cooldown de 60 segundos).',
    })
    @ApiResponse({ status: 200, description: 'Nuevo código OTP enviado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Enfriamiento activo o cuenta ya verificada.' })
    @ApiBody({ type: ResendOtpDto })
    @Throttle({ default: { limit: 2, ttl: 60000 } })
    @HttpCode(HttpStatus.OK)
    @Post('resend-otp')
    resendOtp(@Body() dto: ResendOtpDto) {
        return this.resendOtpAuthAction.execute(dto);
    }
}
