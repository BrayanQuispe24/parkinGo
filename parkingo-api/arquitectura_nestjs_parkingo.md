# Arquitectura NestJS para ParkinGo

## 1. Resumen general

Para que ParkinGo quede ordenado, escalable y consistente con NestJS, se recomienda utilizar una arquitectura modular por funcionalidad, complementada con:

- Actions
- Policies
- Repositories
- DTOs
- Entities
- Services
- Mappers
- Guards
- Pipes
- Middlewares
- Interceptors
- Filters
- Prisma
- PostgreSQL

La idea principal es separar responsabilidades y evitar concentrar toda la lógica en Controllers o Services gigantes.

---

## 2. Estructura general recomendada

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── tenants/
│   ├── parkings/
│   ├── parking-spaces/
│   ├── operators/
│   ├── reservations/
│   ├── vehicles/
│   ├── payments/
│   └── notifications/
│
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── pipes/
│   ├── middlewares/
│   ├── interceptors/
│   ├── filters/
│   ├── exceptions/
│   ├── enums/
│   ├── types/
│   └── utils/
│
├── database/
│   └── prisma/
│       ├── prisma.module.ts
│       └── prisma.service.ts
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── env.validation.ts
│
├── app.module.ts
└── main.ts
```

### Regla general

```text
modules/
→ lógica específica de cada funcionalidad

common/
→ componentes reutilizados por varios módulos

database/
→ conexión y acceso a la base de datos

config/
→ configuración general del sistema
```

---

# 3. Estructura interna de un módulo

Ejemplo para el módulo `parkings`:

```text
modules/
└── parkings/
    ├── controllers/
    │   └── parkings.controller.ts
    │
    ├── actions/
    │   ├── create-parking.action.ts
    │   ├── update-parking.action.ts
    │   ├── delete-parking.action.ts
    │   └── get-parking.action.ts
    │
    ├── services/
    │   ├── parking-availability.service.ts
    │   └── parking-pricing.service.ts
    │
    ├── repositories/
    │   ├── parking.repository.ts
    │   └── prisma-parking.repository.ts
    │
    ├── dto/
    │   ├── create-parking.dto.ts
    │   ├── update-parking.dto.ts
    │   ├── parking-response.dto.ts
    │   └── parking-filter.dto.ts
    │
    ├── entities/
    │   └── parking.entity.ts
    │
    ├── policies/
    │   └── parking.policy.ts
    │
    ├── mappers/
    │   └── parking.mapper.ts
    │
    ├── enums/
    │   └── parking-status.enum.ts
    │
    ├── interfaces/
    │   └── parking.interface.ts
    │
    └── parkings.module.ts
```

No todos los módulos necesitan obligatoriamente todas estas carpetas.

Un módulo simple puede contener solo:

```text
vehicles/
├── vehicles.controller.ts
├── vehicles.service.ts
├── dto/
└── vehicles.module.ts
```

Mientras que un módulo complejo como `reservations` sí puede necesitar prácticamente todas las capas.

---

# 4. Responsabilidad de cada archivo o carpeta

| Archivo / carpeta | Responsabilidad |
|---|---|
| `*.module.ts` | Registra Controllers, Providers, Repositories e imports del módulo |
| `controllers/` | Recibe las peticiones HTTP |
| `actions/` | Ejecuta un caso de uso específico |
| `services/` | Contiene lógica reutilizable o compleja |
| `repositories/` | Abstrae el acceso a los datos |
| `dto/` | Define datos de entrada y salida |
| `entities/` | Representa objetos del dominio |
| `policies/` | Define reglas de autorización sobre recursos |
| `mappers/` | Convierte datos entre Prisma, entidades y DTOs |
| `enums/` | Define valores cerrados como estados o tipos |
| `interfaces/` | Define contratos TypeScript auxiliares |
| `guards/` | Controla el acceso a rutas |
| `pipes/` | Valida o transforma datos |
| `middlewares/` | Procesa la request antes del Controller |
| `interceptors/` | Envuelve la ejecución y transforma respuestas |
| `filters/` | Centraliza el manejo de excepciones |

---

# 5. Controller

Archivo típico:

```text
parkings.controller.ts
```

Responsabilidad:

```text
recibir request
↓
extraer datos
↓
llamar Action
↓
devolver response
```

Ejemplo:

```ts
@Controller('parkings')
export class ParkingsController {
  constructor(
    private readonly createParking: CreateParkingAction,
  ) {}

