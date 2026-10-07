import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GetPermissionAction } from '../actions/get-permission.action.js';
import { PermissionEntity } from '../entities/permission.entity.js';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly getPermissionAction: GetPermissionAction) { }

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
