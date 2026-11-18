// src/modules/reservas/utils/qr-token.util.ts
import crypto from 'node:crypto';
import QRCode from 'qrcode';

const QR_SECRET_KEY = process.env.JWT_SECRET || 'parkingo-qr-access-secret-key-2026';

export interface TokenAccesoPayload {
  codigoReserva: string;
  clienteId: string;
  estacionamientoId: string;
  metodoPago: 'EFECTIVO' | 'QR';
  timestamp?: number;
}

export interface ValidacionTokenResult {
  valido: boolean;
  codigoReserva?: string;
  clienteId?: string;
  estacionamientoId?: string;
  metodoPago?: string;
  timestamp?: number;
  esLegacy?: boolean;
}

export class QrTokenUtil {
  /**
   * Genera un token criptográfico HMAC-SHA256 único e infalsificable para la boleta de reserva.
   */
  static generarTokenAcceso(payload: TokenAccesoPayload): string {
    const ts = payload.timestamp || Date.now();
    const dataString = `v1:${payload.codigoReserva}:${payload.clienteId}:${payload.estacionamientoId}:${payload.metodoPago}:${ts}`;
    
    const hmac = crypto.createHmac('sha256', QR_SECRET_KEY);
    hmac.update(dataString);
    const signature = hmac.digest('hex').substring(0, 16); // 16 caracteres de firma segura

    return `PARKINGO:${dataString}:${signature}`;
  }

  /**
   * Valida la autenticidad y firma criptográfica de un token QR presentado en garita.
   */
  static validarTokenAcceso(token: string): ValidacionTokenResult {
    if (!token || typeof token !== 'string') {
      return { valido: false };
    }

    const trimmed = token.trim();

    // Soporte para formato firmado: PARKINGO:v1:codigoReserva:clienteId:estacionamientoId:metodoPago:ts:signature
    if (trimmed.startsWith('PARKINGO:v1:')) {
      const parts = trimmed.split(':');
      if (parts.length >= 7) {
        const [, version, codigoReserva, clienteId, estacionamientoId, metodoPago, ts, signature] = parts;
        const dataString = `${version}:${codigoReserva}:${clienteId}:${estacionamientoId}:${metodoPago}:${ts}`;
        
        const hmac = crypto.createHmac('sha256', QR_SECRET_KEY);
        hmac.update(dataString);
        const expectedSignature = hmac.digest('hex').substring(0, 16);

        if (signature === expectedSignature) {
          return {
            valido: true,
            codigoReserva,
            clienteId,
            estacionamientoId,
            metodoPago,
            timestamp: Number(ts),
            esLegacy: false,
          };
        }
      }
    }

    // Soporte legacy/fallback para tokens previos: PARKINGO:RES:codigoReserva:clienteId:estacionamientoId
    if (trimmed.startsWith('PARKINGO:RES:')) {
      const parts = trimmed.split(':');
      if (parts.length >= 5) {
        const [, , codigoReserva, clienteId, estacionamientoId] = parts;
        return {
          valido: true,
          codigoReserva,
          clienteId,
          estacionamientoId,
          esLegacy: true,
        };
      }
    }

    // Soporte si se introduce directamente el código de reserva (ej. TKT-2026-4891)
    if (trimmed.startsWith('TKT-')) {
      return {
        valido: true,
        codigoReserva: trimmed,
        esLegacy: true,
      };
    }

    return { valido: false };
  }

  /**
   * Convierte un string de texto en una imagen QR en formato Data URL (Base64)
   */
  static async generarDataUrl(texto: string): Promise<string> {
    try {
      return await QRCode.toDataURL(texto, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
        color: {
          dark: '#063D25',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      console.error('Error al generar DataURL de QR:', err);
      return '';
    }
  }
}

