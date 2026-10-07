---
name: clean-architecture-react
description: Instrucciones estrictas de Arquitectura Limpia (Clean Architecture) para proyectos de React con TypeScript. Define reglas de capas, dependencias y estructura de directorios.
---

# Clean Architecture en React + TypeScript

Como asistente de IA, **DEBES aplicar estrictamente** las reglas de esta skill cuando generes, refactorices o sugieras código en este proyecto.

## 1. Reglas de Oro (Principios Fundamentales)

1. **Regla de Dependencia**: Las dependencias SIEMPRE apuntan hacia el interior.
   - `domain` no depende de NADA (ni de React, ni de Axios, ni de otras capas).
   - `application` depende solo de `domain`.
   - `infrastructure` y `presentation` dependen de `application` y `domain`.
2. **Cero React en Reglas de Negocio**: `domain` y `application` NO DEBEN importar nada de `'react'`, `'react-dom'` ni librerías de UI o red. Son puro TypeScript y lógica agnóstica.
3. **Inversión de Dependencias (DIP)**: `application` debe interactuar con las bases de datos o APIs a través de **interfaces** (contratos) definidos en `domain`. `infrastructure` implementa esas interfaces.

## 2. Estructura de Capas y Carpetas

Organiza el código por **Módulos / Funcionalidades (Features)** dentro de `src/modules/`:

```text
src/
├── core/                        # Utilidades compartidas (HttpClient, Errores Globales, DI Container)
└── modules/
    └── [nombre-modulo]/
        ├── domain/              # Capa 1: Entidades, Value Objects, Interfaces (Repositorios)
        │   ├── models/
        │   └── repositories/
        ├── application/         # Capa 2: Casos de Uso (Use Cases)
        │   └── useCases/
        ├── infrastructure/      # Capa 3: Implementación de repositorios, DTOs, APIs (Axios/Fetch)
        │   ├── dtos/
        │   └── repositories/
        └── presentation/        # Capa 4: React Components, Hooks, Views
            ├── components/
            ├── hooks/           # Integración entre React y los Casos de Uso
            └── pages/           # Vistas principales atadas a las rutas
```

## 3. Patrones y Plantillas por Capa

### A. Capa de Dominio (`domain`)
Define los contratos y entidades de tu dominio sin conocer el exterior.
```typescript
// domain/models/User.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

// domain/repositories/UserRepository.ts
import { User } from '../models/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
}
```

### B. Capa de Aplicación (`application`)
Coordina el flujo de datos usando las interfaces del dominio. Recibe sus dependencias en el constructor.
```typescript
// application/useCases/GetUsersUseCase.ts
import { User } from '../../domain/models/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return this.userRepository.getAll();
  }
}
```

### C. Capa de Infraestructura (`infrastructure`)
Implementa los repositorios reales para comunicarse con las APIs, transformando los datos recibidos (DTOs) en modelos de Dominio.
```typescript
// infrastructure/repositories/ApiUserRepository.ts
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/models/User';

export class ApiUserRepository implements UserRepository {
  async getAll(): Promise<User[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    // Mapeo: DTO (Backend) -> Entidad (Dominio)
    return data.map((dto: any) => ({ id: dto.id_number, name: dto.full_name, email: dto.email }));
  }
  
  async getById(id: string): Promise<User | null> {
    return null;
  }
}
```

### D. Capa de Presentación (`presentation`)
Maneja el estado local y la vista. Utiliza **Custom Hooks** o **Loaders de React Router** para ejecutar los Casos de Uso instanciando las dependencias.
```typescript
// presentation/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '../../domain/models/User';
import { GetUsersUseCase } from '../../application/useCases/GetUsersUseCase';
import { ApiUserRepository } from '../../infrastructure/repositories/ApiUserRepository';

// Idealmente inyectado vía un Contenedor de Dependencias o Context global
const repository = new ApiUserRepository();
const getUsersUseCase = new GetUsersUseCase(repository);

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getUsersUseCase.execute()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
```

## 4. Instrucciones para el Agente (Checklist de Validación)

Antes de terminar tu turno generando o refactorizando código bajo esta arquitectura, revisa:
1. ¿El archivo en `domain` o `application` tiene imports de UI, red, o framework específico? Si es así, **corrígelo**.
2. ¿El componente React (`.tsx`) está haciendo un `fetch` directo a la API? **Cámbialo** para que use un `UseCase` a través de un Hook o un `Loader` de React Router.
3. ¿Se está devolviendo a la vista de React el mismo DTO asqueroso de la API? **Cámbialo**, asegúrate de que se mapeó a una entidad de Dominio en la capa de `infrastructure`.
4. Los nombres de carpetas deben estar en minúsculas y seguir la convención establecida en esta guía.
