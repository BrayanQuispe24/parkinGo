import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

export class RegisterUseCase {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(userData: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }): Promise<User> {
        if (!userData.fullname) throw new Error('Por favor ingrese su Nombre Completo.');
        if (!userData.email) throw new Error('Por favor ingrese un Correo Electrónico válido.');
        if (!userData.password || userData.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.');
        if (!userData.role) throw new Error('Por favor seleccione su Rol / Tipo de usuario.');
        if (!userData.sexo) throw new Error('Por favor seleccione su Sexo.');
        if (!userData.birthdate) throw new Error('Por favor ingrese su Fecha de Nacimiento.');
        if (!userData.ci) throw new Error('Por favor ingrese su Carnet de Identidad (C.I.).');

        return this.authRepository.register(userData);
    }
}
