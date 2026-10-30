// src/modules/driver/presentation/components/ActiveTicketCard.tsx
import React, { useState } from 'react';
import type { DriverBooking } from '../../domain/DriverBooking';

interface ActiveTicketCardProps {
    booking: DriverBooking | null;
    onFinishBooking: (bookingId: string) => Promise<void>;
    onGoToSearch: () => void;
    isFinishing?: boolean;
}

export const ActiveTicketCard: React.FC<ActiveTicketCardProps> = ({
    booking,
    onFinishBooking,
    onGoToSearch,
    isFinishing,
}) => {
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    if (!booking) {
        return (
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    padding: '3.5rem',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        margin: '0 auto 0.85rem auto',
                        borderRadius: '8px',
                        background: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A',
                    }}
                >
                    <i className="fa-solid fa-qrcode" style={{ fontSize: '1.6rem' }}></i>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                    No tienes ningún ticket o boleta activa en este momento
                </h4>
                <p
                    style={{
                        fontSize: '0.82rem',
                        color: '#64748B',
                        margin: '0 0 1.25rem 0',
                        maxWidth: '420px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    Explora los parqueos disponibles en el mapa, configura tus plazas y servicios extras con el patrón
                    decorador y emite tu boleta al instante.
                </p>
                <button
                    type="button"
                    onClick={onGoToSearch}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '6px',
                        background: '#006D36',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                    }}
                >
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <span>Buscar Parqueos Ahora</span>
                </button>
            </div>
        );
    }

    const boleta = booking.boletaOriginal;
    const isPendientePago = boleta?.estado === 'PENDIENTE_PAGO';
    const isCancelada = boleta?.estado === 'CANCELADA';

    const handleConfirmCancel = async () => {
        setConfirmCancelOpen(false);
        await onFinishBooking(booking.id);
    };

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #CBD5CE',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(6, 61, 37, 0.08)',
                    position: 'relative',
                }}
            >
                {/* Banner de Cabecera */}
                <div
                    style={{
                        background: isCancelada
                            ? 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)'
                            : isPendientePago
                              ? 'linear-gradient(135deg, #78350F 0%, #B45309 100%)'
                              : 'linear-gradient(135deg, #063D25 0%, #0B5735 100%)',
                        color: '#FFFFFF',
                        padding: '1.4rem 1.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                                style={{
                                    background: isPendientePago
                                        ? 'rgba(254, 243, 199, 0.25)'
                                        : 'rgba(34, 197, 94, 0.2)',
                                    color: isPendientePago ? '#FDE68A' : '#4ADE80',
                                    padding: '0.2rem 0.65rem',
                                    borderRadius: '4px',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                }}
                            >
                                <i
                                    className={`fa-solid ${isPendientePago ? 'fa-clock-rotate-left' : 'fa-circle-check'}`}
                                    style={{ marginRight: '4px' }}
                                ></i>
                                {isCancelada
                                    ? 'RESERVA CANCELADA'
                                    : isPendientePago
                                      ? 'PENDIENTE DE PAGO (Plazas Bloqueadas)'
                                      : 'RESERVA CONFIRMADA'}
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 700 }}>
                                {booking.bookingNumber}
                            </span>
                        </div>
                        <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                            {booking.parkingName}
                        </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>Monto Total Boleta</span>
                        <div
                            style={{
                                fontSize: '1.45rem',
                                fontWeight: 900,
                                color: isPendientePago ? '#FDE68A' : '#4ADE80',
                            }}
                        >
                            Bs {booking.totalAmount}.00
                        </div>
                    </div>
                </div>

                {/* Línea de corte / Ticket Tear Line */}
                <div
                    style={{
                        height: '24px',
                        background: isCancelada ? '#7F1D1D' : isPendientePago ? '#78350F' : '#063D25',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: '24px',
                            height: '24px',
                            background: '#F8FAF9',
                            borderRadius: '50%',
                            marginLeft: '-12px',
                        }}
                    ></div>
                    <div
                        style={{
                            flexGrow: 1,
                            borderBottom: '2px dashed rgba(255, 255, 255, 0.4)',
                            margin: '0 14px',
                        }}
                    ></div>
                    <div
                        style={{
                            width: '24px',
                            height: '24px',
                            background: '#F8FAF9',
                            borderRadius: '50%',
                            marginRight: '-12px',
                        }}
                    ></div>
                </div>

                {/* Cuerpo del Voucher */}
                <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: '1.25rem',
                            alignItems: 'center',
                        }}
                    >
                        {/* QR Code y Placa */}
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
                                gap: '0.75rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '130px',
                                    height: '130px',
                                    background: '#FFFFFF',
                                    border: '2px solid #0F172A',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                }}
                            >
                                <i className="fa-solid fa-qrcode" style={{ fontSize: '6.5rem', color: '#0F172A' }}></i>
                            </div>

                            <div
                                style={{
                                    background: '#FFFFFF',
                                    border: '2px solid #1E3A8A',
                                    borderRadius: '4px',
                                    padding: '0.2rem 0.75rem',
                                    fontFamily: 'monospace, sans-serif',
                                    fontWeight: 800,
                                    fontSize: '0.98rem',
                                    color: '#1E3A8A',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '0.72rem',
                                        background: '#1E3A8A',
                                        color: '#FFFFFF',
                                        padding: '0.1rem 0.35rem',
                                        borderRadius: '2px',
                                    }}
                                >
                                    BOL
                                </span>
                                <span>{booking.vehiclePlate}</span>
                            </div>

                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                Token QR: {boleta?.qrToken || booking.qrCodeText}
                            </span>
                        </div>

                        {/* Detalles de la Estancia */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ background: '#F1F5F9', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                                <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                                    Ubicación & Plazas Reservadas
                                </span>
                                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
                                    {booking.spotNumber}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                                    {booking.parkingAddress}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.55rem 0.75rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>HORA INGRESO</span>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{booking.entryTime}</div>
                                </div>
                                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.55rem 0.75rem' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>DURACIÓN</span>
                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{booking.durationHours} Horas</div>
                                </div>
                            </div>

                            {/* Alerta de bloqueo inmediato */}
                            <div
                                style={{
                                    background: isPendientePago ? '#FFFBEB' : '#ECFDF5',
                                    border: isPendientePago ? '1px solid #FCD34D' : '1px solid #A7F3D0',
                                    borderRadius: '6px',
                                    padding: '0.65rem 0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <i
                                    className={`fa-solid ${isPendientePago ? 'fa-shield-halved' : 'fa-circle-check'}`}
                                    style={{ color: isPendientePago ? '#D97706' : '#059669', fontSize: '1rem' }}
                                ></i>
                                <span
                                    style={{
                                        fontSize: '0.76rem',
                                        color: isPendientePago ? '#92400E' : '#065F46',
                                        fontWeight: 600,
                                    }}
                                >
                                    {isPendientePago
                                        ? 'Plazas bloqueadas en el intervalo reservado. Puedes pagar al llegar o por QR.'
                                        : 'Estadía activa: Placa registrada para apertura por talanquera LPR.'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Desglose de Plazas y Decoradores (Servicios Extras) de la Boleta */}
                    {boleta && boleta.detalles && boleta.detalles.length > 0 && (
                        <div
                            style={{
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '1rem',
                                background: '#F8FAFC',
                            }}
                        >
                            <h4
                                style={{
                                    margin: '0 0 0.75rem 0',
                                    fontSize: '0.84rem',
                                    fontWeight: 800,
                                    color: '#0F172A',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                }}
                            >
                                <i className="fa-solid fa-receipt" style={{ color: '#006D36' }}></i>
                                <span>Desglose Detallado de la Boleta (Patrón Decorador)</span>
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {boleta.detalles.map((d, i) => (
                                    <div
                                        key={d.id || i}
                                        style={{
                                            background: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '6px',
                                            padding: '0.65rem 0.85rem',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <span
                                                    style={{
                                                        background: '#063D25',
                                                        color: '#FFFFFF',
                                                        borderRadius: '3px',
                                                        padding: '0.12rem 0.45rem',
                                                        fontSize: '0.72rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {d.codigoEspacio}
                                                </span>
                                                <span style={{ fontSize: '0.76rem', color: '#475569' }}>
                                                    {d.tipoEspacio}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                                                Base: Bs {d.precioUnitarioAplicado}.00 / h
                                            </span>
                                        </div>

                                        {/* Servicios Extras decorados en esta plaza */}
                                        {d.serviciosExtras && d.serviciosExtras.length > 0 && (
                                            <div
                                                style={{
                                                    marginTop: '0.4rem',
                                                    paddingTop: '0.4rem',
                                                    borderTop: '1px dashed #E2E8F0',
                                                    display: 'flex',
                                                    flexWrap: 'wrap',
                                                    gap: '0.4rem',
                                                }}
                                            >
                                                {d.serviciosExtras.map((se) => (
                                                    <span
                                                        key={se.id || se.servicioExtraId}
                                                        style={{
                                                            background: '#ECFDF5',
                                                            border: '1px solid #A7F3D0',
                                                            borderRadius: '4px',
                                                            padding: '0.15rem 0.45rem',
                                                            fontSize: '0.7rem',
                                                            color: '#065F46',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-sparkles" style={{ marginRight: '3px', color: '#059669' }}></i>
                                                        {se.nombre}: +Bs {se.subtotal}.00
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'flex-end',
                                                marginTop: '0.35rem',
                                                fontSize: '0.76rem',
                                                fontWeight: 800,
                                                color: '#006D36',
                                            }}
                                        >
                                            Subtotal Plaza: Bs {d.subtotal}.00
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botones de Acción: Cancelación Exclusiva por Conductor */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderTop: '1px solid #E2E8F0',
                            paddingTop: '0.85rem',
                        }}
                    >
                        <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            <i className="fa-solid fa-user-lock" style={{ marginRight: '4px' }}></i>
                            Cancelación exclusiva autorizada para el conductor titular
                        </span>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                                        padding: '0.5rem 1rem',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        cursor: isCancelada ? 'not-allowed' : 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
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
                                            borderRadius: '5px',
                                            padding: '0.4rem 0.75rem',
                                            fontSize: '0.76rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {isFinishing ? 'Cancelando...' : 'Sí, Cancelar'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmCancelOpen(false)}
                                        style={{
                                            background: '#F1F5F9',
                                            color: '#475569',
                                            border: '1px solid #CBD5E1',
                                            borderRadius: '5px',
                                            padding: '0.4rem 0.65rem',
                                            fontSize: '0.76rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        No
                                    </button>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => onFinishBooking(booking.id)}
                                disabled={isFinishing || isCancelada}
                                style={{
                                    background: '#064E3B',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem 1.15rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: isFinishing || isCancelada ? 'not-allowed' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                                }}
                            >
                                {isFinishing ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-flag-checkered"></i>
                                )}
                                <span>Finalizar Estadía / Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
