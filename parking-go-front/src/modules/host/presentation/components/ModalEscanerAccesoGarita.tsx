// src/modules/host/presentation/components/ModalEscanerAccesoGarita.tsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import {
  useVerificarAccesoMutation,
  useConfirmarPagoMutation,
  useRegistrarMovimientoMutation,
  type ResultadoVerificacionAcceso,
} from '../../../reservas/application/usePagosReservaMutations';

interface ModalEscanerAccesoGaritaProps {
  isOpen: boolean;
  onClose: () => void;
  estacionamientoId?: string;
  onAccesoConfirmado?: () => void;
}

export interface DispositivoCamara {
  id: string;
  label: string;
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

  // Selector de cámara dinámico
  const [camarasDisponibles, setCamarasDisponibles] = useState<DispositivoCamara[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const verificarMutation = useVerificarAccesoMutation();
  const confirmarPagoMutation = useConfirmarPagoMutation();
  const registrarMovimientoMutation = useRegistrarMovimientoMutation();

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

  const startCamera = async (targetCameraId?: string) => {
    const qrElementId = 'garita-qr-reader-region';
    try {
      setIsSwitching(true);
      setCameraError(null);

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(qrElementId);
      }
      const scanner = html5QrCodeRef.current;

      if (scanner.isScanning) {
        await scanner.stop();
      }

      // Enumerar cámaras disponibles en el dispositivo
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          const mappedDevices: DispositivoCamara[] = devices.map((d, idx) => ({
            id: d.id,
            label: d.label || `Cámara ${idx + 1}`,
          }));
          setCamarasDisponibles(mappedDevices);
        }
      } catch (e) {
        console.warn('No se pudieron enumerar cámaras previamente:', e);
      }

      const savedDeviceId = localStorage.getItem('garita_preferred_camera_id') || '';
      const cameraToUse = targetCameraId || selectedCameraId || savedDeviceId;

      const cameraConfig = cameraToUse
        ? cameraToUse
        : { facingMode: 'environment' };

      setIsScanning(true);

