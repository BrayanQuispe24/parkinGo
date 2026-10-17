---
trigger: always_on
description: Regla obligatoria de flujo de trabajo y arquitectura para el backend (parkingo-api). Exige el uso y actualización obligatoria del grafo backend_graph.json, separación estricta de capas (Controller -> Action -> Repository -> Prisma), documentación Swagger y verificación de compilación.
---

# Regla de Flujo de Trabajo Backend: ParkinGo (`parkingo-api`)

Para cualquier requerimiento, endpoint, mejora o nuevo módulo en el backend (`parkingo-api`), se deben cumplir estrictamente las siguientes directrices:

### 1. Mantenimiento Obligatorio del Grafo de Arquitectura (`backend_graph.json`):
- **Registro de Nuevos Módulos y Endpoints:** Cada vez que se cree un nuevo módulo, endpoint, acción o repositorio, es **OBLIGATORIO** registrar o actualizar su nodo y dependencias en [backend_graph.json](file:///home/brayan/Documentos/Proyectos/Chamba/parkinGo/parkingo-api/backend_graph.json).
- **Consulta Previa para Cambios:** Antes de modificar lógica existente, consultar el grafo para ubicar quirúrgicamente los archivos involucrados (Action, DTO, Repository, Mapper) evitando exploraciones ciegas que consuman tokens innecesarios.

### 2. Arquitectura Modular y Separación de Responsabilidades:
Todo módulo en `src/modules/<modulo>/` debe seguir la estructura estándar desacoplada:
1. **Controllers (`controllers/`):** Controladores delgados. Solo reciben la request, validan con DTOs, delegan al `Action` correspondiente y retornan la respuesta. Prohibido colocar lógica de negocio en controllers.
2. **Actions (`actions/`):** **1 caso de uso = 1 archivo Action** (Principio de Responsabilidad Única, ej. `create-parking.action.ts`). Orquesta validaciones de dominio, llamadas a repositorios y servicios.
3. **Services (`services/`):** Exclusivo para lógica de negocio transversal, compartida o cálculos complejos reutilizables entre múltiples acciones.
4. **Repositories (`repositories/`):** Capa de persistencia desacoplada. Contiene la interfaz abstracta (`<modulo>.repository.ts`) y su implementación concreta con Prisma (`prisma-<modulo>.repository.ts`). Las acciones deben depender del contrato/interfaz abstracta.
5. **Mappers (`mappers/`):** Métodos estáticos puros para convertir entre modelos Prisma, Entities de dominio y DTOs de respuesta.
6. **DTOs (`dto/`):** Tipado y validación rigurosa con `class-validator` y `class-transformer`.
7. **Policies & Guards:** Guards para acceso/roles a nivel de endpoint (`JwtAuthGuard`, `RolesGuard`); Policies para autorización granular sobre recursos específicos.

### 3. Documentación OpenAPI / Swagger Obligatoria:
- Todo endpoint nuevo o modificado debe estar exhaustivamente documentado:
  - `@ApiTags('<nombre-modulo>')`
  - `@ApiOperation({ summary: '...' })`
  - `@ApiResponse({ status: 200, ... })`
  - Todos los campos en DTOs deben tener `@ApiProperty()` con descripciones claras.

### 4. Ciclo de Verificación y Compilación:
- Tras cualquier cambio en `parkingo-api`:
  1. Si hay cambios en `prisma/schema.prisma`: ejecutar `npx prisma generate` y la migración correspondiente.
  2. Ejecutar `npm run build` o `npx tsc --noEmit` en `parkingo-api` para garantizar 0 errores de compilación y tipos.
