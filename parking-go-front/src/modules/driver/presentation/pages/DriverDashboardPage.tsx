// src/modules/driver/presentation/pages/DriverDashboardPage.tsx
import { useState, useMemo } from 'react';
import type { DriverParking, ParkingTag } from '../../domain/DriverParking';
import type { CreateBookingPayload } from '../../domain/DriverBooking';
import type { CreateVehiclePayload } from '../../domain/DriverVehicle';
import type { CreateReviewPayload } from '../../domain/DriverReview';
import type { UpdateDriverProfilePayload } from '../../domain/DriverProfile';

import { useAuthStore } from '../../../../store/useAuthStore';
import {
    useDriverParkingsQuery,
    useDriverVehiclesQuery,
    useDriverActiveBookingQuery,
    useDriverBookingsHistoryQuery,
    useDriverReviewsQuery,
} from '../../application/useDriverQueries';
import {
    useCreateBookingMutation,
    useCancelBookingMutation,
    useAddVehicleMutation,
    useSetDefaultVehicleMutation,
    useCreateReviewMutation,
    useUpdateDriverProfileMutation,
} from '../../application/useDriverMutations';

import { DriverLayout } from '../layouts/DriverLayout';
import type { DriverViewKey } from '../layouts/DriverSidebar';
import { AirbnbSearchBar } from '../components/AirbnbSearchBar';
import { CategoriesBar } from '../components/CategoriesBar';
import { InteractiveGpsMap } from '../components/InteractiveGpsMap';
import { ParkingCardGrid } from '../components/ParkingCardGrid';
import { BookingModal } from '../components/BookingModal';
import { ActiveTicketCard } from '../components/ActiveTicketCard';
import { VehiclesManager } from '../components/VehiclesManager';
import { BookingHistoryTable } from '../components/BookingHistoryTable';
import { ServiceReviewPanel } from '../components/ServiceReviewPanel';
import { DriverProfilePanel } from '../components/DriverProfilePanel';

