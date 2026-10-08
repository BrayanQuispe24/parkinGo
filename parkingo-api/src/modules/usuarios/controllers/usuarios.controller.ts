import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUsuarioAction } from "../actions/create-usuario.action.js";
import { GetUsuariosAction } from "../actions/get-usuarios.action.js";
import { GetUsuarioAction } from "../actions/get-usuario.action.js";
import { UpdateUsuarioAction } from "../actions/update-usuario.action.js";
import { DeleteUsuarioAction } from "../actions/delete-usuario.action.js";
import { CreateUsuarioDto } from "../dto/create-usuario.dto.js";
import { UpdateUsuarioDto } from "../dto/update-usuario.dto.js";
import { UsuarioMapper } from "../mappers/usuario.mapper.js";

@ApiTags('Usuarios')
@ApiBearerAuth() // Indica que todos los endpoints aquí (por convención) requieren token JWT
@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly createUsuarioAction: CreateUsuarioAction,
        private readonly getUsuariosAction: GetUsuariosAction,
        private readonly getUsuarioAction: GetUsuarioAction,
        private readonly updateUsuarioAction: UpdateUsuarioAction,
        private readonly deleteUsuarioAction: DeleteUsuarioAction,
    ) { }

    @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Devuelve una lista de todos los usuarios registrados en el sistema.' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll() {
        const users = await this.getUsuariosAction.execute();
        return {
            message: "Usuarios obtenidos exitosamente",
            data: { users: users.map(user => UsuarioMapper.toResponse(user)) }
        };
    }

    @ApiOperation({ summary: 'Obtener un usuario por ID', description: 'Busca y devuelve los detalles de un usuario específico.' })
    @ApiParam({ name: 'id', description: 'ID UUID del usuario', type: 'string' })
    @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.getUsuarioAction.execute(id);
        return {
            message: "Usuario obtenido exitosamente",
            data: { user: UsuarioMapper.toResponse(user) }
        };
    }

    //el create lo vamos a tener que suspender de este controlador ya que estamos usando el register
    //aunque seria bueno mantenerlo para la creacion de operadores de parqueos
    @ApiOperation({ summary: 'Crear usuario manual', description: 'Permite crear usuarios desde la administración (Ej: Operadores).' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateUsuarioDto) {
        const user = await this.createUsuarioAction.execute(dto);
        return {
            message: "Usuario creado exitosamente",
            data: { user: UsuarioMapper.toResponse(user) }
        };
    }

    @ApiOperation({ summary: 'Actualizar usuario', description: 'Actualiza los datos de un usuario existente por su ID.' })
    @ApiParam({ name: 'id', description: 'ID UUID del usuario', type: 'string' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioDto) {
        const user = await this.updateUsuarioAction.execute(id, dto);
        return {
            message: "Usuario actualizado exitosamente",
            data: { user: UsuarioMapper.toResponse(user) }
        };
    }

    @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina lógicamente o físicamente a un usuario por su ID.' })
    @ApiParam({ name: 'id', description: 'ID UUID del usuario', type: 'string' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.deleteUsuarioAction.execute(id);
        return {
            message: "Usuario eliminado exitosamente",
            data: { user: UsuarioMapper.toResponse(user) }
        };
    }
}
