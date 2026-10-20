import React, { useState } from 'react';
import type { EstadoEstacionamiento, EstacionamientoModel } from '../../domain/Estacionamiento';
import { useAdminEstacionamientosQuery } from '../../application/useEstacionamientosQuery';
import {
  useAprobarEstacionamientoMutation,
  useRechazarEstacionamientoMutation,
  useInhabilitarEstacionamientoMutation,
} from '../../application/useEstacionamientosMutations';
import { AdminSolicitudesTable } from '../components/AdminSolicitudesTable';
import { AdminSolicitudFichaDetalle } from '../components/AdminSolicitudFichaDetalle';
import { ModalRechazoEstacionamiento } from '../components/ModalRechazoEstacionamiento';
import { showToast } from '../../../../core/utils/toastr';
import '../styles/estacionamientos.css';

export const AdminSolicitudesEstacionamientosPage: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState<EstadoEstacionamiento | undefined>('PENDIENTE');
  const { data: solicitudes = [], isLoading } = useAdminEstacionamientosQuery(filtroEstado);

  const aprobarMutation = useAprobarEstacionamientoMutation();
  const rechazarMutation = useRechazarEstacionamientoMutation();
  const inhabilitarMutation = useInhabilitarEstacionamientoMutation();

  const [selectedParqueo, setSelectedParqueo] = useState<EstacionamientoModel | null>(null);
  const [selectedToReject, setSelectedToReject] = useState<string | null>(null);

  const handleAprobar = async (id: string) => {
    try {
      await aprobarMutation.mutateAsync(id);
      showToast.success('Estacionamiento aprobado exitosamente.', 'Aprobación Exitosa');
      setSelectedParqueo(null);
    } catch (err) {
      console.error(err);
      showToast.error('Error al aprobar el estacionamiento.', 'Error');
    }
  };

  const handleRechazarConfirm = async (motivo: string) => {
    if (!selectedToReject) return;
    try {
      await rechazarMutation.mutateAsync({ id: selectedToReject, motivoRechazo: motivo });
      setSelectedToReject(null);
      setSelectedParqueo(null);
      showToast.success('Solicitud rechazada con motivo registrado.', 'Solicitud Rechazada');
    } catch (err) {
      console.error(err);
      showToast.error('Error al rechazar el estacionamiento.', 'Error');
    }
  };

  const handleInhabilitar = async (id: string) => {
    if (!window.confirm('¿Estás seguro de inhabilitar este estacionamiento?')) return;
    try {
      await inhabilitarMutation.mutateAsync(id);
      showToast.warning('Estacionamiento inhabilitado exitosamente.', 'Estacionamiento Inhabilitado');
      setSelectedParqueo(null);
    } catch (err) {
      console.error(err);
      showToast.error('Error al inhabilitar el estacionamiento.', 'Error');
    }
  };

  const isProcessing =
    aprobarMutation.isPending || rechazarMutation.isPending || inhabilitarMutation.isPending;

  return (
    <div className="estacionamientos-container" style={{ maxWidth: '100%', margin: 0, padding: 0 }}>
      {selectedParqueo ? (
        /* Vista de Ficha Técnica Completa con Botón Volver al Listado */
        <AdminSolicitudFichaDetalle
          parqueo={selectedParqueo}
          onBackToList={() => setSelectedParqueo(null)}
          onAprobar={handleAprobar}
          onRechazar={(id) => setSelectedToReject(id)}
          onInhabilitar={handleInhabilitar}
          isProcessing={isProcessing}
        />
      ) : (
        /* Vista Principal: Tabla Enterprise Compacta con Filtros y Buscador */
        <AdminSolicitudesTable
          solicitudes={solicitudes}
          loading={isLoading}
          onViewSolicitud={(parqueo) => setSelectedParqueo(parqueo)}
          statusFilter={filtroEstado ?? 'ALL'}
          onChangeStatusFilter={(st) => setFiltroEstado(st === 'ALL' ? undefined : st)}
        />
      )}

      {/* Modal para ingresar motivo de rechazo */}
      <ModalRechazoEstacionamiento
        isOpen={Boolean(selectedToReject)}
        onClose={() => setSelectedToReject(null)}
        onConfirm={handleRechazarConfirm}
        isLoading={rechazarMutation.isPending}
      />
    </div>
  );
};
