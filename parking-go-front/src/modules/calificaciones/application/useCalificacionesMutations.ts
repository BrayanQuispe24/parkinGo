// src/modules/calificaciones/application/useCalificacionesMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpCalificacionRepository } from '../infrastructure/HttpCalificacionRepository';
import { CALIFICACIONES_QUERY_KEYS } from './useCalificacionesQuery';
import type { CrearCalificacionPayload, CalificacionModel } from '../domain/Calificacion';

/**
 * Hook de mutación para registrar una nueva calificación.
 * Exclusivo para usuarios con rol Conductor (DRIVER).
 * Invalida automáticamente las queries de calificaciones para mantener sincronizada la UI.
 */
export const useCrearCalificacionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CalificacionModel, Error, CrearCalificacionPayload>({
    mutationFn: (payload: CrearCalificacionPayload) =>
      httpCalificacionRepository.crear(payload),
    onSuccess: (data) => {
      // Invalidar las calificaciones del estacionamiento
      queryClient.invalidateQueries({
        queryKey: CALIFICACIONES_QUERY_KEYS.estacionamiento(data.estacionamientoId),
      });
      // Invalidar mis calificaciones
      queryClient.invalidateQueries({
        queryKey: CALIFICACIONES_QUERY_KEYS.misResenas(),
      });
      // Invalidar las del tenant para que el dueño vea el nuevo comentario
      queryClient.invalidateQueries({
        queryKey: CALIFICACIONES_QUERY_KEYS.tenant(),
      });
    },
  });
};
