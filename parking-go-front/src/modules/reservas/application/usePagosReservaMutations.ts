// src/modules/reservas/application/usePagosReservaMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parkingoApi } from '../../../core/api/parkingoApi';
import type { BoletaReserva, MovimientoReserva } from '../../driver/domain/DriverBooking';
import { DRIVER_KEYS } from '../../driver/application/useDriverQueries';

export interface IniciarPagoPayload {
  reservaId: string;
  metodoPago: 'EFECTIVO' | 'QR';
}

export interface IniciarPagoResponse {
  metodoPago: 'EFECTIVO' | 'QR';
  requiereAccionCliente: boolean;
  qrData?: {
    qrTextoPayload: string;
    expiraEn: string;
  };
  instrucciones?: string;
}

export interface ConfirmarPagoPayload {
  reservaId: string;
  metodoPago: 'EFECTIVO' | 'QR';
  montoEntregado?: number;
  notas?: string;
  referenciaExterna?: string;
}

export interface VerificarAccesoPayload {
  token?: string;
  qrToken?: string;
  estacionamientoId?: string;
}

export interface ResultadoVerificacionAcceso {
  valido: boolean;
  mensaje: string;
  reservaId?: string;
  codigoReserva?: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string | null;
  vehiculoPlaca?: string;
  vehiculoModelo?: string;
  espacioCodigo?: string;
  estadoReserva?: string;
  metodoPago?: 'EFECTIVO' | 'QR';
  estadoPago?: 'PENDIENTE' | 'COMPLETADO';
  montoTotal?: number;
  horaIngreso?: string;
  duracionHoras?: number;
  requiereCobroEfectivo?: boolean;
  siguienteAccion?: 'ENTRADA' | 'SALIDA' | null;
  horaEntradaReal?: string | null;
  horaSalidaReal?: string | null;
  detalleReservacionId?: string;
  movimientos?: MovimientoReserva[];
}

export const useIniciarPagoMutation = () => {
  return useMutation({
    mutationFn: async (payload: IniciarPagoPayload): Promise<IniciarPagoResponse> => {
      const response = await parkingoApi.post<IniciarPagoResponse>(
        `/reservas/${payload.reservaId}/iniciar-pago`,
        { metodoPago: payload.metodoPago },
      );
      return response.data;
    },
  });
};

export const useConfirmarPagoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ConfirmarPagoPayload): Promise<BoletaReserva> => {
      const response = await parkingoApi.patch<BoletaReserva>(
        `/reservas/${payload.reservaId}/confirmar-pago`,
        {
          metodoPago: payload.metodoPago,
          montoEntregado: payload.montoEntregado,
          notas: payload.notas,
          referenciaExterna: payload.referenciaExterna,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidar caché de reservas del establecimiento y del conductor
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.activeBooking() });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.bookingsHistory() });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.boletas() });
    },
  });
};

export const useVerificarAccesoMutation = () => {
  return useMutation({
    mutationFn: async (payload: VerificarAccesoPayload): Promise<ResultadoVerificacionAcceso> => {
      const token = payload.token || payload.qrToken || '';
      const response = await parkingoApi.post<ResultadoVerificacionAcceso>(
        '/reservas/verificar-acceso',
        {
          token,
          qrToken: token,
          estacionamientoId: payload.estacionamientoId,
        },
      );
      return response.data;
    },
  });
};

export interface RegistrarMovimientoPayload {
  token?: string;
  codigoReserva?: string;
  reservaId?: string;
  detalleReservacionId?: string;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  notas?: string;
}

export const useRegistrarMovimientoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RegistrarMovimientoPayload): Promise<BoletaReserva> => {
      const response = await parkingoApi.post<BoletaReserva>('/reservas/movimiento', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.activeBooking() });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.bookingsHistory() });
      queryClient.invalidateQueries({ queryKey: DRIVER_KEYS.boletas() });
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
      queryClient.invalidateQueries({ queryKey: ['estacionamientos'] });
    },
  });
};

