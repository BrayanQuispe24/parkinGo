import { PermissionEntity } from "../entities/permission.entity.js";
import { PermissionRepository } from "./permission.repository.js";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { PermissionMapper } from "../mappers/permission.mapper.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {

    constructor(private readonly prisma: PrismaService) { }

    async findAll(): Promise<PermissionEntity[]> {
        const permissions = await this.prisma.permission.findMany();
        return permissions.map(permission => PermissionMapper.toDomain(permission)!);
    }
}