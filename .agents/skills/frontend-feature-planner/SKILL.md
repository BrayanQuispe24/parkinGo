---
name: frontend-feature-planner
description: Protocolo estricto para planificar y estructurar cualquier funcionalidad frontend en ParkinGo. Establece el flujo secuencial obligatorio de análisis (1. Requerimiento funcional, 2. Librerías de estado y red, 3. Arquitectura por capas Domain/Infra/App/Presentation), tolerancia cero al tipo "any", ciclo de iteración de errores y plan previo supervisable.
metadata:
  short-description: "Flujo de arquitectura frontend, gestión de estados y resolución iterativa sin any"
  author: ParkinGo Team
---

# Frontend Feature Planner: Arquitectura, Estados e Implementación Iterativa

Este protocolo rige de forma obligatoria el desarrollo de cualquier vista, componente, hook o funcionalidad en el frontend de ParkinGo (`parking-go-front`).

---

## 🛑 Principio Cero: "Plan Supervisado Primero"

> **MANDATO ESTRICTO:**  
> Antes de generar o editar código, es **obligatorio** presentar al usuario el **Plan de Implementación** siguiendo el flujo de 3 fases y esperar su confirmación o feedback.

---

## 🧭 Flujo de Análisis e Implementación en 3 Fases

Cualquier cambio o desarrollo en frontend debe pasar por este orden secuencial inalterable:

```
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: Análisis Funcional y Alcance                       │
│ (Casos de uso, requerimientos, interacción de usuario)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: Análisis de Librerías y Gestión de Estado           │
│ (Zustand: cliente | TanStack Query: servidor | Axios: red)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: Arquitectura por Capas (Clean / Hexagonal)          │
│ (Domain -> Infrastructure -> Application -> Presentation)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ FASE 4: Ciclo de Iteración de Errores y Tolerancia Cero any │
│ (npx tsc --noEmit -> corrección -> build -> verificación)   │
└─────────────────────────────────────────────────────────────┘
```

---

### FASE 1: Análisis de la Funcionalidad a Implementar
1. **Propósito**: ¿Qué problema resuelve la funcionalidad para el usuario (Conductor, Admin de Parqueo, Admin General, etc.)?
2. **Entradas y Salidas**: Qué datos introduce el usuario y qué feedback visual debe recibir.
3. **Casos borde**: Estados vacíos (*empty states*), estados de carga (*skeletons/spinners*), errores de red y validaciones de formulario.

---

### FASE 2: Análisis de Gestión de Estados y Librerías

Evaluar obligatoriamente la participación y justificación de cada herramienta:

