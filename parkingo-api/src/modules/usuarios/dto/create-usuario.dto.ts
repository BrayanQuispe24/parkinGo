import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, MaxLength } from "class-validator";
import { UserGender, UserStatus } from "../entities/usuario.entity.js";

export class CreateUsuarioDto {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'El CI/DNI debe tener al menos 5 caracteres' })
    @Transform(({ value }) => value?.trim())
    ci: string;

    @IsUUID('4', { message: 'El roleId debe ser un UUID válido' })
    @IsNotEmpty()
    roleId: string;

    @IsOptional()
    @IsUUID('4')
    createdById?: string;

    @IsOptional()
    status?: UserStatus;

    // --- Atributos Opcionales ---
    @IsOptional()
    @IsString()
    gender?: UserGender;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    phone?: string;

    @IsOptional()
    @IsString()
    photoUrl?: string;

    @IsOptional()
    birthDate?: Date;
}
