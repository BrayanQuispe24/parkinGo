import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsUUID, IsOptional, MinLength, MaxLength } from "class-validator";

/**
 * Data Transfer Object (DTO) para la creación de un Rol.
 * Define la estructura esperada y las validaciones de los datos de entrada
 * que el cliente envía en el cuerpo (body) de la petición HTTP.
 */
export class CreateRoleDto {
    @ApiProperty({
        description: 'Nombre identificador del rol en mayúsculas',
        example: 'SUPERVISOR_TURNO',
        minLength: 3,
        maxLength: 30,
    })
    @IsString()
    @IsNotEmpty({ message: 'El nombre del rol no puede estar vacío' })
    @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El nombre del rol no puede exceder los 30 caracteres' })
    //vamos a transformar el texto
    @Transform(({ value }) => value.trim().toUpperCase())
    name: string;

    @ApiPropertyOptional({
        description: 'Array opcional de UUIDs de permisos asignados al rol',
        example: ['d3b07384-d113-4c55-8968-3e4b38d38b46'],
        type: [String],
    })
    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    permissionIds?: string[];
}