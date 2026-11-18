// src/modules/auth/presentation/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getDefaultDashboardRoute, normalizeSystemRole } from '../../domain/roleRouting';

interface ProtectedRouteProps {
    allowedRoles?: string[];
    redirectPath?: string;
}

export const ProtectedRoute = ({
    allowedRoles,
    redirectPath = '/auth?mode=login',
}: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0 && user) {
        const normalizedUserRole = normalizeSystemRole(user.role);
        const hasRequiredRole = allowedRoles.some(
            (role) => role.toUpperCase() === normalizedUserRole
        );

        if (!hasRequiredRole) {
            return <Navigate to={getDefaultDashboardRoute(user.role)} replace />;
        }
    }

    return <Outlet />;
};
