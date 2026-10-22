import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { GuardarCroquisPayload } from '../domain/Croquis';
import { croquisRepositoryInstance } from '../infrastructure/HttpCroquisRepository';
import { CROQUIS_QUERY_KEYS } from './useCroquisQuery';

export const useGuardarCroquisMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      nivelId,
      payload,
    }: {
      nivelId: string;
      payload: GuardarCroquisPayload;
    }) => croquisRepositoryInstance.guardarCroquis(nivelId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: CROQUIS_QUERY_KEYS.byNivel(variables.nivelId),
      });
      queryClient.invalidateQueries({
        queryKey: CROQUIS_QUERY_KEYS.all,
      });
    },
  });
};
