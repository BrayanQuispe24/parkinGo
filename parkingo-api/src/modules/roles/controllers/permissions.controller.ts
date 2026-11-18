import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetPermissionAction } from '../actions/get-permission.action.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/guards/roles.guard.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';

@ApiTags('Permisos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('permissions')
export class PermissionsController {
    constructor(private readonly getPermissionAction: GetPermissionAction) { }

    @ApiOperation({ summary: 'Listar permisos disponibles', description: 'Exclusivo para SUPER_ADMIN y GENERAL_ADMIN.' })
    @ApiResponse({ status: 200, description: 'Permisos obtenidos exitosamente.' })
    @Roles('SUPER_ADMIN', 'GENERAL_ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const permissions = await this.getPermissionAction.execute();
        return {
            message: "Permisos obtenidos exitosamente",
            data: {
                permissions
            }
        }
    }
}

