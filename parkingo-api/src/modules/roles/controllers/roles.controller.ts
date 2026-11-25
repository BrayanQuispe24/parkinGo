import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateRoleAction } from "../actions/create-role.action.js";
import { GetRolesAction } from "../actions/get-roles.action.js";
import { CreateRoleDto } from "../dto/create-role.dto.js";
import { UpdateRoleDto } from "../dto/update-role.js";
import { UpdateRoleAction } from "../actions/update-role.action.js";
import { RoleMapper } from "../mappers/role.mapper.js";
import { DeleteRoleAction } from "../actions/delete-role.action.js";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../../auth/guards/roles.guard.js";
import { Roles } from "../../auth/decorators/roles.decorator.js";

/**
 * Controlador de Roles.
 * Es la capa de presentación que recibe las peticiones HTTP.
 * NO debe contener lógica de negocio, solo delegar a los Actions correspondientes.
 */
@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
    @ApiOperation({
        summary: 'Listar todos los roles',
        description: 'Obtiene el listado completo de roles registrados en el sistema junto con sus permisos asociados.',
    })
    @ApiResponse({ status: 200, description: 'Roles obtenidos exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Requiere privilegios administrativos.' })
    @Roles('SUPER_ADMIN', 'GENERAL_ADMIN', 'PARKING_ADMIN')
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
    @ApiOperation({
        summary: 'Crear un nuevo rol',
        description: 'Registra un rol personalizado en la base de datos con un conjunto opcional de permisos asignados. Exclusivo para SUPER_ADMIN.',
    })
    @ApiResponse({ status: 201, description: 'Rol creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de validación del rol inválidos.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Solo SUPER_ADMIN puede crear roles.' })
    @ApiResponse({ status: 409, description: 'Ya existe un rol con el nombre proporcionado.' })
    @Roles('SUPER_ADMIN')
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

    @ApiOperation({
        summary: 'Actualizar un rol existente',
        description: 'Modifica el nombre o el conjunto de permisos asignados a un rol específico por su UUID. Exclusivo para SUPER_ADMIN.',
    })
    @ApiParam({ name: 'id', description: 'UUID del rol a actualizar', type: 'string' })
    @ApiResponse({ status: 200, description: 'Rol actualizado exitosamente.' })
    @ApiResponse({ status: 400, description: 'UUID o payload de actualización inválido.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Exclusivo para SUPER_ADMIN.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado con el UUID provisto.' })
    @Roles('SUPER_ADMIN')
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
    
    @ApiOperation({
        summary: 'Eliminar un rol del sistema',
        description: 'Elimina de forma permanente o lógica un rol existente por su UUID. Exclusivo para SUPER_ADMIN.',
    })
    @ApiParam({ name: 'id', description: 'UUID del rol a eliminar', type: 'string' })
    @ApiResponse({ status: 200, description: 'Rol eliminado exitosamente.' })
    @ApiResponse({ status: 400, description: 'UUID inválido.' })
    @ApiResponse({ status: 401, description: 'No autenticado o token JWT inválido.' })
    @ApiResponse({ status: 403, description: 'Acceso denegado. Exclusivo para SUPER_ADMIN.' })
    @ApiResponse({ status: 404, description: 'Rol no encontrado.' })
    @ApiResponse({ status: 409, description: 'No se puede eliminar un rol asignado a usuarios activos.' })
    @Roles('SUPER_ADMIN')
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