// src/core/query/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

/**
 * Instancia única de QueryClient para habilitar limpieza total de caché al cerrar sesión.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
        },
    },
});
