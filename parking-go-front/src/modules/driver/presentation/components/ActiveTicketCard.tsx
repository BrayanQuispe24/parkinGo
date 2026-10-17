// src/modules/driver/presentation/components/ActiveTicketCard.tsx
import React from 'react';
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
    if (!booking) {
        return (
            <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '3.5rem', textAlign: 'center' }}>
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
                    No tienes ningún ticket o reserva activa en este momento
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1.25rem 0', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Explora los parqueos disponibles en el mapa y reserva tu plaza con confirmación instantánea.
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

    return (
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
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
                {/* Banner de Cabecera con degradado ParkinGo */}
                <div
                    style={{
                        background: 'linear-gradient(135deg, #063D25 0%, #0B5735 100%)',
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
                            <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                                <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i> RESERVA CONFIRMADA
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: 600 }}>
                                {booking.bookingNumber}
                            </span>
                        </div>
                        <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                            {booking.parkingName}
                        </h3>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', opacity: 0.8 }}>Monto Total</span>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ADE80' }}>
                            Bs {booking.totalAmount}.00
                        </div>
                    </div>
                </div>

                {/* Línea de corte / Ticket Tear Line con muescas circulares */}
                <div
                    style={{
                        height: '24px',
                        background: '#063D25',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ width: '24px', height: '24px', background: '#F8FAF9', borderRadius: '50%', marginLeft: '-12px' }}></div>
                    <div style={{ flexGrow: 1, borderBottom: '2px dashed rgba(255, 255, 255, 0.4)', margin: '0 14px' }}></div>
                    <div style={{ width: '24px', height: '24px', background: '#F8FAF9', borderRadius: '50%', marginRight: '-12px' }}></div>
                </div>

                {/* Cuerpo del Voucher */}
                <div style={{ padding: '1.5rem 1.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
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

                            {/* Badge de Placa Boliviana */}
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
                                <span style={{ fontSize: '0.72rem', background: '#1E3A8A', color: '#FFFFFF', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>BOL</span>
                                <span>{booking.vehiclePlate}</span>
                            </div>

                            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                Escanea este QR en la talanquera de entrada/salida
                            </span>
                        </div>

                        {/* Detalles de la Estancia */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ background: '#F1F5F9', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Ubicación & Plaza</span>
                                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A' }}>{booking.spotNumber}</div>
                                <div style={{ fontSize: '0.75rem', color: '#475569' }}>{booking.parkingAddress}</div>
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

                            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '6px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <i className="fa-solid fa-clock" style={{ color: '#059669', fontSize: '1rem' }}></i>
                                <span style={{ fontSize: '0.78rem', color: '#065F46', fontWeight: 600 }}>
                                    Estadía en curso: Placa registrada para apertura por cámara LPR.
                                </span>
                            </div>

                            {/* Botón de Finalizar / Pagar */}
                            <button
                                type="button"
                                onClick={() => onFinishBooking(booking.id)}
                                disabled={isFinishing}
                                style={{
                                    marginTop: '0.35rem',
                                    background: '#064E3B',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.65rem 1rem',
                                    fontSize: '0.84rem',
                                    fontWeight: 700,
                                    cursor: isFinishing ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 2px 6px rgba(6, 78, 59, 0.25)',
                                }}
                            >
                                {isFinishing ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-flag-checkered"></i>
                                )}
                                <span>Finalizar Estadía y Marcar Salida</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
