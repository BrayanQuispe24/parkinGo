import { Navigate } from 'react-router';
import { useAuthStore } from '../../../../store/useAuthStore';
import { getParkingAdminHomeRoute } from '../../../auth/domain/roleRouting';

/**
 * Resuelve la ruta inicial dentro de /dashboard/parking-admin según el rol activo:
 * HOST aterriza en su cochera; PARKING_ADMIN / admins aterrizan en gestión de operadores.
 */
export const ParkingAdminIndexRedirect = () => {
    const role = useAuthStore((state) => state.user?.role);
    return <Navigate to={getParkingAdminHomeRoute(role)} replace />;
};

