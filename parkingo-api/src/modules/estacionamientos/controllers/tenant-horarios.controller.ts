import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
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

import { ActualizarHorariosDto } from '../dto/actualizar-horarios.dto.js';
import { HorarioResponseDto } from '../dto/estacionamiento-response.dto.js';
import { GetTenantHorariosAction } from '../actions/get-tenant-horarios.action.js';
import { ActualizarTenantHorariosAction } from '../actions/actualizar-tenant-horarios.action.js';

@ApiTags('Tenant Horarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants/:tenantId/horarios')
export class TenantHorariosController {
  constructor(
    private readonly getTenantHorariosAction: GetTenantHorariosAction,
    private readonly actualizarTenantHorariosAction: ActualizarTenantHorariosAction,
  ) {}

  @ApiOperation({
    summary: 'Obtener horarios de atención establecidos para un Tenant',
    description:
      'Retorna la lista de horarios oficiales configurados para la empresa (Tenant) especificada.',
  })
  @ApiParam({ name: 'tenantId', description: 'UUID de la empresa / tenant' })
  @ApiResponse({
    status: 200,
    description: 'Horarios del tenant obtenidos exitosamente.',
    type: [HorarioResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get()
  async getHorarios(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @CurrentUser() user: { userId: string; role?: { name: string } },
  ): Promise<HorarioResponseDto[]> {
    return this.getTenantHorariosAction.execute(
      tenantId,
      user.userId,
      user.role?.name ? [user.role.name] : [],
    );
  }

  @ApiOperation({
    summary: 'Actualizar horarios de atención de un Tenant',
    description:
      'Guarda o reemplaza los horarios oficiales de la empresa. Si la empresa ya tiene un estacionamiento asociado, se vinculan automáticamente.',
  })
  @ApiParam({ name: 'tenantId', description: 'UUID de la empresa / tenant' })
  @ApiResponse({
    status: 200,
    description: 'Horarios del tenant actualizados exitosamente.',
    type: [HorarioResponseDto],
  })
  @Roles('PARKING_ADMIN', 'HOST', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Put()
  async actualizarHorarios(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Body() dto: ActualizarHorariosDto,
    @CurrentUser() user: { userId: string; role?: { name: string } },
  ): Promise<HorarioResponseDto[]> {
    return this.actualizarTenantHorariosAction.execute(
      tenantId,
      dto,
      user.userId,
      user.role?.name ? [user.role.name] : [],
    );
  }
}
