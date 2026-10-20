import React, { useState } from 'react';
import axios from 'axios';
import { useMisTarifasQuery } from '../../application/useTarifasQuery';
import {
  useActualizarTarifaMutation,
  useCrearTarifaMutation,
  useEliminarTarifaMutation,
} from '../../application/useTarifasMutations';
import type {
  CreateTarifaPayload,
  EstadoTarifa,
  ModalidadTarifa,
  TarifaModel,
} from '../../domain/Tarifa';
import { showToast } from '../../../../core/utils/toastr';

interface FormState {
  descripcion: string;
  monto: string;
  modalidad: ModalidadTarifa;
  estado: EstadoTarifa;
}

const INITIAL_FORM: FormState = {
  descripcion: '',
  monto: '',
  modalidad: 'HORA',
  estado: 'ACTIVO',
};

export interface TenantTarifasPanelProps {
  embedded?: boolean;
  readOnly?: boolean;
  tarifasData?: TarifaModel[];
}

export const TenantTarifasPanel: React.FC<TenantTarifasPanelProps> = ({
  embedded = false,
  readOnly = false,
  tarifasData,
}) => {
  const { data: remoteTarifas = [], isLoading, error } = useMisTarifasQuery();
  const tarifas = tarifasData ?? remoteTarifas;

  const crearMutation = useCrearTarifaMutation();
  const actualizarMutation = useActualizarTarifaMutation();
  const eliminarMutation = useEliminarTarifaMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTarifa, setEditingTarifa] = useState<TarifaModel | null>(null);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingTarifa(null);
    setFormState(INITIAL_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (tarifa: TarifaModel) => {
    setEditingTarifa(tarifa);
    setFormState({
      descripcion: tarifa.descripcion,
      monto: tarifa.monto.toString(),
      modalidad: tarifa.modalidad,
      estado: tarifa.estado,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTarifa(null);
    setFormState(INITIAL_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const descTrim = formState.descripcion.trim();
    if (!descTrim || descTrim.length < 3) {
      setFormError('La descripción de la tarifa debe contener al menos 3 caracteres.');
      return;
    }

    const montoNum = parseFloat(formState.monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setFormError('El monto debe ser un número válido mayor a 0.');
      return;
    }

    try {
      if (editingTarifa) {
        await actualizarMutation.mutateAsync({
          id: editingTarifa.id,
          payload: {
            descripcion: descTrim,
            monto: montoNum,
            modalidad: formState.modalidad,
            estado: formState.estado,
          },
        });
        showToast.success('Tarifa actualizada correctamente.', 'Tarifas');
      } else {
        const payload: CreateTarifaPayload = {
          descripcion: descTrim,
          monto: montoNum,
          modalidad: formState.modalidad,
          estado: formState.estado,
        };
        await crearMutation.mutateAsync(payload);
        showToast.success('Nueva tarifa registrada con éxito.', 'Tarifas');
      }
      closeModal();
    } catch (err: unknown) {
      let msg = 'Ocurrió un error al procesar la tarifa.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const responseMsg = err.response.data.message;
        msg = Array.isArray(responseMsg) ? responseMsg.join(', ') : responseMsg;
      }
      setFormError(msg);
      showToast.error(msg, 'Error en Tarifa');
    }
  };

  const handleToggleEstado = async (tarifa: TarifaModel) => {
    if (readOnly) return;
    const nuevoEstado: EstadoTarifa = tarifa.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    try {
      await actualizarMutation.mutateAsync({
        id: tarifa.id,
        payload: { estado: nuevoEstado },
      });
      showToast.info(
        `Tarifa marcada como ${nuevoEstado === 'ACTIVO' ? 'ACTIVA' : 'INACTIVA'}.`,
        'Estado de Tarifa',
      );
    } catch (err: unknown) {
      let msg = 'No se pudo cambiar el estado de la tarifa.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      showToast.error(msg, 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if (readOnly) return;
    if (!window.confirm('¿Confirmas que deseas eliminar permanentemente esta tarifa?')) {
      return;
    }
    setDeletingId(id);
    try {
      await eliminarMutation.mutateAsync(id);
      showToast.success('Tarifa eliminada del catálogo.', 'Tarifas');
    } catch (err: unknown) {
      let msg = 'Error al eliminar la tarifa.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message;
      }
      showToast.error(msg, 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const isSaving = crearMutation.isPending || actualizarMutation.isPending;

  const getModalidadBadge = (modalidad: ModalidadTarifa) => {
    switch (modalidad) {
      case 'HORA':
        return {
          bg: '#EFF6FF',
          color: '#1D4ED8',
          border: '#BFDBFE',
          icon: 'fa-regular fa-clock',
          label: 'Por Hora',
        };
      case 'DIA':
        return {
          bg: '#FFFBEB',
          color: '#B45309',
          border: '#FDE68A',
          icon: 'fa-regular fa-sun',
          label: 'Por Día',
        };
      case 'MES':
        return {
          bg: '#FAF5FF',
          color: '#7E22CE',
          border: '#E9D5FF',
          icon: 'fa-regular fa-calendar-days',
          label: 'Mensual',
        };
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        boxShadow: embedded ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Header Enterprise */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: '#DCFCE7',
              color: '#006D36',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
            }}
          >
            <i className="fa-solid fa-tags"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0F172A',
                }}
              >
                Esquema de Tarifas
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '3px',
                  background: '#E2E8F0',
                  color: '#475569',
                }}
              >
                {tarifas.length} {tarifas.length === 1 ? 'tarifa' : 'tarifas'}
              </span>
            </div>
            <p style={{ margin: '0.1rem 0 0 0', fontSize: '0.72rem', color: '#64748B' }}>
              Modalidades de cobro configuradas para vehículos y usuarios
            </p>
          </div>
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={openCreateModal}
            style={{
              padding: '0.45rem 0.85rem',
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '3px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005228')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#006D36')}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: '0.7rem' }}></i>
            <span>Nueva Tarifa</span>
          </button>
        )}
      </div>

      {/* Contenido / Tabla de Tarifas */}
      <div style={{ padding: '0.85rem 1.25rem' }}>
        {isLoading && !tarifasData ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '0.5rem', color: '#006D36' }}></i>
            Cargando tarifas registradas...
          </div>
        ) : error && !tarifasData ? (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '3px',
              color: '#991B1B',
              fontSize: '0.78rem',
            }}
          >
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.4rem' }}></i>
            No se pudieron sincronizar las tarifas del estacionamiento.
          </div>
        ) : tarifas.length === 0 ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              border: '1px dashed #CBD5E1',
              borderRadius: '4px',
              background: '#F8FAFC',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                margin: '0 auto 0.75rem auto',
                borderRadius: '50%',
                background: '#E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                fontSize: '1.1rem',
              }}
            >
              <i className="fa-solid fa-receipt"></i>
            </div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
              No hay tarifas configuradas
            </h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: '#64748B', maxWidth: '380px', marginInline: 'auto' }}>
              Registra esquemas de cobro por hora, día o abono mensual para que los conductores conozcan el costo del servicio.
            </p>
            {!readOnly && (
              <button
                type="button"
                onClick={openCreateModal}
                style={{
                  padding: '0.45rem 0.95rem',
                  background: '#006D36',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '3px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Agregar Primera Tarifa</span>
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th
                    style={{
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Modalidad
                  </th>
                  <th
                    style={{
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Monto (Bs.)
                  </th>
                  <th
                    style={{
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Descripción
                  </th>
                  <th
                    style={{
                      padding: '0.6rem 0.85rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'center',
                    }}
                  >
                    Estado
                  </th>
                  {!readOnly && (
                    <th
                      style={{
                        padding: '0.6rem 0.85rem',
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        color: '#475569',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'right',
                      }}
                    >
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.78rem' }}>
                {tarifas.map((t) => {
                  const modBadge = getModalidadBadge(t.modalidad);
                  const isActivo = t.estado === 'ACTIVO';
                  const isDeleting = deletingId === t.id;

                  return (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.1s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Modalidad */}
                      <td style={{ padding: '0.65rem 0.85rem', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '3px',
                            background: modBadge.bg,
                            color: modBadge.color,
                            border: `1px solid ${modBadge.border}`,
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '0.02em',
                          }}
                        >
                          <i className={modBadge.icon} style={{ fontSize: '0.68rem' }}></i>
                          <span>{modBadge.label}</span>
                        </span>
                      </td>

                      {/* Monto */}
                      <td style={{ padding: '0.65rem 0.85rem', whiteSpace: 'nowrap' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#006D36',
                          }}
                        >
                          Bs. {t.monto.toFixed(2)}
                        </span>
                      </td>

                      {/* Descripción */}
                      <td style={{ padding: '0.65rem 0.85rem', color: '#1E293B', fontWeight: 600 }}>
                        {t.descripcion}
                      </td>

                      {/* Estado */}
                      <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {!readOnly ? (
                          <button
                            type="button"
                            onClick={() => handleToggleEstado(t)}
                            title={`Clic para cambiar a ${isActivo ? 'INACTIVO' : 'ACTIVO'}`}
                            style={{
                              border: isActivo ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                              background: isActivo ? '#F0FDF4' : '#F1F5F9',
                              color: isActivo ? '#166534' : '#64748B',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '3px',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: isActivo ? '#22C55E' : '#94A3B8',
                              }}
                            ></span>
                            <span>{t.estado}</span>
                          </button>
                        ) : (
                          <span
                            style={{
                              border: isActivo ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                              background: isActivo ? '#F0FDF4' : '#F1F5F9',
                              color: isActivo ? '#166534' : '#64748B',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '3px',
                              fontSize: '0.6875rem',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: isActivo ? '#22C55E' : '#94A3B8',
                              }}
                            ></span>
                            <span>{t.estado}</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      {!readOnly && (
                        <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => openEditModal(t)}
                              title="Editar tarifa"
                              style={{
                                padding: '0.3rem 0.5rem',
                                background: '#F8FAFC',
                                border: '1px solid #CBD5E1',
                                borderRadius: '3px',
                                color: '#334155',
                                cursor: 'pointer',
                                fontSize: '0.72rem',
                              }}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(t.id)}
                              disabled={isDeleting}
                              title="Eliminar tarifa"
                              style={{
                                padding: '0.3rem 0.5rem',
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                borderRadius: '3px',
                                color: '#DC2626',
                                cursor: isDeleting ? 'not-allowed' : 'pointer',
                                fontSize: '0.72rem',
                              }}
                            >
                              {isDeleting ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fa-regular fa-trash-can"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Enterprise de Creación / Edición */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              width: '100%',
              maxWidth: '460px',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div
              style={{
                padding: '1rem 1.25rem',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fa-solid fa-tag" style={{ color: '#006D36' }}></i>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#0F172A',
                  }}
                >
                  {editingTarifa ? 'Editar Tarifa' : 'Registrar Nueva Tarifa'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
              {formError && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '3px',
                    color: '#991B1B',
                    fontSize: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '0.35rem' }}></i>
                  {formError}
                </div>
              )}

              {/* Modalidad (Radio/Selector visual) */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.4rem',
                  }}
                >
                  Modalidad de Cobro <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  {(['HORA', 'DIA', 'MES'] as ModalidadTarifa[]).map((mod) => {
                    const isSelected = formState.modalidad === mod;
                    const badge = getModalidadBadge(mod);

                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => setFormState((prev) => ({ ...prev, modalidad: mod }))}
                        style={{
                          padding: '0.55rem 0.5rem',
                          background: isSelected ? badge.bg : '#F8FAFC',
                          border: isSelected ? `2px solid ${badge.color}` : '1px solid #CBD5E1',
                          borderRadius: '3px',
                          color: isSelected ? badge.color : '#475569',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <i className={badge.icon}></i>
                        <span>{badge.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Monto */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.4rem',
                  }}
                >
                  Monto (Bs.) <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#64748B',
                    }}
                  >
                    Bs.
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formState.monto}
                    onChange={(e) => setFormState((prev) => ({ ...prev, monto: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem 0.55rem 2.4rem',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.4rem',
                  }}
                >
                  Descripción de la Tarifa <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. Tarifa estándar por hora para vehículos livianos"
                  value={formState.descripcion}
                  onChange={(e) => setFormState((prev) => ({ ...prev, descripcion: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Estado */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.4rem',
                  }}
                >
                  Estado Inicial
                </label>
                <select
                  value={formState.estado}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, estado: e.target.value as EstadoTarifa }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="ACTIVO">ACTIVO (Vigente para cobro)</option>
                  <option value="INACTIVO">INACTIVO (Pausado temporalmente)</option>
                </select>
              </div>

              {/* Botones de acción */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  style={{
                    padding: '0.5rem 0.95rem',
                    background: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '0.5rem 1.15rem',
                    background: '#006D36',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  {isSaving ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>{editingTarifa ? 'Guardar Cambios' : 'Registrar Tarifa'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
