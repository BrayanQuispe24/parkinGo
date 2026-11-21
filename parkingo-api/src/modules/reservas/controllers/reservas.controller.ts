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
import { IniciarPagoReservaAction } from '../actions/iniciar-pago-reserva.action.js';
import { ConfirmarPagoReservaAction } from '../actions/confirmar-pago-reserva.action.js';
import { VerificarAccesoReservaAction } from '../actions/verificar-acceso-reserva.action.js';
import { RegistrarMovimientoReservaAction } from '../actions/registrar-movimiento-reserva.action.js';
import { IniciarPagoDto, ConfirmarPagoDto, InicioPagoResponseDto } from '../dto/pago.dto.js';
import { VerificarAccesoDto, ResultadoVerificacionAccesoDto } from '../dto/verificar-acceso.dto.js';
import { RegistrarMovimientoDto } from '../dto/registrar-movimiento.dto.js';

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
    private readonly iniciarPagoAction: IniciarPagoReservaAction,
    private readonly confirmarPagoAction: ConfirmarPagoReservaAction,
    private readonly verificarAccesoAction: VerificarAccesoReservaAction,
    private readonly registrarMovimientoAction: RegistrarMovimientoReservaAction,
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

  @Post(':id/iniciar-pago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar procesamiento de pago para una reserva (Efectivo o QR)',
    description:
      'Aplica el patrón Strategy para inicializar el canal de pago: para QR genera el token dinámico con expiración; para Efectivo retorna las instrucciones de garita.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Pago inicializado exitosamente',
    type: InicioPagoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'La reserva no está en estado PENDIENTE_PAGO o método inválido' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async iniciarPago(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: IniciarPagoDto,
  ): Promise<InicioPagoResponseDto> {
    return this.iniciarPagoAction.execute(id, user, dto);
  }

  @Patch(':id/confirmar-pago')
  @Roles('PARKING_OPERATOR', 'HOST', 'PARKING_ADMIN', 'SUPER_ADMIN', 'DRIVER')
  @ApiOperation({
    summary: 'Confirmar pago de una reserva (Patrón Strategy)',
    description:
      'Para EFECTIVO: exclusivo Operador de garita o Anfitrión dueño del parqueo (transiciona a CONFIRMADA). Para QR: confirmado digitalmente tras escaneo bancario.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva' })
  @ApiResponse({
    status: 200,
    description: 'Pago confirmado y reserva transicionada a CONFIRMADA',
    type: BoletaReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Monto insuficiente o reserva no pendiente' })
  @ApiResponse({ status: 403, description: 'No autorizado para cobrar en efectivo este parqueo' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async confirmarPago(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: ConfirmarPagoDto,
  ): Promise<BoletaReservaResponseDto> {
    return this.confirmarPagoAction.execute(id, user, dto);
  }

  @Post('verificar-acceso')
  @Roles('PARKING_OPERATOR', 'HOST', 'PARKING_ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar autenticidad de ticket QR en garita/acceso',
    description:
      'Valida la firma criptográfica HMAC-SHA256 del token QR presentado por el conductor. Si el método es EFECTIVO y la reserva sigue pendiente, retorna la boleta permitiendo cobrar y confirmar el acceso.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultado de validación de autenticidad del QR',
    type: ResultadoVerificacionAccesoDto,
  })
  @ApiResponse({ status: 400, description: 'QR inválido, expirado o adulterado' })
  @ApiResponse({ status: 403, description: 'El operador no pertenece al estacionamiento de la reserva' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  async verificarAcceso(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: VerificarAccesoDto,
  ): Promise<ResultadoVerificacionAccesoDto> {
    return this.verificarAccesoAction.execute(user, dto);
  }

  @Post('movimiento')
  @Roles('PARKING_OPERATOR', 'HOST', 'PARKING_ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Registrar movimiento vehicular de Entrada o Salida por escaneo QR en Garita',
    description:
      'Registra el evento de auditoría de entrada (transiciona la reserva a EN_CURSO y el espacio a OCUPADO) o salida (transiciona a COMPLETADA y libera el espacio a DISPONIBLE).',
  })
  @ApiResponse({
    status: 200,
    description: 'Movimiento vehicular registrado y boleta actualizada',
    type: BoletaReservaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Estado incompatible o movimiento inválido' })
  @ApiResponse({ status: 403, description: 'No autorizado para operar este estacionamiento' })
  @ApiResponse({ status: 404, description: 'Reserva o espacio no encontrado' })
  async registrarMovimiento(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: RegistrarMovimientoDto,
  ): Promise<BoletaReservaResponseDto> {
    return this.registrarMovimientoAction.execute(user, dto);
  }
}
