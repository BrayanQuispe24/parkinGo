import { queryClient } from '../query/queryClient';
import { ESTACIONAMIENTOS_QUERY_KEYS } from '../../modules/estacionamientos/application/useEstacionamientosQuery';
import { httpEstacionamientoRepository } from '../../modules/estacionamientos/infrastructure/HttpEstacionamientoRepository';
import { normalizeSystemRole } from '../../modules/auth/domain/roleRouting';

/**
 * Precarga proactiva de Chunks de código JS y queries críticas en segundo plano.
 * Se invoca durante la ventana de transición de login para que cuando el usuario navegue
 * al workspace correspondiente, tanto los componentes como los datos ya estén en memoria (0ms latency).
 */
export const preloadRoleWorkspace = (role?: string | null): void => {
  if (!role) return;
  const canonicalRole = normalizeSystemRole(role);

  switch (canonicalRole) {
    case 'HOST': {
      // 1. Precargar Chunks de Layout y Página de Cochera
      import('../../modules/parking-admin/presentation/layouts/ParkingAdminLayout');
      import('../../modules/estacionamientos/presentation/pages/TenantEstacionamientoPage');

      // 2. Prefetch de datos en TanStack Query
      queryClient.prefetchQuery({
        queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine,
        queryFn: () => httpEstacionamientoRepository.getMiEstacionamiento(),
        staleTime: 1000 * 60 * 3,
      });
      break;
    }

    case 'PARKING_ADMIN': {
      // 1. Precargar Layout y Gestión de Operadores/Usuarios
      import('../../modules/parking-admin/presentation/layouts/ParkingAdminLayout');
      import('../../modules/parking-admin/presentation/pages/ParkingAdminUsersPage');
      import('../../modules/estacionamientos/presentation/pages/TenantEstacionamientoPage');

      // 2. Prefetch de estacionamiento activo
      queryClient.prefetchQuery({
        queryKey: ESTACIONAMIENTOS_QUERY_KEYS.mine,
        queryFn: () => httpEstacionamientoRepository.getMiEstacionamiento(),
        staleTime: 1000 * 60 * 3,
      });
      break;
    }

    case 'SUPER_ADMIN':
    case 'GENERAL_ADMIN': {
      // 1. Precargar Layout de Admin General y páginas principales
      import('../../modules/admin/presentation/layouts/AdminLayout');
      import('../../modules/admin/presentation/pages/GeneralReportsPage');
      import('../../modules/estacionamientos/presentation/pages/AdminSolicitudesEstacionamientosPage');
      import('../../modules/admin/presentation/pages/UsersManagementPage');

      // 2. Prefetch de solicitudes pendientes
      queryClient.prefetchQuery({
        queryKey: ESTACIONAMIENTOS_QUERY_KEYS.adminList('PENDIENTE'),
        queryFn: () => httpEstacionamientoRepository.listarEstacionamientos('PENDIENTE'),
        staleTime: 1000 * 30,
      });
      break;
    }

    case 'OPERATOR':
    case 'PARKING_OPERATOR': {
      import('../../modules/parking-operator/presentation/layouts/ParkingOperatorLayout');
      import('../../modules/parking-operator/presentation/pages/ParkingOperatorProfilePage');
      break;
    }

    case 'DRIVER': {
      import('../../modules/driver/presentation/pages/DriverDashboardPage');
      break;
    }

    default:
      break;
  }
};

