import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'
import './index.css'
import { useSettingsStore, applyGlobalSettingsToDOM } from './store/useSettingsStore';

// Aplicar configuración inicial de tema y escala de fuente
const initialSettings = useSettingsStore.getState();
applyGlobalSettingsToDOM(initialSettings.theme, initialSettings.fontSize);

// 1. Importaciones de TanStack Query y QueryClient compartido
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './core/query/queryClient';
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
