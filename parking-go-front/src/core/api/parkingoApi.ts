import axios from 'axios';

export const parkingoApi = axios.create({
    // Asumiendo que el backend NestJS corre en el puerto 3000 y el prefijo global es /api
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para peticiones
parkingoApi.interceptors.request.use(
    (config) => {
        // Obtenemos el estado de autenticación desde el store de Zustand
        // Nota: En un entorno real, es mejor obtener el token del LocalStorage directamente
        // o del estado de Zustand sin provocar ciclos de importación.
        const token = localStorage.getItem('parkingo_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para respuestas
parkingoApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Manejar errores globales, por ejemplo token expirado (401)
        if (error.response?.status === 401) {
            console.error('No autorizado. Token expirado o inválido.');
            // Aquí podríamos llamar a logout() de nuestro store
            localStorage.removeItem('parkingo_token');
            localStorage.removeItem('parkingo_user');
            // Y redirigir al login
            window.location.href = '/auth?mode=login';
        }
        return Promise.reject(error);
    }
);
