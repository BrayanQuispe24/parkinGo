import React, { useState } from 'react';
import axios from 'axios';
import { useMiEstacionamientoQuery } from '../../application/useEstacionamientosQuery';
import { useRegistrarEstacionamientoMutation } from '../../application/useEstacionamientosMutations';
import type { EstacionamientoModel, RegistrarEstacionamientoPayload } from '../../domain/Estacionamiento';
import { TenantEstadoCard } from '../components/TenantEstadoCard';
import { FormularioEstacionamiento } from '../components/FormularioEstacionamiento';
import { EstacionamientosEnterpriseTable } from '../components/EstacionamientosEnterpriseTable';
import { TenantHorariosPanel } from '../components/TenantHorariosPanel';
import { showToast } from '../../../../core/utils/toastr';
import '../styles/estacionamientos.css';

export const TenantEstacionamientoPage: React.FC = () => {
  const { data: miEstacionamiento, isLoading, error } = useMiEstacionamientoQuery();
  const registrarMutation = useRegistrarEstacionamientoMutation();

  // Lista normalizada (1 o más para soportar multi-estacionamiento a futuro)
  const estacionamientos: EstacionamientoModel[] = miEstacionamiento ? [miEstacionamiento] : [];

  // Pestañas: 'list' (Listado) | 'form' (Registrar) | 'horarios' (Gestionar Horarios)
  const [mainTab, setMainTab] = useState<'list' | 'form' | 'horarios'>('list');
  const [selectedForDetail, setSelectedForDetail] = useState<EstacionamientoModel | null>(null);

  const handleRegisterSubmit = async (payload: RegistrarEstacionamientoPayload) => {
    try {
      await registrarMutation.mutateAsync(payload);
      showToast.success('¡Solicitud registrada exitosamente! Tu parqueo está en estado PENDIENTE.', 'Estacionamiento');
      setMainTab('list');
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message
          : 'Error al registrar el estacionamiento.';
      showToast.error(msg, 'Error al Registrar');
      console.error('Error al registrar estacionamiento:', err);
    }
  };

  return (
    <div className="tenant-page-container">
      {/* 1. Vista Completa Dedicada de Ficha Técnica */}
      {selectedForDetail ? (
        <TenantEstadoCard
          estacionamiento={selectedForDetail}
          onBack={() => setSelectedForDetail(null)}
        />
      ) : (
        <>
          {/* 2. Pestañas de Navegación del Módulo Principal */}
          <div className="tenant-tabs-nav">
            <button
              type="button"
              onClick={() => setMainTab('list')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: mainTab === 'list' ? '2.5px solid var(--accent-emerald, #006D36)' : '2.5px solid transparent',
                color: mainTab === 'list' ? 'var(--accent-emerald, #006D36)' : 'var(--text-muted, #66736B)',
                fontWeight: mainTab === 'list' ? 800 : 600,
                padding: '0.65rem 0.25rem',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <i className="fa-solid fa-square-parking"></i>
              <span>Listado de Estacionamientos ({estacionamientos.length})</span>
            </button>

            {/* Pestaña de Registro */}
            <button
              type="button"
              onClick={() => setMainTab('form')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: mainTab === 'form' ? '2.5px solid var(--accent-emerald, #006D36)' : '2.5px solid transparent',
                color: mainTab === 'form' ? 'var(--accent-emerald, #006D36)' : 'var(--text-muted, #66736B)',
                fontWeight: mainTab === 'form' ? 800 : 600,
                padding: '0.65rem 0.25rem',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <i className="fa-solid fa-plus-circle"></i>
              <span>Registrar Nuevo Estacionamiento</span>
            </button>

            {/* Pestaña de Horarios de Atención */}
            <button
              type="button"
              onClick={() => setMainTab('horarios')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: mainTab === 'horarios' ? '2.5px solid var(--accent-emerald, #006D36)' : '2.5px solid transparent',
                color: mainTab === 'horarios' ? 'var(--accent-emerald, #006D36)' : 'var(--text-muted, #66736B)',
                fontWeight: mainTab === 'horarios' ? 800 : 600,
                padding: '0.65rem 0.25rem',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <i className="fa-solid fa-clock"></i>
              <span>Horarios de Atención</span>
            </button>
          </div>

          {/* Estados de Carga y Vistas Normales */}
          {isLoading ? (
            <div
              className="tenant-form-panel"
              style={{ textAlign: 'center', padding: '3.5rem 2rem' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#006D36' }}>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
                Cargando estacionamientos...
              </p>
            </div>
          ) : error ? (
            <div
              style={{
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                padding: '1rem',
                fontSize: '0.85rem',
                maxWidth: '780px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.2rem' }}></i>
              <div>
                {axios.isAxiosError(error)
                  ? (error.response?.data as { message?: string })?.message || error.message
                  : 'Error al conectar con el servidor.'}
              </div>
            </div>
          ) : mainTab === 'form' ? (
            /* Vista Formulario de Registro */
            <FormularioEstacionamiento
              onSubmit={handleRegisterSubmit}
              isLoading={registrarMutation.isPending}
              onCancel={() => setMainTab('list')}
            />
          ) : mainTab === 'horarios' ? (
            /* Vista Gestión de Horarios */
            <TenantHorariosPanel />
          ) : (
            /* Vista Listado de Estacionamientos */
            <EstacionamientosEnterpriseTable
              estacionamientos={estacionamientos}
              loading={isLoading}
              onViewEstacionamiento={(item) => setSelectedForDetail(item)}
              onGoToRegister={() => setMainTab('form')}
            />
          )}
        </>
      )}
    </div>
  );
};
