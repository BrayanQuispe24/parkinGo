// src/modules/calificaciones/domain/Calificacion.ts

export interface CalificacionModel {
  id: string;
  puntaje: number;
  comentario: string;
  estacionamientoId: string;
  estacionamientoNombre: string;
  clienteId: string;
  clienteNombre: string;
  fechaCreado: string;
}

export interface EstacionamientoCalificacionesSummary {
  promedio: number;
  total: number;
  items: CalificacionModel[];
}

export interface CrearCalificacionPayload {
  estacionamientoId: string;
  puntaje: number;
  comentario: string;
}
