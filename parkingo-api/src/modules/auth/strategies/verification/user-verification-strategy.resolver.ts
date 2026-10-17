// src/modules/auth/strategies/verification/user-verification-strategy.resolver.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentedPartnerStrategy } from './documented-partner.strategy.js';
import { StandardDriverStrategy } from './standard-driver.strategy.js';
import { UserVerificationStrategy } from './user-verification-strategy.interface.js';

@Injectable()
export class UserVerificationStrategyResolver {
    private readonly strategiesByRole: ReadonlyMap<string, UserVerificationStrategy>;

    constructor(
        private readonly driverStrategy: StandardDriverStrategy,
        private readonly partnerStrategy: DocumentedPartnerStrategy,
    ) {
        this.strategiesByRole = new Map<string, UserVerificationStrategy>([
            ['DRIVER', this.driverStrategy],
            ['HOST', this.partnerStrategy],
            ['PARKING_ADMIN', this.partnerStrategy],
        ]);
    }

    resolve(roleName: string): UserVerificationStrategy {
        const normalized = roleName.trim().toUpperCase();
        const strategy = this.strategiesByRole.get(normalized);

        if (!strategy) {
            throw new BadRequestException(
                `No se encontró una estrategia de verificación configurada para el rol: ${roleName}`,
            );
        }

        return strategy;
    }
}
