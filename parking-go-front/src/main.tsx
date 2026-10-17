import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'
import './index.css'
import { useSettingsStore, applyGlobalSettingsToDOM } from './store/useSettingsStore';

// Aplicar configuración inicial de tema y escala de fuente
const initialSettings = useSettingsStore.getState();
applyGlobalSettingsToDOM(initialSettings.theme, initialSettings.fontSize);

// 1. Importaciones de TanStack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 2. Crea una instancia del cliente (fuera del componente para evitar recrearla)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita que haga peticiones al volver a la pestaña
      retry: 1, // Reintenta peticiones fallidas solo 1 vez
      staleTime: 1000 * 60 * 5, // La data se considera fresca por 5 minutos
    },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 3. Envuelve tu aplicación (RouterProvider) con el QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* DevTools (Solo aparecerá en desarrollo) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