  @Post()
  create(@Body() dto: CreateParkingDto) {
    return this.createParking.execute(dto);
  }
}
```

El Controller debe mantenerse delgado.

Evitar:

```ts
@Post()
async create() {
  // 100 líneas de lógica
}
```

---

# 6. DTO

Archivo típico:

```text
create-parking.dto.ts
```

Sirve para definir y validar los datos que entran a la aplicación.

```ts
export class CreateParkingDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  address: string;

  @IsInt()
  capacity: number;
}
```

En NestJS, el DTO junto con `ValidationPipe` cumple una función similar a un `FormRequest` de Laravel.

---

# 7. Entity

Archivo típico:

```text
parking.entity.ts
```

Representa el objeto del dominio:

```ts
export class ParkingEntity {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  status: ParkingStatus;
}
```

Es recomendable separar:

```text
Prisma Model
≠
Domain Entity
```

Esto desacopla el dominio de Prisma.

---

# 8. Repository

Se recomienda separar contrato e implementación.

## Contrato

```text
parking.repository.ts
```

```ts
export abstract class ParkingRepository {
  abstract create(
    parking: ParkingEntity,
  ): Promise<ParkingEntity>;

  abstract findById(
    id: string,
  ): Promise<ParkingEntity | null>;

  abstract update(
    parking: ParkingEntity,
  ): Promise<ParkingEntity>;

  abstract delete(
    id: string,
  ): Promise<void>;
}
```

## Implementación

```text
prisma-parking.repository.ts
```

```ts
@Injectable()
export class PrismaParkingRepository
  implements ParkingRepository {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findById(id: string) {
    const parking =
      await this.prisma.parking.findUnique({
        where: { id },
      });

    return ParkingMapper.toDomain(parking);
  }
}
```

Flujo:

```text
Action
↓
ParkingRepository
↓
PrismaParkingRepository
↓
Prisma
↓
PostgreSQL
```

---

# 9. Mapper

Archivo típico:

```text
parking.mapper.ts
```

Responsabilidad:

```text
Prisma
↓
Mapper
↓
Entity
```

o:

```text
Entity
↓
Mapper
↓
Response DTO
```

Ejemplo:

```ts
export class ParkingMapper {
  static toDomain(raw: any): ParkingEntity {
    return {
      id: raw.id,
      tenantId: raw.tenantId,
      name: raw.name,
      address: raw.address,
      status: raw.status,
    };
  }
}
```

El Mapper evita llenar Actions y Controllers de transformaciones.

---

# 10. Actions

Las Actions representan casos de uso específicos.

Ejemplo:

```text
create-parking.action.ts
```

```ts
@Injectable()
export class CreateParkingAction {
  constructor(
    private readonly parkingRepository:
      ParkingRepository,
  ) {}

  async execute(dto: CreateParkingDto) {
    // reglas
    // validaciones de negocio
    // servicios
    // repository
  }
}
```

Ejemplos de Actions:

```text
CreateParkingAction
UpdateParkingAction
DeleteParkingAction
GetParkingAction
AssignOperatorAction
ActivateParkingAction
DeactivateParkingAction
```

Esto evita tener un `parkings.service.ts` gigantesco.

### Regla

```text
Action
→ caso de uso concreto
```

---

# 11. Services

Los Services se usan para lógica reutilizable o compleja.

Ejemplos:

```text
ParkingAvailabilityService
ParkingPricingService
ReservationConflictService
PaymentCalculationService
```

Una Action puede coordinar varios Services:

```text
CreateReservationAction
        ↓
ParkingAvailabilityService
        ↓
ReservationPricingService
        ↓
ReservationRepository
```

### Regla

```text
Action
→ caso de uso

Service
→ lógica reutilizable
```

No es obligatorio usar Service en todos los flujos.

---

# 12. Policies

Archivo típico:

```text
parking.policy.ts
```

Sirve para reglas de autorización sobre un recurso.

```ts
@Injectable()
export class ParkingPolicy {
  canUpdate(
    user: UserEntity,
    parking: ParkingEntity,
  ): boolean {
    return user.tenantId === parking.tenantId;
  }
}
```

Ejemplo conceptual:

```text
Administrador A
↓
Parking B
↓
¿Parking B pertenece a su tenant?

