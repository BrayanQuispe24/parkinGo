import { useAuthStore } from '../../../store/useAuthStore';

export interface HostParkingPolicy {
  isHost: boolean;
  maxTenants: number;
  maxNiveles: number;
  maxCroquis: number;
  maxEspacios: number;
  canCreateMoreTenants: (currentCount: number) => boolean;
  canCreateMoreNiveles: (currentCount: number) => boolean;
  canCreateMoreEspacios: (currentCount: number) => boolean;
  canAddMoreCroquisNodes: (currentSpaceNodesCount: number) => boolean;
}

/**
 * Hook que encapsula la política de límites y UI del rol Anfitrión (HOST/C2C).
 * Aplica el patrón UI Policy para desacoplar reglas de negocio de presentación.
 */
export const useHostParkingPolicy = (): HostParkingPolicy => {
  const { user } = useAuthStore();
  const normalizedRole = user?.role?.toUpperCase();
  const isHost = normalizedRole === 'HOST' || user?.role?.toLowerCase() === 'anfitrion';

  const maxTenants = isHost ? 1 : Infinity;
  const maxNiveles = isHost ? 1 : Infinity;
  const maxCroquis = isHost ? 1 : Infinity;
  const maxEspacios = isHost ? 1 : Infinity;

  return {
    isHost,
    maxTenants,
    maxNiveles,
    maxCroquis,
    maxEspacios,
    canCreateMoreTenants: (currentCount: number) => currentCount < maxTenants,
    canCreateMoreNiveles: (currentCount: number) => currentCount < maxNiveles,
    canCreateMoreEspacios: (currentCount: number) => currentCount < maxEspacios,
    canAddMoreCroquisNodes: (currentSpaceNodesCount: number) => currentSpaceNodesCount < maxEspacios,
  };
};
