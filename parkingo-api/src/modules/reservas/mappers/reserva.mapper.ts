import {
  BoletaReservaResponseDto,
  DetalleReservaResponseDto,
  ServicioExtraResponseDto,
} from '../dto/reserva-response.dto.js';
import { ReservacionConRelaciones } from '../repositories/reserva.repository.js';

export class ReservaMapper {
  static toDto(r: ReservacionConRelaciones): BoletaReservaResponseDto {
    const detallesDto: DetalleReservaResponseDto[] = (r.detalles || []).map((d) => {
      const extrasDto: ServicioExtraResponseDto[] = (d.serviciosExtras || []).map(
        (e) => ({
          id: e.id,
          servicioExtraId: e.servicioExtraId,
          nombre: e.servicioExtra.nombre,
          cantidad: e.cantidad,
          precioUnitarioAplicado: e.precioUnitarioAplicado,
          subtotal: e.subtotal,
        }),
      );

      const movimientosDto = (d.movimientos || []).map((m) => ({
        id: m.id,
        tipoMovimiento: m.tipoMovimiento,
        fechaHora: m.fechaHora,
        operadorNombre: m.operador
          ? `${m.operador.firstName} ${m.operador.lastName}`.trim()
          : null,
        notas: m.notas || null,
      }));

      return {
        id: d.id,
        espacioId: d.espacioId,
        codigoEspacio: d.espacio.codigoEspacio,
        tipoEspacio: d.espacio.tipo,
        vehiculoPlaca: d.vehiculo ? d.vehiculo.placa : null,
        vehiculoModelo: d.vehiculo
          ? `${d.vehiculo.modelo} (${d.vehiculo.color})`
          : null,
        inicioReserva: d.inicioReserva,
        finReserva: d.finReserva,
        precioUnitarioAplicado: d.precioUnitarioAplicado,
        subtotal: d.subtotal,
        estado: d.estado,
        serviciosExtras: extrasDto,
        movimientos: movimientosDto,
      };
    });

    const todosMovimientos = detallesDto.flatMap((d) => d.movimientos || []);
    const entrada = todosMovimientos.find((m) => m.tipoMovimiento === 'ENTRADA');
    const salida = todosMovimientos.find((m) => m.tipoMovimiento === 'SALIDA');

    return {
      id: r.id,
      codigoReserva: r.codigoReserva,
      qrToken: r.qrToken,
      total: r.total,
      estado: r.estado,
      modalidad: r.modalidad,
      estacionamientoId: r.estacionamientoId,
      estacionamientoNombre: r.estacionamiento.nombre,
      estacionamientoDireccion: r.estacionamiento.direccion,
      clienteId: r.clienteId,
      clienteNombre: `${r.cliente.firstName} ${r.cliente.lastName}`.trim(),
      clienteEmail: r.cliente.email,
      clienteTelefono: r.cliente.phone || null,
      metodoPago: r.pagos && r.pagos.length > 0 ? r.pagos[0].metodoPago : 'EFECTIVO',
      pagos: (r.pagos || []).map((p) => ({
        id: p.id,
        monto: p.monto,
        metodoPago: p.metodoPago,
        estado: p.estado,
        fechaPago: p.fechaPago,
      })),
      operadorNombre: r.operador
        ? `${r.operador.firstName} ${r.operador.lastName}`.trim()
        : null,
      detalles: detallesDto,
      movimientos: todosMovimientos,
      horaEntradaReal: entrada ? (entrada.fechaHora instanceof Date ? entrada.fechaHora.toISOString() : String(entrada.fechaHora)) : null,
      horaSalidaReal: salida ? (salida.fechaHora instanceof Date ? salida.fechaHora.toISOString() : String(salida.fechaHora)) : null,
      fechaCreacion: r.fechaCreacion,
    };
  }

  static toDtoList(list: ReservacionConRelaciones[]): BoletaReservaResponseDto[] {
    return list.map((r) => this.toDto(r));
  }
}