Sí → continuar
No → Forbidden
```

---

# 13. Guards

Los Guards se utilizan principalmente para autorización a nivel de ruta.

Ejemplos:

```text
JwtAuthGuard
RolesGuard
TenantGuard
```

Flujo:

```text
Request
↓
JwtAuthGuard
↓
RolesGuard
↓
Controller
```

Ejemplo:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARKING_ADMIN)
@Post()
create() {}
```

---

# 14. Diferencia entre Policy y Guard

```text
Guard
→ ¿puede acceder a este endpoint?

Policy
→ ¿puede realizar esta acción sobre este recurso?
```

Ejemplo:

```text
RolesGuard
↓
¿Es administrador?
↓
Sí
↓
ParkingPolicy
↓
¿Este parqueo pertenece a su tenant?
↓
Sí
↓
Actualizar
```

---

# 15. Pipes

Los Pipes sirven principalmente para:

```text
validar
transformar
sanitizar
```

Ejemplo:

```ts
@Get(':id')
findOne(
  @Param('id', ParseUUIDPipe)
  id: string,
) {}
```

Configuración global recomendada:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Normalmente se configura en:

```text
main.ts
```

---

# 16. Middlewares

Los Middlewares procesan la request antes de llegar a Guards, Pipes o Controllers.

Ejemplos:

```text
RequestIdMiddleware
LoggerMiddleware
TenantContextMiddleware
```

Se pueden usar para:

- Logging
- Request ID
- Lectura de headers
- Contexto inicial del tenant
- Auditoría básica
- Datos generales de request

No se recomienda usar Middleware para roles o autorización específica.

Para eso se usan Guards.

---

# 17. Interceptors

Los Interceptors permiten envolver la ejecución del Controller.

Ejemplos:

```text
ResponseInterceptor
LoggingInterceptor
TimeoutInterceptor
```

Se pueden utilizar para estandarizar respuestas:

```json
{
  "success": true,
  "message": "Parking obtenido",
  "data": {}
}
```

Así se evita repetir la misma estructura en todos los Controllers.

---

# 18. Filters

Los Filters sirven para manejar excepciones de forma centralizada.

Ejemplo:

```text
http-exception.filter.ts
```

Una excepción:

```text
NotFoundException
```

puede convertirse en:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Parking no encontrado",
  "timestamp": "..."
}
```

Esto permite estandarizar los errores de toda la API.

---

# 19. Common

La carpeta `common` contiene componentes reutilizables por varios módulos.

```text
common/
├── decorators/
│   ├── current-user.decorator.ts
│   ├── roles.decorator.ts
│   └── public.decorator.ts
│
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── tenant.guard.ts
│
├── pipes/
│   └── parse-uuid.pipe.ts
│
├── middlewares/
│   ├── logger.middleware.ts
│   └── request-id.middleware.ts
│
├── interceptors/
│   └── response.interceptor.ts
│
├── filters/
│   └── http-exception.filter.ts
│
├── exceptions/
├── enums/
├── types/
└── utils/
```

### Regla

```text
common/
→ reutilizable por muchos módulos

modules/parkings/
→ específico del módulo Parkings
```

---

# 20. Database

Para ParkinGo se recomienda PostgreSQL con Prisma.

```text
database/
└── prisma/
    ├── prisma.module.ts
    └── prisma.service.ts
```

Flujo:

```text
NestJS
↓
PrismaService
↓
Prisma Client
↓
PostgreSQL
```

Los Repositories utilizan `PrismaService`.

---

# 21. Config

```text
config/
├── app.config.ts
├── database.config.ts
├── jwt.config.ts
└── env.validation.ts
```

Aquí se centralizan configuraciones como:

```text
DATABASE_URL
JWT_SECRET
PORT
NODE_ENV
CORS
```

Se evita utilizar directamente:

```ts
process.env.JWT_SECRET
```

por todo el proyecto.

---

# 22. Librerías principales recomendadas

| Necesidad | Librería |
|---|---|
| Framework | `@nestjs/core` |
| HTTP | `@nestjs/platform-express` |
| Configuración | `@nestjs/config` |
| Validaciones | `class-validator` |
| Transformación DTO | `class-transformer` |
| ORM | `prisma` |
| Prisma Client | `@prisma/client` |
| JWT | `@nestjs/jwt` |
| Passport | `@nestjs/passport` |
| Estrategia JWT | `passport-jwt` |
| Password hashing | `argon2` |
| Swagger | `@nestjs/swagger` |
| Seguridad HTTP | `helmet` |
| Rate limit | `@nestjs/throttler` |

Instalación:

```bash
npm install @nestjs/config
npm install class-validator class-transformer
npm install @prisma/client
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install argon2
npm install @nestjs/swagger
npm install helmet
npm install @nestjs/throttler
```

Prisma:

```bash
npm install -D prisma
```

Inicialización:

```bash
npx prisma init
```

Tipos de Passport JWT:

```bash
npm install -D @types/passport-jwt
```

---

# 23. Librerías adicionales que probablemente se necesitarán

## WebSockets / tiempo real

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io
```

