import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { LandingPage } from './modules/landing/presentation/pages/LandingPage';
import { AuthPage } from './modules/auth/presentation/pages/AuthPage';
import { ProtectedRoute } from './modules/auth/presentation/components/ProtectedRoute';
import { DriverDashboardPage } from './modules/driver/presentation/pages/DriverDashboardPage';
import { AdminLayout } from './modules/admin/presentation/layouts/AdminLayout';
import { GeneralReportsPage } from './modules/admin/presentation/pages/GeneralReportsPage';
import { UsersManagementPage } from './modules/admin/presentation/pages/UsersManagementPage';
import { RolesPermissionsPage } from './modules/admin/presentation/pages/RolesPermissionsPage';
import { ParkingAdminLayout } from './modules/parking-admin/presentation/layouts/ParkingAdminLayout';
import { ParkingAdminUsersPage } from './modules/parking-admin/presentation/pages/ParkingAdminUsersPage';
import { ParkingAdminProfilePage } from './modules/parking-admin/presentation/pages/ParkingAdminProfilePage';
import { ParkingOperatorLayout } from './modules/parking-operator/presentation/layouts/ParkingOperatorLayout';
import { ParkingOperatorProfilePage } from './modules/parking-operator/presentation/pages/ParkingOperatorProfilePage';
import { AdminProfilePage } from './modules/admin/presentation/pages/AdminProfilePage';
import { TenantsManagementPage } from './modules/tenants/presentation/pages/TenantsManagementPage';
import { GeneralAdminLayout } from './modules/general-admin/presentation/layouts/GeneralAdminLayout';
import About from './pages/About';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
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
            element: <DriverDashboardPage />
          },
          {
            path: 'dashboard/driver',
            element: <DriverDashboardPage />
          }
        ]
      },
      {
        path: 'dashboard/parking-admin',
        element: <ProtectedRoute allowedRoles={['PARKING_ADMIN', 'HOST', 'SUPER_ADMIN', 'GENERAL_ADMIN']} />,
        children: [
          {
            element: <ParkingAdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/parking-admin/users" replace />
              },
              {
                path: 'users',
                element: <ParkingAdminUsersPage />
              },
              {
                path: 'tenants',
                element: <TenantsManagementPage />
              },
              {
                path: 'profile',
                element: <ParkingAdminProfilePage />
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
            element: <ParkingOperatorLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/operator/profile" replace />
              },
              {
                path: 'profile',
                element: <ParkingOperatorProfilePage />
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
            element: <GeneralAdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/general-admin/reports" replace />
              },
              {
                path: 'reports',
                element: <GeneralReportsPage />
              },
              {
                path: 'users',
                element: <UsersManagementPage />
              },
              {
                path: 'roles-permissions',
                element: <RolesPermissionsPage />
              },
              {
                path: 'tenants',
                element: <TenantsManagementPage />
              },
              {
                path: 'profile',
                element: <AdminProfilePage />
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
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard/admin/reports" replace />
              },
              {
                path: 'reports',
                element: <GeneralReportsPage />
              },
              {
                path: 'users',
                element: <UsersManagementPage />
              },
              {
                path: 'roles-permissions',
                element: <RolesPermissionsPage />
              },
              {
                path: 'tenants',
                element: <TenantsManagementPage />
              },
              {
                path: 'profile',
                element: <AdminProfilePage />
              }
            ]
          }
        ]
      }
    ]
  }
]);
