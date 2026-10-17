import { useState } from 'react';
import { useAuthStore } from '../../../../store/useAuthStore';
import { LoginUseCase } from '../../application/LoginUseCase';
import { RegisterUseCase } from '../../application/RegisterUseCase';
import type { User } from '../../domain/User';
import { HttpAuthRepository } from '../../infrastructure/HttpAuthRepository';

const authRepository = new HttpAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const registerUseCase = new RegisterUseCase(authRepository);

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const loginState = useAuthStore(state => state.loginState);

    const login = async (email: string, password: string): Promise<User | null> => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const user = await loginUseCase.execute(email, password);
            if (user.token) {
                loginState(user, user.token);
            }
            setSuccess('¡Inicio de sesión exitoso! Redirigiendo a tu panel...');
            return user;
        } catch (err: unknown) {
            const e = err as Error;
            setError(e.message || 'Error al iniciar sesión');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }): Promise<User | null> => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const user = await registerUseCase.execute(userData);
            if (user.token) {
                loginState(user, user.token);
            }
            setSuccess('¡Cuenta registrada con éxito! Ingresa el código de verificación enviado a tu correo.');
            return user;
        } catch (err: unknown) {
            const e = err as Error;
            setError(e.message || 'Error al registrar usuario');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (email: string, code: string): Promise<User | null> => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const user = await authRepository.verifyOtp(email, code);
            if (user.token) {
                loginState(user, user.token);
            }
            setSuccess('¡Correo verificado con éxito! Redirigiendo a tu panel...');
            return user;
        } catch (err: unknown) {
            const e = err as Error;
            setError(e.message || 'Error al verificar el código');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async (email: string): Promise<boolean> => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const res = await authRepository.resendOtp(email);
            setSuccess(res.message);
            return true;
        } catch (err: unknown) {
            const e = err as Error;
            setError(e.message || 'Error al reenviar el código');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const { user, isAuthenticated, logoutState } = useAuthStore();

    const logout = () => {
        logoutState();
    };

    return {
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
        user,
        isAuthenticated,
        loading,
        error,
        success,
        setError,
        setSuccess,
    };
};