Útil para:

- Disponibilidad en tiempo real
- Estados de plazas
- Notificaciones
- Cambios de ocupación

---

## Archivos

NestJS trabaja bien con Multer mediante:

```text
@nestjs/platform-express
```

Útil para:

- Fotos
- Documentos
- Comprobantes
- Imágenes de parqueos

---

## Correo

```bash
npm install @nestjs-modules/mailer nodemailer
```

Útil para:

- Confirmación de cuenta
- Recuperación de contraseña
- Notificaciones por correo
- Avisos de reserva

---

## Tareas programadas

```bash
npm install @nestjs/schedule
```

Útil para:

```text
Avisar que una reserva está terminando
Avisar vencimientos
Liberar reservas
Ejecutar comprobaciones
```

---

## Redis

Redis puede agregarse más adelante para:

- Cache
- Sesiones
- Rate limit distribuido
- Locks
- Colas
- Escalado horizontal
- Datos temporales
- Disponibilidad

---

# 24. Orden recomendado de implementación

No se recomienda comenzar directamente por los Controllers.

Orden sugerido:

```text
1. Requisitos
        ↓
2. Base de datos
        ↓
3. Modelo Prisma
        ↓
4. Migración
        ↓
5. Entity
        ↓
6. DTO
        ↓
7. Repository contract
        ↓
8. Repository implementation
        ↓
9. Mapper
        ↓
10. Policy
        ↓
11. Service
    (si es necesario)
        ↓
12. Action
        ↓
13. Controller
        ↓
14. Module
        ↓
15. Swagger
        ↓
16. Tests
```

---

# 25. Ejemplo de implementación de Crear Parqueo

## Paso 1: Modelo Prisma

```prisma
model Parking {
  id       String @id @default(uuid())
  name     String
  address  String
}
```

## Paso 2: Migración

```bash
npx prisma migrate dev --name create_parkings
```

## Paso 3: Entity

```text
ParkingEntity
```

## Paso 4: DTO

```text
CreateParkingDto
```

## Paso 5: Repository Contract

```text
ParkingRepository
```

## Paso 6: Repository Implementation

```text
PrismaParkingRepository
```

## Paso 7: Mapper

```text
ParkingMapper
```

## Paso 8: Policy

```text
ParkingPolicy
```

## Paso 9: Action

```text
CreateParkingAction
```

## Paso 10: Controller

```text
ParkingsController
```

## Paso 11: Module

```text
ParkingsModule
```

---

# 26. Flujo real de una petición

Ejemplo:

```http
POST /parkings
```

Flujo aproximado:

```text
React / Flutter
      │
      ▼
HTTP Request
      │
      ▼
Middleware
│
├── Request ID
└── Logging
      │
      ▼
Guard
│
├── JWT
├── Role
└── Tenant
      │
      ▼
Interceptor
      │
      ▼
Pipe
│
└── DTO Validation
      │
      ▼
Controller
      │
      ▼
Action
      │
      ├────────► Policy
      │
      ├────────► Service
      │           opcional
      │
      ▼
Repository
      │
      ▼
Prisma Repository
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
      │
      ▼
Mapper
      │
      ▼
Entity / Response DTO
      │
      ▼
Interceptor
      │
      ▼
HTTP Response
```

Si ocurre un error:

```text
Exception
   │
   ▼
Exception Filter
   │
   ▼
HTTP Error Response
```

---

# 27. Flujo mental para desarrollar una funcionalidad

Antes de programar una funcionalidad, responder:

