// src/modules/auth/infrastructure/HttpAuthRepository.ts
import { isAxiosError } from 'axios';
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { ApiResponse, LoginResponseData, RegisterResponseData } from '../data/auth.dto';
import { AuthMapper } from '../data/auth.mapper';
import type { AuthRepository } from '../domain/AuthRepository';
import type { User } from '../domain/User';

export class HttpAuthRepository implements AuthRepository {
    async login(email: string, password: string): Promise<User> {
        try {
            const response = await parkingoApi.post<ApiResponse<LoginResponseData>>('/auth/login', {
                email: email.trim(),
                password,
            });

            const data = response.data.data;
            const domainUser = AuthMapper.loginResponseToDomain(data);

            if (data.token) {
                localStorage.setItem('parkingo_token', data.token);
                localStorage.setItem('parkingo_user', JSON.stringify(domainUser));
            }

            return domainUser;
        } catch (error: unknown) {
            throw this.handleApiError(error, 'Error al iniciar sesión');
        }
    }

    async register(userData: Omit<User, 'isLoggedIn' | 'createdAt'> & { password: string }): Promise<User> {
        try {
            const payload = AuthMapper.formToRegisterDto(userData);
            let response;

            if (payload.document) {
                const formData = new FormData();
                formData.append('email', payload.email);
                formData.append('password', payload.password);
                formData.append('firstName', payload.firstName);
                formData.append('lastName', payload.lastName);
                formData.append('ci', payload.ci);
                formData.append('roleName', payload.roleName);
                if (payload.gender) formData.append('gender', payload.gender);
                if (payload.birthDate) formData.append('birthDate', payload.birthDate);
                if (payload.phone) formData.append('phone', payload.phone);
                formData.append('acceptedTerms', String(payload.acceptedTerms));
                formData.append('document', payload.document);

                response = await parkingoApi.post<ApiResponse<RegisterResponseData>>(
                    '/auth/register',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
            } else {
                response = await parkingoApi.post<ApiResponse<RegisterResponseData>>(
                    '/auth/register',
                    payload
                );
            }

            const registeredUser = AuthMapper.registerResponseToDomain(
                response.data.data,
                userData.role
            );

            return registeredUser;
        } catch (error: unknown) {
            throw this.handleApiError(error, 'Error al registrar el usuario');
        }
    }

    async verifyOtp(email: string, code: string): Promise<User> {
        try {
            const response = await parkingoApi.post<ApiResponse<LoginResponseData>>('/auth/verify-otp', {
                email: email.trim(),
                code: code.trim(),
            });

            const data = response.data.data;
            const domainUser = AuthMapper.loginResponseToDomain(data);

            if (data.token) {
                localStorage.setItem('parkingo_token', data.token);
                localStorage.setItem('parkingo_user', JSON.stringify(domainUser));
            }

            return domainUser;
        } catch (error: unknown) {
            throw this.handleApiError(error, 'Error al verificar el código OTP');
        }
    }

    async resendOtp(email: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await parkingoApi.post<ApiResponse<null>>('/auth/resend-otp', {
                email: email.trim(),
            });

            return {
                success: response.data.success,
                message: response.data.message || 'Código reenviado exitosamente',
            };
        } catch (error: unknown) {
            throw this.handleApiError(error, 'Error al reenviar el código');
        }
    }

    private handleApiError(error: unknown, fallbackMessage: string): Error {
        if (isAxiosError(error)) {
            const status = error.response?.status;
            const apiMessage = error.response?.data?.message;

            if (apiMessage) {
                if (Array.isArray(apiMessage)) {
                    return new Error(apiMessage.join('. '));
                }
                return new Error(String(apiMessage));
            }

            if (status === 401) {
                return new Error('Credenciales incorrectas. Verifique su correo y contraseña.');
            }
            if (status === 409 || status === 400) {
                return new Error('El correo o documento de identidad ya se encuentra registrado.');
            }
            if (status === 429) {
                return new Error('Demasiadas solicitudes. Por favor espere un momento antes de volver a intentar.');
            }
            if (error.code === 'ERR_NETWORK') {
                return new Error('No se pudo conectar con el servidor backend. Verifique que la API esté corriendo en el puerto 3000.');
            }
        }
        return new Error(error instanceof Error ? error.message : fallbackMessage);
    }
}
