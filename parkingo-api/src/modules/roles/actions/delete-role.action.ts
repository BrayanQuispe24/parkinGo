import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../database/prisma/prisma.service.js";
import { RoleEntity } from "../entities/role.entity.js";
import { RoleRepository } from "../repositories/role.repository.js";

@Injectable()
export class DeleteRoleAction {
    constructor(private readonly roleRepository: RoleRepository) { }

    async execute(id: string): Promise<RoleEntity> {
        const role = await this.roleRepository.findById(id);
        if (role.name === "SUPERADMIN") {
            throw new ForbiddenException("No esta permitido eliminar el rol base del sistema(SUPERADMIN).");
        }
        return this.roleRepository.delete(id);
    }
}