// src/modules/auth/utils/email-validator.util.ts
import dns from 'dns/promises';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const disposableDomainsList: string[] = require('disposable-email-domains');
const disposableDomainsSet = new Set<string>(disposableDomainsList);

export class EmailValidatorUtil {
    /**
     * Valida si el dominio del correo pertenece a un proveedor temporal/desechable
     */
    static isDisposable(email: string): boolean {
        const domain = email.split('@')[1]?.toLowerCase().trim();
        if (!domain) return false;
        return disposableDomainsSet.has(domain);
    }

    /**
     * Valida en tiempo real si el dominio cuenta con al menos un servidor MX activo
     */
    static async hasValidMxRecords(email: string): Promise<boolean> {
        const domain = email.split('@')[1]?.toLowerCase().trim();
        if (!domain) return false;

        try {
            const mxRecords = await dns.resolveMx(domain);
            return Array.isArray(mxRecords) && mxRecords.length > 0;
        } catch {
            return false;
        }
    }
}
