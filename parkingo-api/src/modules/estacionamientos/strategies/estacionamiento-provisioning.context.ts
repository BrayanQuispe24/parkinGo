import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  EstacionamientoProvisioningStrategy,
} from './estacionamiento-provisioning.strategy.js';
import { CommercialParkingProvisioningStrategy } from './commercial-parking-provisioning.strategy.js';
import { HostResidentialProvisioningStrategy } from './host-residential-provisioning.strategy.js';

@Injectable()
export class EstacionamientoProvisioningContext {
  private readonly strategies: EstacionamientoProvisioningStrategy[];

  constructor(
    commercialStrategy: CommercialParkingProvisioningStrategy,
    hostStrategy: HostResidentialProvisioningStrategy,
  ) {
    this.strategies = [hostStrategy, commercialStrategy];
  }

  getStrategy(roleName?: string): EstacionamientoProvisioningStrategy {
    const matched = this.strategies.find((strategy) => strategy.canHandle(roleName));
    if (!matched) {
      throw new InternalServerErrorException(
        `No se encontró una estrategia de aprovisionamiento válida para el rol: ${roleName}`,
      );
    }
    return matched;
  }
}
