// src/modules/driver/presentation/components/QrPaymentCheckoutModal.tsx
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { BoletaReserva } from '../../domain/DriverBooking';

interface QrPaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: BoletaReserva | null;
  qrPayload?: string;
  onConfirmPayment: (reservaId: string) => Promise<void>;
  isConfirming?: boolean;
}

export const QrPaymentCheckoutModal: React.FC<QrPaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  reserva,
  qrPayload,
  onConfirmPayment,
  isConfirming = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutos en segundos
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(600);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !reserva) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const qrString = qrPayload || reserva.qrToken || `PARKINGO:QR:PAGO:${reserva.codigoReserva}:${reserva.total}:BOB`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          textAlign: 'center',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, #006D36 0%, #064E2B 100%)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Pago Digital Interoperable
          </div>
          <h3 style={{ margin: '0.25rem 0', fontSize: '1.2rem', fontWeight: 800 }}>
            Escanea tu Código QR
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#D1FAE5' }}>
            Boleta {reserva.codigoReserva} • {reserva.estacionamientoNombre}
          </p>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: '1.5rem' }}>
          {/* Monto y Temporizador */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total a Transferir</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#006D36' }}>
                Bs. {reserva.total.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Expira en</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: timeLeft < 120 ? '#EF4444' : '#0F172A' }}>
                <i className="fa-regular fa-clock" style={{ marginRight: '0.35rem' }}></i>
                {timerDisplay}
              </div>
            </div>
          </div>

          {/* Gráfico QR Generado */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid #006D36',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'inline-block',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 4px 12px rgba(0, 109, 54, 0.1)',
            }}
          >
            <QRCodeSVG
              value={qrString}
              size={190}
              level="M"
              includeMargin={false}
            />
          </div>

          <div style={{ fontSize: '0.74rem', color: '#64748B', marginBottom: '1.25rem', fontWeight: 600 }}>
            Compatible con QR Simple Bolivia • BCP, BNB, Banco Unión y otros
          </div>

          {/* Instrucciones de Uso */}
          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.45 }}>
            Abre la app de tu entidad bancaria, selecciona <strong>Pago por QR</strong> y enfoca este código para debitar <strong>Bs. {reserva.total.toFixed(2)}</strong>.
          </div>

          {/* Botón de Simulación / Confirmación Digital Inmediata */}
          <button
            type="button"
            onClick={() => onConfirmPayment(reserva.id)}
            disabled={isConfirming}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: '#006D36',
              color: '#FFFFFF',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: isConfirming ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 109, 54, 0.3)',
              marginBottom: '0.75rem',
            }}
          >
            {isConfirming ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Verificando Transferencia con el Banco...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-check-double"></i>
                <span>Confirmar Pago Realizado</span>
              </>
            )}
          </button>

          {/* Opciones secundarias */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleCopy}
              style={{
                background: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-copy" style={{ marginRight: '0.35rem' }}></i>
              {copied ? '¡Copiado!' : 'Copiar Token'}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#64748B',
                cursor: 'pointer',
              }}
            >
              Pagar Después en Garita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
