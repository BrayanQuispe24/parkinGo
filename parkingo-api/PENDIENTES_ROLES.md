# 📝 Tareas Pendientes y Recordatorios de Aprendizaje

Este documento sirve como bitácora de lo que hemos aprendido sobre el manejo de base de datos con Prisma y las tareas que nos faltan por implementar para terminar el sistema de validaciones.

---

## 📚 Recordatorio: Códigos de Error Comunes en Prisma

Cuando trabajamos con base de datos, Prisma nos habla mediante códigos. Estos son los que atrapamos en nuestro `PrismaClientExceptionFilter` (Filtro Global) o en los `try/catch` de los repositorios:

*   **`P2025` - Record Not Found:**
    *   *¿Cuándo pasa?* Intentamos buscar, actualizar o borrar un registro con un ID que no existe en la tabla.
    *   *Solución HTTP:* Devolver un **404 Not Found**.
*   **`P2002` - Unique Constraint Failed:**
    *   *¿Cuándo pasa?* Intentamos insertar o actualizar un dato en un campo que tiene la propiedad `@unique` (ej. si dos usuarios intentan registrar el mismo correo).
    *   *Solución HTTP:* Devolver un **409 Conflict**.
*   **`P2003` - Foreign Key Constraint Failed:**
    *   *¿Cuándo pasa?* Intentamos borrar un registro padre que tiene hijos que dependen de él (ej. intentar borrar el rol "CAJERO" cuando ya hay usuarios en el sistema que tienen asignado ese rol).
    *   *Solución HTTP:* Devolver un **409 Conflict** o **400 Bad Request** avisando que está en uso.

---

## 🚀 Lo que falta por implementar

Ya completamos la **Fase 1** (Try/Catch en Repositorios y Filtro Global). Aún nos quedan pendientes dos fases para que la API quede a nivel empresarial.

### 🟡 Fase 2: Validaciones de Transporte (Limpiar la basura)
*   [ ] Modificar los Controladores para usar `ParseUUIDPipe` en los `@Param('id')`. Esto bloqueará IDs que no tengan formato UUID antes de llegar a Prisma.
*   [ ] Instalar y usar `class-transformer` en nuestros DTOs (`CreateRoleDto` y `UpdateRoleDto`).
*   [ ] Usar `@Transform(({ value }) => value.trim().toUpperCase())` para limpiar los espacios extra de los nombres y guardarlos estandarizados en mayúsculas.
*   [ ] Añadir `@MinLength(3)` y `@MaxLength(30)` al nombre de los roles.

### 🟠 Fase 3: Reglas de Negocio Específicas (Actions)
*   [ ] Crear el método `findByName(name)` en el repositorio de roles.
*   [ ] Usar `findByName` en `CreateRoleAction` para rechazar la creación si un rol ya existe con ese nombre (evitar duplicados lógicos).
*   [ ] Modificar `DeleteRoleAction` y `UpdateRoleAction` para que **bloqueen** cualquier intento de borrar o modificar el rol principal del sistema (ej. `SUPERADMIN`), protegiendo el sistema de un auto-sabotaje.
*   [ ] *(Opcional)* Validar que los UUIDs enviados en `permissionsIds` realmente existan antes de intentar enlazarlos a un rol.
