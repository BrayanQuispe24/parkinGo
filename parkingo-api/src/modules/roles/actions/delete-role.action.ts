import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";

@Injectable()
export class DeleteRoleAction {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(id: string): Promise<RoleEntity> {
        const role = await this.roleRepository.delete(id);
        return role;
    }
}