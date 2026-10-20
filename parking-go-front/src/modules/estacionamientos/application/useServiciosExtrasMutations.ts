import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateServicioExtraPayload,
  UpdateServicioExtraPayload,
} from '../domain/ServicioExtra';
import { servicioExtraRepositoryInstance } from '../infrastructure/HttpServicioExtraRepository';
import { SERVICIOS_EXTRAS_QUERY_KEYS } from './useServiciosExtrasQuery';

export const useCrearServicioExtraMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicioExtraPayload) =>
      servicioExtraRepositoryInstance.createServicio(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.all });
    },
  });
};

export const useActualizarServicioExtraMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateServicioExtraPayload }) =>
      servicioExtraRepositoryInstance.updateServicio(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.all });
    },
  });
};

export const useEliminarServicioExtraMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicioExtraRepositoryInstance.deleteServicio(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: SERVICIOS_EXTRAS_QUERY_KEYS.all });
    },
  });
};
