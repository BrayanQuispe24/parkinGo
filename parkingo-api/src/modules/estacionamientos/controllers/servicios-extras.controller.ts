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

import { CreateServicioExtraDto } from '../dto/create-servicio-extra.dto.js';
import { UpdateServicioExtraDto } from '../dto/update-servicio-extra.dto.js';
import { ServicioExtraResponseDto } from '../dto/servicio-extra-response.dto.js';

import { CrearServicioExtraAction } from '../actions/crear-servicio-extra.action.js';
import { GetMisServiciosExtrasAction } from '../actions/get-mis-servicios-extras.action.js';
import { GetServiciosExtrasByEstacionamientoAction } from '../actions/get-servicios-extras-by-estacionamiento.action.js';
import { ActualizarServicioExtraAction } from '../actions/actualizar-servicio-extra.action.js';
import { EliminarServicioExtraAction } from '../actions/eliminar-servicio-extra.action.js';

@ApiTags('Servicios Extras')
@Controller('estacionamientos')
export class ServiciosExtrasController {
  constructor(
    private readonly crearServicioExtraAction: CrearServicioExtraAction,
    private readonly getMisServiciosExtrasAction: GetMisServiciosExtrasAction,
    private readonly getServiciosExtrasByEstacionamientoAction: GetServiciosExtrasByEstacionamientoAction,
    private readonly actualizarServicioExtraAction: ActualizarServicioExtraAction,
    private readonly eliminarServicioExtraAction: EliminarServicioExtraAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar un nuevo servicio extra',
    description:
      'Permite al Administrador de Parqueo (PARKING_ADMIN / HOST) crear un servicio adicional para su estacionamiento.',
  })
  @ApiResponse({
    status: 201,
    description: 'Servicio extra registrado con éxito.',
    type: ServicioExtraResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o el tenant no posee un estacionamiento registrado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @Post('me/servicios')
  async crearServicio(
    @Body() dto: CreateServicioExtraDto,
    @CurrentUser() user: { userId: string },
  ): Promise<ServicioExtraResponseDto> {
    return this.crearServicioExtraAction.execute(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Listar servicios extras de mi estacionamiento',
    description:
      'Retorna la lista de todos los servicios extras (activos e inactivos) del estacionamiento del tenant en sesión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de servicios extras del tenant.',
    type: [ServicioExtraResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me/servicios')
  async getMisServicios(
    @CurrentUser() user: { userId: string },
  ): Promise<ServicioExtraResponseDto[]> {
    return this.getMisServiciosExtrasAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Listar servicios extras activos de un estacionamiento (Público / Conductor)',
    description:
      'Retorna el catálogo de servicios complementarios disponibles y activos para los conductores en el parqueo indicado.',
  })
  @ApiParam({
    name: 'estacionamientoId',
    description: 'UUID del estacionamiento a consultar',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Catálogo de servicios extras activos.',
    type: [ServicioExtraResponseDto],
  })
  @Get(':estacionamientoId/servicios')
  async getServiciosByEstacionamiento(
    @Param('estacionamientoId') estacionamientoId: string,
  ): Promise<ServicioExtraResponseDto[]> {
    return this.getServiciosExtrasByEstacionamientoAction.execute(estacionamientoId);
  }

  @ApiOperation({
    summary: 'Actualizar un servicio extra existente',
    description:
      'Permite modificar nombre, descripción, precio o estado de activación del servicio.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del servicio extra a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio extra actualizado correctamente.',
    type: ServicioExtraResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos sobre el parqueo al que pertenece el servicio.',
  })
  @ApiResponse({
    status: 404,
    description: 'El servicio extra no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Patch('me/servicios/:id')
  async actualizarServicio(
    @Param('id') id: string,
    @Body() dto: UpdateServicioExtraDto,
    @CurrentUser() user: { userId: string },
  ): Promise<ServicioExtraResponseDto> {
    return this.actualizarServicioExtraAction.execute(id, dto, user.userId);
  }

  @ApiOperation({
    summary: 'Eliminar un servicio extra',
    description:
      'Elimina permanentemente un servicio extra del catálogo del estacionamiento.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del servicio extra a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Servicio extra eliminado correctamente.',
    type: ServicioExtraResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos sobre el parqueo al que pertenece el servicio.',
  })
  @ApiResponse({
    status: 404,
    description: 'El servicio extra no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Delete('me/servicios/:id')
  async eliminarServicio(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<ServicioExtraResponseDto> {
    return this.eliminarServicioExtraAction.execute(id, user.userId);
  }
}
