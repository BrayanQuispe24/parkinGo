import { User } from "@prisma/client";
import { UsuarioEntity } from "../entities/usuario.entity.js";
import { RoleMapper } from "../../roles/mappers/role.mapper.js";

export class UsuarioMapper {
    // Convierte el modelo de Prisma a nuestra Entidad de Dominio
    static toDomain(prismaUser: any): UsuarioEntity {
        return new UsuarioEntity({
            id: prismaUser.id,
            email: prismaUser.email,
            // Quitamos la contraseña por seguridad al devolver datos
            password: prismaUser.password,
            isVerified: prismaUser.isVerified,
            status: prismaUser.status,
            photoUrl: prismaUser.photoUrl,
            firstName: prismaUser.firstName,
            lastName: prismaUser.lastName,
            gender: prismaUser.gender,
            birthDate: prismaUser.birthDate,
            ci: prismaUser.ci,
            phone: prismaUser.phone,
            roleId: prismaUser.roleId,
            role: prismaUser.role ? (RoleMapper.toDomain(prismaUser.role) || undefined) : undefined
        });
    }

    static toEntity(user: UsuarioEntity): any {
        return {
            id: user.id,
            email: user.email,
            password: user.password,
            isVerified: user.isVerified,
            status: user.status,
            photoUrl: user.photoUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            birthDate: user.birthDate,
            ci: user.ci,
            phone: user.phone,
            roleId: user.roleId,
            role: user.role ? RoleMapper.toEntity(user.role) : undefined
        };
    }

    // Opcional: un método para ocultar la contraseña antes de enviar al frontend
    static toResponse(entity: UsuarioEntity): Omit<UsuarioEntity, 'password'> {
        const { password, ...userWithoutPassword } = entity;
        return userWithoutPassword;
    }
}
