/**
 * Normaliza y evalúa si el rol corresponde a un Anfitrión C2C (HOST).
 */
export function isHostRole(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.trim().toUpperCase();
  return normalized === 'HOST' || normalized === 'ANFITRION';
}

/**
 * Normaliza un nombre de rol al identificador canónico de permisos del sistema.
 */
export function normalizeSystemRole(role?: string | null): string {
  if (!role) return '';
  const normalized = role.trim().toUpperCase();
  if (normalized === 'ANFITRION') return 'HOST';
  if (normalized === 'OPERADOR') return 'OPERATOR';
  if (normalized === 'CONDUCTOR') return 'DRIVER';
  return normalized;
}

/**
 * Retorna la ruta de inicio dentro del workspace /dashboard/parking-admin según el rol.
 * HOST aterriza directamente en su cochera; PARKING_ADMIN aterriza en gestión de operadores.
 */
export function getParkingAdminHomeRoute(role?: string | null): string {
  return isHostRole(role)
    ? '/dashboard/parking-admin/estacionamiento'
    : '/dashboard/parking-admin/users';
}

/**
 * Resuelve la ruta principal de redirección post-autenticación para cada rol.
 */
export function getDefaultDashboardRoute(role?: string | null): string {
  const normalized = normalizeSystemRole(role);

  if (normalized === 'PARKING_OPERATOR' || normalized === 'OPERATOR') {
    return '/dashboard/operator';
  }
  if (normalized === 'HOST') {
    return '/dashboard/parking-admin/estacionamiento';
  }
  if (normalized === 'PARKING_ADMIN') {
    return '/dashboard/parking-admin/users';
  }
  if (normalized === 'GENERAL_ADMIN') {
    return '/dashboard/general-admin';
  }
  if (normalized === 'SUPER_ADMIN' || normalized === 'ADMIN') {
    return '/dashboard/admin';
  }
  return '/dashboard';
}

