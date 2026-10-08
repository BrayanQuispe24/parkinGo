---
name: parkingo-nestjs-architecture
description: Guidelines and strict structure for building NestJS modules in the ParkinGo API project. Use this skill whenever creating new endpoints, modules, or refactoring the backend.
---

# ParkinGo NestJS Architecture Guidelines

When working on the ParkinGo API backend, you MUST strictly adhere to the following modular architecture. Avoid using generic, massive Services or Controllers. Separate responsibilities clearly.

## 1. Directory Structure

- `src/modules/<module-name>/`: Contains specific business logic, grouped by feature.
- `src/common/`: Shared components (decorators, guards, pipes, middlewares, interceptors, filters, exceptions, enums, types, utils).
- `src/database/`: Database access (Prisma connection, etc.).
- `src/config/`: App configuration (app, database, jwt).

## 2. Module Internal Structure (`src/modules/<module-name>/`)

For a module, e.g. `parkings`, use these subdirectories (omit those not needed for simple features, but keep the separation of concerns):
- `controllers/` - HTTP request handlers. Must remain very thin, delegating logic to Actions.
- `actions/` - Specific use cases (e.g., `create-parking.action.ts`). An action coordinates one specific workflow.
- `services/` - Reusable/complex logic shared across actions or modules (e.g., `parking-availability.service.ts`).
- `repositories/` - Data access abstraction. Contains the contract (abstract class, e.g. `parking.repository.ts`) and the Prisma implementation (`prisma-parking.repository.ts`).
- `dto/` - Request/Response structure definitions and validation (`class-validator` / `class-transformer`).
- `entities/` - Domain representation, distinct from raw Prisma models.
- `policies/` - Authorization rules over specific resources (e.g., "does this parking belong to this user's tenant?").
- `mappers/` - Static methods to convert data between Prisma models, Entities, and DTOs.
- `<module-name>.module.ts` - NestJS module wiring.

## 3. Development Workflow

Follow this sequence when building a new feature:
1. **Prisma Model**: Define the table structure in `prisma/schema.prisma`.
2. **Migration**: Generate migration (`npx prisma migrate dev --name <name>`).
3. **Entity**: Create the domain representation.
4. **DTO**: Define input/output validation.
5. **Repository**: Create Contract & Prisma Implementation.
6. **Mapper**: Write conversions (Prisma <-> Entity <-> DTO).
7. **Policy**: Define authorization rules (if applicable).
8. **Service**: Create if there is reusable logic.
9. **Action**: Implement the specific use case coordinating repositories and services.
10. **Controller**: Expose the endpoint and call the Action.
11. **Module**: Register controllers and providers.

## 4. Key Rules to Remember

- **Controllers:** Do NOT put business logic here. Only receive request, parse data, call Action, return response.
- **Actions vs Services:** Action = One specific use case (`CreateParkingAction`). Service = Reusable logic (`ParkingPricingService`).
- **Repositories:** Abstract DB logic behind a Repository interface. Implement it using `PrismaService`. The Action should depend on the Contract, not the Implementation directly.
- **Mappers:** Transform Prisma models to Entities, and Entities to DTOs here to avoid cluttering Actions and Controllers.
- **Guards vs Policies:** Guard = "Can the user access this endpoint?" (Role/JWT). Policy = "Can the user manipulate this specific resource?"
- **No Over-Architecture:** For extremely simple operations, `Controller -> Action -> Repository` is fine. Add Services and Policies only when complexity demands it.
- **API Documentation:** EVERY implemented endpoint MUST be documented using Swagger. Use `@ApiTags`, `@ApiOperation`, and `@ApiResponse` in Controllers, and `@ApiProperty` in DTOs to ensure a professional and complete API reference.
