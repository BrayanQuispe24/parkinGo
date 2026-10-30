// src/modules/calificaciones/domain/CalificacionRepository.ts
import type {
  CalificacionModel,
  CrearCalificacionPayload,
  EstacionamientoCalificacionesSummary,
} from './Calificacion';

export interface CalificacionRepository {
  crear(payload: CrearCalificacionPayload): Promise<CalificacionModel>;
  getByTenant(): Promise<CalificacionModel[]>;
  getByEstacionamiento(estacionamientoId: string): Promise<EstacionamientoCalificacionesSummary>;
  getMisCalificaciones(): Promise<CalificacionModel[]>;
}
