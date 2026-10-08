import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { UsuarioEntity } from "../entities/usuario.entity.js";
import { UsuarioMapper } from "../mappers/usuario.mapper.js";
import { UsuarioRepository } from "./usuario.repository.js";

@Injectable()
export class PrismaUsuarioRepository implements UsuarioRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<UsuarioEntity[]> {
        const users = await this.prisma.user.findMany({ include: { role: true } });
        return users.map(user => UsuarioMapper.toDomain(user));
    }

    async findById(id: string): Promise<UsuarioEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });
        if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);
        return UsuarioMapper.toDomain(user);
    }

    async findByEmail(email: string): Promise<UsuarioEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });
        return user ? UsuarioMapper.toDomain(user) : null;
    }

    async findByCi(ci: string): Promise<UsuarioEntity | null> {
        const user = await this.prisma.user.findUnique({
            where: { ci },
            include: { role: true }
        });
        return user ? UsuarioMapper.toDomain(user) : null;
    }

    async create(data: Partial<UsuarioEntity>): Promise<UsuarioEntity> {
        const user = await this.prisma.user.create({
            data: {
                email: data.email!,
                password: data.password!,
                firstName: data.firstName!,
                lastName: data.lastName!,
                ci: data.ci!,
                roleId: data.roleId!,
                gender: data.gender,
                phone: data.phone,
                photoUrl: data.photoUrl,
                birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
            },
            include: { role: true }
        });
        return UsuarioMapper.toDomain(user);
    }

    async update(id: string, data: Partial<UsuarioEntity>): Promise<UsuarioEntity> {
        try {
            const { email, password, isVerified, status, photoUrl, firstName, lastName, gender, ci, phone, roleId } = data;

            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    email,
                    password,
                    isVerified,
                    status,
                    photoUrl,
                    firstName,
                    lastName,
                    gender,
                    ci,
                    phone,
                    roleId,
                    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
                },
                include: { role: true }
            });
            return UsuarioMapper.toDomain(user);
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundException(`Usuario con ID ${id} no existe.`);
            throw error;
        }
    }


    async delete(id: string): Promise<UsuarioEntity> {
        try {
            const user = await this.prisma.user.delete({
                where: { id },
                include: { role: true }
            });
            return UsuarioMapper.toDomain(user);
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundException(`Usuario con ID ${id} no existe.`);
            throw error;
        }
    }
}
