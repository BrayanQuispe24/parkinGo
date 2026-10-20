import { useQuery } from '@tanstack/react-query';
import type { EstadoEstacionamiento } from '../domain/Estacionamiento';
import { httpEstacionamientoRepository } from '../infrastructure/HttpEstacionamientoRepository';

export const ESTACIONAMIENTOS_QUERY_KEYS = {
  all: ['estacionamientos'] as const,
  mine: ['estacionamientos', 'me'] as const,
  adminList: (estado?: EstadoEstacionamiento) =>
    ['estacionamientos', 'admin', estado ?? 'ALL'] as const,
};

export const useMiEstacionamientoQuery = () => {
  return useQuery({
    queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine,
    queryFn: () => httpEstacionamientoRepository.getMiEstacionamiento(),
    staleTime: 1000 * 60 * 3, // 3 minutos
  });
};

export const useAdminEstacionamientosQuery = (estado?: EstadoEstacionamiento) => {
  return useQuery({
    queryKey: ESTACIONAMIENTOS_QUERY_KEYS.adminList(estado),
    queryFn: () => httpEstacionamientoRepository.listarEstacionamientos(estado),
    staleTime: 1000 * 30, // 30 segundos
  });
};
