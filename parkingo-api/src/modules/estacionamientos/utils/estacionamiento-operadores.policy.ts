import { ForbiddenException } from '@nestjs/common';
import { EstacionamientoWithRelations } from '../repositories/estacionamiento.repository.js';

/**
 * Garantiza que un estacionamiento pertenezca a una modalidad comercial compatible con operadores.
 * Los parqueos registrados por usuarios con rol HOST (C2C) no admiten operadores.
 */
export function assertEstacionamientoPermiteOperadores(
  estacionamiento: EstacionamientoWithRelations,
): void {
  const ownerRole = estacionamiento.tenant?.usuario?.role?.name?.toUpperCase();
  if (ownerRole === 'HOST') {
    throw new ForbiddenException(
      'Los estacionamientos registrados por un Anfitrión no admiten asignación ni gestión de operadores.',
    );
  }
}

