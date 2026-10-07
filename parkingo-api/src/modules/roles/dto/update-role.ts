import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    permissionsIds?: string[];
}