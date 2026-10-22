import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

import { AsignarOperadoresDto } from '../dto/asignar-operadores.dto.js';
import { OperadorEstacionamientoResponseDto } from '../dto/operador-estacionamiento-response.dto.js';

import { GetOperadoresEstacionamientoAction } from '../actions/get-operadores-estacionamiento.action.js';
import { GetOperadoresDisponiblesAction } from '../actions/get-operadores-disponibles.action.js';
import { AsignarOperadoresAction } from '../actions/asignar-operadores.action.js';
import { DesasignarOperadorAction } from '../actions/desasignar-operador.action.js';

@ApiTags('Estacionamientos - Operadores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estacionamientos')
export class EstacionamientoOperadoresController {
  constructor(
    private readonly getOperadoresEstacionamientoAction: GetOperadoresEstacionamientoAction,
    private readonly getOperadoresDisponiblesAction: GetOperadoresDisponiblesAction,
    private readonly asignarOperadoresAction: AsignarOperadoresAction,
    private readonly desasignarOperadorAction: DesasignarOperadorAction,
  ) {}

  @ApiOperation({
    summary: 'Listar operadores asignados a un estacionamiento',
    description:
      'Retorna la lista de todos los operadores que actualmente pertenecen y operan en el estacionamiento especificado.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del estacionamiento',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Operadores del estacionamiento obtenidos exitosamente.',
    type: [OperadorEstacionamientoResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get(':id/operadores')
  async getOperadores(
    @Param('id') id: string,
  ): Promise<OperadorEstacionamientoResponseDto[]> {
    return this.getOperadoresEstacionamientoAction.execute(id);
  }

  @ApiOperation({
    summary: 'Listar operadores disponibles para asignación',
    description:
      'Retorna los operadores creados que aún no han sido asignados a ningún estacionamiento (estacionamientoId es null), garantizando la regla de exclusividad 1:N.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del estacionamiento destino',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Operadores disponibles obtenidos exitosamente.',
    type: [OperadorEstacionamientoResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get(':id/operadores-disponibles')
  async getOperadoresDisponibles(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string; roleName: string },
  ): Promise<OperadorEstacionamientoResponseDto[]> {
    return this.getOperadoresDisponiblesAction.execute(
      id,
      user.userId,
      user.roleName,
    );
  }

  @ApiOperation({
    summary: 'Asignar uno o más operadores al estacionamiento',
    description:
      'Asocia a los operadores seleccionados al estacionamiento especificado. Cada operador pertenecerá únicamente a este estacionamiento.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del estacionamiento',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Operadores asignados correctamente al estacionamiento.',
    type: [OperadorEstacionamientoResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @Post(':id/operadores')
  async asignarOperadores(
    @Param('id') id: string,
    @Body() dto: AsignarOperadoresDto,
  ): Promise<OperadorEstacionamientoResponseDto[]> {
    return this.asignarOperadoresAction.execute(id, dto);
  }

  @ApiOperation({
    summary: 'Desasignar un operador del estacionamiento',
    description:
      'Desvincula al operador del estacionamiento, liberándolo para que pueda ser asignado a otro estacionamiento si se requiere.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del estacionamiento',
    type: String,
  })
  @ApiParam({
    name: 'usuarioId',
    description: 'ID único del usuario operador a desvincular',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Operador desvinculado con éxito.',
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @Delete(':id/operadores/:usuarioId')
  async desasignarOperador(
    @Param('id') id: string,
    @Param('usuarioId') usuarioId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.desasignarOperadorAction.execute(id, usuarioId);
  }
}
