import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
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
import { CrearVehiculoDto } from '../dto/crear-vehiculo.dto.js';
import { VehiculoResponseDto } from '../dto/vehiculo-response.dto.js';
import { CrearVehiculoAction } from '../actions/crear-vehiculo.action.js';
import { GetMisVehiculosAction } from '../actions/get-mis-vehiculos.action.js';
import { SetVehiculoPredeterminadoAction } from '../actions/set-vehiculo-predeterminado.action.js';
import { EliminarVehiculoAction } from '../actions/eliminar-vehiculo.action.js';

@ApiTags('vehiculos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehiculos')
export class VehiculosController {
  constructor(
    private readonly crearVehiculoAction: CrearVehiculoAction,
    private readonly getMisVehiculosAction: GetMisVehiculosAction,
    private readonly setVehiculoPredeterminadoAction: SetVehiculoPredeterminadoAction,
    private readonly eliminarVehiculoAction: EliminarVehiculoAction,
  ) {}

  @Post()
  @Roles('DRIVER')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo vehículo (Exclusivo para Conductor)',
    description:
      'Permite a un usuario con rol DRIVER registrar un vehículo con su tipo (enum), placa, modelo y color. Si es el primer vehículo registrado, se marca como predeterminado automáticamente.',
  })
  @ApiResponse({
    status: 201,
    description: 'Vehículo registrado exitosamente',
    type: VehiculoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos del vehículo inválidos o mal formateados' })
  @ApiResponse({ status: 403, description: 'Acceso restringido: Solo para rol DRIVER' })
  @ApiResponse({ status: 409, description: 'La placa ya se encuentra registrada en el sistema' })
  async crear(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
    @Body() dto: CrearVehiculoDto,
  ): Promise<VehiculoResponseDto> {
    return this.crearVehiculoAction.execute(user, dto);
  }

  @Get('mis-vehiculos')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Listar mis vehículos registrados (Exclusivo para Conductor)',
    description:
      'Retorna todos los vehículos registrados por el conductor en sesión, ordenados con el predeterminado al inicio.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vehículos del conductor',
    type: [VehiculoResponseDto],
  })
  @ApiResponse({ status: 403, description: 'Acceso restringido: Solo para rol DRIVER' })
  async getMisVehiculos(
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<VehiculoResponseDto[]> {
    return this.getMisVehiculosAction.execute(user);
  }

  @Patch(':id/predeterminado')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Establecer vehículo predeterminado (Exclusivo para Conductor)',
    description:
      'Marca el vehículo especificado como predeterminado para futuras reservas y desmarca los demás vehículos del conductor.',
  })
  @ApiParam({ name: 'id', description: 'ID del vehículo' })
  @ApiResponse({
    status: 200,
    description: 'Vehículo establecido como predeterminado',
    type: VehiculoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para modificar este vehículo' })
  async setPredeterminado(
    @Param('id') id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<VehiculoResponseDto> {
    return this.setVehiculoPredeterminadoAction.execute(id, user);
  }

  @Delete(':id')
  @Roles('DRIVER')
  @ApiOperation({
    summary: 'Eliminar vehículo (Exclusivo para Conductor)',
    description:
      'Elimina un vehículo perteneciente al conductor autenticado.',
  })
  @ApiParam({ name: 'id', description: 'ID del vehículo a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Vehículo eliminado con éxito',
  })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para eliminar este vehículo' })
  async eliminar(
    @Param('id') id: string,
    @CurrentUser() user: { id?: string; userId?: string; role?: string; roleName?: string },
  ): Promise<{ message: string }> {
    return this.eliminarVehiculoAction.execute(id, user);
  }
}
