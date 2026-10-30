import {
  Reservacion,
  DetalleReservacion,
  DetalleServicioExtra,
  EstadoReserva,
  ModalidadTarifa,
} from '@prisma/client';

export interface CreateDetalleExtraData {
  servicioExtraId: string;
  cantidad: number;
  precioUnitarioAplicado: number;
  subtotal: number;
}

export interface CreateDetalleData {
  espacioId: string;
  vehiculoId?: string;
  tarifaId?: string;
  inicioReserva: Date;
  finReserva: Date;
  precioUnitarioAplicado: number;
  subtotal: number;
  serviciosExtras?: CreateDetalleExtraData[];
}

export interface CreateReservaData {
  codigoReserva: string;
  qrToken: string;
  total: number;
  modalidad: ModalidadTarifa;
  estacionamientoId: string;
  clienteId: string;
  operadorId?: string;
  detalles: CreateDetalleData[];
}

export type ReservacionConRelaciones = Reservacion & {
  estacionamiento: {
    id: string;
    nombre: string;
    direccion: string;
  };
  cliente: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  operador?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  detalles: Array<
    DetalleReservacion & {
      espacio: {
        id: string;
        codigoEspacio: string;
        tipo: string;
      };
      vehiculo?: {
        id: string;
        placa: string;
        modelo: string;
        color: string;
      } | null;
      serviciosExtras: Array<
        DetalleServicioExtra & {
          servicioExtra: {
            id: string;
            nombre: string;
            precio: number;
          };
        }
      >;
    }
  >;
};

export abstract class ReservaRepository {
  abstract create(data: CreateReservaData): Promise<ReservacionConRelaciones>;
  abstract findById(id: string): Promise<ReservacionConRelaciones | null>;
  abstract findByCodigo(codigoReserva: string): Promise<ReservacionConRelaciones | null>;
  abstract findByClienteId(clienteId: string): Promise<ReservacionConRelaciones[]>;
  abstract findByEstacionamientoId(estacionamientoId: string): Promise<ReservacionConRelaciones[]>;
  abstract verificarColisionEspacios(
    espaciosIds: string[],
    inicio: Date,
    fin: Date,
  ): Promise<{ espacioId: string; codigoEspacio: string; conflictoCon: string }[]>;
  abstract cancelar(id: string): Promise<ReservacionConRelaciones>;
}
