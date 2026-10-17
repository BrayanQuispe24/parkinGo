// src/modules/driver/presentation/components/BookingModal.tsx
import React, { useState } from 'react';
import type { DriverParking } from '../../domain/DriverParking';
import type { DriverVehicle } from '../../domain/DriverVehicle';
import type { CreateBookingPayload } from '../../domain/DriverBooking';

interface BookingModalProps {
    isOpen: boolean;
    parking: DriverParking | null;
    vehicles: DriverVehicle[];
    onClose: () => void;
    onConfirmBooking: (payload: CreateBookingPayload) => Promise<void>;
    isSubmitting?: boolean;
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    parking,
    vehicles,
    onClose,
    onConfirmBooking,
    isSubmitting,
}) => {
    const [durationHours, setDurationHours] = useState<number>(2);
    const [selectedPlate, setSelectedPlate] = useState<string>(
        vehicles.find((v) => v.isDefault)?.plate || vehicles[0]?.plate || ''
    );

    if (!isOpen || !parking) return null;

    const totalCost = parking.pricePerHour * durationHours;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlate) {
            alert('Por favor selecciona un vehículo registrado');
            return;
        }

        await onConfirmBooking({
            parkingId: parking.id,
            vehiclePlate: selectedPlate,
            durationHours,
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    width: '100%',
                    maxWidth: '520px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                }}
            >
                {/* Header Modal */}
                <div
                    style={{
                        padding: '1rem 1.4rem',
                        background: '#063D25',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <i className="fa-solid fa-calendar-check" style={{ color: '#22C55E' }}></i>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Confirmar Reserva de Plaza</h3>
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
                        }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleFormSubmit} style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Resumen del Parqueo */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>{parking.name}</div>
                        <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '0.15rem' }}>
                            <i className="fa-solid fa-location-dot" style={{ color: '#006D36', marginRight: '4px' }}></i>
                            {parking.address}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.65rem', fontSize: '0.78rem' }}>
                            <div>
                                <span style={{ color: '#64748B' }}>Tarifa: </span>
                                <strong style={{ color: '#006D36' }}>Bs {parking.pricePerHour} / hora</strong>
                            </div>
                            <div>
                                <span style={{ color: '#64748B' }}>Disponibles: </span>
                                <strong style={{ color: '#15803D' }}>{parking.availableSpots} plazas</strong>
                            </div>
                        </div>
                    </div>

                    {/* Selector de Vehículo */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Vehículo con el que ingresarás:
                        </label>
                        <select
                            value={selectedPlate}
                            onChange={(e) => setSelectedPlate(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.85rem',
                                color: '#0F172A',
                                outline: 'none',
                                background: '#FFFFFF',
                            }}
                        >
                            {vehicles.map((v) => (
                                <option key={v.id} value={v.plate}>
                                    {v.plate} — {v.brand} {v.model} ({v.color})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Horas de Estadía */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                            Duración estimada de reserva:
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                            {[1, 2, 3, 4].map((hours) => (
                                <button
                                    key={hours}
                                    type="button"
                                    onClick={() => setDurationHours(hours)}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: durationHours === hours ? '2px solid #006D36' : '1px solid #CBD5E1',
                                        background: durationHours === hours ? '#F0FDF4' : '#FFFFFF',
                                        color: durationHours === hours ? '#006D36' : '#475569',
                                        fontWeight: 700,
                                        fontSize: '0.82rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {hours} {hours === 1 ? 'Hora' : 'Horas'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Desglose de Pago */}
                    <div
                        style={{
                            borderTop: '1px solid #E2E8F0',
                            paddingTop: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Total estimado a pagar:</span>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#006D36' }}>
                                Bs {totalCost}.00
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    border: '1px solid #CBD5E1',
                                    background: '#FFFFFF',
                                    color: '#475569',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#006D36',
                                    color: '#FFFFFF',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    cursor: isSubmitting ? 'wait' : 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.45rem',
                                    boxShadow: '0 2px 6px rgba(0, 109, 54, 0.3)',
                                }}
                            >
                                {isSubmitting ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-check"></i>
                                )}
                                <span>Generar Ticket</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
