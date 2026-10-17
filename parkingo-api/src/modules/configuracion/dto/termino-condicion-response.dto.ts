import { ApiProperty } from '@nestjs/swagger';

export class TerminoCondicionResponseDto {
    @ApiProperty({ example: '85f9be28-a477-4b89-a2cb-3fbce46fae85', description: 'Identificador único del término' })
    id: string;

    @ApiProperty({ example: '1. Aceptación y Alcance de los Términos', description: 'Título o cláusula' })
    title: string;

    @ApiProperty({ example: 'Al registrarse y utilizar la plataforma...', description: 'Texto detallado del término o condición' })
    content: string;

    @ApiProperty({ example: 1, description: 'Orden de visualización' })
    order: number;

    @ApiProperty({ example: true, description: 'Estado activo del término' })
    isActive: boolean;

    @ApiProperty({ example: '1.0', description: 'Versión del término' })
    version: string;
}
