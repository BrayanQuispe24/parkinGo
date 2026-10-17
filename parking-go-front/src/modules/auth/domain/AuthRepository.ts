import { type User } from './User';

export interface AuthRepository {
    login(email: string, password: string): Promise<User>;
    register(user: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }): Promise<User>;
    verifyOtp(email: string, code: string): Promise<User>;
    resendOtp(email: string): Promise<{ success: boolean; message: string }>;
}
