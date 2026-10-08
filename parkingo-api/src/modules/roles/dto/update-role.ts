import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'El nombre del rol debe tener al menos 3 caracteres' })
    @MaxLength(30, { message: 'El nombre del rol no puede exceder los 30 caracteres' })
    //vamos a transformar el texto
    @Transform(({ value }) => value.trim().toUpperCase())
    name?: string;

    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    permissionsIds?: string[];
}