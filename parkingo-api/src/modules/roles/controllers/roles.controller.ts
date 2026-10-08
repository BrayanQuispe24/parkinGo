import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { CreateRoleAction } from "../actions/create-role.action.js";
import { GetRolesAction } from "../actions/get-roles.action.js";
import { CreateRoleDto } from "../dto/create-role.dto.js";
import { UpdateRoleDto } from "../dto/update-role.js";
import { UpdateRoleAction } from "../actions/update-role.action.js";
import { RoleMapper } from "../mappers/role.mapper.js";
import { DeleteRoleAction } from "../actions/delete-role.action.js";

/**
 * Controlador de Roles.
 * Es la capa de presentación que recibe las peticiones HTTP.
 * NO debe contener lógica de negocio, solo delegar a los Actions correspondientes.
 */
@Controller('roles')
export class RolesController {
    constructor(
        private readonly createRoleAction: CreateRoleAction,
        private readonly getRolesAction: GetRolesAction,
        private readonly updateRoleAction: UpdateRoleAction,
        private readonly deleteRoleAction: DeleteRoleAction,
    ) { }

    /**
   * GET /roles
   * Endpoint para obtener la lista de roles.
   */
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const roles = await this.getRolesAction.execute();
        return {
            message: "Roles obtenidos exitosamente",
            data: {
                roles: roles.map(role => RoleMapper.toEntity(role))
            }
        }
    }

    /**
     * POST /roles
     * Endpoint para crear un nuevo rol.
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateRoleDto) {
        const role = await this.createRoleAction.execute(dto);
        return {
            message: "Rol creado exitosamente",
            data: {
                role: RoleMapper.toEntity(role)
            }
        }
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
        const role = await this.updateRoleAction.execute(id, dto.name, dto.permissionsIds);
        return {
            message: "Rol actualizado exitosamente",
            data: {
                role: RoleMapper.toEntity(role)
            }
        }
    }
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const role = await this.deleteRoleAction.execute(id);
        return {
            message: "Rol eliminado exitosamente",
            data: {
                role: RoleMapper.toEntity(role)
            }
        }
    }
}
//aclarar que los pipe ya estane establecidos globalmente, por ese motivo no es necesario declararlos en cada metodod