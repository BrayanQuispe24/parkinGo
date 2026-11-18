// src/modules/host/presentation/pages/HostReservasRecibidasPage.tsx
import React, { useState } from 'react';
import { useMiEstacionamientoQuery } from '../../../estacionamientos/application/useEstacionamientosQuery';
import { useReservasEstacionamientoQuery } from '../../../reservas/application/useReservasEstacionamientoQuery';
import { useConfirmarPagoMutation } from '../../../reservas/application/usePagosReservaMutations';
import { ReservasRecibidasTable } from '../../../reservas/presentation/components/ReservasRecibidasTable';
import { ModalConfirmarPagoEfectivo } from '../../../reservas/presentation/components/ModalConfirmarPagoEfectivo';
import { ModalEscanerAccesoGarita } from '../components/ModalEscanerAccesoGarita';
import type { BoletaReserva } from '../../../driver/domain/DriverBooking';
import { showToast } from '../../../../core/utils/toastr';

export const HostReservasRecibidasPage: React.FC = () => {
  const { data: miEstacionamiento, isLoading: loadingParking } = useMiEstacionamientoQuery();
  const {
    data: reservas = [],
    isLoading: loadingReservas,
    refetch,
  } = useReservasEstacionamientoQuery(miEstacionamiento?.id);

  const confirmarPagoMutation = useConfirmarPagoMutation();
  const [selectedToPay, setSelectedToPay] = useState<BoletaReserva | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  const handleConfirmarCobroEfectivo = async (payload: {
    reservaId: string;
    montoEntregado?: number;
    notas?: string;
  }) => {
    try {
      await confirmarPagoMutation.mutateAsync({
        reservaId: payload.reservaId,
        metodoPago: 'EFECTIVO',
        montoEntregado: payload.montoEntregado,
        notas: payload.notas,
      });

      showToast.success(
        `Cobro en efectivo registrado exitosamente. La reserva ha sido confirmada.`,
        'Cobro Asentado',
      );
      setSelectedToPay(null);
      refetch();
    } catch (err: unknown) {
      console.error('Error al registrar cobro en efectivo:', err);
      showToast.error(
        'No se pudo registrar el cobro en efectivo. Verifica tu conexión o permisos.',
        'Error de Cobro',
      );
    }
  };

  const isLoading = loadingParking || loadingReservas;

  return (
    <div style={{ width: '100%', padding: '0.25rem 0' }}>
      {/* Cabecera del Módulo */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
          paddingBottom: '0.85rem',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
            Gestión de Reservas Recibidas
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            Control de conductores, plazas asignadas y cobro exclusivo en garita (Efectivo & QR Digital) para{' '}
            <strong style={{ color: '#006D36' }}>
              {miEstacionamiento?.nombre || 'Mi Cochera'}
            </strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsScannerOpen(true)}
            style={{
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 2px 6px rgba(0, 109, 54, 0.25)',
            }}
          >
            <i className="fa-solid fa-camera"></i>
            <span>Validar QR de Entrada</span>
          </button>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '0.5rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <i className={`fa-solid fa-rotate-right ${isLoading ? 'fa-spin' : ''}`}></i>
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Tabla de Reservas Recibidas */}
      <ReservasRecibidasTable
        reservas={reservas}
        loading={isLoading}
        onCobrarEfectivo={(reserva) => setSelectedToPay(reserva)}
      />

      {/* Modal de Cobro en Efectivo */}
      <ModalConfirmarPagoEfectivo
        isOpen={Boolean(selectedToPay)}
        onClose={() => setSelectedToPay(null)}
        reserva={selectedToPay}
        onConfirm={handleConfirmarCobroEfectivo}
        isLoading={confirmarPagoMutation.isPending}
      />

      {/* Modal de Escaneo y Validación QR en Garita */}
      <ModalEscanerAccesoGarita
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        estacionamientoId={miEstacionamiento?.id}
        onAccesoConfirmado={() => {
          refetch();
        }}
      />
    </div>
  );
};

