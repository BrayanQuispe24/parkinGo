// src/modules/auth/data/auth.mapper.ts
import type { User } from '../domain/User';
import type { LoginResponseData, RegisterRequestDto, RegisterResponseData } from './auth.dto';

export class AuthMapper {
    /**
     * Mapea el rol de la interfaz de usuario al Enum esperado por el backend
     */
    static mapRoleToBackend(uiRole: string): string {
        switch (uiRole.toLowerCase()) {
            case 'conductor':
            case 'driver':
                return 'DRIVER';
            case 'anfitrion':
            case 'host':
                return 'HOST';
            case 'admin':
            case 'parking_admin':
            case 'administrador':
                return 'PARKING_ADMIN';
            default:
                return 'DRIVER';
        }
    }

    /**
     * Mapea el rol del backend al nombre legible o identificador del frontend
     */
    static mapRoleToFrontend(backendRole: string): string {
        switch (backendRole.toUpperCase()) {
            case 'DRIVER':
                return 'conductor';
            case 'HOST':
                return 'anfitrion';
            case 'PARKING_ADMIN':
                return 'admin';
            case 'PARKING_OPERATOR':
                return 'operador';
            default:
                return backendRole.toLowerCase();
        }
    }

    /**
     * Convierte la respuesta del Login de la API a la entidad de Dominio User
     */
    static loginResponseToDomain(data: LoginResponseData): User {
        const { user, token } = data;
        const fullname = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullname: fullname || user.email,
            role: user.role,
            roleId: user.roleId,
            ci: user.ci,
            gender: user.gender,
            phone: user.phone,
            token,
            isLoggedIn: true,
        };
    }

    /**
     * Convierte la respuesta de Registro a la entidad de Dominio User
     */
    static registerResponseToDomain(data: RegisterResponseData, originalRole: string): User {
        const fullname = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim();

        return {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            fullname: fullname || data.email,
            role: data.role ?? originalRole,
            roleId: data.roleId,
            status: data.status,
            isVerified: data.isVerified ?? false,
            requiresVerification: true,
            requiresDocumentReview: data.requiresDocumentReview ?? false,
            isLoggedIn: false,
        };
    }

    /**
     * Mapea los datos del formulario de registro del frontend al DTO esperado por la API
     */
    static formToRegisterDto(
        userData: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }
    ): RegisterRequestDto {
        // Desglosar fullname en firstName y lastName
        let firstName = userData.firstName || '';
        let lastName = userData.lastName || '';

        if (!firstName && userData.fullname) {
            const parts = userData.fullname.trim().split(/\s+/);
            if (parts.length === 1) {
                firstName = parts[0];
                lastName = parts[0]; // Fallback para satisfacer @IsNotEmpty en lastName
            } else if (parts.length === 2) {
                firstName = parts[0];
                lastName = parts[1];
            } else if (parts.length === 3) {
                firstName = parts[0];
                lastName = `${parts[1]} ${parts[2]}`;
            } else {
                firstName = `${parts[0]} ${parts[1]}`;
                lastName = parts.slice(2).join(' ');
            }
        }

        // Mapear género a 'M' | 'F' | 'U'
        let gender: 'M' | 'F' | 'U' | undefined;
        const g = (userData.gender || userData.sexo || '').toUpperCase();
        if (g === 'M' || g === 'F' || g === 'U') {
            gender = g as 'M' | 'F' | 'U';
        } else if (g === 'MASCULINO') {
            gender = 'M';
        } else if (g === 'FEMENINO') {
            gender = 'F';
        }

        return {
            email: userData.email.trim(),
            password: userData.password,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            ci: (userData.ci || '').trim(),
            roleName: this.mapRoleToBackend(userData.role),
            gender,
            birthDate: userData.birthDate || userData.birthdate || undefined,
            phone: userData.phone || undefined,
            acceptedTerms: Boolean(userData.acceptedTerms ?? true),
            document: userData.document,
        };
    }
}
