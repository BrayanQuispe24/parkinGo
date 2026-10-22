import { Prisma } from '@prisma/client';

export type OperadorWithRole = Prisma.UserGetPayload<{
  include: {
    role: true;
  };
}>;

export abstract class EstacionamientoOperadorRepository {
  abstract findOperadoresByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<OperadorWithRole[]>;

  abstract findOperadoresDisponibles(
    adminUserId?: string,
  ): Promise<OperadorWithRole[]>;

  abstract findOperadoresByIds(
    usuarioIds: string[],
  ): Promise<OperadorWithRole[]>;

  abstract asignarOperadores(
    estacionamientoId: string,
    usuarioIds: string[],
  ): Promise<void>;

  abstract desasignarOperador(
    estacionamientoId: string,
    usuarioId: string,
  ): Promise<void>;
}
