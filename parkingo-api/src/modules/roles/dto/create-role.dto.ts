import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional } from "class-validator";
import { UUID } from "crypto";

/**
 * Data Transfer Object (DTO) para la creación de un Rol.
 * Define la estructura esperada y las validaciones de los datos de entrada
 * que el cliente envía en el cuerpo (body) de la petición HTTP.
 */
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    permissionIds?: string[];
}