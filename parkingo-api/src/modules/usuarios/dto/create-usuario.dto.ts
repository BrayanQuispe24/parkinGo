import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength, MaxLength } from "class-validator";
import { UserGender, UserStatus } from "../entities/usuario.entity.js";

export class CreateUsuarioDto {
    @ApiProperty({
        description: 'Correo electrónico único del usuario',
        example: 'operador1@parkingo.com',
    })
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @ApiProperty({
        description: 'Contraseña de acceso (mínimo 6 caracteres)',
        example: 'Secret123*',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Carlos',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @ApiProperty({
        description: 'Apellido del usuario',
        example: 'Pérez',
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido es demasiado largo' })
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @ApiProperty({
        description: 'Número de Carnet de Identidad o DNI',
        example: '7894561-LP',
        minLength: 5,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(5, { message: 'El CI/DNI debe tener al menos 5 caracteres' })
    @Transform(({ value }) => value?.trim())
    ci: string;

    @ApiProperty({
        description: 'UUID del rol que se le asignará al usuario',
        example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    })
    @IsUUID('4', { message: 'El roleId debe ser un UUID válido' })
    @IsNotEmpty()
    roleId: string;

    @ApiPropertyOptional({
        description: 'UUID del usuario administrador creador',
        example: 'b1c2d3e4-f5a6-7890-1234-567890abcdef',
    })
    @IsOptional()
    @IsUUID('4')
    createdById?: string;

    @ApiPropertyOptional({
        description: 'Estado inicial de la cuenta de usuario',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    @IsOptional()
    status?: UserStatus;

    // --- Atributos Opcionales ---
    @ApiPropertyOptional({
        description: 'Género del usuario (M, F, U)',
        enum: UserGender,
        example: UserGender.M,
    })
    @IsOptional()
    @IsString()
    gender?: UserGender;

    @ApiPropertyOptional({
        description: 'Número telefónico o celular de contacto',
        example: '+591 70012345',
    })
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value?.trim())
    phone?: string;

    @ApiPropertyOptional({
        description: 'URL de fotografía de perfil del usuario',
        example: 'https://cdn.parkingo.com/profiles/user-123.jpg',
    })
    @IsOptional()
    @IsString()
    photoUrl?: string;

    @ApiPropertyOptional({
        description: 'Fecha de nacimiento del usuario',
        example: '1995-08-20T00:00:00.000Z',
        type: String,
    })
    @IsOptional()
    birthDate?: Date;
}
