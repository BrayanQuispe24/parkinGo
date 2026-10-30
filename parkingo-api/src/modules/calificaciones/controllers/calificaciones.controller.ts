import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { CrearCalificacionDto } from '../dto/crear-calificacion.dto.js';
import { CalificacionResponseDto } from '../dto/calificacion-response.dto.js';
import { EstacionamientoCalificacionesSummaryResponseDto } from '../dto/estacionamiento-calificaciones-summary-response.dto.js';
import { CrearCalificacionAction } from '../actions/crear-calificacion.action.js';
import { GetCalificacionesTenantAction } from '../actions/get-calificaciones-tenant.action.js';
import { GetCalificacionesByEstacionamientoAction } from '../actions/get-calificaciones-by-estacionamiento.action.js';
import { GetMisCalificacionesAction } from '../actions/get-mis-calificaciones.action.js';

@ApiTags('calificaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('calificaciones')
export class CalificacionesController {
  constructor(
    private readonly crearCalificacionAction: CrearCalificacionAction,
    private readonly getCalificacionesTenantAction: GetCalificacionesTenantAction,
    private readonly getCalificacionesByEstacionamientoAction: GetCalificacionesByEstacionamientoAction,
    private readonly getMisCalificacionesAction: GetMisCalificacionesAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar una calificación de estacionamiento',
    description:
      'Permite registrar una calificación (1-5 estrellas) y comentario. RESTRICCIÓN: Únicamente accesible para usuarios con rol Conductor (DRIVER).',
  })
  @ApiResponse({
    status: 201,
    description: 'Calificación creada exitosamente.',
    type: CalificacionResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado: El usuario no posee el rol DRIVER.',
  })
  @Roles('DRIVER')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async crear(
    @Body() dto: CrearCalificacionDto,
    @CurrentUser() user: { userId: string; roleName?: string },
  ): Promise<CalificacionResponseDto> {
    return this.crearCalificacionAction.execute(dto, user.userId, user.roleName);
  }

  @ApiOperation({
    summary: 'Consultar calificaciones de los estacionamientos del tenant autenticado',
    description:
      'Retorna únicamente las calificaciones y comentarios recibidos en los estacionamientos pertenecientes al Administrador de Parqueo o Anfitrión en sesión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de calificaciones del tenant obtenido exitosamente.',
    type: [CalificacionResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('tenant')
  async getCalificacionesTenant(
    @CurrentUser() user: { userId: string },
  ): Promise<CalificacionResponseDto[]> {
    return this.getCalificacionesTenantAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Consultar las calificaciones emitidas por el conductor autenticado',
    description:
      'Retorna el historial de reseñas que el conductor logueado ha emitido en el sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial de calificaciones del conductor.',
    type: [CalificacionResponseDto],
  })
  @Roles('DRIVER')
  @Get('mis-resenas')
  async getMisCalificaciones(
    @CurrentUser() user: { userId: string },
  ): Promise<CalificacionResponseDto[]> {
    return this.getMisCalificacionesAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Consultar calificaciones y resumen estadístico de un estacionamiento',
    description:
      'Retorna el puntaje promedio, total de opiniones y lista de calificaciones de un estacionamiento para su ficha técnica.',
  })
  @ApiParam({
    name: 'estacionamientoId',
    description: 'ID único del estacionamiento',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Resumen y lista de calificaciones del estacionamiento.',
    type: EstacionamientoCalificacionesSummaryResponseDto,
  })
  @Roles('DRIVER', 'PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get('estacionamiento/:estacionamientoId')
  async getByEstacionamiento(
    @Param('estacionamientoId') estacionamientoId: string,
  ): Promise<EstacionamientoCalificacionesSummaryResponseDto> {
    return this.getCalificacionesByEstacionamientoAction.execute(estacionamientoId);
  }
}
