import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';

import { GuardarCroquisDto } from '../dto/guardar-croquis.dto.js';
import { CroquisResponseDto } from '../dto/croquis-response.dto.js';

import { GetCroquisByNivelAction } from '../actions/get-croquis-by-nivel.action.js';
import { GuardarCroquisAction } from '../actions/guardar-croquis.action.js';
import { SubirFondoCroquisAction } from '../actions/subir-fondo-croquis.action.js';
import type { UploadedPhotoFile } from '../actions/registrar-estacionamiento.action.js';

@ApiTags('Croquis')
@Controller('estacionamientos')
export class CroquisController {
  constructor(
    private readonly getCroquisByNivelAction: GetCroquisByNivelAction,
    private readonly guardarCroquisAction: GuardarCroquisAction,
    private readonly subirFondoCroquisAction: SubirFondoCroquisAction,
  ) {}

  @ApiOperation({
    summary: 'Consultar el croquis / plano de un nivel específico',
    description:
      'Retorna la estructura visual serializada en JSON del croquis asociado al nivel de estacionamiento.',
  })
  @ApiParam({
    name: 'nivelId',
    description: 'UUID del nivel cuyo croquis se desea consultar',
  })
  @ApiResponse({
    status: 200,
    description: 'Croquis del nivel encontrado o null si aún no se ha diseñado.',
    type: CroquisResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @Get('me/niveles/:nivelId/croquis')
  async getCroquisByNivel(
    @Param('nivelId') nivelId: string,
    @CurrentUser() user: { userId: string },
  ): Promise<CroquisResponseDto | null> {
    return this.getCroquisByNivelAction.execute(nivelId, user.userId);
  }

  @ApiOperation({
    summary: 'Guardar o actualizar el croquis de un nivel',
    description:
      'Guarda las dimensiones del lienzo, fondo y la distribución espacial de nodos (boxes, muros, vías).',
  })
  @ApiParam({
    name: 'nivelId',
    description: 'UUID del nivel al que pertenece el croquis',
  })
  @ApiResponse({
    status: 200,
    description: 'Croquis guardado exitosamente.',
    type: CroquisResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.OK)
  @Put('me/niveles/:nivelId/croquis')
  async guardarCroquis(
    @Param('nivelId') nivelId: string,
    @Body() dto: GuardarCroquisDto,
    @CurrentUser() user: { userId: string },
  ): Promise<CroquisResponseDto> {
    return this.guardarCroquisAction.execute(nivelId, dto, user.userId);
  }

  @ApiOperation({
    summary: 'Subir imagen o plano arquitectónico de fondo para el croquis',
    description:
      'Permite subir un archivo de imagen (PNG, JPG, WEBP, SVG) que servirá de plano o textura de fondo en el lienzo del croquis.',
  })
  @ApiParam({
    name: 'nivelId',
    description: 'UUID del nivel al que se asociará la imagen de fondo',
  })
  @ApiResponse({
    status: 201,
    description: 'Imagen subida y asociada exitosamente al croquis.',
    type: CroquisResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARKING_ADMIN', 'HOST')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('me/niveles/:nivelId/croquis/fondo-imagen')
  async subirFondoCroquis(
    @Param('nivelId') nivelId: string,
    @UploadedFile() file: UploadedPhotoFile,
    @CurrentUser() user: { userId: string },
  ): Promise<CroquisResponseDto> {
    return this.subirFondoCroquisAction.execute(nivelId, file, user.userId);
  }
}

