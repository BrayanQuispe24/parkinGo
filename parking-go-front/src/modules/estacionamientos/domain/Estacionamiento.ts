import type { TarifaModel } from './Tarifa';

export type EstadoEstacionamiento = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'INHABILITADO';

export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO';

export interface FotoEstacionamientoModel {
  id: string;
  url: string;
  createdAt: string;
}

export interface HorarioEstacionamientoModel {
  id: string;
  dia: DiaSemana;
  horaInicio: string;
  horaCierre: string;
}

export interface UsuarioSolicitanteModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  ci?: string | null;
  roleName?: string;
}

export interface TenantSummaryModel {
  id: string;
  nombre: string;
  nit: string;
  razonSocial?: string;
  direccion?: string | null;
  ciudad?: string | null;
  usuarioId?: string;
  usuario?: UsuarioSolicitanteModel | null;
}

export interface EstacionamientoModel {
  id: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  estado: EstadoEstacionamiento;
  tenantId: string;
  tenant?: TenantSummaryModel;
  motivoRechazo: string | null;
  fechaAprobacion: string | null;
  fotos: FotoEstacionamientoModel[];
  horarios: HorarioEstacionamientoModel[];
  tarifas?: TarifaModel[];
  createdAt: string;
  updatedAt: string;
}

export interface HorarioItemPayload {
  dia: DiaSemana;
  horaInicio: string;
  horaCierre: string;
}

export interface RegistrarEstacionamientoPayload {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  horarios: HorarioItemPayload[];
  fotos: File[];
  tenantId?: string;
}
