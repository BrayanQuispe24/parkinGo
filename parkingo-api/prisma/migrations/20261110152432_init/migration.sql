-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING_APPROVAL', 'INACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "DocumentVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('M', 'F', 'U');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoEstacionamiento" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'INHABILITADO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "ModalidadTarifa" AS ENUM ('HORA', 'DIA', 'MES');

-- CreateEnum
CREATE TYPE "EstadoTarifa" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoEspacio" AS ENUM ('AUTO', 'MOTO', 'CAMIONETA', 'DISCAPACITADO', 'ELECTRICO');

-- CreateEnum
CREATE TYPE "EstadoEspacio" AS ENUM ('DISPONIBLE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "TipoVehiculo" AS ENUM ('SEDAN', 'SUV', 'CAMIONETA', 'MOTO', 'ELECTRICO', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE_PAGO', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoDetalleReserva" AS ENUM ('ACTIVO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "photoUrl" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gender" "UserGender",
    "birthDate" DATE,
    "ci" TEXT NOT NULL,
    "phone" TEXT,
    "roleId" TEXT NOT NULL,
    "createdById" TEXT,
    "estacionamiento_id" TEXT,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "termsAcceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_verification_documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "status" "DocumentVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_verification_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "terminos_condiciones" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "terminos_condiciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "estado" "TenantStatus" NOT NULL DEFAULT 'ACTIVO',
    "direccion" TEXT,
    "ciudad" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estacionamientos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoEstacionamiento" NOT NULL DEFAULT 'PENDIENTE',
    "tenant_id" TEXT NOT NULL,
    "motivo_rechazo" TEXT,
    "fecha_aprobacion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estacionamientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "estacionamiento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horarios" (
    "id" TEXT NOT NULL,
    "dia" "DiaSemana" NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "hora_cierre" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estacionamientos_horarios" (
    "id" TEXT NOT NULL,
    "estacionamiento_id" TEXT NOT NULL,
    "horario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estacionamientos_horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios_extras" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "estacionamiento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "modalidad" "ModalidadTarifa" NOT NULL,
    "estado" "EstadoTarifa" NOT NULL DEFAULT 'ACTIVO',
    "estacionamiento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveles" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "estacionamiento_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "niveles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "espacios" (
    "id" TEXT NOT NULL,
    "codigo_espacio" TEXT NOT NULL,
    "tipo" "TipoEspacio" NOT NULL DEFAULT 'AUTO',
    "modalidad" "ModalidadTarifa" NOT NULL DEFAULT 'HORA',
    "estado" "EstadoEspacio" NOT NULL DEFAULT 'DISPONIBLE',
    "nivel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "espacios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "croquis" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL DEFAULT 'PLANO-PRINCIPAL',
    "ancho_lienzo" INTEGER NOT NULL DEFAULT 1200,
    "alto_lienzo" INTEGER NOT NULL DEFAULT 800,
    "contenido" JSONB,
    "fondo_tipo" TEXT NOT NULL DEFAULT 'PLANO',
    "fondo_imagen_url" TEXT,
    "fondo_opacidad" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "nivel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "croquis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones" (
    "id" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "estacionamiento_id" TEXT NOT NULL,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculos" (
    "id" TEXT NOT NULL,
    "tipo" "TipoVehiculo" NOT NULL DEFAULT 'SEDAN',
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "propietario_id" TEXT NOT NULL,
    "es_predeterminado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservaciones" (
    "id" TEXT NOT NULL,
    "codigo_reserva" TEXT NOT NULL,
    "qr_token" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "modalidad" "ModalidadTarifa" NOT NULL DEFAULT 'HORA',
    "estacionamiento_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "operador_id" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_reservaciones" (
    "id" TEXT NOT NULL,
    "inicio_reserva" TIMESTAMP(3) NOT NULL,
    "fin_reserva" TIMESTAMP(3) NOT NULL,
    "precio_unitario_aplicado" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoDetalleReserva" NOT NULL DEFAULT 'ACTIVO',
    "reservacion_id" TEXT NOT NULL,
    "espacio_id" TEXT NOT NULL,
    "vehiculo_id" TEXT,
    "tarifa_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "detalles_reservaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_servicios_extras" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario_aplicado" DOUBLE PRECISION NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "detalle_reservacion_id" TEXT NOT NULL,
    "servicio_extra_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detalles_servicios_extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "metodo_pago" TEXT NOT NULL DEFAULT 'QR',
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_pago" TIMESTAMP(3),
    "reservacion_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ci_key" ON "User"("ci");

-- CreateIndex
CREATE INDEX "User_estacionamiento_id_idx" ON "User"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "user_verification_documents_userId_idx" ON "user_verification_documents"("userId");

-- CreateIndex
CREATE INDEX "email_verification_tokens_userId_idx" ON "email_verification_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_nit_key" ON "tenants"("nit");

-- CreateIndex
CREATE INDEX "tenants_usuarioId_idx" ON "tenants"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "estacionamientos_tenant_id_key" ON "estacionamientos"("tenant_id");

-- CreateIndex
CREATE INDEX "fotos_estacionamiento_id_idx" ON "fotos"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "horarios_tenant_id_idx" ON "horarios"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "horarios_tenant_id_dia_hora_inicio_hora_cierre_key" ON "horarios"("tenant_id", "dia", "hora_inicio", "hora_cierre");

-- CreateIndex
CREATE INDEX "estacionamientos_horarios_estacionamiento_id_idx" ON "estacionamientos_horarios"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "estacionamientos_horarios_horario_id_idx" ON "estacionamientos_horarios"("horario_id");

-- CreateIndex
CREATE UNIQUE INDEX "estacionamientos_horarios_estacionamiento_id_horario_id_key" ON "estacionamientos_horarios"("estacionamiento_id", "horario_id");

-- CreateIndex
CREATE INDEX "servicios_extras_estacionamiento_id_idx" ON "servicios_extras"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "tarifas_estacionamiento_id_idx" ON "tarifas"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "niveles_estacionamiento_id_idx" ON "niveles"("estacionamiento_id");

-- CreateIndex
CREATE UNIQUE INDEX "niveles_estacionamiento_id_codigo_key" ON "niveles"("estacionamiento_id", "codigo");

-- CreateIndex
CREATE INDEX "espacios_nivel_id_idx" ON "espacios"("nivel_id");

-- CreateIndex
CREATE UNIQUE INDEX "espacios_nivel_id_codigo_espacio_key" ON "espacios"("nivel_id", "codigo_espacio");

-- CreateIndex
CREATE INDEX "croquis_nivel_id_idx" ON "croquis"("nivel_id");

-- CreateIndex
CREATE INDEX "calificaciones_estacionamiento_id_idx" ON "calificaciones"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "calificaciones_cliente_id_idx" ON "calificaciones"("cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_placa_key" ON "vehiculos"("placa");

-- CreateIndex
CREATE INDEX "vehiculos_propietario_id_idx" ON "vehiculos"("propietario_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservaciones_codigo_reserva_key" ON "reservaciones"("codigo_reserva");

-- CreateIndex
CREATE INDEX "reservaciones_estacionamiento_id_idx" ON "reservaciones"("estacionamiento_id");

-- CreateIndex
CREATE INDEX "reservaciones_cliente_id_idx" ON "reservaciones"("cliente_id");

-- CreateIndex
CREATE INDEX "reservaciones_operador_id_idx" ON "reservaciones"("operador_id");

-- CreateIndex
CREATE INDEX "reservaciones_estado_idx" ON "reservaciones"("estado");

-- CreateIndex
CREATE INDEX "detalles_reservaciones_reservacion_id_idx" ON "detalles_reservaciones"("reservacion_id");

-- CreateIndex
CREATE INDEX "detalles_reservaciones_espacio_id_idx" ON "detalles_reservaciones"("espacio_id");

-- CreateIndex
CREATE INDEX "detalles_reservaciones_inicio_reserva_fin_reserva_idx" ON "detalles_reservaciones"("inicio_reserva", "fin_reserva");

-- CreateIndex
CREATE INDEX "detalles_servicios_extras_detalle_reservacion_id_idx" ON "detalles_servicios_extras"("detalle_reservacion_id");

-- CreateIndex
CREATE INDEX "detalles_servicios_extras_servicio_extra_id_idx" ON "detalles_servicios_extras"("servicio_extra_id");

-- CreateIndex
CREATE INDEX "pagos_reservacion_id_idx" ON "pagos"("reservacion_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_verification_documents" ADD CONSTRAINT "user_verification_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification_tokens" ADD CONSTRAINT "email_verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estacionamientos" ADD CONSTRAINT "estacionamientos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estacionamientos_horarios" ADD CONSTRAINT "estacionamientos_horarios_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estacionamientos_horarios" ADD CONSTRAINT "estacionamientos_horarios_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "horarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios_extras" ADD CONSTRAINT "servicios_extras_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niveles" ADD CONSTRAINT "niveles_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "espacios" ADD CONSTRAINT "espacios_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "niveles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "croquis" ADD CONSTRAINT "croquis_nivel_id_fkey" FOREIGN KEY ("nivel_id") REFERENCES "niveles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones" ADD CONSTRAINT "calificaciones_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_propietario_id_fkey" FOREIGN KEY ("propietario_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservaciones" ADD CONSTRAINT "reservaciones_estacionamiento_id_fkey" FOREIGN KEY ("estacionamiento_id") REFERENCES "estacionamientos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservaciones" ADD CONSTRAINT "reservaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservaciones" ADD CONSTRAINT "reservaciones_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_reservaciones" ADD CONSTRAINT "detalles_reservaciones_reservacion_id_fkey" FOREIGN KEY ("reservacion_id") REFERENCES "reservaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_reservaciones" ADD CONSTRAINT "detalles_reservaciones_espacio_id_fkey" FOREIGN KEY ("espacio_id") REFERENCES "espacios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_reservaciones" ADD CONSTRAINT "detalles_reservaciones_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_reservaciones" ADD CONSTRAINT "detalles_reservaciones_tarifa_id_fkey" FOREIGN KEY ("tarifa_id") REFERENCES "tarifas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_servicios_extras" ADD CONSTRAINT "detalles_servicios_extras_detalle_reservacion_id_fkey" FOREIGN KEY ("detalle_reservacion_id") REFERENCES "detalles_reservaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_servicios_extras" ADD CONSTRAINT "detalles_servicios_extras_servicio_extra_id_fkey" FOREIGN KEY ("servicio_extra_id") REFERENCES "servicios_extras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_reservacion_id_fkey" FOREIGN KEY ("reservacion_id") REFERENCES "reservaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
