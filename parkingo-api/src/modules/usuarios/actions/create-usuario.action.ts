import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from "../dto/create-usuario.dto.js";
import { UsuarioRepository } from "../repositories/usuario.repository.js";
import { RoleRepository } from "../../roles/repositories/role.repository.js";
import { MailerService } from "../../mailer/mailer.service.js";
import { EmailValidatorUtil } from "../../auth/utils/email-validator.util.js";

@Injectable()
export class CreateUsuarioAction {
    private readonly logger = new Logger(CreateUsuarioAction.name);

    constructor(
        private readonly usuarioRepository: UsuarioRepository,
        private readonly roleRepository: RoleRepository,
        private readonly mailerService: MailerService,
    ) { }

    async execute(dto: CreateUsuarioDto, requestingUserId?: string, requestingUserRoleId?: string) {
        if (!requestingUserRoleId) {
            throw new ForbiddenException("No se proporcionó el contexto del usuario solicitante.");
        }
        
        const requesterRole = await this.roleRepository.findById(requestingUserRoleId);
        if (!requesterRole) {
            throw new ForbiddenException("Rol del usuario solicitante no válido.");
        }

        // Regla: el general admin no puede crear cuentas
        if (requesterRole.name === 'GENERAL_ADMIN') {
            throw new ForbiddenException("Los administradores generales no tienen permiso para crear cuentas.");
        }

        const roleToAssign = await this.roleRepository.findById(dto.roleId);
        if (!roleToAssign) {
            throw new ConflictException("El rol que intentas asignar no existe.");
        }

        // Regla: solo el superadmin puede registrar a un general admin
        if (roleToAssign.name === 'GENERAL_ADMIN' && requesterRole.name !== 'SUPER_ADMIN') {
            throw new ForbiddenException("Solo el SUPER_ADMIN puede registrar a un GENERAL_ADMIN.");
        }

        // Regla: el PARKING_ADMIN / HOST solo puede crear usuarios con rol PARKING_OPERATOR u OPERATOR
        const isOperatorRole = roleToAssign.name === 'PARKING_OPERATOR' || roleToAssign.name === 'OPERATOR';
        if ((requesterRole.name === 'PARKING_ADMIN' || requesterRole.name === 'HOST') && !isOperatorRole) {
            throw new ForbiddenException("Los administradores de parqueo solo pueden registrar operadores de caseta.");
        }

        // 1. Validar que el correo no sea de un proveedor desechable o temporal
        if (EmailValidatorUtil.isDisposable(dto.email)) {
            throw new BadRequestException('No se permiten correos electrónicos temporales o desechables.');
        }

        // 2. Validar que el dominio tenga servidores de correo MX reales y activos
        const hasMx = await EmailValidatorUtil.hasValidMxRecords(dto.email);
        if (!hasMx) {
            throw new BadRequestException(
                'El dominio del correo electrónico no cuenta con un servidor de correo activo o válido.',
            );
        }

        // 3. Validar que el correo no exista en la base de datos
        const emailExists = await this.usuarioRepository.findByEmail(dto.email);
        if (emailExists) {
            throw new ConflictException(`El correo electrónico '${dto.email}' ya está registrado.`);
        }

        // 4. Validar que el CI no exista
        const ciExists = await this.usuarioRepository.findByCi(dto.ci);
        if (ciExists) {
            throw new ConflictException(`El número de identificación '${dto.ci}' ya está registrado.`);
        }

        // 5. Conservar contraseña en texto plano para el correo antes de hashear
        const rawPassword = dto.password;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 6. Asignar createdById si fue creado por un usuario administrativo
        const createdById = (requesterRole.name === 'PARKING_ADMIN' || requesterRole.name === 'HOST')
            ? requestingUserId
            : dto.createdById;

        const createdUser = await this.usuarioRepository.create({
            ...dto,
            password: hashedPassword,
            createdById,
            isVerified: true, // Usuarios creados administrativamente nacen verificados
        });

        // 7. Enviar correo formal con credenciales temporales al operador
        try {
            const operatorFullName = `${createdUser.firstName} ${createdUser.lastName}`.trim();
            await this.mailerService.sendOperatorWelcomeEmail(
                createdUser.email,
                operatorFullName,
                rawPassword,
            );
        } catch (mailError) {
            this.logger.warn(`No se pudo enviar el correo de bienvenida al operador ${createdUser.email}: ${mailError}`);
        }

        return createdUser;
    }
}
