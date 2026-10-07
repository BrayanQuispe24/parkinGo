import { PermissionEntity } from "../entities/permission.entity.js";

export abstract class PermissionRepository {
    abstract findAll(): Promise<PermissionEntity[]>;
}