import type {
  EstacionamientoModel,
  EstadoEstacionamiento,
  FotoEstacionamientoModel,
  HorarioItemPayload,
  RegistrarEstacionamientoPayload,
} from './Estacionamiento';

export interface EstacionamientoRepository {
  getMiEstacionamiento(): Promise<EstacionamientoModel | null>;
  registrarEstacionamiento(payload: RegistrarEstacionamientoPayload): Promise<EstacionamientoModel>;
  actualizarHorarios(horarios: HorarioItemPayload[]): Promise<EstacionamientoModel>;
  listarEstacionamientos(estado?: EstadoEstacionamiento): Promise<EstacionamientoModel[]>;
  aprobarEstacionamiento(id: string): Promise<EstacionamientoModel>;
  rechazarEstacionamiento(id: string, motivoRechazo: string): Promise<EstacionamientoModel>;
  inhabilitarEstacionamiento(id: string): Promise<EstacionamientoModel>;
  subirFotos(fotos: File[]): Promise<FotoEstacionamientoModel[]>;
  eliminarFoto(fotoId: string): Promise<FotoEstacionamientoModel>;
}
