import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { TenantStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { CreateTenantDto } from '../dto/create-tenant.dto.js';
import { UpdateTenantDto } from '../dto/update-tenant.dto.js';
import { TenantResponseDto } from '../dto/tenant-response.dto.js';

import { CreateTenantAction } from '../actions/create-tenant.action.js';
import { GetTenantsAction } from '../actions/get-tenants.action.js';
import { GetTenantByIdAction } from '../actions/get-tenant-by-id.action.js';
import { UpdateTenantAction } from '../actions/update-tenant.action.js';
import { DarDeBajaTenantAction } from '../actions/dar-de-baja-tenant.action.js';
import { DeleteTenantAction } from '../actions/delete-tenant.action.js';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly createTenantAction: CreateTenantAction,
    private readonly getTenantsAction: GetTenantsAction,
    private readonly getTenantByIdAction: GetTenantByIdAction,
    private readonly updateTenantAction: UpdateTenantAction,
    private readonly darDeBajaTenantAction: DarDeBajaTenantAction,
    private readonly deleteTenantAction: DeleteTenantAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar nueva empresa / tenant',
    description:
      'Exclusivo para Administrador de Parqueo. Se habilita automáticamente en estado ACTIVO y se despacha un correo de confirmación.',
  })
  @ApiResponse({ status: 201, description: 'Empresa registrada exitosamente.', type: TenantResponseDto })
  @ApiResponse({ status: 403, description: 'No autorizado (rol distinto a PARKING_ADMIN).' })
  @ApiResponse({ status: 409, description: 'NIT ya registrado en el sistema.' })
  @Roles('PARKING_ADMIN')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateTenantDto, @CurrentUser() user: any) {
    const data = await this.createTenantAction.execute(dto, user);
    return {
      message: 'Empresa registrada y habilitada exitosamente. Se envió un correo de confirmación.',
      data,
    };
  }

  @ApiOperation({
    summary: 'Listar empresas / tenants',
    description:
      'Para PARKING_ADMIN devuelve solo sus empresas registradas. Para GENERAL_ADMIN y SUPER_ADMIN devuelve todas las empresas.',
  })
  @ApiResponse({ status: 200, description: 'Lista de empresas obtenida.', type: [TenantResponseDto] })
  @Roles('PARKING_ADMIN', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@CurrentUser() user: any) {
    const data = await this.getTenantsAction.execute(user);
    return {
      message: 'Empresas obtenidas exitosamente.',
      data,
    };
  }

  @ApiOperation({
    summary: 'Obtener detalle de una empresa por ID',
  })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Detalle de la empresa.', type: TenantResponseDto })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  @Roles('PARKING_ADMIN', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    const data = await this.getTenantByIdAction.execute(id, user);
    return {
      message: 'Empresa obtenida exitosamente.',
      data,
    };
  }

  @ApiOperation({
    summary: 'Editar datos de una empresa',
    description: 'Permite al Administrador de Parqueo propietario editar el nombre, NIT o razón social.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada.', type: TenantResponseDto })
  @Roles('PARKING_ADMIN', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() user: any
  ) {
    const data = await this.updateTenantAction.execute(id, dto, user);
    return {
      message: 'Empresa actualizada exitosamente.',
      data,
    };
  }

  @ApiOperation({
    summary: 'Dar de baja o reactivar empresa',
    description:
      'Permite al Administrador de Parqueo cambiar el estado de la empresa a INACTIVO (dar de baja) o reactivarla.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiQuery({ name: 'estado', required: false, enum: TenantStatus, description: 'Estado explícito deseado' })
  @ApiResponse({ status: 200, description: 'Estado de la empresa actualizado.', type: TenantResponseDto })
  @Roles('PARKING_ADMIN', 'GENERAL_ADMIN', 'SUPER_ADMIN')
  @Patch(':id/baja')
  @HttpCode(HttpStatus.OK)
  async darDeBaja(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Query('estado') estado?: TenantStatus
  ) {
    const data = await this.darDeBajaTenantAction.execute(id, user, estado);
    return {
      message: `Empresa ${data.estado === TenantStatus.ACTIVO ? 'reactivada' : 'dada de baja'} exitosamente.`,
      data,
    };
  }

  @ApiOperation({
    summary: 'Eliminar definitivamente una empresa del sistema',
    description: 'Acción crítica reservada exclusivamente para Administrador General o Superadmin.',
  })
  @ApiParam({ name: 'id', description: 'UUID de la empresa' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada de la base de datos.' })
  @ApiResponse({ status: 403, description: 'No autorizado (rol distinto a GENERAL_ADMIN o SUPER_ADMIN).' })
  @Roles('GENERAL_ADMIN', 'SUPER_ADMIN')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    const result = await this.deleteTenantAction.execute(id, user);
    return {
      message: result.message,
      data: { id: result.id },
    };
  }
}
