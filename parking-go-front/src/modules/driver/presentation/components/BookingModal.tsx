// src/modules/driver/presentation/components/BookingModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import type { DriverParking, DriverParkingSpace } from '../../domain/DriverParking';
import type { DriverVehicle } from '../../domain/DriverVehicle';
import type { CreateBookingPayload, CotizacionReservaResult } from '../../domain/DriverBooking';
import { useCotizarReservaMutation } from '../../application/useDriverMutations';

interface BookingModalProps {
    isOpen: boolean;
    parking: DriverParking | null;
    vehicles: DriverVehicle[];
    onClose: () => void;
    onConfirmBooking: (payload: CreateBookingPayload) => Promise<void>;
    isSubmitting?: boolean;
    preselectedSpot?: string | null;
}

interface EspacioSeleccionadoState {
    espacioId: string;
    codigoEspacio: string;
    serviciosExtrasIds: string[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    parking,
    vehicles,
    onClose,
    onConfirmBooking,
    isSubmitting,
    preselectedSpot,
}) => {
    const [durationHours, setDurationHours] = useState<number>(2);
    const [selectedPlate, setSelectedPlate] = useState<string>(
        vehicles.find((v) => v.isDefault)?.plate || vehicles[0]?.plate || '',
    );

    // Lista de espacios seleccionados con sus decoradores (servicios extras) configurados individualmente
    const [selectedSpaces, setSelectedSpaces] = useState<EspacioSeleccionadoState[]>([]);
    const [cotizacionResult, setCotizacionResult] = useState<CotizacionReservaResult | null>(null);

    const cotizarMutation = useCotizarReservaMutation();

    // Espacios disponibles del estacionamiento
    const availableSpaces = useMemo(() => {
        if (!parking?.spaces || parking.spaces.length === 0) return [];
        return parking.spaces.filter((s) => s.status === 'DISPONIBLE');
    }, [parking?.spaces]);

    // Servicios extras disponibles en el catálogo de este estacionamiento
    const availableExtras = useMemo(() => {
        return parking?.serviciosExtras || [];
    }, [parking?.serviciosExtras]);

    // Inicializar selección de espacio cuando se abre el modal
    useEffect(() => {
        if (!isOpen || !parking) {
            setSelectedSpaces([]);
            setCotizacionResult(null);
            return;
        }

        // Si se preseleccionó un spot específico
        let initialSpace: DriverParkingSpace | undefined;
        if (preselectedSpot) {
            initialSpace = availableSpaces.find((s) => s.code === preselectedSpot);
        }
        if (!initialSpace && availableSpaces.length > 0) {
            initialSpace = availableSpaces[0];
        }

        if (initialSpace) {
            setSelectedSpaces([
                {
                    espacioId: initialSpace.id,
                    codigoEspacio: initialSpace.code,
                    serviciosExtrasIds: [],
                },
            ]);
        } else {
            // Espacio virtual por defecto si el catálogo no tiene lista de plazas cargadas
            setSelectedSpaces([
                {
                    espacioId: 'auto-asignado',
                    codigoEspacio: preselectedSpot || 'Plaza Asignada',
                    serviciosExtrasIds: [],
                },
            ]);
        }
    }, [isOpen, parking, preselectedSpot, availableSpaces]);

    // Recalcular cotización en tiempo real con el backend mediante el patrón Decorator
    useEffect(() => {
        if (!parking || selectedSpaces.length === 0) {
            setCotizacionResult(null);
            return;
        }

        // Filtrar espacios reales con ID válido para la API
        const espaciosPayload = selectedSpaces
            .filter((s) => s.espacioId !== 'auto-asignado')
            .map((s) => ({
                espacioId: s.espacioId,
                duracionHoras: durationHours,
                serviciosExtras: s.serviciosExtrasIds.map((id) => ({
                    servicioExtraId: id,
                    cantidad: 1,
                })),
            }));

        if (espaciosPayload.length > 0) {
            cotizarMutation
                .mutateAsync({
                    estacionamientoId: parking.id,
                    espacios: espaciosPayload,
                })
                .then((res) => {
                    setCotizacionResult(res);
                })
                .catch((err) => {
                    console.warn('Error en cotización en vivo con backend:', err);
                });
        }
    }, [parking, selectedSpaces, durationHours]);

    if (!isOpen || !parking) return null;

    // Toggle para agregar/quitar espacio
    const handleToggleSpace = (space: DriverParkingSpace) => {
        const existe = selectedSpaces.some((s) => s.espacioId === space.id);
        if (existe) {
            if (selectedSpaces.length === 1) {
                alert('Debes mantener al menos un espacio seleccionado para la boleta.');
                return;
            }
            setSelectedSpaces((prev) => prev.filter((s) => s.espacioId !== space.id));
        } else {
            setSelectedSpaces((prev) => [
                ...prev,
                {
                    espacioId: space.id,
                    codigoEspacio: space.code,
                    serviciosExtrasIds: [],
                },
            ]);
        }
    };

    // Toggle de servicio extra para un espacio determinado (Principio Decorator individual por espacio)
    const handleToggleExtraForSpace = (espacioId: string, extraId: string) => {
        setSelectedSpaces((prev) =>
            prev.map((s) => {
                if (s.espacioId !== espacioId) return s;
                const tiene = s.serviciosExtrasIds.includes(extraId);
                const nuevasExtras = tiene
                    ? s.serviciosExtrasIds.filter((id) => id !== extraId)
                    : [...s.serviciosExtrasIds, extraId];
                return {
                    ...s,
                    serviciosExtrasIds: nuevasExtras,
                };
            }),
        );
    };

    // Cálculo local reactivo de respaldo
    const baseHourPrice = parking.pricePerHour || 10;
    const subtotalPlazasLocal = selectedSpaces.length * baseHourPrice * durationHours;
    const subtotalExtrasLocal = selectedSpaces.reduce((acc, s) => {
        const extrasCost = s.serviciosExtrasIds.reduce((sum, extraId) => {
            const found = availableExtras.find((e) => e.id === extraId);
            return sum + (found?.precio || 0);
        }, 0);
        return acc + extrasCost;
    }, 0);
    const totalLocal = subtotalPlazasLocal + subtotalExtrasLocal;

    // Total final (prioriza la respuesta del Assembler Decorator del backend)
    const displayedTotal = cotizacionResult ? cotizacionResult.totalGeneral : totalLocal;

    // Limpieza amigable de la dirección para evitar textos largos desordenados
    const cleanAddress = parking.address.split('(')[0].trim() || parking.address;

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlate) {
            alert('Por favor selecciona un vehículo registrado');
            return;
        }

        const primerEspacioReal = selectedSpaces.find((s) => s.espacioId !== 'auto-asignado');

        await onConfirmBooking({
            parkingId: parking.id,
            vehiclePlate: selectedPlate,
            durationHours,
            espacioId: primerEspacioReal?.espacioId,
            detallesEspacios: selectedSpaces.map((s) => ({
                espacioId: s.espacioId,
                serviciosExtrasIds: s.serviciosExtrasIds,
            })),
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(6px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.2s ease-out',
            }}
        >
            <div
                style={{
                    background: '#FFFFFF',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '660px',
                    maxHeight: '92vh',
                    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header Modal con Contraste Impecable */}
                <div
                    style={{
                        padding: '1.25rem 1.6rem',
                        background: 'linear-gradient(135deg, #063D25 0%, #0B5735 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                background: 'rgba(34, 197, 94, 0.25)',
                                border: '1px solid rgba(34, 197, 94, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4ADE80',
                                fontSize: '1.2rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            <i className="fa-solid fa-receipt"></i>
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '1.15rem',
                                    fontWeight: 800,
                                    color: '#FFFFFF',
                                    letterSpacing: '-0.01em',
                                    lineHeight: 1.25,
                                }}
                            >
                                Boleta de Reserva de Estacionamiento
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                <span
                                    style={{
                                        fontSize: '0.72rem',
                                        color: '#86EFAC',
                                        fontWeight: 600,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                    }}
                                >
                                    <i className="fa-solid fa-shield-halved" style={{ fontSize: '0.7rem' }}></i>
                                    Patrón Decorador dinámico • Servicios extras configurables por plaza
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Cerrar ventana"
                        style={{
                            background: 'rgba(255, 255, 255, 0.12)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            width: '34px',
                            height: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Formulario Scrolleable */}
                <form
                    onSubmit={handleFormSubmit}
                    style={{
                        padding: '1.4rem 1.6rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.15rem',
                        overflowY: 'auto',
                    }}
                >
                    {/* Tarjeta de Información del Parqueo */}
                    <div
                        style={{
                            background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                                <span
                                    style={{
                                        background: '#063D25',
                                        color: '#FFFFFF',
                                        fontSize: '0.65rem',
                                        fontWeight: 800,
                                        padding: '0.15rem 0.45rem',
                                        borderRadius: '4px',
                                        letterSpacing: '0.04em',
                                    }}
                                >
                                    PARQUEO
                                </span>
                                <h4
                                    style={{
                                        margin: 0,
                                        fontWeight: 800,
                                        fontSize: '0.98rem',
                                        color: '#0F172A',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {parking.name}
                                </h4>
                            </div>
                            <div
                                style={{
                                    fontSize: '0.78rem',
                                    color: '#64748B',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                }}
                            >
                                <i className="fa-solid fa-location-dot" style={{ color: '#006D36' }}></i>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {cleanAddress}
                                </span>
                            </div>
                        </div>

                        {/* Badge Tarifa Destacada */}
                        <div
                            style={{
                                background: '#ECFDF5',
                                border: '1px solid #A7F3D0',
                                borderRadius: '8px',
                                padding: '0.45rem 0.85rem',
                                textAlign: 'right',
                                flexShrink: 0,
                            }}
                        >
                            <span style={{ fontSize: '0.68rem', color: '#065F46', fontWeight: 700, textTransform: 'uppercase' }}>
                                Tarifa Base
                            </span>
                            <div style={{ fontWeight: 900, color: '#006D36', fontSize: '1.15rem', lineHeight: 1.1 }}>
                                Bs {parking.pricePerHour}.00
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>por hora</span>
                        </div>
                    </div>

                    {/* Fila: Selector de Vehículo y Duración */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.9rem' }}>
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    color: '#334155',
                                    marginBottom: '0.4rem',
                                }}
                            >
                                <i className="fa-solid fa-car" style={{ marginRight: '5px', color: '#006D36' }}></i>
                                Vehículo con el que ingresarás:
                            </label>
                            <select
                                value={selectedPlate}
                                onChange={(e) => setSelectedPlate(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.55rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1px solid #CBD5E1',
                                    fontSize: '0.82rem',
                                    color: '#0F172A',
                                    outline: 'none',
                                    background: '#FFFFFF',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.plate}>
                                        {v.plate} — {v.model} ({v.color})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    color: '#334155',
                                    marginBottom: '0.4rem',
                                }}
                            >
                                <i className="fa-solid fa-clock" style={{ marginRight: '5px', color: '#006D36' }}></i>
                                Duración de reserva:
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
                                {[1, 2, 3, 4].map((hours) => {
                                    const isSelected = durationHours === hours;
                                    return (
                                        <button
                                            key={hours}
                                            type="button"
                                            onClick={() => setDurationHours(hours)}
                                            style={{
                                                padding: '0.55rem 0.2rem',
                                                borderRadius: '8px',
                                                border: isSelected ? '2px solid #006D36' : '1px solid #E2E8F0',
                                                background: isSelected
                                                    ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
                                                    : '#FFFFFF',
                                                color: isSelected ? '#064E3B' : '#475569',
                                                fontWeight: 800,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease',
                                                boxShadow: isSelected ? '0 2px 6px rgba(0, 109, 54, 0.15)' : 'none',
                                            }}
                                        >
                                            {hours}h
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sección 1: Selección de Espacios de Estacionamiento */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.45rem',
                            }}
                        >
                            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B' }}>
                                <i className="fa-solid fa-square-parking" style={{ marginRight: '6px', color: '#006D36' }}></i>
                                Plazas a Reservar en la Boleta:
                            </label>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <span
                                    style={{
                                        fontSize: '0.7rem',
                                        background: '#063D25',
                                        color: '#FFFFFF',
                                        padding: '0.15rem 0.5rem',
                                        borderRadius: '4px',
                                        fontWeight: 700,
                                    }}
                                >
                                    {selectedSpaces.length} seleccionada{selectedSpaces.length > 1 ? 's' : ''}
                                </span>
                                {availableSpaces.length > 0 && (
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            background: '#ECFDF5',
                                            color: '#059669',
                                            border: '1px solid #A7F3D0',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '4px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {availableSpaces.length} disponibles
                                    </span>
                                )}
                            </div>
                        </div>

                        {availableSpaces.length > 0 ? (
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '10px',
                                    maxHeight: '130px',
                                    overflowY: 'auto',
                                }}
                            >
                                {availableSpaces.map((s) => {
                                    const isSelected = selectedSpaces.some((sel) => sel.espacioId === s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => handleToggleSpace(s)}
                                            style={{
                                                padding: '0.45rem 0.85rem',
                                                borderRadius: '8px',
                                                border: isSelected ? '2px solid #006D36' : '1px solid #CBD5E1',
                                                background: isSelected
                                                    ? 'linear-gradient(135deg, #ECFDF5 0%, #DCFCE7 100%)'
                                                    : '#FFFFFF',
                                                color: isSelected ? '#064E3B' : '#334155',
                                                fontWeight: 800,
                                                fontSize: '0.78rem',
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.45rem',
                                                boxShadow: isSelected
                                                    ? '0 2px 6px rgba(0, 109, 54, 0.12)'
                                                    : '0 1px 2px rgba(0,0,0,0.02)',
                                                transition: 'all 0.15s ease',
                                            }}
                                        >
                                            <i
                                                className={`fa-solid ${isSelected ? 'fa-circle-check' : 'fa-square'}`}
                                                style={{ color: isSelected ? '#006D36' : '#94A3B8', fontSize: '0.85rem' }}
                                            ></i>
                                            <span>{s.code}</span>
                                            <span
                                                style={{
                                                    fontSize: '0.68rem',
                                                    color: isSelected ? '#047857' : '#64748B',
                                                    background: isSelected ? 'rgba(5, 150, 105, 0.12)' : '#F1F5F9',
                                                    padding: '0.1rem 0.35rem',
                                                    borderRadius: '4px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {s.level}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: '#F0FDF4',
                                    border: '1px solid #BBF7D0',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    color: '#166534',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                }}
                            >
                                <i className="fa-solid fa-circle-info" style={{ fontSize: '1rem', color: '#16A34A' }}></i>
                                <span>Se asignará automáticamente la plaza disponible al registrar tu ingreso.</span>
                            </div>
                        )}
                    </div>

                    {/* Sección 2: Configuración del Patrón Decorador por cada Espacio */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
                            <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#D97706', fontSize: '0.9rem' }}></i>
                            <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                                Servicios Extras Decoradores (Configuración independiente por plaza):
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                            {selectedSpaces.map((space, idx) => {
                                const cotizDetalle = cotizacionResult?.detallesEspacios.find(
                                    (d) => d.espacioId === space.espacioId,
                                );
                                const subtotalBasePlaza =
                                    (cotizDetalle?.precioBaseUnitario || baseHourPrice) * durationHours;

                                return (
                                    <div
                                        key={space.espacioId}
                                        style={{
                                            border: '1px solid #E2E8F0',
                                            borderRadius: '10px',
                                            padding: '0.85rem 1rem',
                                            background: '#FFFFFF',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                borderBottom: '1px solid #F1F5F9',
                                                paddingBottom: '0.55rem',
                                                marginBottom: '0.65rem',
                                                flexWrap: 'wrap',
                                                gap: '0.5rem',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                                                <span
                                                    style={{
                                                        background: '#063D25',
                                                        color: '#FFFFFF',
                                                        borderRadius: '6px',
                                                        padding: '0.2rem 0.6rem',
                                                        fontSize: '0.74rem',
                                                        fontWeight: 800,
                                                        letterSpacing: '0.02em',
                                                    }}
                                                >
                                                    Plaza #{idx + 1}: {space.codigoEspacio}
                                                </span>
                                                <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                                    Base: Bs {baseHourPrice}/h × {durationHours}h ={' '}
                                                    <strong style={{ color: '#0F172A' }}>Bs {subtotalBasePlaza}.00</strong>
                                                </span>
                                            </div>

                                            <span
                                                style={{
                                                    fontSize: '0.78rem',
                                                    fontWeight: 800,
                                                    color: '#006D36',
                                                    background: '#ECFDF5',
                                                    border: '1px solid #A7F3D0',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                Subtotal Decorado: Bs{' '}
                                                {cotizDetalle ? cotizDetalle.subtotalTotalEspacio : subtotalBasePlaza}.00
                                            </span>
                                        </div>

                                        {/* Opciones de Servicios Extras para esta plaza */}
                                        {availableExtras.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                                {availableExtras.map((extra) => {
                                                    const isChecked = space.serviciosExtrasIds.includes(extra.id);
                                                    return (
                                                        <button
                                                            key={extra.id}
                                                            type="button"
                                                            onClick={() =>
                                                                handleToggleExtraForSpace(space.espacioId, extra.id)
                                                            }
                                                            style={{
                                                                padding: '0.45rem 0.8rem',
                                                                borderRadius: '8px',
                                                                border: isChecked
                                                                    ? '1.5px solid #059669'
                                                                    : '1px solid #E2E8F0',
                                                                background: isChecked ? '#ECFDF5' : '#F8FAFC',
                                                                color: isChecked ? '#065F46' : '#475569',
                                                                fontSize: '0.76rem',
                                                                fontWeight: isChecked ? 700 : 500,
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.45rem',
                                                                boxShadow: isChecked
                                                                    ? '0 2px 6px rgba(5, 150, 105, 0.12)'
                                                                    : 'none',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                        >
                                                            <i
                                                                className={`fa-solid ${isChecked ? 'fa-circle-check' : 'fa-plus'}`}
                                                                style={{
                                                                    color: isChecked ? '#059669' : '#94A3B8',
                                                                    fontSize: '0.82rem',
                                                                }}
                                                            ></i>
                                                            <span>{extra.nombre}</span>
                                                            <strong style={{ color: isChecked ? '#047857' : '#0F172A' }}>
                                                                (+Bs {extra.precio}.00)
                                                            </strong>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    background: '#F8FAFC',
                                                    border: '1px dashed #CBD5E1',
                                                    borderRadius: '6px',
                                                    padding: '0.55rem 0.85rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.45rem',
                                                    fontSize: '0.74rem',
                                                    color: '#64748B',
                                                }}
                                            >
                                                <i
                                                    className="fa-solid fa-sparkles"
                                                    style={{ color: '#94A3B8', fontSize: '0.8rem' }}
                                                ></i>
                                                <span>
                                                    Este parqueo opera con tarifa estándar base (sin servicios extras
                                                    requeridos).
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Resumen de Desglose de la Boleta (Ticket Invoice Style) */}
                    <div
                        style={{
                            background: 'linear-gradient(180deg, #F0FDF4 0%, #F8FAFC 100%)',
                            border: '1px solid #BBF7D0',
                            borderRadius: '12px',
                            padding: '1.1rem 1.25rem',
                            position: 'relative',
                            boxShadow: '0 4px 12px rgba(6, 61, 37, 0.04)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.65rem',
                            }}
                        >
                            <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>
                                Estado inicial tras emisión:
                            </span>
                            <span
                                style={{
                                    background: '#FEF3C7',
                                    border: '1px solid #FCD34D',
                                    color: '#B45309',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '5px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                }}
                            >
                                <i className="fa-solid fa-clock-rotate-left"></i>
                                PENDIENTE DE PAGO (Plazas Bloqueadas)
                            </span>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                color: '#475569',
                                marginBottom: '0.35rem',
                            }}
                        >
                            <span>Subtotal Plazas Base ({selectedSpaces.length}):</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>Bs {subtotalPlazasLocal}.00</span>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.8rem',
                                color: '#475569',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <span>Servicios Extras Adicionados (Decoradores):</span>
                            <span style={{ fontWeight: 700, color: '#006D36' }}>+Bs {subtotalExtrasLocal}.00</span>
                        </div>

                        {/* Línea divisoria estilo ticket */}
                        <div
                            style={{
                                borderTop: '2px dashed #CBD5E1',
                                paddingTop: '0.75rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0F172A' }}>
                                    Total Boleta de Reserva:
                                </span>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                    Incluye {durationHours}h de estadía + {selectedSpaces.length} plaza(s)
                                </div>
                            </div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#006D36' }}>
                                Bs {displayedTotal}.00
                            </div>
                        </div>
                    </div>

                    {/* Footer y Acciones */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.75rem',
                            paddingTop: '0.4rem',
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            style={{
                                padding: '0.65rem 1.25rem',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                background: '#FFFFFF',
                                color: '#475569',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || selectedSpaces.length === 0}
                            style={{
                                padding: '0.65rem 1.6rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #006D36 0%, #047857 100%)',
                                color: '#FFFFFF',
                                fontSize: '0.86rem',
                                fontWeight: 800,
                                cursor: isSubmitting ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.55rem',
                                boxShadow: '0 4px 14px rgba(0, 109, 54, 0.35)',
                                transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 109, 54, 0.45)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 109, 54, 0.35)';
                            }}
                        >
                            {isSubmitting ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-file-invoice-dollar"></i>
                            )}
                            <span>Emitir Boleta y Reservar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
