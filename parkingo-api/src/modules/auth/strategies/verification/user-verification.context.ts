// src/modules/auth/strategies/verification/user-verification.context.ts
import { Injectable } from '@nestjs/common';

import { UserStatus } from '../../../usuarios/entities/usuario.entity.js';
import { RegisterAuthDto } from '../../dto/register-auth.dto.js';
import {
    UploadedDocumentFile,
    UserVerificationStrategy,
    VerificationProcessResult,
} from './user-verification-strategy.interface.js';
import { UserVerificationStrategyResolver } from './user-verification-strategy.resolver.js';

/**
 * Contexto del patrón Strategy (GoF) para la verificación de usuarios.
 * Mantiene la referencia a la estrategia activa y delega las operaciones
 * sin que el cliente (RegisterAuthAction) conozca las implementaciones concretas.
 */
@Injectable()
export class UserVerificationContext {
    private strategy?: UserVerificationStrategy;

    constructor(private readonly strategyResolver: UserVerificationStrategyResolver) { }

    /**
     * Configura la estrategia concreta directamente (GoF canónico)
     */
    setStrategy(strategy: UserVerificationStrategy): this {
        this.strategy = strategy;
        return this;
    }

    /**
     * Configura la estrategia resolviéndola según el rol del usuario
     */
    setStrategyByRole(roleName: string): this {
        this.strategy = this.strategyResolver.resolve(roleName);
        return this;
    }

    /**
     * Obtiene la estrategia actual configurada en el contexto
     */
    getStrategy(): UserVerificationStrategy {
        if (!this.strategy) {
            throw new Error(
                'UserVerificationContext: No se ha configurado ninguna estrategia. Llama a setStrategy() o setStrategyByRole() primero.',
            );
        }
        return this.strategy;
    }

    /**
     * Delega la validación de requerimientos de registro a la estrategia activa
     */
    validateRequirements(dto: RegisterAuthDto, file?: UploadedDocumentFile): void {
        this.getStrategy().validateRequirements(dto, file);
    }

    /**
     * Delega la determinación del estado inicial del usuario a la estrategia activa
     */
    determineInitialStatus(): UserStatus {
        return this.getStrategy().determineInitialStatus();
    }

    /**
     * Delega el procesamiento de la verificación (documentos, estado) a la estrategia activa
     */
    async processVerification(
        userId: string,
        file?: UploadedDocumentFile,
    ): Promise<VerificationProcessResult> {
        return this.getStrategy().processVerification(userId, file);
    }
}
