// src/modules/auth/dto/resend-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
    @ApiProperty({
        example: 'juan.perez@ejemplo.com',
        description: 'Correo electrónico de la cuenta para reenviar el código OTP',
    })
    @IsEmail({}, { message: 'El formato de correo no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email: string;
}
