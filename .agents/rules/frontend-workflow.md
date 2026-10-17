---
trigger: always_on
description: Regla de flujo de trabajo para el desarrollo frontend en ParkinGo. Exige el orden secuencial de análisis (Funcionalidad -> Librerías de Estado -> Arquitectura limpia), tipado estricto sin any, ciclo de iteración de errores y plan previo supervisable.
---

# Regla de Flujo de Trabajo Frontend: ParkinGo

Para cualquier requerimiento, mejora o funcionalidad en el frontend (`parking-go-front`):

### 1. Orden Secuencial Obligatorio del Análisis:
1. **Análisis Funcional:** Comprender a fondo qué problema resuelve, alcance y flujo del usuario.
2. **Análisis de Librerías y Gestión de Estados:**
   - **Zustand:** Exclusivo para client-state global (sesión, preferencias UI, modales globales). No usar para caché de servidor.
   - **TanStack Query (`@tanstack/react-query`):** Obligatorio para server-state (lecturas con `useQuery`, mutaciones con `useMutation`, invalidación de caché). Prohibido `useEffect + useState` para llamadas remotas.
   - **Axios (`parkingoApi`):** Toda llamada HTTP debe encapsularse en repositorios usando la instancia centralizada con interceptores JWT. Prohibido `axios` suelto en componentes `.tsx`.
3. **Arquitectura por Capas Frontend:**
   - `domain/`: Interfaces y entidades puras (**PROHIBIDO el uso de `any`**).
   - `infrastructure/`: Repositorios HTTP con `parkingoApi` y mapeadores.
   - `application/` (o `hooks/`): Custom hooks de consulta y mutación.
   - `presentation/`: Vistas y componentes con fidelidad total a la paleta y diseño (`dashboard.css`).

### 2. Plan de Implementación Previo Obligatorio:
- Antes de crear o editar código, presenta el **Plan de Implementación** estructurado según la skill `frontend-feature-planner`.
- Espera la supervisión, comentarios o confirmación del usuario antes de proceder a la edición del código.

### 3. Tolerancia Cero a `any` y Tipado Estricto:
- Tipar exhaustivamente props, eventos, parámetros y respuestas de endpoints. Usar `unknown` o genéricos `<T>` si el tipo es dinámico, nunca `any`.

### 4. Ciclo de Iteración para Solución de Errores:
- Tras cualquier cambio, ejecutar iteraciones de verificación:
  - `npx tsc --noEmit` (corregir hasta 0 errores).
  - `npm run build` (confirmar integridad del empaquetado).