      await scanner.start(
        cameraConfig,
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          if (scanner && scanner.isScanning) {
            scanner.pause(true);
          }
          handleProcesarToken(decodedText);
        },
        () => {
          // Ignorar frames sin código QR
        },
      );

      // Si inició exitosamente, actualizar listas y persistencia
      try {
        const postDevices = await Html5Qrcode.getCameras();
        if (postDevices && postDevices.length > 0) {
          const mapped = postDevices.map((d, idx) => ({
            id: d.id,
            label: d.label || `Cámara ${idx + 1}`,
          }));
          setCamarasDisponibles(mapped);
          if (!cameraToUse) {
            setSelectedCameraId(mapped[0].id);
            localStorage.setItem('garita_preferred_camera_id', mapped[0].id);
          } else {
            setSelectedCameraId(cameraToUse);
            localStorage.setItem('garita_preferred_camera_id', cameraToUse);
          }
        }
      } catch (e) {
        console.warn('Error al consultar cámaras post-inicio:', e);
      }

      setIsSwitching(false);
    } catch (err) {
      console.warn('No se pudo acceder a la cámara:', err);
      setCameraError(
        'No se pudo acceder a la cámara del dispositivo o faltan permisos. Puedes seleccionar otra cámara o ingresar el código manualmente.',
      );
      setIsScanning(false);
      setIsSwitching(false);
    }
  };

  const handleCambiarCamara = async (nuevoCameraId: string) => {
    if (!nuevoCameraId || nuevoCameraId === selectedCameraId || isSwitching) return;
    setSelectedCameraId(nuevoCameraId);
    localStorage.setItem('garita_preferred_camera_id', nuevoCameraId);
    await startCamera(nuevoCameraId);
  };

  useEffect(() => {
    if (!isOpen) {
      setResultado(null);
      setManualToken('');
      setCameraError(null);
      return;
    }

    const timeout = setTimeout(() => {
      startCamera();
    }, 250);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKeyDown);
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current
            .stop()
            .then(() => html5QrCodeRef.current?.clear())
            .catch((e) => console.warn('Error al detener scanner:', e));
        }
      }
    };
  }, [isOpen, onClose]);

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
      setResultado((prev) =>
        prev
          ? {
              ...prev,
              mensaje: 'Pago en efectivo registrado. Acceso confirmado y barrera habilitada.',
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

  const handleRegistrarMovimiento = async (tipo: 'ENTRADA' | 'SALIDA') => {
    if (!resultado?.reservaId) return;

    try {
      await registrarMovimientoMutation.mutateAsync({
        reservaId: resultado.reservaId,
        codigoReserva: resultado.codigoReserva,
        detalleReservacionId: resultado.detalleReservacionId,
        tipoMovimiento: tipo,
        notas: tipo === 'ENTRADA' ? 'Ingreso validado en Garita' : 'Salida validada en Garita',
      });

      const ahora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      setResultado((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          mensaje:
            tipo === 'ENTRADA'
              ? `Ingreso vehicular registrado a las ${ahora}. Barrera habilitada y plaza marcada como OCUPADA.`
              : `Egreso vehicular registrado a las ${ahora}. Estadía concluida y plaza liberada a DISPONIBLE.`,
          estadoReserva: tipo === 'ENTRADA' ? 'EN_CURSO' : 'COMPLETADA',
          siguienteAccion: tipo === 'ENTRADA' ? 'SALIDA' : null,
          horaEntradaReal: tipo === 'ENTRADA' ? new Date().toISOString() : prev.horaEntradaReal,
          horaSalidaReal: tipo === 'SALIDA' ? new Date().toISOString() : prev.horaSalidaReal,
        };
      });

      if (onAccesoConfirmado) {
        onAccesoConfirmado();
      }
    } catch (err: unknown) {
      console.error('Error al registrar movimiento vehicular:', err);
      let errorMsg = 'No se pudo registrar el movimiento vehicular.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = Array.isArray(err.response.data.message)
          ? err.response.data.message.join(', ')
          : err.response.data.message;
      }
      alert(errorMsg);
    }
  };

  const handleReintentarEscaneo = () => {
    setResultado(null);
    setManualToken('');
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        html5QrCodeRef.current.resume();
      } catch (e) {
        console.warn('Error al reanudar escáner:', e);
      }
    }
  };

  const totalCobro = resultado?.montoTotal ?? 0;
  const entregadoNum = Number(montoEntregado) || 0;
  const cambioDevolver = entregadoNum >= totalCobro ? entregadoNum - totalCobro : 0;

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 15, 29, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeInModal 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes laserSweep {
          0% { top: 12%; opacity: 0.2; }
          50% { top: 88%; opacity: 1; }
          100% { top: 12%; opacity: 0.2; }
        }
        @keyframes radarPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.92); }
        }
        #garita-qr-reader-region {
          border: none !important;
          width: 100% !important;
        }
        #garita-qr-reader-region video {
          border-radius: 8px !important;
          object-fit: cover !important;
          max-height: 290px !important;
          width: 100% !important;
        }
        #garita-qr-reader-region img {
          display: none !important;
        }
        #garita-qr-reader-region__scan_region {
          background: transparent !important;
        }
      `}</style>

      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #CBD5CE',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 48px -12px rgba(6, 61, 37, 0.3), 0 8px 24px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera Enterprise Garita */}
        <div
          style={{
            padding: '1.15rem 1.4rem',
            background: 'linear-gradient(135deg, #063D25 0%, #0A4F30 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <i className="fa-solid fa-camera"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Control de Acceso Garita
                </h3>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#86EFAC',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '20px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#4ADE80',
                      boxShadow: '0 0 6px #4ADE80',
                      animation: 'radarPulse 2s infinite ease-in-out',
                    }}
                  />
                  En Línea
                </span>
              </div>
              <p
                style={{
                  margin: '0.2rem 0 0 0',
                  fontSize: '0.74rem',
                  color: '#C8D5CC',
                  fontWeight: 500,
                }}
              >
                Validación de autenticidad de tickets y cobro en efectivo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '6px',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Contenido Modal */}
        <div
          style={{
            padding: '1.25rem 1.4rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Scanner Viewport con Marco HUD Enterprise */}
          <div
            style={{
              background: '#090E18',
              borderRadius: '8px',
              border: '1px solid #1E293B',
              overflow: 'hidden',
              minHeight: '270px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'inset 0 2px 14px rgba(0, 0, 0, 0.75)',
            }}
          >
            {/* Barra Superior HUD: Selector de Cámara y Estado */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                right: '12px',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
                pointerEvents: 'auto',
              }}
            >
              {/* Selector de Dispositivo de Video */}
              <div
                style={{
                  background: 'rgba(10, 15, 29, 0.88)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '6px',
                  padding: '0.22rem 0.6rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  maxWidth: '340px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                }}
              >
                <i className="fa-solid fa-video" style={{ color: '#4ADE80', fontSize: '0.75rem', flexShrink: 0 }}></i>
                {camarasDisponibles.length > 1 ? (
                  <select
                    value={selectedCameraId}
                    onChange={(e) => handleCambiarCamara(e.target.value)}
                    disabled={isSwitching}
                    title="Elegir cámara de garita"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#F1F5F9',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      outline: 'none',
                      cursor: isSwitching ? 'wait' : 'pointer',
                      maxWidth: '220px',
                    }}
                  >
                    {camarasDisponibles.map((cam, idx) => (
                      <option key={cam.id} value={cam.id} style={{ background: '#0F172A', color: '#FFFFFF' }}>
                        {cam.label || `Cámara ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#E2E8F0', fontWeight: 600 }}>
                    {camarasDisponibles[0]?.label || 'Cámara activa'}
                  </span>
                )}
              </div>

              {/* Indicador de cambio de cámara o refresco */}
              {isSwitching ? (
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.9)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Conmutando...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startCamera(selectedCameraId)}
                  title="Reiniciar o detectar nuevas cámaras"
                  style={{
                    background: 'rgba(10, 15, 29, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '6px',
                    padding: '0.22rem 0.55rem',
                    fontSize: '0.7rem',
                    color: '#CBD5E1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <i className="fa-solid fa-rotate-right" style={{ fontSize: '0.68rem' }}></i>
                  <span>Reconectar</span>
                </button>
              )}
            </div>

            {/* Región de html5-qrcode */}
            <div
              id="garita-qr-reader-region"
              style={{
                width: '100%',
                maxWidth: '420px',
              }}
            />

            {/* Guías HUD de Escaneo (Corner Brackets) */}
            {isScanning && !cameraError && !resultado && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    width: '210px',
                    height: '210px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Esquinas HUD verdes neón */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '24px',
                      height: '24px',
                      borderTop: '3px solid #22C55E',
                      borderLeft: '3px solid #22C55E',
                      borderTopLeftRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '24px',
                      height: '24px',
                      borderTop: '3px solid #22C55E',
                      borderRight: '3px solid #22C55E',
                      borderTopRightRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '24px',
                      height: '24px',
                      borderBottom: '3px solid #22C55E',
                      borderLeft: '3px solid #22C55E',
                      borderBottomLeftRadius: '4px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '24px',
                      height: '24px',
                      borderBottom: '3px solid #22C55E',
                      borderRight: '3px solid #22C55E',
                      borderBottomRightRadius: '4px',
                    }}
                  />

                  {/* Línea Láser Dinámica */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
                      boxShadow: '0 0 10px #22C55E, 0 0 4px #86EFAC',
                      animation: 'laserSweep 2.2s infinite ease-in-out',
                    }}
                  />
                </div>

                {/* Pill inferior de indicación HUD */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    background: 'rgba(10, 15, 29, 0.88)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#F1F5F9',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <i className="fa-solid fa-qrcode" style={{ color: '#4ADE80' }}></i>
                  <span>Apunta la cámara al código QR de la boleta</span>
                </div>
              </>
            )}

            {/* Error de Cámara */}
            {cameraError && (
              <div
                style={{
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  color: '#FCA5A5',
                  fontSize: '0.82rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                    fontSize: '1.3rem',
                  }}
                >
                  <i className="fa-solid fa-video-slash"></i>
                </div>
                <div style={{ fontWeight: 700, color: '#FEE2E2', marginBottom: '0.3rem' }}>
                  Cámara no disponible
                </div>
                <div style={{ color: '#94A3B8', maxWidth: '340px', margin: '0 auto', fontSize: '0.76rem' }}>
                  {cameraError}
                </div>
              </div>
            )}
          </div>

          {/* Separador elegante Enterprise */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.15rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span
              style={{
                fontSize: '0.67rem',
                fontWeight: 700,
                color: '#64748B',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-keyboard" style={{ color: '#94A3B8' }}></i>
              Ingreso Manual de Código
            </span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </div>

          {/* Formulario Manual de Respaldo */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #DDE3DE',
              borderRadius: '8px',
              padding: '0.65rem 0.85rem',
              display: 'flex',
              gap: '0.55rem',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.2rem 0.65rem',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-ticket" style={{ color: '#94A3B8', fontSize: '0.85rem' }}></i>
              <input
                type="text"
                placeholder="Código de reserva o token (ej: RES-1092)..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleProcesarToken(manualToken);
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: '#0F172A',
                  padding: '0.35rem 0',
                }}
              />
              {manualToken && (
                <button
                  type="button"
                  onClick={() => setManualToken('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    padding: '0.2rem',
                  }}
                  title="Limpiar"
                >
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleProcesarToken(manualToken)}
              disabled={verificarMutation.isPending || !manualToken.trim()}
              style={{
                padding: '0.52rem 1.15rem',
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: verificarMutation.isPending || !manualToken.trim() ? 'not-allowed' : 'pointer',
                opacity: !manualToken.trim() && !verificarMutation.isPending ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 1px 3px rgba(0, 109, 54, 0.25)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (manualToken.trim() && !verificarMutation.isPending) {
                  e.currentTarget.style.background = '#00562B';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#006D36';
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
                borderRadius: '8px',
                padding: '1.1rem',
                background: resultado.valido ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${resultado.valido ? '#86EFAC' : '#FECACA'}`,
                animation: 'fadeInModal 0.25s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4
                      style={{
                        margin: '0 0 0.2rem 0',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: resultado.valido ? '#166534' : '#991B1B',
                      }}
                    >
                      {resultado.valido ? 'Ticket Auténtico y Válido' : 'Validación Denegada'}
                    </h4>
                    {resultado.valido && (
                      <span
                        style={{
                          background: '#DCFCE7',
                          color: '#15803D',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #86EFAC',
                        }}
                      >
                        AUTORIZADO
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      color: resultado.valido ? '#14532D' : '#7F1D1D',
                      lineHeight: 1.4,
                    }}
                  >
                    {resultado.mensaje}
                  </p>
                </div>
              </div>

              {/* Ficha Enterprise de la Reserva si es Válida */}
              {resultado.valido && resultado.codigoReserva && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '0.85rem',
                    borderTop: '1px dashed #86EFAC',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <span style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700, display: 'block' }}>
                      CONDUCTOR
                    </span>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '0.15rem' }}>
                      <i className="fa-solid fa-user" style={{ marginRight: '0.35rem', color: '#16A34A' }}></i>
                      {resultado.clienteNombre || 'Conductor'}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <span style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700, display: 'block' }}>
                      PLACA DEL VEHÍCULO
                    </span>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#1E3A8A',
                        fontFamily: 'monospace',
                        marginTop: '0.15rem',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <i className="fa-solid fa-car-side" style={{ marginRight: '0.35rem', color: '#3B82F6' }}></i>
                      {resultado.vehiculoPlaca || 'Sin placa'}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <span style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700, display: 'block' }}>
                      PLAZA ASIGNADA
                    </span>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#006D36',
                        marginTop: '0.15rem',
                        fontSize: '0.88rem',
                      }}
                    >
                      <i className="fa-solid fa-square-parking" style={{ marginRight: '0.35rem' }}></i>
                      {resultado.espacioCodigo || 'Plaza Asignada'}
                    </div>
                  </div>

                  <div
                    style={{
                      background: '#FFFFFF',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <span style={{ color: '#64748B', fontSize: '0.68rem', fontWeight: 700, display: 'block' }}>
                      MÉTODO DE PAGO
                    </span>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '0.15rem' }}>
                      <i
                        className={`fa-solid ${resultado.metodoPago === 'EFECTIVO' ? 'fa-money-bill-wave' : 'fa-credit-card'}`}
                        style={{ marginRight: '0.35rem', color: '#059669' }}
                      ></i>
                      {resultado.metodoPago || 'EFECTIVO'}
                    </div>
                  </div>

                  <div
                    style={{
                      gridColumn: 'span 2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #D1FAE5',
                    }}
                  >
                    <span style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700 }}>
                      ESTADO ACTUAL:
                    </span>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        background:
                          resultado.estadoReserva === 'COMPLETADA'
                            ? '#E0E7FF'
                            : resultado.estadoReserva === 'EN_CURSO'
                            ? '#DBEAFE'
                            : resultado.estadoReserva === 'CONFIRMADA'
                            ? '#DCFCE7'
                            : '#FEF3C7',
                        color:
                          resultado.estadoReserva === 'COMPLETADA'
                            ? '#3730A3'
                            : resultado.estadoReserva === 'EN_CURSO'
                            ? '#1E40AF'
                            : resultado.estadoReserva === 'CONFIRMADA'
                            ? '#166534'
                            : '#92400E',
                        border: `1px solid ${
                          resultado.estadoReserva === 'COMPLETADA'
                            ? '#C7D2FE'
                            : resultado.estadoReserva === 'EN_CURSO'
                            ? '#93C5FD'
                            : resultado.estadoReserva === 'CONFIRMADA'
                            ? '#86EFAC'
                            : '#FDE68A'
                        }`,
                      }}
                    >
                      {resultado.estadoReserva || 'PENDIENTE_PAGO'}
                    </span>
                  </div>

                  {/* Auditoría de Entrada y Salida */}
                  <div
                    style={{
                      gridColumn: 'span 2',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '0.65rem 0.75rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="fa-solid fa-right-to-bracket" style={{ color: resultado.horaEntradaReal ? '#16A34A' : '#94A3B8' }}></i>
                        ENTRADA REAL
                      </span>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: resultado.horaEntradaReal ? '#0F172A' : '#94A3B8', marginTop: '0.15rem' }}>
                        {resultado.horaEntradaReal
                          ? new Date(resultado.horaEntradaReal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Pendiente de entrada'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <i className="fa-solid fa-right-from-bracket" style={{ color: resultado.horaSalidaReal ? '#2563EB' : '#94A3B8' }}></i>
                        SALIDA REAL
                      </span>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: resultado.horaSalidaReal ? '#0F172A' : '#94A3B8', marginTop: '0.15rem' }}>
                        {resultado.horaSalidaReal
                          ? new Date(resultado.horaSalidaReal).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : resultado.estadoReserva === 'EN_CURSO'
                          ? 'Vehículo en parqueo'
                          : 'Pendiente'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Módulo Especial de Cobro en Garita (Efectivo) */}
              {resultado.requiereCobroEfectivo && (
                <div
                  style={{
                    marginTop: '1rem',
                    background: '#FFFBEB',
                    border: '1px solid #FCD34D',
                    borderRadius: '8px',
                    padding: '0.95rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#78350F' }}>
                      <i className="fa-solid fa-hand-holding-dollar" style={{ marginRight: '0.4rem', color: '#D97706' }}></i>
                      Monto a Cobrar en Garita:
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#006D36' }}>
                      Bs. {totalCobro.toFixed(2)}
                    </span>
                  </div>

                  {/* Atajos de cobro rápido */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 600 }}>Atajos:</span>
                    {[totalCobro, 20, 50, 100].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setMontoEntregado(val.toString())}
                        style={{
                          background: montoEntregado === val.toString() ? '#F59E0B' : '#FEF3C7',
                          color: montoEntregado === val.toString() ? '#FFFFFF' : '#92400E',
                          border: '1px solid #FDE68A',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Bs. {val}
                      </button>
                    ))}
                  </div>

                  {/* Input y Confirmación */}
                  <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        type="number"
                        placeholder="Monto entregado..."
                        value={montoEntregado}
                        onChange={(e) => setMontoEntregado(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #F59E0B',
                          background: '#FFFFFF',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          outline: 'none',
                          color: '#0F172A',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCobrarEnEfectivo}
                      disabled={confirmarPagoMutation.isPending}
                      style={{
                        padding: '0.55rem 1.15rem',
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: confirmarPagoMutation.isPending ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#00562B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#006D36';
                      }}
                    >
                      {confirmarPagoMutation.isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-check-double"></i>
                      )}
                      <span>Confirmar Cobro y Abrir Paso</span>
                    </button>
                  </div>

                  {/* Cálculo en vivo de cambio */}
                  {entregadoNum > totalCobro && (
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#065F46',
                        background: '#D1FAE5',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Cambio a devolver al conductor:</span>
                      <span style={{ fontWeight: 800 }}>Bs. {cambioDevolver.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones de Entrada y Salida Vehicular */}
              {resultado.valido && !resultado.requiereCobroEfectivo && (
                <div
                  style={{
                    marginTop: '1rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: '#334155',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <i className="fa-solid fa-traffic-light" style={{ marginRight: '0.4rem', color: '#006D36' }}></i>
                    Control de Movimiento Vehicular
                  </span>

                  {(resultado.siguienteAccion === 'ENTRADA' || resultado.estadoReserva === 'CONFIRMADA') && (
                    <button
                      type="button"
                      onClick={() => handleRegistrarMovimiento('ENTRADA')}
                      disabled={registrarMovimientoMutation.isPending}
                      style={{
                        padding: '0.7rem 1.2rem',
                        background: 'linear-gradient(135deg, #006D36 0%, #047857 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: registrarMovimientoMutation.isPending ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.55rem',
                        boxShadow: '0 2px 6px rgba(0, 109, 54, 0.3)',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      {registrarMovimientoMutation.isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-arrow-right-to-bracket" style={{ fontSize: '1rem' }}></i>
                      )}
                      <span>Registrar ENTRADA del Vehículo (Habilitar Barrera)</span>
                    </button>
                  )}

                  {(resultado.siguienteAccion === 'SALIDA' || resultado.estadoReserva === 'EN_CURSO') && (
                    <button
                      type="button"
                      onClick={() => handleRegistrarMovimiento('SALIDA')}
                      disabled={registrarMovimientoMutation.isPending}
                      style={{
                        padding: '0.7rem 1.2rem',
                        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.86rem',
                        fontWeight: 800,
                        cursor: registrarMovimientoMutation.isPending ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.55rem',
                        boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      {registrarMovimientoMutation.isPending ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '1rem' }}></i>
                      )}
                      <span>Registrar SALIDA del Vehículo (Liberar Plaza)</span>
                    </button>
                  )}

                  {resultado.estadoReserva === 'COMPLETADA' && (
                    <div
                      style={{
                        background: '#EEF2FF',
                        border: '1px solid #C7D2FE',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem',
                        color: '#3730A3',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ color: '#4F46E5', fontSize: '1rem' }}></i>
                      <span>Estadía concluida en su totalidad. Entrada y salida registradas, plaza disponible.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Botón Reintentar o Escanear Siguiente */}
              <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleReintentarEscaneo}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    padding: '0.42rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <i className="fa-solid fa-rotate-right" style={{ color: '#006D36' }}></i>
                  Escanear Otro Ticket
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Enterprise */}
        <div
          style={{
            padding: '0.85rem 1.4rem',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <kbd
              style={{
                background: '#E2E8F0',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                padding: '0.1rem 0.35rem',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#334155',
              }}
            >
              ESC
            </kbd>{' '}
            para cerrar ventana
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
