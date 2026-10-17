// src/modules/auth/dto/verify-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({
        example: 'juan.perez@ejemplo.com',
        description: 'Correo electrónico de la cuenta a verificar',
    })
    @IsEmail({}, { message: 'El formato de correo no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email: string;

    @ApiProperty({
        example: '482915',
        description: 'Código numérico OTP de 6 dígitos recibido por correo',
    })
    @IsString()
    @IsNotEmpty({ message: 'El código OTP es obligatorio' })
    @Length(6, 6, { message: 'El código OTP debe tener exactamente 6 dígitos' })
    @Matches(/^[0-9]{6}$/, { message: 'El código OTP solo debe contener números' })
    code: string;
}
