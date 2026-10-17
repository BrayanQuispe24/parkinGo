import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTerminoCondicionDto {
    @ApiProperty({ example: '1. Aceptación y Alcance de los Términos', description: 'Título de la cláusula' })
    @IsString()
    @IsNotEmpty({ message: 'El título es obligatorio' })
    title: string;

    @ApiProperty({ example: 'Al registrarse en ParkinGo el usuario acepta...', description: 'Texto completo del término' })
    @IsString()
    @IsNotEmpty({ message: 'El contenido es obligatorio' })
    content: string;

    @ApiProperty({ example: 1, description: 'Posición u orden en la lista', required: false, default: 0 })
    @IsOptional()
    @IsInt({ message: 'El orden debe ser un número entero' })
    order?: number;

    @ApiProperty({ example: true, description: 'Determina si el término está activo', required: false, default: true })
    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser booleano' })
    isActive?: boolean;

    @ApiProperty({ example: '1.0', description: 'Versión del término', required: false, default: '1.0' })
    @IsOptional()
    @IsString()
    version?: string;
}
