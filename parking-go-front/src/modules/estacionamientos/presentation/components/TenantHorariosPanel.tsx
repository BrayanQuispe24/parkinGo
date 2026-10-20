import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { HorarioItemPayload } from '../../domain/Estacionamiento';
import { HorariosSemanaPicker } from './HorariosSemanaPicker';
import { useTenantsQuery, useTenantHorariosQuery } from '../../../tenants/application/useTenantsQuery';
import { useActualizarTenantHorariosMutation } from '../../../tenants/application/useTenantsMutations';
import { showToast } from '../../../../core/utils/toastr';

interface TenantHorariosPanelProps {
  onSuccess?: (msg: string) => void;
}

const DEFAULT_HORARIOS: HorarioItemPayload[] = [
  { dia: 'LUNES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'MARTES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'MIERCOLES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'JUEVES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'VIERNES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'SABADO', horaInicio: '08:00', horaCierre: '14:00' },
];

export const TenantHorariosPanel: React.FC<TenantHorariosPanelProps> = ({
  onSuccess,
}) => {
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenantsQuery();
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  // Auto-seleccionar primer tenant si existe
  useEffect(() => {
    if (tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [tenants, selectedTenantId]);

  const {
    data: tenantHorarios = [],
    isLoading: isLoadingHorarios,
  } = useTenantHorariosQuery(selectedTenantId);

  const actualizarMutation = useActualizarTenantHorariosMutation();
  const [horarios, setHorarios] = useState<HorarioItemPayload[]>(DEFAULT_HORARIOS);
  const [formError, setFormError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  // Sincronizar horarios cuando carguen los del tenant
  useEffect(() => {
    if (tenantHorarios && tenantHorarios.length > 0) {
      setHorarios(tenantHorarios);
    } else {
      setHorarios(DEFAULT_HORARIOS);
    }
  }, [tenantHorarios]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setLocalSuccess(null);

    if (!selectedTenantId) {
      setFormError('Por favor selecciona una empresa (Tenant) para guardar sus horarios.');
      return;
    }

    if (horarios.length === 0) {
      setFormError('Debes configurar el horario de atención para al menos un día (*).');
      return;
    }

    try {
      await actualizarMutation.mutateAsync({
        tenantId: selectedTenantId,
        horarios,
      });
      const selectedTenant = tenants.find((t) => t.id === selectedTenantId);
      const msg = `¡Horarios de atención guardados exitosamente para ${selectedTenant?.nombre || 'la empresa'}!`;
      setLocalSuccess(msg);
      showToast.success(msg, 'Horarios Actualizados');
      if (onSuccess) {
        onSuccess(msg);
      }
      setTimeout(() => setLocalSuccess(null), 4000);
    } catch (err: unknown) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message
          : 'Ocurrió un error al actualizar los horarios de la empresa.';
      setFormError(errorMsg);
      showToast.error(errorMsg, 'Error');
    }
  };

  if (isLoadingTenants) {
    return (
      <div
        className="estacionamiento-card"
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 2rem',
        }}
      >
        <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#006D36' }}></i>
        <p style={{ marginTop: '1rem', color: '#64748B', fontSize: '0.88rem' }}>
          Cargando empresas asociadas a tu cuenta...
        </p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div
        className="estacionamiento-card"
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '3rem 2rem',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#F0FDF4',
            color: '#006D36',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 1.25rem auto',
            border: '1px solid #BBF7D0',
          }}
        >
          <i className="fa-solid fa-building"></i>
        </div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
          No tienes ninguna empresa (Tenant) registrada
        </h3>
        <p
          style={{
            margin: '0 auto 1.75rem auto',
            maxWidth: '460px',
            color: '#64748B',
            fontSize: '0.86rem',
            lineHeight: 1.5,
          }}
        >
          Para configurar y gestionar horarios de atención, primero debes registrar una empresa en el módulo de Empresas / Tenants.
        </p>
      </div>
    );
  }

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSave} className="tenant-form-panel">
        {/* Header */}
        <div className="tenant-form-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: '#DCFCE7',
                color: '#006D36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              <i className="fa-solid fa-clock"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                Configuración de Horarios por Empresa
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                Define los horarios oficiales de tu empresa. Los estacionamientos creados bajo esta empresa adoptarán estos horarios de atención.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Selector de Empresa */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                marginBottom: '0.4rem',
              }}
            >
              <i className="fa-solid fa-building" style={{ color: '#006D36' }}></i>
              <span>Empresa / Tenant a Configurar</span>
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedTenantId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTenantId(e.target.value)}
                disabled={actualizarMutation.isPending}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.6rem 2.2rem 0.6rem 0.85rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  color: '#0F172A',
                  background: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  appearance: 'none',
                }}
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} {t.nit ? `· NIT: ${t.nit}` : ''} {t.razonSocial ? `(${t.razonSocial})` : ''}
                  </option>
                ))}
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#64748B',
                }}
              >
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
            {selectedTenant && (
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.3rem', display: 'block' }}>
                Estableciendo los horarios de atención para: <strong>{selectedTenant.nombre}</strong>.
              </span>
            )}
          </div>

          {formError && (
            <div
              style={{
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-triangle-exclamation"></i>
              <span>{formError}</span>
            </div>
          )}

          {localSuccess && (
            <div
              style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fa-solid fa-circle-check" style={{ color: '#059669' }}></i>
              <span>{localSuccess}</span>
            </div>
          )}

          {/* Horarios Picker */}
          <div style={{ marginBottom: '1.5rem' }}>
            {isLoadingHorarios ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36', marginRight: '0.5rem' }}></i>
                Cargando horarios de la empresa...
              </div>
            ) : (
              <HorariosSemanaPicker
                horarios={horarios}
                onChange={(updated) => setHorarios(updated)}
                disabled={actualizarMutation.isPending}
              />
            )}
          </div>

          {/* Botón Guardar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <button
              type="submit"
              disabled={actualizarMutation.isPending || isLoadingHorarios}
              style={{
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.65rem 1.4rem',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: actualizarMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: actualizarMutation.isPending ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 109, 54, 0.15)',
              }}
            >
              {actualizarMutation.isPending ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Guardando Horarios...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Guardar Horarios de la Empresa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
