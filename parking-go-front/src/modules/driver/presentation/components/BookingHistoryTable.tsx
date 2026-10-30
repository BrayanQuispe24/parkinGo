// src/modules/driver/presentation/components/BookingHistoryTable.tsx
import React, { useState } from 'react';
import type { DriverBooking } from '../../domain/DriverBooking';

interface BookingHistoryTableProps {
    bookings: DriverBooking[];
    onViewTicket?: (booking: DriverBooking) => void;
}

export const BookingHistoryTable: React.FC<BookingHistoryTableProps> = ({
    bookings,
    onViewTicket,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBookingForModal, setSelectedBookingForModal] = useState<DriverBooking | null>(null);

    const filteredBookings = bookings.filter(
        (b) =>
            b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.parkingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDetail = (b: DriverBooking) => {
        if (onViewTicket) {
            onViewTicket(b);
        } else {
            setSelectedBookingForModal(b);
        }
    };

    return (
        <div>
            {/* Header del Bloque */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                }}
            >
                <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Historial de Boletas de Reserva y Estadías
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                        Consulta tus comprobantes anteriores, plazas reservadas y servicios extras decorados.
                    </p>
                </div>

                <div style={{ position: 'relative', width: '260px' }}>
                    <i
                        className="fa-solid fa-magnifying-glass"
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#94A3B8',
                            fontSize: '0.8rem',
                        }}
                    ></i>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por código, parqueo..."
                        style={{
                            width: '100%',
                            padding: '0.45rem 1rem 0.45rem 2.2rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontSize: '0.82rem',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Tabla de Reservas */}
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    overflowX: 'auto',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr
                            style={{
                                background: '#F8FAFC',
                                borderBottom: '1px solid #E2E8F0',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#475569',
                            }}
                        >
                            <th style={{ padding: '0.85rem 1.15rem' }}>CÓDIGO TICKET</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>PARQUEO / PLAZAS</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>VEHÍCULO</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>DURACIÓN & FECHA</th>
                            <th style={{ padding: '0.85rem 1.15rem' }}>ESTADO</th>
                            <th style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>MONTO</th>
                            <th style={{ padding: '0.85rem 1.15rem', textAlign: 'center' }}>COMPROBANTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                                    No se encontraron registros de reservas en el historial.
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((b) => {
                                const estadoBoleta = b.boletaOriginal?.estado;
                                const isCancelled = b.status === 'CANCELLED' || estadoBoleta === 'CANCELADA';
                                const isPending = estadoBoleta === 'PENDIENTE_PAGO';

                                return (
                                    <tr
                                        key={b.id}
                                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                    >
                                        <td style={{ padding: '0.85rem 1.15rem' }}>
                                            <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A' }}>
                                                {b.bookingNumber}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem' }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                                                {b.parkingName}
                                            </div>
                                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                                                {b.spotNumber}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem' }}>
                                            <div
                                                style={{
                                                    background: '#FFFFFF',
                                                    border: '1px solid #1E3A8A',
                                                    borderRadius: '3px',
                                                    padding: '0.12rem 0.45rem',
                                                    fontFamily: 'monospace, sans-serif',
                                                    fontWeight: 800,
                                                    fontSize: '0.8rem',
                                                    color: '#1E3A8A',
                                                    display: 'inline-block',
                                                }}
                                            >
                                                {b.vehiclePlate}
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem', fontSize: '0.8rem', color: '#334155' }}>
                                            {b.entryTime}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.72rem',
                                                    fontWeight: 700,
                                                    background: isCancelled
                                                        ? '#FEE2E2'
                                                        : isPending
                                                          ? '#FEF3C7'
                                                          : '#DCFCE7',
                                                    color: isCancelled
                                                        ? '#B91C1C'
                                                        : isPending
                                                          ? '#B45309'
                                                          : '#15803D',
                                                    border: isCancelled
                                                        ? '1px solid #FCA5A5'
                                                        : isPending
                                                          ? '1px solid #FCD34D'
                                                          : '1px solid #86EFAC',
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '6px',
                                                        height: '6px',
                                                        borderRadius: '50%',
                                                        background: isCancelled ? '#EF4444' : isPending ? '#F59E0B' : '#22C55E',
                                                    }}
                                                ></span>
                                                {isCancelled ? 'CANCELADA' : isPending ? 'PENDIENTE PAGO' : 'COMPLETADA'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'right' }}>
                                            <strong style={{ color: '#006D36', fontSize: '0.88rem' }}>
                                                Bs {b.totalAmount}.00
                                            </strong>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.15rem', textAlign: 'center' }}>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenDetail(b)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #CBD5E1',
                                                    borderRadius: '5px',
                                                    padding: '0.3rem 0.65rem',
                                                    color: '#0F172A',
                                                    fontSize: '0.76rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                }}
                                                title="Ver detalle del voucher"
                                            >
                                                <i className="fa-solid fa-receipt" style={{ color: '#006D36' }}></i>
                                                <span>Detalle</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Detalle de Boleta / Voucher */}
            {selectedBookingForModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1050,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            maxWidth: '560px',
                            width: '100%',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                padding: '1rem 1.25rem',
                                background: '#063D25',
                                color: '#FFFFFF',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                                Detalle de Boleta: {selectedBookingForModal.bookingNumber}
                            </h4>
                            <button
                                type="button"
                                onClick={() => setSelectedBookingForModal(null)}
                                style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', fontSize: '1.1rem' }}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Estacionamiento:</div>
                                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>
                                    {selectedBookingForModal.parkingName}
                                </div>
                                <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                                    {selectedBookingForModal.parkingAddress}
                                </div>
                            </div>

                            {selectedBookingForModal.boletaOriginal?.detalles && selectedBookingForModal.boletaOriginal.detalles.length > 0 ? (
                                <div>
                                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                        Plazas y Servicios Extras (Patrón Decorador):
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                                        {selectedBookingForModal.boletaOriginal.detalles.map((d, i) => (
                                            <div
                                                key={d.id || i}
                                                style={{
                                                    background: '#F8FAFC',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '6px',
                                                    padding: '0.6rem 0.8rem',
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>
                                                        Plaza {d.codigoEspacio} ({d.tipoEspacio})
                                                    </span>
                                                    <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                                                        Base: Bs {d.precioUnitarioAplicado}.00 / h
                                                    </span>
                                                </div>
                                                {d.serviciosExtras && d.serviciosExtras.length > 0 && (
                                                    <div style={{ marginTop: '0.35rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                                        {d.serviciosExtras.map((se) => (
                                                            <span
                                                                key={se.id || se.servicioExtraId}
                                                                style={{
                                                                    background: '#ECFDF5',
                                                                    border: '1px solid #A7F3D0',
                                                                    borderRadius: '4px',
                                                                    padding: '0.12rem 0.4rem',
                                                                    fontSize: '0.68rem',
                                                                    color: '#065F46',
                                                                    fontWeight: 600,
                                                                }}
                                                            >
                                                                + {se.nombre} (Bs {se.subtotal}.00)
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div style={{ textAlign: 'right', marginTop: '0.3rem', fontSize: '0.76rem', fontWeight: 800, color: '#006D36' }}>
                                                    Subtotal: Bs {d.subtotal}.00
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                                    Plaza: {selectedBookingForModal.spotNumber} • Vehículo: {selectedBookingForModal.vehiclePlate}
                                </div>
                            )}

                            <div
                                style={{
                                    borderTop: '1px solid #E2E8F0',
                                    paddingTop: '0.65rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>Total Facturado:</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#006D36' }}>
                                    Bs {selectedBookingForModal.totalAmount}.00
                                </span>
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem 1.25rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
                            <button
                                type="button"
                                onClick={() => setSelectedBookingForModal(null)}
                                style={{
                                    padding: '0.45rem 1rem',
                                    borderRadius: '5px',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#0F172A',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
