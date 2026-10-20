import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateTarifaPayload,
  UpdateTarifaPayload,
} from '../domain/Tarifa';
import { tarifaRepositoryInstance } from '../infrastructure/HttpTarifaRepository';
import { TARIFAS_QUERY_KEYS } from './useTarifasQuery';

export const useCrearTarifaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTarifaPayload) =>
      tarifaRepositoryInstance.createTarifa(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.all });
    },
  });
};

export const useActualizarTarifaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTarifaPayload }) =>
      tarifaRepositoryInstance.updateTarifa(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.all });
    },
  });
};

export const useEliminarTarifaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tarifaRepositoryInstance.deleteTarifa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: TARIFAS_QUERY_KEYS.all });
    },
  });
};