| Herramienta | Rol Arquitectónico | Cuándo SÍ utilizarla | Cuándo NO utilizarla |
| :--- | :--- | :--- | :--- |
| **Zustand** | **Client-State Global** | Estado de cliente que trasciende rutas (auth, sesión, tema, sidebar colapsado, preferencias de UI, selecciones globales). | **Nunca** para almacenar datos del servidor (evitar duplicar caché de APIs). Tampoco para estados locales de un solo componente. |
| **TanStack Query** | **Server-State & Caché** | Toda lectura (`useQuery`) o mutación (`useMutation`) contra el backend. Gestiona caché, revalidación, `staleTime`, reintentos e invalidación automática de queries. | No usar para estados efímeros de UI (dropdowns, tabs locales). **Prohibido** usar `useEffect + useState` para llamadas remotas. |
| **Axios (`parkingoApi`)** | **Infraestructura HTTP** | Para todas las peticiones remotas mediante [`src/core/api/parkingoApi.ts`](file:///home/brayan/Documentos/Proyectos/Chamba/parkinGo/parking-go-front/src/core/api/parkingoApi.ts) con interceptores Bearer JWT y control 401. | Nunca ejecutar `axios` o `fetch` sueltos directamente dentro de componentes visuales `.tsx`. |

---

### FASE 3: Arquitectura por Capas Frontend (Estructura de Carpetas)

Todo módulo en `src/modules/<modulo>/` debe organizarse bajo este esquema:

```
src/modules/<modulo>/
├── domain/                  # 1. CAPA DE DOMINIO (Modelos puros)
│   ├── [Entidad].ts         # Interfaces TypeScript estrictas. PROHIBIDO "any".
│   └── [Entidad]Repository.ts # Contrato / Interfaz abstracta del repositorio.
│
├── infrastructure/          # 2. CAPA DE INFRAESTRUCTURA (HTTP & DTOs)
│   ├── Http[Entidad]Repository.ts # Implementación que consume parkingoApi.
│   └── mappers/             # Mapeo de respuestas backend a modelos de dominio.
│
├── application/ (o hooks/)  # 3. CAPA DE APLICACIÓN (Casos de uso & Hooks)
│   ├── use[Entidad]Query.ts # Hook de consulta con TanStack Query (useQuery).
│   └── use[Accion]Mutation.ts # Hook de mutación con TanStack Query (useMutation).
│
└── presentation/            # 4. CAPA DE PRESENTACIÓN (UI)
    ├── pages/               # Vistas de página principales.
    ├── components/          # Componentes visuales desacoplados.
    └── layouts/             # Plantillas estructurales (Sidebar, Topbar, Canvas).
```

---

## 🛡️ Tolerancia Cero al Tipo `any`

1. **Tipado Estricto Obligatorio:**
   - Todo DTO de entrada, parámetro de función, valor de retorno y propiedad de componente debe estar tipado explícitamente.
   - Si una estructura externa es dinámica o desconocida, utilizar `unknown` junto con validaciones de tipo (*type guards*) o genéricos `<T>`, **nunca `any`**.
2. **Tipado en Formularios y Eventos:**
   - Tipar eventos de React (`React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`).
3. **Respuestas de Axios:**
   - Tipar siempre `parkingoApi.get<ApiResponse<T>>()` o definir interfaces que representen la forma exacta de la data.

---

## 🔄 Ciclo de Iteración para Solución de Errores

Antes de considerar concluida cualquier implementación:

1. **Chequeo de Tipos Estricto:**
   ```bash
   npx tsc --noEmit
   ```
   *Si surgen errores de tipo o interfaces incompletas, se debe iterar inmediatamente sobre el código hasta que el comando retorne código 0 sin advertencias.*

2. **Verificación de Bundle y Producción:**
   ```bash
   npm run build
   ```
   *Garantizar que Vite compile sin advertencias de resolución de assets o dependencias rotas.*

3. **Validación Visual y de Estilos:**
   *Confirmar que los componentes respeten la paleta oficial ParkinGo (`#063D25`, `#006D36`, `#22C55E`, `#FFFFFF`, `#F7F8F4`) y los estilos base de `dashboard.css`.*

---

## 📋 Plantilla Obligatoria del Plan de Implementación

Al recibir un requerimiento de frontend, responder siempre con esta estructura:

```markdown
### 📋 Plan de Implementación: [Nombre de la Funcionalidad]

#### 1. Análisis Funcional
- **Objetivo:** [Qué resuelve]
- **Casos de uso / Flujo del usuario:** [Pasos de interacción]
- **Estados de interfaz:** [Carga / Éxito / Error / Vacío]

#### 2. Matriz de Librerías y Estados
- **Zustand:** [¿Aplica? Sí / No] -> [Justificación técnica]
- **TanStack Query:** [¿Aplica? Sí / No] -> [Query keys, staleTime, invalidaciones tras mutación]
- **Axios (`parkingoApi`):** [¿Aplica? Sí / No] -> [Endpoints: GET / POST / PATCH / DELETE]

#### 3. Arquitectura y Archivos a Modificar / Crear
- **Domain (`domain/`):** Interfaces tipadas sin `any`.
- **Infrastructure (`infrastructure/`):** Repositorios HTTP con `parkingoApi`.
- **Application (`hooks/`):** Hooks `useQuery` o `useMutation`.
- **Presentation (`presentation/`):** Páginas y componentes con fidelidad de diseño.

#### 4. Estrategia de Tipado (Anti-`any`)
- [Listado de tipos/interfaces clave que garantizarán type-safety total]

#### 5. Plan de Verificación Iterativa
- Ejecución de `npx tsc --noEmit`.
- Verificación de build con `npm run build`.

---
> 💬 *¿Estás de acuerdo con este plan de implementación o deseas realizar algún ajuste antes de escribir el código?*
```
