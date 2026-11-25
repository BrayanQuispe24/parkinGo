import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class UpdateRoleDto {
    @ApiPropertyOptional({
        description: 'Nuevo nombre en mayúsculas del rol',
        example: 'SUPERVISOR_GENERAL',
        minLength: 3,
        maxLength: 30,
    })
    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El nombre del rol no puede exceder los 30 caracteres' })
    //vamos a transformar el texto
    @Transform(({ value }) => value.trim().toUpperCase())
    name?: string;

    @ApiPropertyOptional({
        description: 'Array de UUIDs de permisos actualizados para el rol',
        example: ['d3b07384-d113-4c55-8968-3e4b38d38b46'],
        type: [String],
    })
    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    permissionsIds?: string[];
}