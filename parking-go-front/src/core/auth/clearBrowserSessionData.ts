// src/core/auth/clearBrowserSessionData.ts
import { queryClient } from '../query/queryClient';

const USER_LOCAL_STORAGE_KEYS = [
    'parkingo_token',
    'parkingo_user',
    'auth-storage',
] as const;

/**
 * Elimina todos los datos almacenados en el navegador asociados al usuario actual
 * tras cerrar sesión o expirar el token (caché de servidor, storages y cookies locales).
 */
export const clearBrowserSessionData = (): void => {
    // 1. Cancelar peticiones activas y vaciar la caché de TanStack Query en memoria
    void queryClient.cancelQueries();
    queryClient.clear();

    if (typeof window === 'undefined') {
        return;
    }

    // 2. Eliminar claves de sesión, perfil y persistencia de Zustand en localStorage
    try {
        for (const key of USER_LOCAL_STORAGE_KEYS) {
            window.localStorage.removeItem(key);
        }

        const extraUserKeys: string[] = [];
        for (let i = 0; i < window.localStorage.length; i += 1) {
            const key = window.localStorage.key(i);
            if (!key) continue;
            if (
                key.startsWith('parkingo_user') ||
                key.startsWith('auth-') ||
                key.startsWith('driver_')
            ) {
                extraUserKeys.push(key);
            }
        }
        for (const key of extraUserKeys) {
            window.localStorage.removeItem(key);
        }
    } catch {
        // Ignorar si el almacenamiento local está bloqueado por política del navegador
    }

    // 3. Limpiar almacenamiento temporal de sesión
    try {
        window.sessionStorage.clear();
    } catch {
        // Ignorar si sessionStorage no está disponible
    }

    // 4. Expirar cookies no HttpOnly asociadas al dominio actual
    try {
        if (typeof document !== 'undefined' && document.cookie) {
            const cookies = document.cookie.split(';');
            for (const rawCookie of cookies) {
                const eqPos = rawCookie.indexOf('=');
                const name = (eqPos > -1 ? rawCookie.slice(0, eqPos) : rawCookie).trim();
                if (!name) continue;
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            }
        }
    } catch {
        // Ignorar errores de acceso a cookies
    }
};
