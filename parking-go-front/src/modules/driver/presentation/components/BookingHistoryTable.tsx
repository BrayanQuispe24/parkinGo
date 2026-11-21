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
            {selectedBookingForModal && (() => {
                const b = selectedBookingForModal;
                const boleta = b.boletaOriginal;
                const estadoBoleta = boleta?.estado || b.status;
                const isCancelled = estadoBoleta === 'CANCELADA' || b.status === 'CANCELLED';
                const isPending = estadoBoleta === 'PENDIENTE_PAGO';
                const isInProgress = estadoBoleta === 'EN_CURSO';
                const isCompleted = estadoBoleta === 'COMPLETADA' || b.status === 'COMPLETED';

                const horaEntrada = b.horaEntradaReal || boleta?.horaEntradaReal;
                const horaSalida = b.horaSalidaReal || boleta?.horaSalidaReal;

                return (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.72)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 1050,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                            animation: 'fadeInModal 0.2s ease-out',
                        }}
                        onClick={() => setSelectedBookingForModal(null)}
                    >
                        <div
                            style={{
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                maxWidth: '580px',
                                width: '100%',
                                maxHeight: '92vh',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: '0 24px 48px -12px rgba(6, 61, 37, 0.3), 0 8px 24px rgba(0, 0, 0, 0.18)',
                                overflow: 'hidden',
                                border: '1px solid #CBD5CE',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Cabecera Enterprise Alto Contraste */}
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                                            color: '#4ADE80',
                                            fontSize: '1.15rem',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <i className="fa-solid fa-receipt"></i>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <h4
                                                style={{
                                                    margin: 0,
                                                    fontSize: '0.98rem',
                                                    fontWeight: 800,
                                                    color: '#FFFFFF',
                                                    letterSpacing: '-0.01em',
                                                }}
                                            >
                                                Comprobante de Boleta
                                            </h4>
                                            <span
                                                style={{
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.66rem',
                                                    fontWeight: 800,
                                                    letterSpacing: '0.04em',
                                                    background: isCancelled
                                                        ? 'rgba(239, 68, 68, 0.25)'
                                                        : isCompleted
                                                        ? 'rgba(34, 197, 94, 0.25)'
                                                        : isInProgress
                                                        ? 'rgba(59, 130, 246, 0.25)'
                                                        : 'rgba(245, 158, 11, 0.25)',
                                                    color: isCancelled
                                                        ? '#FCA5A5'
                                                        : isCompleted
                                                        ? '#86EFAC'
                                                        : isInProgress
                                                        ? '#93C5FD'
                                                        : '#FDE68A',
                                                    border: `1px solid ${
                                                        isCancelled
                                                            ? 'rgba(239, 68, 68, 0.4)'
                                                            : isCompleted
                                                            ? 'rgba(34, 197, 94, 0.4)'
                                                            : isInProgress
                                                            ? 'rgba(59, 130, 246, 0.4)'
                                                            : 'rgba(245, 158, 11, 0.4)'
                                                    }`,
                                                }}
                                            >
                                                {isCancelled
                                                    ? 'CANCELADA'
                                                    : isCompleted
                                                    ? 'ESTADÍA COMPLETADA'
                                                    : isInProgress
                                                    ? 'EN CURSO'
                                                    : isPending
                                                    ? 'PENDIENTE PAGO'
                                                    : 'CONFIRMADA'}
                                            </span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.74rem',
                                                color: '#C8D5CC',
                                                fontFamily: 'monospace',
                                                marginTop: '0.15rem',
                                            }}
                                        >
                                            {b.bookingNumber} • {b.parkingName}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedBookingForModal(null)}
                                    title="Cerrar comprobante"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.18)',
                                        borderRadius: '6px',
                                        width: '32px',
                                        height: '32px',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.95rem',
                                        transition: 'background 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>

                            {/* Cuerpo del Modal con Scroll */}
                            <div
                                style={{
                                    padding: '1.25rem 1.4rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    overflowY: 'auto',
                                    flex: 1,
                                }}
                            >
                                {/* Ficha de Ubicación y Vehículo */}
                                <div
                                    style={{
                                        background: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '8px',
                                        padding: '0.85rem 1rem',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                                        gap: '0.85rem',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '0.67rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>
                                            Estacionamiento
                                        </span>
                                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F172A', marginTop: '0.15rem' }}>
                                            {b.parkingName}
                                        </div>
                                        <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <i className="fa-solid fa-location-dot" style={{ color: '#006D36', fontSize: '0.7rem' }}></i>
                                            <span>{b.parkingAddress}</span>
                                        </div>
                                    </div>

                                    {/* Placa Boliviana Oficial */}
                                    <div>
                                        <span style={{ fontSize: '0.67rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>
                                            Vehículo Registrado
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <div
                                                style={{
                                                    background: '#FFFFFF',
                                                    border: '2px solid #1E293B',
                                                    borderRadius: '4px',
                                                    padding: '0.18rem 0.6rem',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.45rem',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingRight: '0.4rem', borderRight: '1px solid #CBD5E1' }}>
                                                    <span style={{ fontSize: '0.5rem', fontWeight: 800, color: '#1E3A8A', lineHeight: 1 }}>BOL</span>
                                                    <span style={{ width: '12px', height: '5px', marginTop: '1px', background: 'linear-gradient(180deg, #DC2626 33%, #F59E0B 33%, #F59E0B 66%, #16A34A 66%)', borderRadius: '1px' }} />
                                                </div>
                                                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '0.88rem', letterSpacing: '0.06em', color: '#0F172A' }}>
                                                    {b.vehiclePlate || 'SIN PLACA'}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                                                {b.vehicleModel || ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bloque Especial: Auditoría de Horarios en Garita (Entrada & Salida Real) */}
                                <div
                                    style={{
                                        background: isCompleted ? '#F0FDF4' : isInProgress ? '#EFF6FF' : '#F8FAFC',
                                        border: `1px solid ${isCompleted ? '#86EFAC' : isInProgress ? '#BFDBFE' : '#CBD5E1'}`,
                                        borderRadius: '8px',
                                        padding: '0.85rem 1rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.65rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                color: isCompleted ? '#166534' : isInProgress ? '#1E40AF' : '#475569',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.35rem',
                                            }}
                                        >
                                            <i className="fa-solid fa-tower-broadcast" style={{ color: isCompleted ? '#16A34A' : isInProgress ? '#2563EB' : '#64748B' }}></i>
                                            Auditoría de Control de Acceso (Garita)
                                        </span>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B' }}>
                                            Duración: <strong>{b.durationHours} Horas</strong>
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                                        {/* Hora Entrada */}
                                        <div
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '6px',
                                                padding: '0.55rem 0.75rem',
                                            }}
                                        >
                                            <span style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <i className="fa-solid fa-circle-check" style={{ color: horaEntrada ? '#16A34A' : '#94A3B8' }}></i>
                                                HORA ENTRADA REGISTRADA
                                            </span>
                                            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: horaEntrada ? '#0F172A' : '#94A3B8', marginTop: '0.2rem' }}>
                                                {horaEntrada
                                                    ? new Date(horaEntrada).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                                    : b.entryTime || 'Pendiente de escaneo'}
                                            </div>
                                        </div>

                                        {/* Hora Salida */}
                                        <div
                                            style={{
                                                background: '#FFFFFF',
                                                border: '1px solid #E2E8F0',
                                                borderRadius: '6px',
                                                padding: '0.55rem 0.75rem',
                                            }}
                                        >
                                            <span style={{ fontSize: '0.66rem', color: '#64748B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <i className="fa-solid fa-flag-checkered" style={{ color: horaSalida ? '#2563EB' : '#94A3B8' }}></i>
                                                HORA SALIDA REGISTRADA
                                            </span>
                                            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: horaSalida ? '#0F172A' : '#94A3B8', marginTop: '0.2rem' }}>
                                                {horaSalida
                                                    ? new Date(horaSalida).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                                                    : isInProgress
                                                    ? 'En curso (dentro del parqueo)'
                                                    : 'Pendiente de egreso'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Desglose de Plazas y Servicios Adicionales */}
                                {boleta?.detalles && boleta.detalles.length > 0 ? (
                                    <div>
                                        <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#334155', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                            Desglose de Plazas y Servicios Adicionales:
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {boleta.detalles.map((d, i) => (
                                                <div
                                                    key={d.id || i}
                                                    style={{
                                                        background: '#F8FAFC',
                                                        border: '1px solid #E2E8F0',
                                                        borderRadius: '6px',
                                                        padding: '0.65rem 0.85rem',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0F172A' }}>
                                                            Plaza {d.codigoEspacio} ({d.tipoEspacio})
                                                        </span>
                                                        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                                                            Base: Bs {d.precioUnitarioAplicado}.00 / h
                                                        </span>
                                                    </div>
                                                    {d.serviciosExtras && d.serviciosExtras.length > 0 && (
                                                        <div style={{ marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
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
                                                                    + {se.nombre} (Bs {se.subtotal}.00)
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div style={{ textAlign: 'right', marginTop: '0.35rem', fontSize: '0.78rem', fontWeight: 800, color: '#006D36' }}>
                                                        Subtotal: Bs {d.subtotal}.00
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                                        Plaza: {b.spotNumber} • Vehículo: {b.vehiclePlate}
                                    </div>
                                )}

                                {/* Total Facturado */}
                                <div
                                    style={{
                                        borderTop: '1px solid #E2E8F0',
                                        paddingTop: '0.75rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A', display: 'block' }}>
                                            Total Facturado:
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                            Método de pago: <strong>{boleta?.metodoPago || b.paymentMethod || 'EFECTIVO'}</strong>
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#006D36' }}>
                                        Bs {b.totalAmount}.00
                                    </span>
                                </div>
                            </div>

                            {/* Footer con Botón Imprimir y Cerrar */}
                            <div
                                style={{
                                    padding: '0.85rem 1.4rem',
                                    background: '#F8FAFC',
                                    borderTop: '1px solid #E2E8F0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    style={{
                                        padding: '0.48rem 0.95rem',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        color: '#334155',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                >
                                    <i className="fa-solid fa-print" style={{ color: '#006D36' }}></i>
                                    <span>Imprimir Comprobante</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setSelectedBookingForModal(null)}
                                    style={{
                                        padding: '0.48rem 1.25rem',
                                        borderRadius: '6px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        color: '#0F172A',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};