export const DriverDashboardPage = () => {
    // Vista activa en el portal del conductor
    const [activeView, setActiveView] = useState<DriverViewKey>('mapa-busqueda');

    // Estados de filtrado en la vista de búsqueda
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<ParkingTag>('all');
    const [showMap, setShowMap] = useState(true);
    const [selectedVehiclePlate, setSelectedVehiclePlate] = useState<string>('');
    const [selectedParkingForBooking, setSelectedParkingForBooking] = useState<DriverParking | null>(null);

    // Feedback Toast Notifier
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Auth Store para perfil del conductor
    const { user, updateUserProfile } = useAuthStore();

    // Consultas remotas con TanStack Query
    const { data: parkings = [] } = useDriverParkingsQuery();
    const { data: vehicles = [] } = useDriverVehiclesQuery();
    const { data: activeBooking = null } = useDriverActiveBookingQuery();
    const { data: bookingsHistory = [] } = useDriverBookingsHistoryQuery();
    const { data: reviews = [] } = useDriverReviewsQuery();

    // Mutaciones remotas con TanStack Query
    const createBookingMutation = useCreateBookingMutation();
    const cancelBookingMutation = useCancelBookingMutation();
    const addVehicleMutation = useAddVehicleMutation();
    const setDefaultVehicleMutation = useSetDefaultVehicleMutation();
    const createReviewMutation = useCreateReviewMutation();
    const updateProfileMutation = useUpdateDriverProfileMutation();

    // Sincronizar placa seleccionada si está vacía
    const currentPlate = selectedVehiclePlate || vehicles.find((v) => v.isDefault)?.plate || vehicles[0]?.plate || '';

    // Filtrado reactivo de parqueos
    const filteredParkings = useMemo(() => {
        return parkings.filter((p) => {
            const matchesQuery =
                !searchQuery.trim() ||
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.zone.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                activeCategory === 'all' || p.tags.includes(activeCategory as 'ev' | 'cubierto' | 'seguridad');

            return matchesQuery && matchesCategory;
        });
    }, [parkings, searchQuery, activeCategory]);

    // Handlers
    const handleConfirmBooking = async (payload: CreateBookingPayload) => {
        try {
            await createBookingMutation.mutateAsync(payload);
            setSelectedParkingForBooking(null);
            showToast('¡Reserva creada exitosamente! Tu ticket activo está listo.');
            setActiveView('ticket-activo');
        } catch (error) {
            console.error('Error al crear reserva:', error);
            showToast('No se pudo procesar la reserva');
        }
    };

    const handleFinishBooking = async (bookingId: string) => {
        if (!confirm('¿Deseas finalizar tu estadía y registrar la salida del parqueo?')) {
            return;
        }
        try {
            await cancelBookingMutation.mutateAsync(bookingId);
            showToast('Estadía finalizada. Comprobante guardado en tu historial.');
            setActiveView('mis-reservas');
        } catch (error) {
            console.error('Error al finalizar estadía:', error);
            showToast('No se pudo finalizar la estadía');
        }
    };

    const handleAddVehicle = async (payload: CreateVehiclePayload) => {
        try {
            await addVehicleMutation.mutateAsync(payload);
            showToast(`Vehículo con placa ${payload.plate} registrado con éxito.`);
        } catch (error) {
            console.error('Error al registrar vehículo:', error);
            showToast('No se pudo registrar el vehículo');
        }
    };

    const handleSetDefaultVehicle = async (vehicleId: string) => {
        try {
            await setDefaultVehicleMutation.mutateAsync(vehicleId);
            showToast('Vehículo predeterminado actualizado.');
        } catch (error) {
            console.error('Error al actualizar vehículo:', error);
            showToast('No se pudo actualizar el vehículo predeterminado');
        }
    };

    const handleCreateReview = async (payload: CreateReviewPayload) => {
        try {
            await createReviewMutation.mutateAsync(payload);
            showToast('¡Gracias por tu calificación! Reseña publicada con éxito.');
        } catch (error) {
            console.error('Error al publicar reseña:', error);
            showToast('No se pudo publicar la reseña');
        }
    };

    const handleUpdateProfile = async (payload: UpdateDriverProfilePayload) => {
        if (!user?.id) {
            // Si por alguna razón de token no hay id, actualizar al menos el estado en store
            updateUserProfile(payload);
            showToast('Información de perfil actualizada.');
            return;
        }

        try {
            await updateProfileMutation.mutateAsync({
                userId: user.id,
                payload,
            });
            updateUserProfile(payload);
            showToast('¡Perfil actualizado exitosamente!');
        } catch (error) {
            console.error('Error al actualizar perfil en servidor:', error);
            // Si el backend da error pero queremos reflejarlo localmente
            updateUserProfile(payload);
            showToast('Datos de perfil guardados en tu sesión.');
        }
    };

    return (
        <DriverLayout
            activeView={activeView}
            onSelectView={setActiveView}
            hasActiveBooking={Boolean(activeBooking)}
        >
            {/* Feedback Toast Notifier */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 2000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '6px',
                        background: '#064E3B',
                        color: '#D1FAE5',
                        border: '1px solid #059669',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                    }}
                >
                    <i className="fa-solid fa-circle-check" style={{ color: '#34D399', fontSize: '1rem' }}></i>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* VISTA 1: BUSCAR PARQUEOS (AIRBNB DISCOVERY & MAPA) */}
            {activeView === 'mapa-busqueda' && (
                <div>
                    {/* Barra de Búsqueda Cápsula */}
                    <div className="driver-stagger-1">
                        <AirbnbSearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            vehicles={vehicles}
                            selectedVehiclePlate={currentPlate}
                            onSelectVehicle={setSelectedVehiclePlate}
                            durationLabel="Hoy • 2 Horas"
                            onOpenDurationModal={() => {
                                if (parkings[0]) setSelectedParkingForBooking(parkings[0]);
                            }}
                        />
                    </div>

                    {/* Barra de Categorías */}
                    <div className="driver-stagger-2">
                        <CategoriesBar
                            activeCategory={activeCategory}
                            onSelectCategory={setActiveCategory}
                            showMap={showMap}
                            onToggleMap={() => setShowMap(!showMap)}
                        />
                    </div>

                    {/* Mapa Interactivo */}
                    {showMap && (
                        <div className="driver-stagger-3">
                            <InteractiveGpsMap
                                parkings={filteredParkings}
                                onSelectParking={(parking) => setSelectedParkingForBooking(parking)}
                            />
                        </div>
                    )}

                    {/* Grilla de Parqueos */}
                    <div className="driver-stagger-4">
                        <ParkingCardGrid
                            parkings={filteredParkings}
                            onReserveParking={(parking) => setSelectedParkingForBooking(parking)}
                        />
                    </div>
                </div>
            )}

            {/* VISTA 2: TICKET & RESERVA ACTIVA */}
            {activeView === 'ticket-activo' && (
                <ActiveTicketCard
                    booking={activeBooking}
                    onFinishBooking={handleFinishBooking}
                    onGoToSearch={() => setActiveView('mapa-busqueda')}
                    isFinishing={cancelBookingMutation.isPending}
                />
            )}

            {/* VISTA 3: MIS VEHÍCULOS */}
            {activeView === 'mis-vehiculos' && (
                <VehiclesManager
                    vehicles={vehicles}
                    onAddVehicle={handleAddVehicle}
                    onSetDefaultVehicle={handleSetDefaultVehicle}
                    isSubmitting={addVehicleMutation.isPending}
                />
            )}

            {/* VISTA 4: HISTORIAL DE RESERVAS */}
            {activeView === 'mis-reservas' && (
                <BookingHistoryTable
                    bookings={bookingsHistory}
                    onViewTicket={(booking) => {
                        alert(
                            `Detalle del Ticket ${booking.bookingNumber}:\n\n` +
                            `Parqueo: ${booking.parkingName}\n` +
                            `Plaza: ${booking.spotNumber}\n` +
                            `Vehículo: ${booking.vehiclePlate}\n` +
                            `Fecha: ${booking.entryTime}\n` +
                            `Total Pagado: Bs ${booking.totalAmount}.00`
                        );
                    }}
                />
            )}

            {/* VISTA 5: CALIFICAR SERVICIO */}
            {activeView === 'calificar' && (
                <ServiceReviewPanel
                    reviews={reviews}
                    parkingNames={parkings.map((p) => p.name)}
                    onSubmitReview={handleCreateReview}
                    isSubmitting={createReviewMutation.isPending}
                />
            )}

            {/* VISTA 6: MI PERFIL */}
            {activeView === 'mi-perfil' && (
                <DriverProfilePanel
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    isUpdating={updateProfileMutation.isPending}
                />
            )}

            {/* Modal de Reserva */}
            <BookingModal
                isOpen={Boolean(selectedParkingForBooking)}
                parking={selectedParkingForBooking}
                vehicles={vehicles}
                onClose={() => setSelectedParkingForBooking(null)}
                onConfirmBooking={handleConfirmBooking}
                isSubmitting={createBookingMutation.isPending}
            />
        </DriverLayout>
    );
};

export default DriverDashboardPage;
