import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, MaxLength } from "class-validator";
import { UserGender, UserStatus } from "../entities/usuario.entity.js";

export class UpdateUsuarioDto {
    @IsOptional()
    @IsEnum(UserStatus, { message: 'El estado debe ser ACTIVE, INACTIVE, SUSPENDED o DELETED' })
    status?: UserStatus;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsOptional()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password?: string;

    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    firstName?: string;

    @IsString()
    @IsOptional()
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    lastName?: string;

    @IsString()
    @IsOptional()
    @MinLength(5, { message: 'El CI/DNI debe tener al menos 5 caracteres' })
    @Transform(({ value }) => value?.trim())
    ci?: string;

    @IsUUID('4', { message: 'El roleId debe ser un UUID válido' })
    @IsOptional()
    roleId?: string;

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
