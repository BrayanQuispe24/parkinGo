import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { HorarioItemPayload, RegistrarEstacionamientoPayload } from '../domain/Estacionamiento';
import { httpEstacionamientoRepository } from '../infrastructure/HttpEstacionamientoRepository';
import { ESTACIONAMIENTOS_QUERY_KEYS } from './useEstacionamientosQuery';

export const useActualizarHorariosMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (horarios: HorarioItemPayload[]) =>
      httpEstacionamientoRepository.actualizarHorarios(horarios),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useRegistrarEstacionamientoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegistrarEstacionamientoPayload) =>
      httpEstacionamientoRepository.registrarEstacionamiento(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useAprobarEstacionamientoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => httpEstacionamientoRepository.aprobarEstacionamiento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useRechazarEstacionamientoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivoRechazo }: { id: string; motivoRechazo: string }) =>
      httpEstacionamientoRepository.rechazarEstacionamiento(id, motivoRechazo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useInhabilitarEstacionamientoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => httpEstacionamientoRepository.inhabilitarEstacionamiento(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useSubirFotosMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fotos: File[]) => httpEstacionamientoRepository.subirFotos(fotos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};

export const useEliminarFotoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fotoId: string) => httpEstacionamientoRepository.eliminarFoto(fotoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine });
      queryClient.invalidateQueries({ queryKey: ESTACIONAMIENTOS_QUERY_KEYS.all });
    },
  });
};
