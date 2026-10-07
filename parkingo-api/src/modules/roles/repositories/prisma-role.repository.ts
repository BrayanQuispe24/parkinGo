import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleMapper } from "../mappers/role.mapper.js";
import { RoleRepository } from "./role.repository.js";

/**
 * Implementación concreta del repositorio de Roles usando Prisma ORM.
 * Se encarga de interactuar directamente con la base de datos
 * y usa los Mappers para devolver Entidades de Dominio en lugar de modelos de Prisma.
 */
@Injectable()
export class PrismaRoleRepository implements RoleRepository {
    constructor(private readonly prisma: PrismaService) { }
    async findAll(): Promise<RoleEntity[]> {
        const roles = await this.prisma.role.findMany({ include: { permissions: true } });
        return roles.map(role => RoleMapper.toDomain(role)!);
    }
    async findById(id: string): Promise<RoleEntity> {
        const role = await this.prisma.role.findUnique({
            where: { id },
            include: { permissions: true }
        });
        if (!role) throw new NotFoundException(`Role with ID "${id}" not found`);
        return RoleMapper.toDomain(role)!;
    }
    async update(id: string, name?: string, permissionIds?: string[]): Promise<RoleEntity> {
        try {
            const role = await this.prisma.role.update({
                where: { id },
                data: {
                    name,
                    permissions: permissionIds ? {
                        set: permissionIds.map(id => ({ id }))
                    } : undefined
                },
                include: { permissions: true }
            });
            return RoleMapper.toDomain(role)!;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`No se pudo actualizar: El rol con ID ${id} no existe.`);
            }
            throw error;
        }
    }
    async delete(id: string): Promise<RoleEntity> {
        try {
            const role = await this.prisma.role.delete({
                where: { id },
                include: { permissions: true }
            });
            return RoleMapper.toDomain(role)!;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`No se pudo eliminar: El rol con ID ${id} no existe.`);
            }
            throw error;
        }
    }

    /**
     * Crea un rol en la base de datos.
     * Convierte el resultado de Prisma a una Entidad de Dominio antes de retornarlo.
     */
    async create(name: string, permissionIds?: string[]) {

        const role = await this.prisma.role.create({
            data: {
                name,
                permissions: permissionIds ? {
                    connect: permissionIds.map(id => ({ id }))
                } : undefined
            },
            include: {
                permissions: true
            }
        });
        return RoleMapper.toDomain(role)!;
    }
}