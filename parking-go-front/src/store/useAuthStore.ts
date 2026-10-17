import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../modules/auth/domain/User';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    
    // Acciones
    loginState: (user: User, token: string) => void;
    logoutState: () => void;
    updateUserProfile: (updatedFields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,

            loginState: (user, token) => {
                localStorage.setItem('parkingo_token', token);
                set({ user, isAuthenticated: true, token });
            },
            
            logoutState: () => {
                localStorage.removeItem('parkingo_token');
                localStorage.removeItem('parkingo_user');
                set({ user: null, isAuthenticated: false, token: null });
            },

            updateUserProfile: (updatedFields) => {
                set((state) => {
                    if (!state.user) return state;
                    const updatedUser = {
                        ...state.user,
                        ...updatedFields,
                        fullname: updatedFields.firstName || updatedFields.lastName
                            ? `${updatedFields.firstName ?? state.user.firstName ?? ''} ${updatedFields.lastName ?? state.user.lastName ?? ''}`.trim()
                            : state.user.fullname,
                    };
                    return { ...state, user: updatedUser };
                });
            },
        }),
        {
            name: 'auth-storage', // Nombre para el localStorage
            // Solo guardaremos el usuario y si está autenticado
            partialize: (state) => ({ 
                user: state.user, 
                isAuthenticated: state.isAuthenticated, 
                token: state.token 
            }),
        }
    )
);
