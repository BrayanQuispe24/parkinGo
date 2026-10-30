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
      };
    });

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
      operadorNombre: r.operador
        ? `${r.operador.firstName} ${r.operador.lastName}`.trim()
        : null,
      detalles: detallesDto,
      fechaCreacion: r.fechaCreacion,
    };
  }

  static toDtoList(list: ReservacionConRelaciones[]): BoletaReservaResponseDto[] {
    return list.map((r) => this.toDto(r));
  }
}
