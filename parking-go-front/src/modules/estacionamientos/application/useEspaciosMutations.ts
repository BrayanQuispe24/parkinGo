import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateEspacioPayload,
  UpdateEspacioPayload,
} from '../domain/Espacio';
import { espacioRepositoryInstance } from '../infrastructure/HttpEspacioRepository';
import { ESPACIOS_QUERY_KEYS } from './useEspaciosQuery';
import { NIVELES_QUERY_KEYS } from './useNivelesQuery';

export const useCrearEspacioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEspacioPayload) =>
      espacioRepositoryInstance.createEspacio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESPACIOS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.all });
    },
  });
};

export const useActualizarEspacioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEspacioPayload }) =>
      espacioRepositoryInstance.updateEspacio(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESPACIOS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.all });
    },
  });
};

export const useEliminarEspacioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => espacioRepositoryInstance.deleteEspacio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESPACIOS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.all });
    },
  });
};
