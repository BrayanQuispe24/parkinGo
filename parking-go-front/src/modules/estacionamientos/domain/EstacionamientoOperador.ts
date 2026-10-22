export interface OperadorEstacionamientoModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nombreCompleto: string;
  ci: string;
  phone?: string | null;
  photoUrl?: string | null;
  status: string;
  estacionamientoId?: string | null;
  roleName: string;
  createdAt: string;
}

export interface AsignarOperadoresPayload {
  usuarioIds: string[];
}
