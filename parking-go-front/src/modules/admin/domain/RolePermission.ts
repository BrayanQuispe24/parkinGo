// src/modules/admin/domain/RolePermission.ts

export interface PermissionItem {
    id: string;
    name: string;
    description?: string;
}

export interface RoleWithPermissions {
    id: string;
    name: string;
    permissions?: PermissionItem[];
}
