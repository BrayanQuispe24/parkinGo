-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateTable
CREATE TABLE "movimientos" (
    "id" TEXT NOT NULL,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operador_id" TEXT,
    "detalle_reservacion_id" TEXT NOT NULL,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movimientos_detalle_reservacion_id_idx" ON "movimientos"("detalle_reservacion_id");

-- CreateIndex
CREATE INDEX "movimientos_operador_id_idx" ON "movimientos"("operador_id");

-- CreateIndex
CREATE INDEX "movimientos_tipo_movimiento_idx" ON "movimientos"("tipo_movimiento");

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_operador_id_fkey" FOREIGN KEY ("operador_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_detalle_reservacion_id_fkey" FOREIGN KEY ("detalle_reservacion_id") REFERENCES "detalles_reservaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
