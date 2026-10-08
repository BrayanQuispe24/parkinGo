// src/modules/auth/dto/register-auth.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Roles públicos permitidos para registro autónomo
const PUBLIC_ROLES = ['HOST', 'PARKING_ADMIN', 'DRIVER'];

export class RegisterAuthDto {
    @ApiProperty({ example: 'juan.perez@ejemplo.com', description: 'Correo electrónico único del usuario' })
    @IsEmail({}, { message: 'El correo debe ser válido' })
    email: string;

    @ApiProperty({ example: 'SecretoSeguro123!', description: 'Contraseña para la cuenta, mínimo 6 caracteres', minLength: 6 })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({ example: 'Juan', description: 'Nombre(s) del usuario' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido(s) del usuario' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: '1234567', description: 'Carnet de Identidad o documento único' })
    @IsString()
    @IsNotEmpty()
    ci: string;

    // Validación clave para evitar que alguien envíe rol GENERAL_ADMIN
    @ApiProperty({ 
        example: 'DRIVER', 
        description: 'Rol solicitado para la cuenta',
        enum: PUBLIC_ROLES 
    })
    @IsString()
    @IsIn(PUBLIC_ROLES, {
        message: `El rol no es válido para registro. Debe ser: ${PUBLIC_ROLES.join(', ')}`,
    })
    roleName: string;
}
