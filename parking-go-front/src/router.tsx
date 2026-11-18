import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useRouteError, isRouteErrorResponse } from 'react-router';
import App from './App';
import { LandingPage } from './modules/landing/presentation/pages/LandingPage';
import { AuthPage } from './modules/auth/presentation/pages/AuthPage';
import { ProtectedRoute } from './modules/auth/presentation/components/ProtectedRoute';
import { ParkingAdminIndexRedirect } from './modules/parking-admin/presentation/components/ParkingAdminIndexRedirect';
import { CanvasSuspenseFallback } from './core/routing/CanvasSuspenseFallback';
import About from './pages/About';

function lazyWithRetry<T extends React.ComponentType<Record<string, unknown>>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const module = await factory();
      sessionStorage.removeItem('chunk_retry_refreshed');
      return module;
    } catch (error) {
      const hasRefreshed = sessionStorage.getItem('chunk_retry_refreshed');
      if (!hasRefreshed) {
        sessionStorage.setItem('chunk_retry_refreshed', 'true');
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      sessionStorage.removeItem('chunk_retry_refreshed');
      throw error;
    }
  });
}

const DriverDashboardPage = lazyWithRetry(() =>
  import('./modules/driver/presentation/pages/DriverDashboardPage').then((m) => ({
    default: m.DriverDashboardPage,
  }))
);
const AdminLayout = lazyWithRetry(() =>
  import('./modules/admin/presentation/layouts/AdminLayout').then((m) => ({
    default: m.AdminLayout,
  }))
);
const GeneralReportsPage = lazyWithRetry(() =>
  import('./modules/admin/presentation/pages/GeneralReportsPage').then((m) => ({
    default: m.GeneralReportsPage,
  }))
);
const UsersManagementPage = lazyWithRetry(() =>
  import('./modules/admin/presentation/pages/UsersManagementPage').then((m) => ({
    default: m.UsersManagementPage,
  }))
);
const RolesPermissionsPage = lazyWithRetry(() =>
  import('./modules/admin/presentation/pages/RolesPermissionsPage').then((m) => ({
    default: m.RolesPermissionsPage,
  }))
);
const ParkingAdminLayout = lazyWithRetry(() =>
  import('./modules/parking-admin/presentation/layouts/ParkingAdminLayout').then((m) => ({
    default: m.ParkingAdminLayout,
  }))
);
const ParkingAdminUsersPage = lazyWithRetry(() =>
  import('./modules/parking-admin/presentation/pages/ParkingAdminUsersPage').then((m) => ({
    default: m.ParkingAdminUsersPage,
  }))
);
const ParkingAdminProfilePage = lazyWithRetry(() =>
  import('./modules/parking-admin/presentation/pages/ParkingAdminProfilePage').then((m) => ({
    default: m.ParkingAdminProfilePage,
  }))
);
const ParkingOperatorLayout = lazyWithRetry(() =>
  import('./modules/parking-operator/presentation/layouts/ParkingOperatorLayout').then((m) => ({
    default: m.ParkingOperatorLayout,
  }))
);
const ParkingOperatorProfilePage = lazyWithRetry(() =>
  import('./modules/parking-operator/presentation/pages/ParkingOperatorProfilePage').then((m) => ({
    default: m.ParkingOperatorProfilePage,
  }))
);
const AdminProfilePage = lazyWithRetry(() =>
  import('./modules/admin/presentation/pages/AdminProfilePage').then((m) => ({
    default: m.AdminProfilePage,
  }))
);
const TenantsManagementPage = lazyWithRetry(() =>
  import('./modules/tenants/presentation/pages/TenantsManagementPage').then((m) => ({
    default: m.TenantsManagementPage,
  }))
);
const GeneralAdminLayout = lazyWithRetry(() =>
  import('./modules/general-admin/presentation/layouts/GeneralAdminLayout').then((m) => ({
    default: m.GeneralAdminLayout,
  }))
);
const TenantEstacionamientoPage = lazyWithRetry(() =>
  import('./modules/estacionamientos/presentation/pages/TenantEstacionamientoPage').then((m) => ({
    default: m.TenantEstacionamientoPage,
  }))
);
const AdminSolicitudesEstacionamientosPage = lazyWithRetry(() =>
  import('./modules/estacionamientos/presentation/pages/AdminSolicitudesEstacionamientosPage').then((m) => ({
    default: m.AdminSolicitudesEstacionamientosPage,
  }))
);
const HostReservasRecibidasPage = lazyWithRetry(() =>
  import('./modules/host/presentation/pages/HostReservasRecibidasPage').then((m) => ({
    default: m.HostReservasRecibidasPage,
  }))
);

const RouteSuspenseFallback: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      color: '#006D36',
    }}
  >
    <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.85rem' }}></i>
    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
      Cargando módulo...
    </span>
  </div>
);

const RootErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado al cargar la vista.';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#F4F6F4',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 1.25rem',
          }}
        >
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F2417', marginBottom: '0.5rem' }}>
          Actualización de Módulo
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          {errorMessage.includes('dynamically imported module')
            ? 'Se ha detectado una nueva versión del sistema o se reinició el servicio. Recarga para sincronizar los módulos.'
            : errorMessage}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#006D36',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '99px',
            padding: '0.7rem 1.6rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <i className="fa-solid fa-rotate-right"></i> Recargar Aplicación
        </button>
      </div>
    </div>
  );
};

function withSuspense<P extends Record<string, unknown>>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>
): React.ReactElement {
  return (
    <Suspense fallback={<RouteSuspenseFallback />}>
      <Component {...({} as P)} />
    </Suspense>
  );
}

function withCanvasSuspense<P extends Record<string, unknown>>(
  Component: React.LazyExoticComponent<React.ComponentType<P>>
): React.ReactElement {
  return (
    <Suspense fallback={<CanvasSuspenseFallback />}>
      <Component {...({} as P)} />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    errorElement: <RootErrorBoundary />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'auth',
        element: <AuthPage />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'dashboard',
            element: withSuspense(DriverDashboardPage)
          },
          {
            path: 'dashboard/driver',
            element: withSuspense(DriverDashboardPage)
          }
        ]
      },
      {
        path: 'dashboard/parking-admin',
        element: <ProtectedRoute allowedRoles={['PARKING_ADMIN', 'HOST', 'SUPER_ADMIN', 'GENERAL_ADMIN']} />,
        children: [
          {
            element: withSuspense(ParkingAdminLayout),
            children: [
              {
                index: true,
                element: <ParkingAdminIndexRedirect />
              },
              {
                element: <ProtectedRoute allowedRoles={['PARKING_ADMIN', 'SUPER_ADMIN', 'GENERAL_ADMIN']} />,
                children: [
                  {
                    path: 'users',
                    element: withCanvasSuspense(ParkingAdminUsersPage)
                  }
                ]
              },
              {
                path: 'tenants',
                element: withCanvasSuspense(TenantsManagementPage)
              },
              {
                path: 'estacionamiento',
                element: withCanvasSuspense(TenantEstacionamientoPage)
              },
              {
                path: 'reservas',
                element: withCanvasSuspense(HostReservasRecibidasPage)
              },
              {
                path: 'profile',
                element: withCanvasSuspense(ParkingAdminProfilePage)
              }
            ]
          }
        ]
      },
      {
        path: 'dashboard/operator',
        element: <ProtectedRoute allowedRoles={['PARKING_OPERATOR', 'OPERATOR', 'SUPER_ADMIN', 'GENERAL_ADMIN']} />,
        children: [
          {
            element: withSuspense(ParkingOperatorLayout),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/operator/profile" replace />
              },
              {
                path: 'profile',
                element: withCanvasSuspense(ParkingOperatorProfilePage)
              }
            ]
          }
        ]
      },
      {
        path: 'dashboard/general-admin',
        element: <ProtectedRoute allowedRoles={['GENERAL_ADMIN', 'SUPER_ADMIN']} />,
        children: [
          {
            element: withSuspense(GeneralAdminLayout),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/general-admin/reports" replace />
              },
              {
                path: 'reports',
                element: withCanvasSuspense(GeneralReportsPage)
              },
              {
                path: 'users',
                element: withCanvasSuspense(UsersManagementPage)
              },
              {
                path: 'roles-permissions',
                element: withCanvasSuspense(RolesPermissionsPage)
              },
              {
                path: 'tenants',
                element: withCanvasSuspense(TenantsManagementPage)
              },
              {
                path: 'solicitudes',
                element: withCanvasSuspense(AdminSolicitudesEstacionamientosPage)
              },
              {
                path: 'estacionamientos',
                element: <Navigate to="/dashboard/general-admin/solicitudes" replace />
              },
              {
                path: 'profile',
                element: withCanvasSuspense(AdminProfilePage)
              }
            ]
          }
        ]
      },
      {
        path: 'dashboard/admin',
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'GENERAL_ADMIN']} />,
        children: [
          {
            element: withSuspense(AdminLayout),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/admin/reports" replace />
              },
              {
                path: 'reports',
                element: withCanvasSuspense(GeneralReportsPage)
              },
              {
                path: 'users',
                element: withCanvasSuspense(UsersManagementPage)
              },
              {
                path: 'roles-permissions',
                element: withCanvasSuspense(RolesPermissionsPage)
              },
              {
                path: 'tenants',
                element: withCanvasSuspense(TenantsManagementPage)
              },
              {
                path: 'solicitudes',
                element: withCanvasSuspense(AdminSolicitudesEstacionamientosPage)
              },
              {
                path: 'estacionamientos',
                element: <Navigate to="/dashboard/admin/solicitudes" replace />
              },
              {
                path: 'profile',
                element: withCanvasSuspense(AdminProfilePage)
              }
            ]
          }
        ]
      }
    ]
  }
]);

