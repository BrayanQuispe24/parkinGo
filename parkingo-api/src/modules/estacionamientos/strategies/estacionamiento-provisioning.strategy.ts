import { RegistrarEstacionamientoDto } from '../dto/registrar-estacionamiento.dto.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import type { UploadedPhotoFile } from '../actions/registrar-estacionamiento.action.js';

export interface EstacionamientoProvisioningInput {
  dto: RegistrarEstacionamientoDto;
  files: UploadedPhotoFile[];
  userId: string;
  providedTenantId?: string;
  roleName?: string;
}

export interface EstacionamientoProvisioningStrategy {
  canHandle(roleName?: string): boolean;
  provision(input: EstacionamientoProvisioningInput): Promise<EstacionamientoResponseDto>;
}
