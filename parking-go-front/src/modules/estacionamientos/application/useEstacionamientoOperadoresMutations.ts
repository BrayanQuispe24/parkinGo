import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AsignarOperadoresPayload } from '../domain/EstacionamientoOperador';
import { estacionamientoOperadorRepositoryInstance } from '../infrastructure/HttpEstacionamientoOperadorRepository';
import { ESTACIONAMIENTO_OPERADORES_QUERY_KEYS } from './useEstacionamientoOperadoresQuery';

export const useAsignarOperadoresMutation = (estacionamientoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AsignarOperadoresPayload) =>
      estacionamientoOperadorRepositoryInstance.asignarOperadores(
        estacionamientoId,
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.byEstacionamiento(estacionamientoId),
      });
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.disponibles(estacionamientoId),
      });
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.all,
      });
    },
  });
};

export const useDesasignarOperadorMutation = (estacionamientoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (usuarioId: string) =>
      estacionamientoOperadorRepositoryInstance.desasignarOperador(
        estacionamientoId,
        usuarioId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.byEstacionamiento(estacionamientoId),
      });
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.disponibles(estacionamientoId),
      });
      queryClient.invalidateQueries({
        queryKey: ESTACIONAMIENTO_OPERADORES_QUERY_KEYS.all,
      });
    },
  });
};
