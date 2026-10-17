import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";

@Injectable()
export class DeleteRoleAction {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(id: string): Promise<RoleEntity> {
        const role = await this.roleRepository.findById(id);
        if (role.name === "SUPER_ADMIN") {
            throw new ForbiddenException("No esta permitido eliminar el rol base del sistema(SUPER_ADMIN).");
        }
        return this.roleRepository.delete(id);
    }
}