import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
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
import { CotizarReservaDto } from '../dto/cotizar-reserva.dto.js';
import { CrearReservaDto } from '../dto/crear-reserva.dto.js';
import {
  BoletaReservaResponseDto,
  CotizacionReservaResponseDto,
} from '../dto/reserva-response.dto.js';
import { CotizarReservaAction } from '../actions/cotizar-reserva.action.js';
import { CrearReservaAction } from '../actions/crear-reserva.action.js';
import { GetMisReservasAction } from '../actions/get-mis-reservas.action.js';
import { GetReservasEstacionamientoAction } from '../actions/get-reservas-estacionamiento.action.js';
import { GetReservaByIdAction } from '../actions/get-reserva-by-id.action.js';
import { CancelarReservaAction } from '../actions/cancelar-reserva.action.js';

@ApiTags('reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(
    private readonly cotizarAction: CotizarReservaAction,
    private readonly crearAction: CrearReservaAction,
    private readonly getMisReservasAction: GetMisReservasAction,
    private readonly getReservasEstacionamientoAction: GetReservasEstacionamientoAction,
    private readonly getReservaByIdAction: GetReservaByIdAction,
    private readonly cancelarAction: CancelarReservaAction,
  ) {}

  @Post('cotizar')
  @Roles('DRIVER', 'PARKING_OPERATOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cotizar reserva multi-espacio con servicios extras (Patrón Decorator)',
    description:
      'Calcula en memoria el desglose por espacio y total de la boleta ensamblando decoradores sin persistir en base de datos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Cotización calculada exitosamente',
    type: CotizacionReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de espacios o extras inválidos' })
  @ApiResponse({ status: 403, description: 'Solo conductores y operadores pueden cotizar reservas' })
  async cotizar(@Body() dto: CotizarReservaDto): Promise<CotizacionReservaResponseDto> {
    return this.cotizarAction.execute(dto);
  }

  @Post()
  @Roles('DRIVER', 'PARKING_OPERATOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar nueva boleta de reserva (Exclusivo Conductor y Operador)',
    description:
      'Crea transaccionalmente la boleta en estado PENDIENTE_PAGO, valida colisiones en intervalos [inicio, fin) y aparta los espacios seleccionados con snapshots de tarifas.',
  })
  @ApiResponse({
    status: 201,
    description: 'Boleta de reserva creada exitosamente en estado PENDIENTE_PAGO',
    type: BoletaReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Parámetros de reserva inválidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado: Solo DRIVER y PARKING_OPERATOR' })
  @ApiResponse({ status: 409, description: 'Conflicto: Uno o más espacios ya están reservados en ese horario' })
  async crear(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: CrearReservaDto,
  ): Promise<BoletaReservaResponseDto> {
    return this.crearAction.execute(user, dto);
  }

  @Get('mis-reservas')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Listar mis boletas de reserva (Exclusivo Conductor)',
    description: 'Retorna el historial completo de boletas creadas por el conductor en sesión.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletas del conductor',
    type: [BoletaReservaResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Acceso restringido: Solo para rol DRIVER' })
  async getMisReservas(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto[]> {
    return this.getMisReservasAction.execute(user);
  }

  @Get('estacionamiento/:id')
  @Roles('PARKING_ADMIN', 'HOST', 'PARKING_OPERATOR', 'SUPER_ADMIN')
  @ApiOperation({
    summary: 'Listar reservas de un estacionamiento (Administrador u Operador del Parqueo)',
    description:
      'Permite al administrador o al operador asignado visualizar las reservas de su propio estacionamiento. GENERAL_ADMIN tiene el acceso denegado.',
  })
  @ApiParam({ name: 'id', description: 'ID del estacionamiento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de boletas del estacionamiento',
    type: [BoletaReservaResponseDto],
  })
  @ApiResponse({ status: 403, description: 'No tienes permisos para ver reservas de este parqueo o eres GENERAL_ADMIN' })
  async getPorEstacionamiento(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto[]> {
    return this.getReservasEstacionamientoAction.execute(id, user);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar detalle de una boleta de reserva con QR y desglose',
    description:
      'Consulta la boleta verificando que pertenezca al conductor o al administrador/operador del parqueo.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Detalle completo de la boleta de reserva',
    type: BoletaReservaResponseDto,
  })
  @ApiResponse({ status: 403, description: 'No tienes autorización para consultar esta reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async getPorId(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto> {
    return this.getReservaByIdAction.execute(id, user);
  }

  @Patch(':id/cancelar')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Cancelar una reserva (Exclusivo para el Cliente Conductor dueño)',
    description:
      'Permite exclusivamente al cliente que registró la reserva cancelarla y liberar los espacios asociados.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva a cancelar' })
  @ApiResponse({
    status: 200,
    description: 'Reserva cancelada exitosamente',
    type: BoletaReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'La reserva ya fue cancelada o completada' })
  @ApiResponse({ status: 403, description: 'Solo el cliente dueño puede cancelar la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async cancelar(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<BoletaReservaResponseDto> {
    return this.cancelarAction.execute(id, user);
  }
}
