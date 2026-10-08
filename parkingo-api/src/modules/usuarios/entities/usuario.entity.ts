import { RoleEntity } from "../../roles/entities/role.entity.js";

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED',
}

export enum UserGender {
    M = 'M',
    F = 'F',
    U = 'U',
}

export class UsuarioEntity {
    id: string;
    email: string;
    password?: string;
    isVerified: boolean;
    status: UserStatus;
    photoUrl?: string;
    firstName: string;
    lastName: string;
    gender?: UserGender;
    birthDate?: Date;
    ci: string;
    phone?: string;

    roleId: string;
    role?: RoleEntity;

    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<UsuarioEntity>) {
        Object.assign(this, partial);
    }
}
