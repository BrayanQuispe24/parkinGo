// src/modules/driver/presentation/components/ActiveTicketCard.tsx
import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { DriverBooking } from '../../domain/DriverBooking';
import { showToast } from '../../../../core/utils/toastr';

interface ActiveTicketCardProps {
    booking: DriverBooking | null;
    onFinishBooking: (bookingId: string) => Promise<void>;
    onGoToSearch: () => void;
    onPayWithQr?: () => void;
    onGoToReview?: (parkingId: string) => void;
    onGoToHistory?: () => void;
    isFinishing?: boolean;
}

export const ActiveTicketCard: React.FC<ActiveTicketCardProps> = ({
    booking,
    onFinishBooking,
    onGoToSearch,
    onPayWithQr,
    onGoToReview,
    onGoToHistory,
    isFinishing,
}) => {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);
    const [showFullToken, setShowFullToken] = useState(false);

    if (!booking) {
        return (
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #CBD5CE',
                    padding: '3.5rem 2rem',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    maxWidth: '540px',
                    margin: '2rem auto',
                }}
            >
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        margin: '0 auto 1rem auto',
                        borderRadius: '8px',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#006D36',
                        fontSize: '1.6rem',
                    }}
                >
                    <i className="fa-solid fa-qrcode"></i>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    No tienes ningún ticket activo
                </h4>
                <p
                    style={{
                        fontSize: '0.84rem',
                        color: '#64748B',
                        margin: '0 0 1.5rem 0',
                        lineHeight: 1.5,
                    }}
                >
                    Explora los parqueos disponibles en el mapa interactivo, selecciona tus plazas y servicios extras y emite tu boleta digital al instante.
                </p>
                <button
                    type="button"
                    onClick={onGoToSearch}
                    style={{
                        padding: '0.6rem 1.4rem',
                        borderRadius: '6px',
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                    }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Buscar Parqueos en el Mapa</span>
                </button>
            </div>
        );
    }

    const boleta = booking.boletaOriginal;
    const isPendientePago = boleta?.estado === 'PENDIENTE_PAGO';
    const isCancelada = boleta?.estado === 'CANCELADA';
    const metodoPago = boleta?.metodoPago || booking.paymentMethod || 'EFECTIVO';
    const isCashMethod = metodoPago === 'EFECTIVO';
    const isQrMethod = metodoPago === 'QR';
    const qrTokenValue = boleta?.qrToken || booking.qrCodeText || `PARKINGO:RESERVA:${boleta?.id || booking.id}`;

    const horaEntradaReal = booking.horaEntradaReal || boleta?.horaEntradaReal;
    const horaSalidaReal = booking.horaSalidaReal || boleta?.horaSalidaReal;
    const isEnCurso = boleta?.estado === 'EN_CURSO' || Boolean(horaEntradaReal && !horaSalidaReal);
    const isCompletada = boleta?.estado === 'COMPLETADA' || Boolean(horaSalidaReal);

    const handleConfirmCancel = async () => {
        setConfirmCancelOpen(false);
        await onFinishBooking(booking.id);
    };

    const handleCopyToken = () => {
        if (qrTokenValue) {
            navigator.clipboard.writeText(qrTokenValue);
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 2000);
            showToast.success('Token de seguridad copiado al portapapeles', 'Token Copiado');
        }
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #parking-active-ticket-print, #parking-active-ticket-print * { visibility: visible; }
                    #parking-active-ticket-print { position: absolute; left: 0; top: 0; width: 100%; }
                    .ticket-no-print { display: none !important; }
                }
                @keyframes pulseDot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.9); }
                }
            `}</style>

            <div
                id="parking-active-ticket-print"
                style={{
                    background: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #CBD5CE',
                    overflow: 'hidden',
                    boxShadow: '0 12px 32px rgba(6, 61, 37, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                }}
            >
                {/* Cabecera Enterprise Digital Voucher */}
                <div
                    style={{
                        background: isCancelada
                            ? 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)'
                            : isCompletada
                              ? 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #064E3B 100%)'
                              : isEnCurso
                                ? 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)'
                                : isPendientePago
                                  ? 'linear-gradient(135deg, #1C1917 0%, #292524 100%)'
                                  : 'linear-gradient(135deg, #063D25 0%, #0B5735 100%)',
                        color: '#FFFFFF',
                        padding: '1.35rem 1.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            {/* Chip de Estado Operativo */}
                            <span
                                style={{
                                    background: isCancelada
                                        ? 'rgba(239, 68, 68, 0.2)'
                                        : isCompletada
                                          ? 'rgba(16, 185, 129, 0.25)'
                                          : isEnCurso
                                            ? 'rgba(59, 130, 246, 0.25)'
                                            : isPendientePago
                                              ? 'rgba(245, 158, 11, 0.2)'
                                              : 'rgba(34, 197, 94, 0.2)',
                                    color: isCancelada
                                        ? '#FCA5A5'
                                        : isCompletada
                                          ? '#A7F3D0'
                                          : isEnCurso
                                            ? '#BFDBFE'
                                            : isPendientePago
                                              ? '#FDE68A'
                                              : '#86EFAC',
                                    border: isCancelada
                                        ? '1px solid rgba(239, 68, 68, 0.4)'
                                        : isCompletada
                                          ? '1px solid rgba(16, 185, 129, 0.5)'
                                          : isEnCurso
                                            ? '1px solid rgba(59, 130, 246, 0.5)'
                                            : isPendientePago
                                              ? '1px solid rgba(245, 158, 11, 0.4)'
                                              : '1px solid rgba(34, 197, 94, 0.4)',
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '20px',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: isCancelada
                                            ? '#EF4444'
                                            : isCompletada
                                              ? '#34D399'
                                              : isEnCurso
                                                ? '#60A5FA'
                                                : isPendientePago
                                                  ? '#F59E0B'
                                                  : '#4ADE80',
                                        boxShadow: `0 0 6px ${
                                            isCancelada
                                                ? '#EF4444'
                                                : isCompletada
                                                  ? '#34D399'
                                                  : isEnCurso
                                                    ? '#60A5FA'
                                                    : isPendientePago
                                                      ? '#F59E0B'
                                                      : '#4ADE80'
                                        }`,
                                        animation: 'pulseDot 2s infinite ease-in-out',
                                    }}
                                />
                                {isCancelada
                                    ? 'RESERVA CANCELADA'
                                    : isCompletada
                                      ? 'ESTADÍA COMPLETADA - BOLETA LIQUIDADA'
                                      : isEnCurso
                                        ? 'VEHÍCULO EN PARQUEO (EN CURSO)'
                                        : isPendientePago
                                          ? 'PENDIENTE DE PAGO (EN GARITA)'
                                          : 'RESERVA ACTIVA & CONFIRMADA'}
                            </span>

                            {/* Código de Boleta */}
                            <span
                                style={{
                                    fontSize: '0.76rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    padding: '0.18rem 0.55rem',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    fontFamily: 'monospace',
                                    color: '#E2E8F0',
                                }}
                            >
                                {booking.bookingNumber}
                            </span>
                        </div>

                        {/* Nombre del Parqueo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.55rem' }}>
                            <i
                                className="fa-solid fa-square-parking"
                                style={{ color: isPendientePago ? '#F59E0B' : '#4ADE80', fontSize: '1.25rem' }}
                            ></i>
                            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
                                {booking.parkingName}
                            </h3>
                        </div>
                    </div>

                    {/* Monto Total */}
                    <div style={{ textAlign: 'right' }}>
                        <span
                            style={{
                                fontSize: '0.67rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                color: '#CBD5E1',
                                display: 'block',
                            }}
                        >
                            Total Boleta Liquidada
                        </span>
                        <div
                            style={{
                                fontSize: '1.65rem',
                                fontWeight: 900,
                                color: isCancelada ? '#FCA5A5' : isPendientePago ? '#FDE68A' : '#4ADE80',
                                lineHeight: 1.1,
                                marginTop: '0.2rem',
                            }}
                        >
                            Bs. {booking.totalAmount}.00
                        </div>
                    </div>
                </div>

                {/* Línea de Troquelado / Perforación Realista (Ticket Tear Line) */}
                <div
                    style={{
                        height: '22px',
                        background: isCancelada ? '#7F1D1D' : isPendientePago ? '#1C1917' : '#063D25',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: '22px',
                            height: '22px',
                            background: '#F7F8F4',
                            borderRadius: '50%',
                            marginLeft: '-11px',
                            boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.2)',
                        }}
                    />
                    <div
                        style={{
                            flexGrow: 1,
                            borderBottom: '2px dashed rgba(255, 255, 255, 0.3)',
                            margin: '0 12px',
                        }}
                    />
                    <div
                        style={{
                            width: '22px',
                            height: '22px',
                            background: '#F7F8F4',
                            borderRadius: '50%',
                            marginRight: '-11px',
                            boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.2)',
                        }}
                    />
                </div>

                {/* Cuerpo del Voucher */}
                <div style={{ padding: '1.4rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.25rem',
                            alignItems: 'stretch',
                        }}
                    >
                        {/* Columna Izquierda: QR Code, Placa Boliviana y Token */}
                        <div
                            style={{
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '1.25rem',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.85rem',
                            }}
                        >
                            {/* Contenedor del QR */}
                            {isQrMethod && isPendientePago ? (
                                <div
                                    style={{
                                        width: '160px',
                                        height: '160px',
                                        background: '#FEF3C7',
                                        border: '2px dashed #D97706',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 2px 8px rgba(217, 119, 6, 0.1)',
                                        textAlign: 'center',
                                        gap: '0.4rem',
                                    }}
                                >
                                    <i className="fa-solid fa-lock" style={{ fontSize: '2.5rem', color: '#B45309' }}></i>
                                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#92400E', lineHeight: 1.2 }}>
                                        Acceso QR Protegido
                                    </span>
                                    <span style={{ fontSize: '0.66rem', color: '#78350F', lineHeight: 1.1 }}>
                                        Completa el pago digital para habilitar tu ingreso
                                    </span>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                    }}
                                >
                                    <QRCodeSVG
                                        value={qrTokenValue}
                                        size={145}
                                        level="M"
                                        includeMargin={false}
                                    />
                                </div>
                            )}

                            {/* Badge Informativo de Pago y Acceso */}
                            <div
                                style={{
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    borderRadius: '6px',
                                    padding: '0.45rem 0.75rem',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    lineHeight: 1.35,
                                    background: isCashMethod
                                        ? '#ECFDF5'
                                        : isPendientePago
                                          ? '#FFFBEB'
                                          : '#F0FDF4',
                                    color: isCashMethod
                                        ? '#065F46'
                                        : isPendientePago
                                          ? '#92400E'
                                          : '#166534',
                                    border: isCashMethod
                                        ? '1px solid #A7F3D0'
                                        : isPendientePago
                                          ? '1px solid #FCD34D'
                                          : '1px solid #BBF7D0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i
                                    className={`fa-solid ${
                                        isCompletada
                                            ? 'fa-circle-check'
                                            : isCashMethod
                                            ? 'fa-hand-holding-dollar'
                                            : isPendientePago
                                            ? 'fa-clock'
                                            : 'fa-circle-check'
                                    }`}
                                    style={{
                                        fontSize: '0.95rem',
                                        flexShrink: 0,
                                        color: isCompletada ? '#059669' : undefined,
                                    }}
                                ></i>
                                <span>
                                    {isCompletada
                                        ? 'Estadía concluida con éxito. El egreso fue registrado en garita y tu boleta ha sido liquidada.'
                                        : isCashMethod
                                        ? 'Pagarás en efectivo al llegar a la garita. Muestra este código QR para ingresar.'
                                        : isPendientePago
                                        ? 'Presiona "Pagar con QR Ahora" para acreditar tu pago y habilitar el pase.'
                                        : 'Pago acreditado. Código QR autenticado y listo para lectura en garita.'}
                                </span>
                            </div>

                            {/* Placa Vehicular Estilizada Bolivia */}
                            {booking.vehiclePlate && (
                                <div
                                    style={{
                                        background: '#FFFFFF',
                                        border: '2px solid #1E293B',
                                        borderRadius: '6px',
                                        padding: '0.25rem 0.85rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            paddingRight: '0.5rem',
                                            borderRight: '1px solid #CBD5E1',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '0.55rem',
                                                fontWeight: 800,
                                                color: '#1E3A8A',
                                                letterSpacing: '0.06em',
                                                lineHeight: 1,
                                            }}
                                        >
                                            BOL
                                        </span>
                                        <span
                                            style={{
                                                width: '14px',
                                                height: '6px',
                                                marginTop: '2px',
                                                background: 'linear-gradient(180deg, #DC2626 33%, #F59E0B 33%, #F59E0B 66%, #16A34A 66%)',
                                                borderRadius: '1px',
                                            }}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
                                            fontWeight: 900,
                                            fontSize: '1.05rem',
                                            letterSpacing: '0.08em',
                                            color: '#0F172A',
                                        }}
                                    >
                                        {booking.vehiclePlate}
                                    </span>
                                </div>
                            )}

                            {/* Token de Seguridad Compacto con botón Copiar */}
                            <div
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '6px',
                                    padding: '0.4rem 0.65rem',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.5rem',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                                    <i className="fa-solid fa-shield-halved" style={{ color: '#006D36', fontSize: '0.75rem', flexShrink: 0 }}></i>
                                    <span
                                        style={{
                                            fontSize: '0.68rem',
                                            color: '#64748B',
                                            fontFamily: 'monospace',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        title={qrTokenValue}
                                    >
                                        {showFullToken ? qrTokenValue : `${qrTokenValue.slice(0, 22)}...${qrTokenValue.slice(-8)}`}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowFullToken(!showFullToken)}
                                        title={showFullToken ? 'Ocultar hash' : 'Ver token completo'}
                                        style={{
                                            background: '#F8FAFC',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '4px',
                                            padding: '0.2rem 0.4rem',
                                            fontSize: '0.68rem',
                                            color: '#475569',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <i className={`fa-solid ${showFullToken ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCopyToken}
                                        style={{
                                            background: copiedToken ? '#DCFCE7' : '#F1F5F9',
                                            border: `1px solid ${copiedToken ? '#86EFAC' : '#CBD5E1'}`,
                                            borderRadius: '4px',
                                            padding: '0.2rem 0.5rem',
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            color: copiedToken ? '#15803D' : '#334155',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        <i className={`fa-solid ${copiedToken ? 'fa-check' : 'fa-copy'}`}></i>
                                        <span>{copiedToken ? 'Copiado' : 'Copiar'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Detalles de Estancia, Horarios y Garantía */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'space-between' }}>
                            {/* Ubicación y Plaza Asignada */}
                            <div
                                style={{
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    padding: '0.85rem 1rem',
                                }}
                            >
                                <span style={{ fontSize: '0.67rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                                    Plaza Asignada & Dirección
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
                                    <span
                                        style={{
                                            background: '#063D25',
                                            color: '#FFFFFF',
                                            padding: '0.18rem 0.55rem',
                                            borderRadius: '4px',
                                            fontWeight: 900,
                                            fontSize: '0.88rem',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {booking.spotNumber}
                                    </span>
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                                        {booking.parkingName}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fa-solid fa-location-dot" style={{ color: '#006D36' }}></i>
                                    <span>{booking.parkingAddress}</span>
                                </div>
                            </div>

                            {/* Horario y Duración */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                                <div
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        padding: '0.75rem 0.85rem',
                                    }}
                                >
                                    <span style={{ fontSize: '0.67rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                                        <i className="fa-regular fa-calendar-check" style={{ marginRight: '0.3rem', color: '#006D36' }}></i>
                                        Hora Ingreso
                                    </span>
                                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                                        {booking.entryTime}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        padding: '0.75rem 0.85rem',
                                    }}
                                >
                                    <span style={{ fontSize: '0.67rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                                        <i className="fa-regular fa-clock" style={{ marginRight: '0.3rem', color: '#006D36' }}></i>
                                        Duración
                                    </span>
                                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                                        {booking.durationHours} Horas
                                    </div>
                                </div>
                            </div>

                            {/* Auditoría de Acceso en Vivo (Garita QR) */}
                            <div
                                style={{
                                    background: isCompletada ? '#F0FDF4' : isEnCurso ? '#EFF6FF' : '#F8FAFC',
                                    border: `1px solid ${isCompletada ? '#86EFAC' : isEnCurso ? '#BFDBFE' : '#E2E8F0'}`,
                                    borderRadius: '8px',
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.55rem',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span
                                        style={{
                                            fontSize: '0.67rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em',
                                            color: isCompletada ? '#166534' : isEnCurso ? '#1E40AF' : '#64748B',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                        }}
                                    >
                                        <i
                                            className="fa-solid fa-tower-broadcast"
                                            style={{ color: isCompletada ? '#16A34A' : isEnCurso ? '#2563EB' : '#94A3B8' }}
                                        ></i>
                                        Auditoría de Garita en Vivo
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '4px',
                                            background: isCompletada ? '#DCFCE7' : isEnCurso ? '#DBEAFE' : '#F1F5F9',
                                            color: isCompletada ? '#15803D' : isEnCurso ? '#1D4ED8' : '#475569',
                                            border: `1px solid ${isCompletada ? '#86EFAC' : isEnCurso ? '#93C5FD' : '#CBD5E1'}`,
                                        }}
                                    >
                                        {isCompletada
                                            ? 'ESTADÍA COMPLETADA'
                                            : isEnCurso
                                            ? 'VEHÍCULO EN PARQUEO'
                                            : 'PENDIENTE DE INGRESO'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.2rem' }}>
                                    <div
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            padding: '0.5rem 0.65rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '0.64rem',
                                                color: '#64748B',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                            }}
                                        >
                                            <i
                                                className="fa-solid fa-circle-check"
                                                style={{ color: horaEntradaReal ? '#16A34A' : '#CBD5E1' }}
                                            ></i>
                                            Entrada Registrada
                                        </span>
                                        <div
                                            style={{
                                                fontSize: '0.78rem',
                                                fontWeight: 800,
                                                color: horaEntradaReal ? '#0F172A' : '#94A3B8',
                                                marginTop: '0.15rem',
                                            }}
                                        >
                                            {horaEntradaReal
                                                ? new Date(horaEntradaReal).toLocaleTimeString([], {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : 'Sin registrar'}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            padding: '0.5rem 0.65rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: '0.64rem',
                                                color: '#64748B',
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.3rem',
                                            }}
                                        >
                                            <i
                                                className="fa-solid fa-flag-checkered"
                                                style={{ color: horaSalidaReal ? '#2563EB' : '#CBD5E1' }}
                                            ></i>
                                            Salida Registrada
                                        </span>
                                        <div
                                            style={{
                                                fontSize: '0.78rem',
                                                fontWeight: 800,
                                                color: horaSalidaReal ? '#0F172A' : '#94A3B8',
                                                marginTop: '0.15rem',
                                            }}
                                        >
                                            {horaSalidaReal
                                                ? new Date(horaSalidaReal).toLocaleTimeString([], {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : isEnCurso
                                                ? 'En estadía'
                                                : 'Sin registrar'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Garantía Operativa de Bloqueo */}
                            <div
                                style={{
                                    background: isPendientePago ? '#FFFBEB' : '#ECFDF5',
                                    border: isPendientePago ? '1px solid #FDE68A' : '1px solid #A7F3D0',
                                    borderRadius: '8px',
                                    padding: '0.8rem 1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.65rem',
                                }}
                            >
                                <i
                                    className={`fa-solid ${isPendientePago ? 'fa-shield-halved' : 'fa-circle-check'}`}
                                    style={{ color: isPendientePago ? '#D97706' : '#059669', fontSize: '1.2rem', flexShrink: 0 }}
                                ></i>
                                <span
                                    style={{
                                        fontSize: '0.77rem',
                                        color: isPendientePago ? '#92400E' : '#065F46',
                                        fontWeight: 600,
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {isPendientePago
                                        ? 'Plazas bloqueadas en el sistema para tu vehículo. Puedes pagar al llegar a garita o liquidar antes con QR.'
                                        : 'Estadía activa: Plaza asignada y placa vehicular autorizada en sistema de garita.'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desglose Detallado de Tarifas y Servicios Extras */}
                    {boleta && boleta.detalles && boleta.detalles.length > 0 && (
                        <div
                            style={{
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '1.1rem',
                                background: '#F8FAFC',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.85rem',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                }}
                            >
                                <h4
                                    style={{
                                        margin: 0,
                                        fontSize: '0.88rem',
                                        fontWeight: 800,
                                        color: '#0F172A',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                    }}
                                >
                                    <i className="fa-solid fa-receipt" style={{ color: '#006D36' }}></i>
                                    <span>Liquidación de Boleta y Servicios</span>
                                </h4>
                                <span
                                    style={{
                                        background: '#E2E8F0',
                                        color: '#475569',
                                        fontSize: '0.66rem',
                                        fontWeight: 700,
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    Tarifa Dinámica Aplicada
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {boleta.detalles.map((d, i) => (
                                    <div
                                        key={d.id || i}
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            padding: '0.75rem 0.95rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span
                                                    style={{
                                                        background: '#063D25',
                                                        color: '#FFFFFF',
                                                        borderRadius: '4px',
                                                        padding: '0.15rem 0.5rem',
                                                        fontSize: '0.74rem',
                                                        fontWeight: 800,
                                                        fontFamily: 'monospace',
                                                    }}
                                                >
                                                    {d.codigoEspacio}
                                                </span>
                                                <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                                                    {d.tipoEspacio}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                                                Base: Bs. {d.precioUnitarioAplicado}.00 / h
                                            </span>
                                        </div>

                                        {/* Servicios Extras seleccionados en esta plaza */}
                                        {d.serviciosExtras && d.serviciosExtras.length > 0 && (
                                            <div
                                                style={{
                                                    marginTop: '0.5rem',
                                                    paddingTop: '0.5rem',
                                                    borderTop: '1px dashed #E2E8F0',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.45rem',
                                                }}
                                            >
                                                {d.serviciosExtras.map((se) => (
                                                    <span
                                                        key={se.id || se.servicioExtraId}
                                                        style={{
                                                            background: '#ECFDF5',
                                                            border: '1px solid #A7F3D0',
                                                            borderRadius: '4px',
                                                            padding: '0.2rem 0.55rem',
                                                            fontSize: '0.72rem',
                                                            color: '#065F46',
                                                            fontWeight: 600,
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#059669' }}></i>
                                                        <span>{se.nombre}: <strong>+Bs. {se.subtotal}.00</strong></span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                marginTop: '0.45rem',
                                                fontSize: '0.78rem',
                                                fontWeight: 800,
                                                color: '#006D36',
                                            }}
                                        >
                                            Subtotal Plaza: Bs. {d.subtotal}.00
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones de Acción y Operatoria */}
                    <div
                        className="ticket-no-print"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid #E2E8F0',
                            paddingTop: '1rem',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                style={{
                                    background: '#FFFFFF',
                                    color: '#334155',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '6px',
                                    padding: '0.52rem 0.95rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#F8FAFC';
                                    e.currentTarget.style.borderColor = '#94A3B8';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#FFFFFF';
                                    e.currentTarget.style.borderColor = '#CBD5E1';
                                }}
                            >
                                <i className="fa-solid fa-print" style={{ color: '#006D36' }}></i>
                                <span>Imprimir Boleta</span>
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            {isCompletada ? (
                                <>
                                    {onGoToReview && (
                                        <button
                                            type="button"
                                            onClick={() => onGoToReview(booking.parkingId)}
                                            style={{
                                                background: '#D97706',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.52rem 1.15rem',
                                                fontSize: '0.82rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.25)',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#B45309')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#D97706')}
                                        >
                                            <i className="fa-solid fa-star"></i>
                                            <span>Calificar Experiencia</span>
                                        </button>
                                    )}
                                    {onGoToHistory && (
                                        <button
                                            type="button"
                                            onClick={onGoToHistory}
                                            style={{
                                                background: '#006D36',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.52rem 1.15rem',
                                                fontSize: '0.82rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#00562B')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#006D36')}
                                        >
                                            <i className="fa-solid fa-receipt"></i>
                                            <span>Ver en Historial</span>
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={onGoToSearch}
                                        style={{
                                            background: '#F1F5F9',
                                            color: '#334155',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '6px',
                                            padding: '0.52rem 1rem',
                                            fontSize: '0.82rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.45rem',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#E2E8F0')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                        <span>Buscar Parqueos</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    {isPendientePago && onPayWithQr && (
                                        <button
                                            type="button"
                                            onClick={onPayWithQr}
                                            style={{
                                                background: '#006D36',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.52rem 1.15rem',
                                                fontSize: '0.82rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.background = '#00562B')}
                                            onMouseLeave={(e) => (e.currentTarget.style.background = '#006D36')}
                                        >
                                            <i className="fa-solid fa-qrcode"></i>
                                            <span>Pagar con QR Ahora</span>
                                        </button>
                                    )}

                                    {!confirmCancelOpen ? (
                                        <button
                                            type="button"
                                            onClick={() => setConfirmCancelOpen(true)}
                                            disabled={isFinishing || isCancelada}
                                            style={{
                                                background: '#FFFFFF',
                                                color: '#DC2626',
                                                border: '1px solid #FCA5A5',
                                                borderRadius: '6px',
                                                padding: '0.52rem 0.95rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: isCancelada ? 'not-allowed' : 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isCancelada) e.currentTarget.style.background = '#FEF2F2';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#FFFFFF';
                                            }}
                                        >
                                            <i className="fa-solid fa-ban"></i>
                                            <span>Cancelar Reserva</span>
                                        </button>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                            <span style={{ fontSize: '0.76rem', color: '#DC2626', fontWeight: 700 }}>
                                                ¿Confirmar cancelación?
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleConfirmCancel}
                                                disabled={isFinishing}
                                                style={{
                                                    background: '#DC2626',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '0.3rem 0.75rem',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 700,
                                                    cursor: isFinishing ? 'wait' : 'pointer',
                                                }}
                                            >
                                                {isFinishing ? 'Cancelando...' : 'Sí, cancelar'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setConfirmCancelOpen(false)}
                                                style={{
                                                    background: '#F1F5F9',
                                                    color: '#475569',
                                                    border: '1px solid #CBD5E1',
                                                    borderRadius: '4px',
                                                    padding: '0.3rem 0.65rem',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
