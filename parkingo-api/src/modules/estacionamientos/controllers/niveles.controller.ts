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

import { CreateNivelDto } from '../dto/create-nivel.dto.js';
import { NivelResponseDto } from '../dto/nivel-response.dto.js';

import { CrearNivelAction } from '../actions/crear-nivel.action.js';
import { GetMisNivelesAction } from '../actions/get-mis-niveles.action.js';
import { EliminarNivelAction } from '../actions/eliminar-nivel.action.js';

@ApiTags('Niveles')
@Controller('estacionamientos')
export class NivelesController {
  constructor(
    private readonly crearNivelAction: CrearNivelAction,
    private readonly getMisNivelesAction: GetMisNivelesAction,
    private readonly eliminarNivelAction: EliminarNivelAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar un nuevo nivel / piso en el estacionamiento',
    description:
      'Crea un nuevo nivel físico identificado por su código (ej. Piso 1, Sótano 1).',
  })
  @ApiResponse({
    status: 201,
    description: 'Nivel creado con éxito.',
    type: NivelResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un nivel con este código en el estacionamiento.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @Post('me/niveles')
  async crearNivel(
    @Body() dto: CreateNivelDto,
    @CurrentUser() user: { userId: string },
  ): Promise<NivelResponseDto> {
    return this.crearNivelAction.execute(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Listar todos los niveles de mi estacionamiento',
    description:
      'Retorna los pisos/niveles configurados para el estacionamiento del tenant con el conteo de espacios.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de niveles obtenida correctamente.',
    type: [NivelResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me/niveles')
  async getMisNiveles(
    @CurrentUser() user: { userId: string },
  ): Promise<NivelResponseDto[]> {
    return this.getMisNivelesAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Eliminar un nivel del estacionamiento',
    description:
      'Elimina el nivel. Si contiene espacios asociados, se rechaza la operación para preservar integridad.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del nivel a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Nivel eliminado exitosamente.',
    type: NivelResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar porque contiene espacios asignados.',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos sobre este nivel.',
  })
  @ApiResponse({
    status: 404,
    description: 'El nivel no existe.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Delete('me/niveles/:id')
  async eliminarNivel(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string },
  ): Promise<NivelResponseDto> {
    return this.eliminarNivelAction.execute(id, user.userId);
  }
}
