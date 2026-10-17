import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

export class LoginUseCase {
    private authRepository: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async execute(email: string, password: string): Promise<User> {
        if (!email || !password) {
            throw new Error('Por favor complete el correo electrónico y la contraseña.');
        }
        return this.authRepository.login(email, password);
    }
}
