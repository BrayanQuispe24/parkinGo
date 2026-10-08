// src/modules/auth/dto/login-auth.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
    @ApiProperty({ example: 'juan.perez@ejemplo.com', description: 'Correo electrónico del usuario registrado' })
    @IsEmail({}, { message: 'El formato de correo no es válido' })
    email: string;

    @ApiProperty({ example: 'SecretoSeguro123!', description: 'Contraseña del usuario', minLength: 6 })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}
