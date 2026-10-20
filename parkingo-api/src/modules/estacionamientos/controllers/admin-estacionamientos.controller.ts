import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EstadoEstacionamiento } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { RechazarEstacionamientoDto } from '../dto/rechazar-estacionamiento.dto.js';
import { ListarSolicitudesAction } from '../actions/listar-solicitudes.action.js';
import { AprobarEstacionamientoAction } from '../actions/aprobar-estacionamiento.action.js';
import { RechazarEstacionamientoAction } from '../actions/rechazar-estacionamiento.action.js';
import { InhabilitarEstacionamientoAction } from '../actions/inhabilitar-estacionamiento.action.js';

@ApiTags('Admin Estacionamientos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('GENERAL_ADMIN', 'SUPER_ADMIN')
@Controller('admin/estacionamientos')
export class AdminEstacionamientosController {
  constructor(
    private readonly listarSolicitudesAction: ListarSolicitudesAction,
    private readonly aprobarEstacionamientoAction: AprobarEstacionamientoAction,
    private readonly rechazarEstacionamientoAction: RechazarEstacionamientoAction,
    private readonly inhabilitarEstacionamientoAction: InhabilitarEstacionamientoAction,
  ) {}

  @ApiOperation({
    summary: 'Listar solicitudes y estacionamientos',
    description:
      'Exclusivo para Administrador General. Permite consultar estacionamientos filtrando por estado (PENDIENTE, APROBADO, RECHAZADO, INHABILITADO).',
  })
  @ApiQuery({
    name: 'estado',
    enum: EstadoEstacionamiento,
    required: false,
    description: 'Filtrar por estado del estacionamiento',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estacionamientos obtenida exitosamente.',
    type: [EstacionamientoResponseDto],
  })
  @Get()
  async listar(
    @Query('estado') estado?: EstadoEstacionamiento,
  ): Promise<EstacionamientoResponseDto[]> {
    return this.listarSolicitudesAction.execute(estado);
  }

  @ApiOperation({
    summary: 'Aprobar solicitud de estacionamiento',
    description:
      'Exclusivo para Administrador General. Cambia el estado del estacionamiento a APROBADO.',
  })
  @ApiParam({ name: 'id', description: 'ID UUID del estacionamiento a aprobar' })
  @ApiResponse({
    status: 200,
    description: 'Estacionamiento aprobado exitosamente.',
    type: EstacionamientoResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/aprobar')
  async aprobar(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EstacionamientoResponseDto> {
    return this.aprobarEstacionamientoAction.execute(id);
  }

  @ApiOperation({
    summary: 'Rechazar solicitud de estacionamiento con motivo',
    description:
      'Exclusivo para Administrador General. Cambia el estado a RECHAZADO y registra el motivo del rechazo.',
  })
  @ApiParam({ name: 'id', description: 'ID UUID del estacionamiento a rechazar' })
  @ApiResponse({
    status: 200,
    description: 'Estacionamiento rechazado con motivo registrado.',
    type: EstacionamientoResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/rechazar')
  async rechazar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RechazarEstacionamientoDto,
  ): Promise<EstacionamientoResponseDto> {
    return this.rechazarEstacionamientoAction.execute(id, dto.motivoRechazo);
  }

  @ApiOperation({
    summary: 'Inhabilitar estacionamiento activo',
    description:
      'Exclusivo para Administrador General. Cambia el estado a INHABILITADO para suspender operaciones del parqueo.',
  })
  @ApiParam({ name: 'id', description: 'ID UUID del estacionamiento a inhabilitar' })
  @ApiResponse({
    status: 200,
    description: 'Estacionamiento inhabilitado exitosamente.',
    type: EstacionamientoResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Patch(':id/inhabilitar')
  async inhabilitar(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EstacionamientoResponseDto> {
    return this.inhabilitarEstacionamientoAction.execute(id);
  }
}
