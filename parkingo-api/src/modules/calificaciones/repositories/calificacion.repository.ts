export interface CreateCalificacionData {
  puntaje: number;
  comentario: string;
  clienteId: string;
  estacionamientoId: string;
}

export interface CalificacionWithRelations {
  id: string;
  puntaje: number;
  comentario: string;
  clienteId: string;
  cliente: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  estacionamientoId: string;
  estacionamiento: {
    id: string;
    nombre: string;
    tenantId: string;
  };
  fechaCreado: Date;
}

export abstract class CalificacionRepository {
  abstract create(data: CreateCalificacionData): Promise<CalificacionWithRelations>;
  abstract findByEstacionamientoId(estacionamientoId: string): Promise<CalificacionWithRelations[]>;
  abstract findByTenantId(tenantId: string): Promise<CalificacionWithRelations[]>;
  abstract findByClienteId(clienteId: string): Promise<CalificacionWithRelations[]>;
  abstract getSummaryByEstacionamientoId(
    estacionamientoId: string,
  ): Promise<{ promedio: number; total: number }>;
}
