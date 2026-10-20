import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateNivelPayload } from '../domain/Nivel';
import { nivelRepositoryInstance } from '../infrastructure/HttpNivelRepository';
import { NIVELES_QUERY_KEYS } from './useNivelesQuery';
import { ESPACIOS_QUERY_KEYS } from './useEspaciosQuery';

export const useCrearNivelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNivelPayload) =>
      nivelRepositoryInstance.createNivel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.all });
    },
  });
};

export const useEliminarNivelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => nivelRepositoryInstance.deleteNivel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: NIVELES_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ESPACIOS_QUERY_KEYS.all });
    },
  });
};
