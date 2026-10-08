import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional, MinLength, MaxLength } from "class-validator";

/**
 * Data Transfer Object (DTO) para la creación de un Rol.
 * Define la estructura esperada y las validaciones de los datos de entrada
 * que el cliente envía en el cuerpo (body) de la petición HTTP.
 */
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del rol no puede estar vacío' })
    @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El nombre del rol no puede exceder los 30 caracteres' })
    //vamos a transformar el texto
    @Transform(({ value }) => value.trim().toUpperCase())
    name: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    permissionIds?: string[];
}