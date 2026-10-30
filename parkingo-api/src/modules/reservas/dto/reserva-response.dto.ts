import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReserva, ModalidadTarifa, EstadoDetalleReserva } from '@prisma/client';

export class ServicioExtraResponseDto {
  @ApiProperty({ example: 'srv-123-uuid' })
  id!: string;

  @ApiProperty({ example: 'srv-catalogo-uuid' })
  servicioExtraId!: string;

  @ApiProperty({ example: 'Lavado Exterior' })
  nombre!: string;

  @ApiProperty({ example: 1 })
  cantidad!: number;

  @ApiProperty({ example: 15.0 })
  precioUnitarioAplicado!: number;

  @ApiProperty({ example: 15.0 })
  subtotal!: number;
}

export class DetalleReservaResponseDto {
  @ApiProperty({ example: 'det-123-uuid' })
  id!: string;

  @ApiProperty({ example: 'esp-uuid-1' })
  espacioId!: string;

  @ApiProperty({ example: 'A-01' })
  codigoEspacio!: string;

  @ApiProperty({ example: 'AUTO' })
  tipoEspacio!: string;

  @ApiPropertyOptional({ example: '9912-KLS' })
  vehiculoPlaca?: string | null;

  @ApiPropertyOptional({ example: 'Toyota Corolla' })
  vehiculoModelo?: string | null;

  @ApiProperty({ example: '2026-10-28T14:00:00.000Z' })
  inicioReserva!: Date;

  @ApiProperty({ example: '2026-10-28T16:00:00.000Z' })
  finReserva!: Date;

  @ApiProperty({ example: 10.0, description: 'Tarifa base por hora snapshot' })
  precioUnitarioAplicado!: number;

  @ApiProperty({ example: 45.0, description: 'Subtotal acumulado (espacio + extras calculados por Decorator)' })
  subtotal!: number;

  @ApiProperty({ enum: EstadoDetalleReserva, example: EstadoDetalleReserva.ACTIVO })
  estado!: EstadoDetalleReserva;

  @ApiProperty({ type: [ServicioExtraResponseDto] })
  serviciosExtras!: ServicioExtraResponseDto[];
}

export class BoletaReservaResponseDto {
  @ApiProperty({ example: 'res-123-uuid' })
  id!: string;

  @ApiProperty({ example: 'TKT-2026-8842' })
  codigoReserva!: string;

  @ApiProperty({ example: 'PARKINGO:TKT-2026-8842:CONFIRMED' })
  qrToken!: string;

  @ApiProperty({ example: 118.0 })
  total!: number;

  @ApiProperty({ enum: EstadoReserva, example: EstadoReserva.PENDIENTE_PAGO })
  estado!: EstadoReserva;

  @ApiProperty({ enum: ModalidadTarifa, example: ModalidadTarifa.HORA })
  modalidad!: ModalidadTarifa;

  @ApiProperty({ example: 'est-uuid-1' })
  estacionamientoId!: string;

  @ApiProperty({ example: 'ParkinGo Equipetrol Central' })
  estacionamientoNombre!: string;

  @ApiProperty({ example: 'Av. San Martín #450' })
  estacionamientoDireccion!: string;

  @ApiProperty({ example: 'usr-cliente-uuid' })
  clienteId!: string;

  @ApiProperty({ example: 'Brayan Quispe' })
  clienteNombre!: string;

  @ApiProperty({ example: 'brayan@gmail.com' })
  clienteEmail!: string;

  @ApiPropertyOptional({ example: 'Operador Garita 1' })
  operadorNombre?: string | null;

  @ApiProperty({ type: [DetalleReservaResponseDto] })
  detalles!: DetalleReservaResponseDto[];

  @ApiProperty({ example: '2026-10-28T10:00:00.000Z' })
  fechaCreacion!: Date;
}

export class CotizacionReservaResponseDto {
  @ApiProperty({ example: 'ParkinGo Equipetrol Central' })
  estacionamientoNombre!: string;

  @ApiProperty({
    description: 'Desglose detallado por espacio con sus extras y subtotales calculados por el patrón Decorator',
  })
  detallesEspacios!: Array<{
    espacioId: string;
    codigoEspacio: string;
    precioBaseUnitario: number;
    duracionHoras: number;
    subtotalBaseEspacio: number;
    serviciosExtras: Array<{
      servicioExtraId: string;
      nombre: string;
      precioUnitario: number;
      cantidad: number;
      subtotal: number;
    }>;
    subtotalTotalEspacio: number;
  }>;

  @ApiProperty({ example: 118.0, description: 'Total general calculado aditivamente' })
  totalGeneral!: number;
}
