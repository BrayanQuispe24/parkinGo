import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { RegistrarEstacionamientoDto } from '../dto/registrar-estacionamiento.dto.js';
import { ActualizarHorariosDto } from '../dto/actualizar-horarios.dto.js';
import {
  EstacionamientoResponseDto,
  FotoResponseDto,
} from '../dto/estacionamiento-response.dto.js';
import {
  RegistrarEstacionamientoAction,
  UploadedPhotoFile,
} from '../actions/registrar-estacionamiento.action.js';
import { GetMiEstacionamientoAction } from '../actions/get-mi-estacionamiento.action.js';
import { ActualizarHorariosAction } from '../actions/actualizar-horarios.action.js';
import { SubirFotosAction } from '../actions/subir-fotos.action.js';
import { EliminarFotoAction } from '../actions/eliminar-foto.action.js';

@ApiTags('Estacionamientos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('estacionamientos')
export class EstacionamientosController {
  constructor(
    private readonly registrarEstacionamientoAction: RegistrarEstacionamientoAction,
    private readonly getMiEstacionamientoAction: GetMiEstacionamientoAction,
    private readonly actualizarHorariosAction: ActualizarHorariosAction,
    private readonly subirFotosAction: SubirFotosAction,
    private readonly eliminarFotoAction: EliminarFotoAction,
  ) {}

  @ApiOperation({
    summary: 'Registrar solicitud de nuevo estacionamiento',
    description:
      'Exclusivo para Tenants (PARKING_ADMIN / HOST). Permite subir fotos, ubicación geográfica y horarios por día. El registro queda en estado PENDIENTE. Restricción: Solo se permite 1 estacionamiento por tenant.',
  })
  @ApiResponse({
    status: 201,
    description: 'Solicitud de estacionamiento registrada en estado PENDIENTE.',
    type: EstacionamientoResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto: El tenant ya cuenta con un estacionamiento registrado.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Datos del estacionamiento, horarios por día en JSON y fotos en archivos multipart',
    type: RegistrarEstacionamientoDto,
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('fotos', 10))
  @Post()
  async registrar(
    @Body() dto: RegistrarEstacionamientoDto,
    @UploadedFiles() fotos: UploadedPhotoFile[] = [],
    @CurrentUser() user: { userId: string },
  ): Promise<EstacionamientoResponseDto> {
    return this.registrarEstacionamientoAction.execute(
      dto,
      fotos,
      user.userId,
      dto.tenantId,
    );
  }

  @ApiOperation({
    summary: 'Consultar estacionamiento del tenant autenticado',
    description:
      'Retorna el estacionamiento perteneciente al tenant del usuario en sesión, incluyendo estado, fotos y horarios de atención. Retorna null si aún no ha registrado ninguno.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estacionamiento del tenant obtenido exitosamente o null.',
    type: EstacionamientoResponseDto,
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me')
  async getMiEstacionamiento(
    @CurrentUser() user: { userId: string },
  ): Promise<EstacionamientoResponseDto | null> {
    return this.getMiEstacionamientoAction.execute(user.userId);
  }

  @ApiOperation({
    summary: 'Actualizar horarios de atención del estacionamiento del tenant',
    description:
      'Permite al Administrador de Parqueo actualizar los horarios de apertura y cierre de su estacionamiento.',
  })
  @ApiResponse({
    status: 200,
    description: 'Horarios de atención actualizados exitosamente.',
    type: EstacionamientoResponseDto,
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @Put('me/horarios')
  async actualizarHorarios(
    @Body() dto: ActualizarHorariosDto,
    @CurrentUser() user: { userId: string },
  ): Promise<EstacionamientoResponseDto> {
    return this.actualizarHorariosAction.execute(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Subir nuevas fotografías a la galería del estacionamiento',
    description:
      'Permite al Administrador de Parqueo subir una o más imágenes a la galería de su estacionamiento.',
  })
  @ApiResponse({
    status: 201,
    description: 'Fotografías subidas exitosamente.',
    type: [FotoResponseDto],
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fotos: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('fotos', 10))
  @Post('me/fotos')
  async subirFotos(
    @UploadedFiles() fotos: UploadedPhotoFile[] = [],
    @CurrentUser() user: { userId: string },
  ): Promise<FotoResponseDto[]> {
    return this.subirFotosAction.execute(fotos, user.userId);
  }

  @ApiOperation({
    summary: 'Eliminar una fotografía de la galería del estacionamiento',
    description:
      'Elimina permanentemente una foto del estacionamiento del tenant.',
  })
  @ApiParam({
    name: 'fotoId',
    description: 'UUID de la fotografía a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Fotografía eliminada exitosamente.',
    type: FotoResponseDto,
  })
  @Roles('PARKING_ADMIN', 'HOST')
  @Delete('me/fotos/:fotoId')
  async eliminarFoto(
    @Param('fotoId') fotoId: string,
    @CurrentUser() user: { userId: string },
  ): Promise<FotoResponseDto> {
    return this.eliminarFotoAction.execute(fotoId, user.userId);
  }
}
