import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional, IsEnum, IsDateString, IsBoolean, Equals } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../../usuarios/entities/usuario.entity.js';

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

    @ApiProperty({ 
        example: 'M', 
        description: 'Género del usuario: M (Masculino), F (Femenino), U (No especificado/Otro)', 
        enum: UserGender,
        required: false 
    })
    @IsOptional()
    @IsEnum(UserGender, { message: 'El género debe ser M, F o U' })
    gender?: UserGender;

    @ApiProperty({ 
        example: '1995-05-20', 
        description: 'Fecha de nacimiento en formato YYYY-MM-DD o ISO', 
        required: false 
    })
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
    birthDate?: string;

    @ApiProperty({ 
        example: '+591 70012345', 
        description: 'Teléfono o celular del usuario', 
        required: false 
    })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ 
        example: true, 
        description: 'Aceptación obligatoria de los términos y condiciones de ParkinGo' 
    })
    @Transform(({ value }: { value: unknown }) => value === 'true' || value === true)
    @IsBoolean({ message: 'Debe especificar la aceptación de los términos y condiciones' })
    @Equals(true, { message: 'Es obligatorio aceptar los términos y condiciones para registrarse' })
    acceptedTerms: boolean;
}

