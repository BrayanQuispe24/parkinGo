import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

export class LocalStorageAuthRepository implements AuthRepository {
    async login(email: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock verification
                if (!email || !password) {
                    reject(new Error('Credenciales inválidas'));
                } else {
                    const mockUser: User = {
                        email,
                        role: 'conductor', // default mock role
                        isLoggedIn: true
                    };
                    localStorage.setItem('parkingo_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                }
            }, 1200);
        });
    }

    async register(userData: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }): Promise<User> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser: User = {
                    email: userData.email,
                    role: userData.role,
                    fullname: userData.fullname,
                    estado: userData.estado,
                    sexo: userData.sexo,
                    birthdate: userData.birthdate,
                    ci: userData.ci,
                    createdAt: new Date().toISOString(),
                    isLoggedIn: true
                };
                localStorage.setItem('parkingo_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 1400);
        });
    }

    async verifyOtp(email: string, _code: string): Promise<User> {
        return {
            email,
            role: 'conductor',
            isLoggedIn: true,
            isVerified: true,
        };
    }

    async resendOtp(_email: string): Promise<{ success: boolean; message: string }> {
        return {
            success: true,
            message: 'Código reenviado en entorno de pruebas',
        };
    }
}

