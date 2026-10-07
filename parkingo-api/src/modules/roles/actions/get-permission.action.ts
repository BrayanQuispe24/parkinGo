import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "../repositories/permission.repository.js";
import { PermissionEntity } from "../entities/permission.entity.js";

@Injectable()
export class GetPermissionAction {
    constructor(private readonly permissionRepository: PermissionRepository) { }

    async execute(): Promise<PermissionEntity[]> {
        return this.permissionRepository.findAll();
    }
}