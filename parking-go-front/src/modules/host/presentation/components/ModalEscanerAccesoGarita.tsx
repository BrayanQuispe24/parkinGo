// src/modules/host/presentation/components/ModalEscanerAccesoGarita.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import {
  useVerificarAccesoMutation,
  useConfirmarPagoMutation,
  type ResultadoVerificacionAcceso,
} from '../../../reservas/application/usePagosReservaMutations';

interface ModalEscanerAccesoGaritaProps {
  isOpen: boolean;
  onClose: () => void;
  estacionamientoId?: string;
  onAccesoConfirmado?: () => void;
}

export const ModalEscanerAccesoGarita: React.FC<ModalEscanerAccesoGaritaProps> = ({
  isOpen,
  onClose,
  estacionamientoId,
  onAccesoConfirmado,
}) => {
  const [manualToken, setManualToken] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoVerificacionAcceso | null>(null);
  const [montoEntregado, setMontoEntregado] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const verificarMutation = useVerificarAccesoMutation();
  const confirmarPagoMutation = useConfirmarPagoMutation();

  const handleProcesarToken = async (token: string) => {
    const cleanToken = token.trim();
    if (!cleanToken) return;

    try {
      const res = await verificarMutation.mutateAsync({
        token: cleanToken,
        qrToken: cleanToken,
        estacionamientoId,
      });
      setResultado(res);
      const totalCobro = res.montoTotal ?? 0;
      if (totalCobro > 0) {
        setMontoEntregado(totalCobro.toString());
      }
    } catch (err: unknown) {
      console.error('Error al verificar acceso:', err);
      let errorMsg = 'Error de conexión o token no reconocido por el sistema.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
      }
      setResultado({
        valido: false,
        mensaje: errorMsg,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setResultado(null);
      setManualToken('');
      setCameraError(null);
      return;
    }

    const qrElementId = 'garita-qr-reader-region';
    let scanner: Html5Qrcode | null = null;

    const startCamera = async () => {
      try {
        scanner = new Html5Qrcode(qrElementId);
        html5QrCodeRef.current = scanner;
        setIsScanning(true);
        setCameraError(null);

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 240, height: 240 },
          },
          (decodedText) => {
            // Éxito al escanear
            if (scanner && scanner.isScanning) {
              scanner.pause(true);
            }
            handleProcesarToken(decodedText);
          },
          () => {
            // Ignorar frames sin QR
          },
        );
      } catch (err) {
        console.warn('No se pudo acceder a la cámara:', err);
        setCameraError(
          'No se pudo acceder a la cámara del dispositivo. Puedes ingresar el código o token manualmente.',
        );
        setIsScanning(false);
      }
    };

    // Iniciar cámara con pequeño retardo para asegurar montaje en el DOM
    const timeout = setTimeout(startCamera, 300);

    return () => {
      clearTimeout(timeout);
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current
            .stop()
            .then(() => html5QrCodeRef.current?.clear())
            .catch((e) => console.warn('Error al detener scanner:', e));
        }
      }
    };
  }, [isOpen]);

  const handleCobrarEnEfectivo = async () => {
    if (!resultado?.reservaId) return;
    const monto = Number(montoEntregado) || resultado.montoTotal || 0;

    try {
      await confirmarPagoMutation.mutateAsync({
        reservaId: resultado.reservaId,
        metodoPago: 'EFECTIVO',
        montoEntregado: monto,
        notas: 'Cobrado y validado en garita con token QR',
      });
      // Re-verificar para actualizar el estado visual
      setResultado((prev) =>
        prev
          ? {
              ...prev,
              mensaje: 'Pago en efectivo registrado. Acceso confirmado.',
              requiereCobroEfectivo: false,
              estadoReserva: 'CONFIRMADA',
              estadoPago: 'COMPLETADO',
            }
          : null,
      );
      if (onAccesoConfirmado) {
        onAccesoConfirmado();
      }
    } catch (err) {
      console.error('Error al registrar pago en garita:', err);
      alert('No se pudo registrar el cobro en efectivo. Verifica la conexión.');
    }
  };

  const handleReintentarEscaneo = () => {
    setResultado(null);
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      html5QrCodeRef.current.resume();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div
          style={{
            padding: '1.2rem 1.6rem',
            background: 'linear-gradient(135deg, #063D25 0%, #0B5735 100%)',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-camera"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                Control de Acceso Garita
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#D1FAE5' }}>
                Validación de autenticidad de tickets y cobro en efectivo
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '1.25rem',
              cursor: 'pointer',
              opacity: 0.8,
              padding: '0.3rem',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Contenido con scroll */}
        <div style={{ padding: '1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Cámara / Scanner Viewport */}
          <div
            style={{
              background: '#0F172A',
              borderRadius: '12px',
              overflow: 'hidden',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            <div
              id="garita-qr-reader-region"
              style={{
                width: '100%',
                maxWidth: '380px',
              }}
            />

            {isScanning && !cameraError && !resultado && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '99px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <i className="fa-solid fa-expand" style={{ color: '#4ADE80' }}></i>
                <span>Enfoca el código QR de la boleta</span>
              </div>
            )}

            {cameraError && (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: '#F87171',
                  fontSize: '0.82rem',
                }}
              >
                <i className="fa-solid fa-video-slash" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <div>{cameraError}</div>
              </div>
            )}
          </div>

          {/* Formulario Manual de Respaldo */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ingresa token o código de reserva manual..."
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleProcesarToken(manualToken);
                }
              }}
              style={{
                flex: 1,
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => handleProcesarToken(manualToken)}
              disabled={verificarMutation.isPending || !manualToken.trim()}
              style={{
                padding: '0.5rem 1rem',
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {verificarMutation.isPending ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <i className="fa-solid fa-check"></i>
              )}
              <span>Validar</span>
            </button>
          </div>

          {/* Resultado de la Verificación */}
          {resultado && (
            <div
              style={{
                borderRadius: '10px',
                padding: '1.1rem',
                background: resultado.valido ? '#F0FDF4' : '#FEF2F2',
                border: `1.5px solid ${resultado.valido ? '#86EFAC' : '#FECACA'}`,
                animation: 'fadeIn 0.25s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: resultado.valido ? '#DCFCE7' : '#FEE2E2',
                    color: resultado.valido ? '#16A34A' : '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  <i className={`fa-solid ${resultado.valido ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: resultado.valido ? '#166534' : '#991B1B',
                    }}
                  >
                    {resultado.valido ? 'Ticket Auténtico y Válido' : 'Validación Rechazada'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: resultado.valido ? '#14532D' : '#7F1D1D' }}>
                    {resultado.mensaje}
                  </p>
                </div>
              </div>

              {/* Ficha de la Reserva si es Válida */}
              {resultado.valido && resultado.codigoReserva && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px dashed #86EFAC',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.65rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>CONDUCTOR:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{resultado.clienteNombre || 'Conductor'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>PLACA:</span>
                    <div style={{ fontWeight: 800, color: '#1E3A8A', fontFamily: 'monospace' }}>
                      {resultado.vehiculoPlaca || 'Sin placa'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>PLAZA ASIGNADA:</span>
                    <div style={{ fontWeight: 800, color: '#006D36' }}>{resultado.espacioCodigo || 'Plaza'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>MÉTODO DE PAGO:</span>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{resultado.metodoPago || 'EFECTIVO'}</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: '#64748B', fontSize: '0.72rem' }}>ESTADO ACTUAL:</span>
                    <div
                      style={{
                        display: 'inline-block',
                        marginLeft: '0.4rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                        background: resultado.estadoReserva === 'CONFIRMADA' ? '#DCFCE7' : '#FEF3C7',
                        color: resultado.estadoReserva === 'CONFIRMADA' ? '#166534' : '#92400E',
                      }}
                    >
                      {resultado.estadoReserva || 'PENDIENTE_PAGO'}
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de Cobro en Efectivo si aplica */}
              {resultado.requiereCobroEfectivo && (
                <div
                  style={{
                    marginTop: '1rem',
                    background: '#FEF9C3',
                    border: '1px solid #FDE047',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713F12' }}>
                      <i className="fa-solid fa-hand-holding-dollar" style={{ marginRight: '0.35rem' }}></i>
                      Monto a Cobrar en Garita:
                    </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#006D36' }}>
                      Bs. {(resultado.montoTotal ?? 0).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Monto entregado..."
                      value={montoEntregado}
                      onChange={(e) => setMontoEntregado(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        border: '1px solid #CA8A04',
                        background: '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCobrarEnEfectivo}
                      disabled={confirmarPagoMutation.isPending}
                      style={{
                        padding: '0.55rem 1.1rem',
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 2px 8px rgba(0, 109, 54, 0.3)',
                      }}
                    >
                      {confirmarPagoMutation.isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-receipt"></i>
                      )}
                      <span>Confirmar Cobro y Acceso</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botón Escanear Siguiente */}
              <div style={{ marginTop: '0.85rem', textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={handleReintentarEscaneo}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fa-solid fa-rotate-right" style={{ marginRight: '0.35rem' }}></i>
                  Escanear Otro Ticket
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.4rem',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            textAlign: 'right',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
