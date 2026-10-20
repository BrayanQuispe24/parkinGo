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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { CreateEspacioDto } from '../dto/create-espacio.dto.js';
import { UpdateEspacioDto } from '../dto/update-espacio.dto.js';
import { EspacioResponseDto } from '../dto/espacio-response.dto.js';

import { CrearEspacioAction } from '../actions/crear-espacio.action.js';
import { GetMisEspaciosAction } from '../actions/get-mis-espacios.action.js';
import { ActualizarEspacioAction } from '../actions/actualizar-espacio.action.js';
import { EliminarEspacioAction } from '../actions/eliminar-espacio.action.js';

@ApiTags('Espacios')
@Controller('estacionamientos')
export class EspaciosController {
  constructor(
    private readonly crearEspacioAction: CrearEspacioAction,
    private readonly getMisEspaciosAction: GetMisEspaciosAction,
    private readonly actualizarEspacioAction: ActualizarEspacioAction,
    private readonly eliminarEspacioAction: EliminarEspacioAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar un nuevo espacio / box de estacionamiento',
    description:
      'Crea un nuevo espacio vinculado a un nivel específico con su tipo de vehículo, modalidad y estado inicial.',
  })
  @ApiResponse({
    status: 201,
    description: 'Espacio registrado exitosamente.',
    type: EspacioResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un espacio con ese código en el nivel seleccionado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @Post('me/espacios')
  async crearEspacio(
    @Body() dto: CreateEspacioDto,
    @CurrentUser() user: { userId: string },
  ): Promise<EspacioResponseDto> {
    return this.crearEspacioAction.execute(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Listar espacios de mi estacionamiento',
    description:
      'Retorna todos los espacios del estacionamiento del tenant, con opción a filtrar por nivel.',
  })
  @ApiQuery({
    name: 'nivelId',
    required: false,
    description: 'UUID del nivel para filtrar los espacios (opcional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de espacios obtenida correctamente.',
    type: [EspacioResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me/espacios')
  async getMisEspacios(
    @CurrentUser() user: { userId: string },
    @Query('nivelId') nivelId?: string,
  ): Promise<EspacioResponseDto[]> {
    return this.getMisEspaciosAction.execute(user.userId, nivelId);
  }

  @ApiOperation({
    summary: 'Actualizar un espacio existente',
    description:
      'Permite cambiar código, tipo de vehículo, modalidad, estado y/o reubicar de nivel.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del espacio a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Espacio actualizado correctamente.',
    type: EspacioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'El espacio no existe.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto de código duplicado en el nivel.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Patch('me/espacios/:id')
  async actualizarEspacio(
    @Param('id') id: string,
    @Body() dto: UpdateEspacioDto,
    @CurrentUser() user: { userId: string },
  ): Promise<EspacioResponseDto> {
    return this.actualizarEspacioAction.execute(id, dto, user.userId);
  }

  @ApiOperation({
    summary: 'Eliminar un espacio',
    description: 'Elimina permanentemente un espacio del nivel y estacionamiento.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del espacio a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Espacio eliminado correctamente.',
    type: EspacioResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'El espacio no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Delete('me/espacios/:id')
  async eliminarEspacio(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<EspacioResponseDto> {
    return this.eliminarEspacioAction.execute(id, user.userId);
  }
}
