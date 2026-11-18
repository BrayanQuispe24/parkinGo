// src/modules/reservas/presentation/components/ModalConfirmarPagoEfectivo.tsx
import React, { useState, useEffect } from 'react';
import type { BoletaReserva } from '../../../driver/domain/DriverBooking';

interface ModalConfirmarPagoEfectivoProps {
  isOpen: boolean;
  onClose: () => void;
  reserva: BoletaReserva | null;
  onConfirm: (payload: { reservaId: string; montoEntregado?: number; notas?: string }) => Promise<void>;
  isLoading?: boolean;
}

export const ModalConfirmarPagoEfectivo: React.FC<ModalConfirmarPagoEfectivoProps> = ({
  isOpen,
  onClose,
  reserva,
  onConfirm,
  isLoading = false,
}) => {
  const [montoEntregado, setMontoEntregado] = useState<string>('');
  const [notas, setNotas] = useState<string>('');

  useEffect(() => {
    if (reserva) {
      setMontoEntregado(reserva.total.toString());
      setNotas('');
    }
  }, [reserva]);

  if (!isOpen || !reserva) return null;

  const total = reserva.total;
  const numEntregado = parseFloat(montoEntregado) || 0;
  const cambio = Math.max(0, Math.round((numEntregado - total) * 100) / 100);
  const esInsuficiente = numEntregado < total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (esInsuficiente) return;

    await onConfirm({
      reservaId: reserva.id,
      montoEntregado: numEntregado,
      notas: notas.trim() || undefined,
    });
  };

  const primerDetalle = reserva.detalles[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
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
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: '#063D25',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22C55E',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                Registrar Cobro en Efectivo
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#CBD5CE' }}>
                Boleta {reserva.codigoReserva} • Garita / Ventanilla
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#CBD5CE',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Ficha Resumen de la Boleta */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Conductor:</span>
              <strong style={{ color: '#0F172A' }}>{reserva.clienteNombre}</strong>
            </div>
            {reserva.clienteTelefono && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Teléfono:</span>
                <span style={{ color: '#0F172A' }}>{reserva.clienteTelefono}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Vehículo:</span>
              <span style={{ color: '#0F172A', fontWeight: 600 }}>
                {primerDetalle?.vehiculoPlaca ? `[${primerDetalle.vehiculoPlaca}] ${primerDetalle.vehiculoModelo || ''}` : 'No asignado'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Espacio:</span>
              <span style={{ color: '#006D36', fontWeight: 700 }}>
                Plaza {primerDetalle?.codigoEspacio || 'General'}
              </span>
            </div>
          </div>

          {/* Importe a Cobrar */}
          <div
            style={{
              textAlign: 'center',
              padding: '0.85rem',
              background: '#ECFDF5',
              border: '1.5px dashed #006D36',
              borderRadius: '8px',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#006D36', fontWeight: 700, letterSpacing: '0.05em' }}>
              Total Exacto a Cobrar
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#006D36', margin: '0.2rem 0' }}>
              Bs. {total.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#065F46' }}>
              Modalidad de pago autorizada: <strong>EFECTIVO (En Garita)</strong>
            </div>
          </div>

          {/* Input de Efectivo Recibido y Cambio */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.35rem',
                }}
              >
                Efectivo Recibido (Bs.) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                required
                value={montoEntregado}
                onChange={(e) => setMontoEntregado(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: esInsuficiente ? '1.5px solid #EF4444' : '1.5px solid #CBD5E1',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.35rem',
                }}
              >
                Cambio a Entregar (Vuelto)
              </label>
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  background: esInsuficiente ? '#FEF2F2' : '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  fontSize: '1rem',
                  fontWeight: 900,
                  color: esInsuficiente ? '#DC2626' : '#006D36',
                  textAlign: 'right',
                }}
              >
                {esInsuficiente ? 'Monto insuficiente' : `Bs. ${cambio.toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Notas Opcionales */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#64748B',
                marginBottom: '0.35rem',
              }}
            >
              Notas de Garita (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Pagó con billete de 100 Bs. sin contratiempos"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          {/* Botones de Acción */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || esInsuficiente}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '6px',
                border: 'none',
                background: esInsuficiente ? '#94A3B8' : '#006D36',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: esInsuficiente ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 109, 54, 0.25)',
              }}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Confirmando Cobro...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Confirmar Pago Recibido</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
