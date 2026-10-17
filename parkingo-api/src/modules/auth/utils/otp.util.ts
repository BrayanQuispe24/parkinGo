// src/modules/auth/utils/otp.util.ts
import crypto from 'crypto';

export class OtpUtil {
    /**
     * Genera un código OTP de 6 dígitos criptográficamente seguro
     */
    static generateOtp(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Genera el hash SHA-256 de un código OTP para almacenamiento seguro en BD
     */
    static hashOtp(otp: string): string {
        return crypto.createHash('sha256').update(otp.trim()).digest('hex');
    }

    /**
     * Compara de forma segura (timing safe) el código recibido contra el hash en base de datos
     */
    static verifyOtp(otp: string, storedHash: string): boolean {
        const inputHash = this.hashOtp(otp);
        const inputBuffer = Buffer.from(inputHash, 'hex');
        const storedBuffer = Buffer.from(storedHash, 'hex');

        if (inputBuffer.length !== storedBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(inputBuffer, storedBuffer);
    }
}
