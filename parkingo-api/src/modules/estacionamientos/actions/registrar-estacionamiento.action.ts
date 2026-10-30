import { Injectable } from '@nestjs/common';
import { RegistrarEstacionamientoDto } from '../dto/registrar-estacionamiento.dto.js';
import { EstacionamientoResponseDto } from '../dto/estacionamiento-response.dto.js';
import { EstacionamientoProvisioningContext } from '../strategies/estacionamiento-provisioning.context.js';

export interface UploadedPhotoFile {
  originalname: string;
  buffer?: Buffer;
  path?: string;
  mimetype?: string;
}

@Injectable()
export class RegistrarEstacionamientoAction {
  constructor(
    private readonly provisioningContext: EstacionamientoProvisioningContext,
  ) {}

  async execute(
    dto: RegistrarEstacionamientoDto,
    files: UploadedPhotoFile[],
    userId: string,
    providedTenantId?: string,
    roleName?: string,
  ): Promise<EstacionamientoResponseDto> {
    const strategy = this.provisioningContext.getStrategy(roleName);
    return strategy.provision({
      dto,
      files,
      userId,
      providedTenantId,
      roleName,
    });
  }
}
