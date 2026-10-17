// src/modules/auth/presentation/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';

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
        const hasRequiredRole = allowedRoles.some(
            (role) => role.toUpperCase() === user.role?.toUpperCase()
        );

        if (!hasRequiredRole) {
            const isOperator = user.role === 'PARKING_OPERATOR' || user.role === 'OPERATOR' || user.role === 'operador';
            const isParkingAdmin = user.role === 'PARKING_ADMIN' || user.role === 'HOST';
            const isGeneralAdmin = user.role === 'GENERAL_ADMIN';
            const defaultRedirect = user.role === 'DRIVER' || user.role === 'conductor'
                ? '/dashboard'
                : isOperator
                    ? '/dashboard/operator'
                    : isParkingAdmin
                        ? '/dashboard/parking-admin'
                        : isGeneralAdmin
                            ? '/dashboard/general-admin'
                            : '/dashboard/admin';
            return <Navigate to={defaultRedirect} replace />;
        }
    }

    return <Outlet />;
};
