import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { GetTerminosCondicionesAction } from '../actions/get-terminos-condiciones.action.js';
import { CreateTerminoCondicionAction } from '../actions/create-termino-condicion.action.js';
import { UpdateTerminoCondicionAction } from '../actions/update-termino-condicion.action.js';
import { DeleteTerminoCondicionAction } from '../actions/delete-termino-condicion.action.js';
import { TerminoCondicionResponseDto } from '../dto/termino-condicion-response.dto.js';
import { CreateTerminoCondicionDto } from '../dto/create-termino-condicion.dto.js';
import { UpdateTerminoCondicionDto } from '../dto/update-termino-condicion.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

@ApiTags('Configuración')
@Controller(['configuracion', 'settings'])
export class ConfiguracionController {
    constructor(
        private readonly getTerminosCondicionesAction: GetTerminosCondicionesAction,
        private readonly createTerminoCondicionAction: CreateTerminoCondicionAction,
        private readonly updateTerminoCondicionAction: UpdateTerminoCondicionAction,
        private readonly deleteTerminoCondicionAction: DeleteTerminoCondicionAction,
    ) {}

    @Get(['terminos-condiciones', 'terms'])
    @ApiOperation({ summary: 'Obtener listado de términos y condiciones vigentes (Público)' })
    @ApiResponse({ status: 200, description: 'Lista de términos y condiciones activos ordenados', type: [TerminoCondicionResponseDto] })
    async getTerminosCondiciones(): Promise<TerminoCondicionResponseDto[]> {
        return this.getTerminosCondicionesAction.execute();
    }

    @Post('terminos-condiciones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN', 'GENERAL_ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo término y condición (Solo Admins)' })
    @ApiResponse({ status: 201, description: 'Término creado exitosamente', type: TerminoCondicionResponseDto })
    @ApiResponse({ status: 400, description: 'Datos de validación inválidos.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Exclusivo para administradores.' })
    async createTerminoCondicion(@Body() dto: CreateTerminoCondicionDto): Promise<TerminoCondicionResponseDto> {
        return this.createTerminoCondicionAction.execute(dto);
    }

    @Patch('terminos-condiciones/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN', 'GENERAL_ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un término y condición existente (Solo Admins)' })
    @ApiParam({ name: 'id', description: 'UUID del término y condición a modificar', type: 'string' })
    @ApiResponse({ status: 200, description: 'Término actualizado', type: TerminoCondicionResponseDto })
    @ApiResponse({ status: 400, description: 'UUID o payload inválido.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Exclusivo para administradores.' })
    @ApiResponse({ status: 404, description: 'Término y condición no encontrado.' })
    async updateTerminoCondicion(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTerminoCondicionDto,
    ): Promise<TerminoCondicionResponseDto> {
        return this.updateTerminoCondicionAction.execute(id, dto);
    }

    @Delete('terminos-condiciones/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN', 'GENERAL_ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Eliminar un término y condición (Solo Admins)' })
    @ApiParam({ name: 'id', description: 'UUID del término y condición a eliminar', type: 'string' })
    @ApiResponse({ status: 200, description: 'Término eliminado', type: TerminoCondicionResponseDto })
    @ApiResponse({ status: 400, description: 'UUID inválido.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Exclusivo para administradores.' })
    @ApiResponse({ status: 404, description: 'Término y condición no encontrado.' })
    async deleteTerminoCondicion(@Param('id', ParseUUIDPipe) id: string): Promise<TerminoCondicionResponseDto> {
        return this.deleteTerminoCondicionAction.execute(id);
    }
}
