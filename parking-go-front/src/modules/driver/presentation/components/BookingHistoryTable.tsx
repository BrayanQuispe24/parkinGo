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

    const filteredBookings = bookings.filter(
        (b) =>
            b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.parkingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        Historial de Reservas y Estadías
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.2rem 0 0 0' }}>
                        Consulta tus comprobantes anteriores, plazas utilizadas y facturación electrónica.
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
                            <th style={{ padding: '0.85rem 1.15rem' }}>PARQUEO / UBICACIÓN</th>
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
                            filteredBookings.map((b) => (
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
                                            Plaza: {b.spotNumber}
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
                                                background: b.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                                                color: b.status === 'ACTIVE' ? '#15803D' : '#475569',
                                                border: b.status === 'ACTIVE' ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                                            }}
                                        >
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: b.status === 'ACTIVE' ? '#22C55E' : '#64748B' }}></span>
                                            {b.status === 'ACTIVE' ? 'EN CURSO' : 'COMPLETADO'}
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
                                            onClick={() => onViewTicket?.(b)}
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