```text
¿Qué quiere hacer el usuario?
        ↓
Action

¿Qué datos necesita?
        ↓
DTO

¿Qué reglas existen?
        ↓
Policy / Service

¿Qué información necesito guardar?
        ↓
Entity

¿Cómo accedo a esos datos?
        ↓
Repository

¿Cómo los guardo realmente?
        ↓
PrismaRepository

¿Cómo llegan desde HTTP?
        ↓
Controller

¿Quién conecta todo?
        ↓
Module
```

---

# 28. Ejemplo de módulo Reservations

```text
reservations/
├── controllers/
│   └── reservations.controller.ts
│
├── actions/
│   ├── create-reservation.action.ts
│   ├── cancel-reservation.action.ts
│   └── extend-reservation.action.ts
│
├── services/
│   ├── reservation-availability.service.ts
│   ├── reservation-price.service.ts
│   └── reservation-conflict.service.ts
│
├── repositories/
│   ├── reservation.repository.ts
│   └── prisma-reservation.repository.ts
│
├── dto/
│   ├── create-reservation.dto.ts
│   └── reservation-response.dto.ts
│
├── entities/
│   └── reservation.entity.ts
│
├── policies/
│   └── reservation.policy.ts
│
├── mappers/
│   └── reservation.mapper.ts
│
├── enums/
│   └── reservation-status.enum.ts
│
└── reservations.module.ts
```

Flujo:

```text
POST /reservations
        ↓
CreateReservationDto
        ↓
ValidationPipe
        ↓
JwtAuthGuard
        ↓
ReservationsController
        ↓
CreateReservationAction
        ↓
ReservationPolicy
        ↓
ReservationAvailabilityService
        ↓
ReservationPriceService
        ↓
ReservationRepository
        ↓
Prisma
        ↓
PostgreSQL
```

---

# 29. Equivalencias con Laravel

| Laravel | NestJS ParkinGo |
|---|---|
| Route | Controller decorator |
| Middleware | Middleware |
| FormRequest | DTO + ValidationPipe |
| Controller | Controller |
| Action | Action |
| Service | Service |
| Policy | Policy / Guard |
| Model | Entity / Prisma Model |
| Repository | Repository |
| Resource | Mapper + Response DTO |
| Service Provider | Module |
| Exception Handler | Exception Filter |
| Eloquent | Prisma |
| Artisan | Nest CLI |

Flujo típico en Laravel:

```text
Migración
→ Model
→ Request
→ DTO
→ Action
→ Service
→ Controller
```

Flujo propuesto en NestJS:

```text
Prisma schema
→ Migration
→ Entity
→ DTO
→ Repository
→ Mapper
→ Policy
→ Service opcional
→ Action
→ Controller
→ Module
```

---

# 30. Reglas arquitectónicas recomendadas

```text
Controller
→ no piensa, solo recibe y delega

Action
→ coordina un caso de uso

Service
→ encapsula lógica reutilizable

Policy
→ decide permisos sobre recursos

Guard
→ controla acceso a endpoints

Repository
→ define acceso a persistencia

Prisma Repository
→ implementa persistencia real

Mapper
→ transforma datos

Entity
→ representa el dominio

DTO
→ transporta y valida datos

Pipe
→ valida o transforma entrada

Middleware
→ procesa request antes del flujo Nest

Interceptor
→ envuelve ejecución y respuestas

Filter
→ maneja excepciones

Module
→ conecta y registra dependencias
```

---

# 31. Regla para evitar sobrearquitectura

No todas las operaciones tienen que usar todas las capas.

Una operación simple puede ser:

```text
Controller
↓
Action
↓
Repository
```

Una operación compleja puede ser:

```text
Controller
↓
Action
├── Policy
├── Service
├── Service
└── Repository
```

La arquitectura debe servir al sistema, no hacer que el sistema sirva a la arquitectura.

---

# 32. Conclusión

La arquitectura recomendada para ParkinGo con NestJS combina:

```text
Arquitectura modular
+
Actions
+
Services
+
Repositories
+
Policies
+
DTOs
+
Entities
+
Mappers
+
Guards
+
Pipes
+
Middlewares
+
Interceptors
+
Filters
+
Prisma
+
PostgreSQL
```

El objetivo es mantener cada responsabilidad separada, facilitar mantenimiento, escalabilidad, testing y evolución del sistema.

Esta estructura permite empezar modular y crecer sin necesidad de reorganizar todo el backend más adelante.
