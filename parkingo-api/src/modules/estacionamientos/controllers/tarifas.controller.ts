import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { CreateTarifaDto } from '../dto/create-tarifa.dto.js';
import { UpdateTarifaDto } from '../dto/update-tarifa.dto.js';
import { TarifaResponseDto } from '../dto/tarifa-response.dto.js';

import { CrearTarifaAction } from '../actions/crear-tarifa.action.js';
import { GetMisTarifasAction } from '../actions/get-mis-tarifas.action.js';
import { GetTarifasByEstacionamientoAction } from '../actions/get-tarifas-by-estacionamiento.action.js';
import { ActualizarTarifaAction } from '../actions/actualizar-tarifa.action.js';
import { EliminarTarifaAction } from '../actions/eliminar-tarifa.action.js';

@ApiTags('Tarifas')
@Controller('estacionamientos')
export class TarifasController {
  constructor(
    private readonly crearTarifaAction: CrearTarifaAction,
    private readonly getMisTarifasAction: GetMisTarifasAction,
    private readonly getTarifasByEstacionamientoAction: GetTarifasByEstacionamientoAction,
    private readonly actualizarTarifaAction: ActualizarTarifaAction,
    private readonly eliminarTarifaAction: EliminarTarifaAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar una nueva tarifa para el estacionamiento',
    description:
      'Permite al Administrador de Parqueo (PARKING_ADMIN / HOST) crear un esquema de cobro (hora, día, mes) para su parqueo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tarifa registrada con éxito.',
    type: TarifaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el tenant no posee un estacionamiento registrado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @Post('me/tarifas')
  async crearTarifa(
    @Body() dto: CreateTarifaDto,
    @CurrentUser() user: { userId: string },
  ): Promise<TarifaResponseDto> {
    return this.crearTarifaAction.execute(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Listar tarifas de mi estacionamiento',
    description:
      'Retorna todas las tarifas (activas e inactivas) del estacionamiento asociado al tenant en sesión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de tarifas del tenant.',
    type: [TarifaResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me/tarifas')
  async getMisTarifas(
    @CurrentUser() user: { userId: string },
  ): Promise<TarifaResponseDto[]> {
    return this.getMisTarifasAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Listar tarifas activas de un estacionamiento (Público / Conductor)',
    description:
      'Retorna el tarifario vigente y activo disponible para los conductores en el parqueo indicado.',
  })
  @ApiParam({
    name: 'estacionamientoId',
    description: 'UUID del estacionamiento a consultar',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifario activo del estacionamiento.',
    type: [TarifaResponseDto],
  })
  @Get(':estacionamientoId/tarifas')
  async getTarifasByEstacionamiento(
    @Param('estacionamientoId') estacionamientoId: string,
  ): Promise<TarifaResponseDto[]> {
    return this.getTarifasByEstacionamientoAction.execute(estacionamientoId);
  }

  @ApiOperation({
    summary: 'Actualizar una tarifa existente',
    description:
      'Permite modificar descripción, monto, modalidad o estado (ACTIVO/INACTIVO) de la tarifa.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la tarifa a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifa actualizada correctamente.',
    type: TarifaResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos sobre el parqueo al que pertenece la tarifa.',
  })
  @ApiResponse({
    status: 404,
    description: 'La tarifa no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Patch('me/tarifas/:id')
  async actualizarTarifa(
    @Param('id') id: string,
    @Body() dto: UpdateTarifaDto,
    @CurrentUser() user: { userId: string },
  ): Promise<TarifaResponseDto> {
    return this.actualizarTarifaAction.execute(id, dto, user.userId);
  }

  @ApiOperation({
    summary: 'Eliminar una tarifa',
    description:
      'Elimina permanentemente una tarifa del catálogo del estacionamiento.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID de la tarifa a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarifa eliminada correctamente.',
    type: TarifaResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos sobre el parqueo al que pertenece la tarifa.',
  })
  @ApiResponse({
    status: 404,
    description: 'La tarifa no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Delete('me/tarifas/:id')
  async eliminarTarifa(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<TarifaResponseDto> {
    return this.eliminarTarifaAction.execute(id, user.userId);
  }
}
