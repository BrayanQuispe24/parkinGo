import React, { useState } from 'react';
import axios from 'axios';
import { useMisServiciosExtrasQuery } from '../../application/useServiciosExtrasQuery';
import {
  useActualizarServicioExtraMutation,
  useCrearServicioExtraMutation,
  useEliminarServicioExtraMutation,
} from '../../application/useServiciosExtrasMutations';
import type {
  CreateServicioExtraPayload,
  ServicioExtraModel,
} from '../../domain/ServicioExtra';
import { showToast } from '../../../../core/utils/toastr';

interface FormState {
  nombre: string;
  descripcion: string;
  precio: string;
}

const INITIAL_FORM: FormState = {
  nombre: '',
  descripcion: '',
  precio: '',
};

export interface TenantServiciosExtrasPanelProps {
  embedded?: boolean;
}

export const TenantServiciosExtrasPanel: React.FC<TenantServiciosExtrasPanelProps> = ({
  embedded = false,
}) => {
  const { data: servicios = [], isLoading, error } = useMisServiciosExtrasQuery();

  const crearMutation = useCrearServicioExtraMutation();
  const actualizarMutation = useActualizarServicioExtraMutation();
  const eliminarMutation = useEliminarServicioExtraMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingServicio, setEditingServicio] = useState<ServicioExtraModel | null>(null);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingServicio(null);
    setFormState(INITIAL_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (serv: ServicioExtraModel) => {
    setEditingServicio(serv);
    setFormState({
      nombre: serv.nombre,
      descripcion: serv.descripcion ?? '',
      precio: serv.precio.toString(),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingServicio(null);
    setFormState(INITIAL_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const nombreTrim = formState.nombre.trim();
    if (!nombreTrim || nombreTrim.length < 3) {
      setFormError('El nombre del servicio debe contener al menos 3 caracteres.');
      return;
    }

    const precioNum = parseFloat(formState.precio);
    if (isNaN(precioNum) || precioNum < 0) {
      setFormError('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    try {
      if (editingServicio) {
        await actualizarMutation.mutateAsync({
          id: editingServicio.id,
          payload: {
            nombre: nombreTrim,
            descripcion: formState.descripcion.trim() || undefined,
            precio: precioNum,
          },
        });
        showToast.success('Servicio extra actualizado correctamente.', 'Servicios Extras');
      } else {
        const payload: CreateServicioExtraPayload = {
          nombre: nombreTrim,
          descripcion: formState.descripcion.trim() || undefined,
          precio: precioNum,
        };
        await crearMutation.mutateAsync(payload);
        showToast.success('¡Nuevo servicio extra registrado exitosamente!', 'Servicios Extras');
      }
      closeModal();
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? Array.isArray(err.response.data.message)
            ? err.response.data.message.join(', ')
            : err.response.data.message
          : 'Ocurrió un error al procesar el servicio extra.';
      setFormError(msg);
      showToast.error(msg, 'Error');
    }
  };

  const handleToggleActivo = async (serv: ServicioExtraModel) => {
    try {
      await actualizarMutation.mutateAsync({
        id: serv.id,
        payload: {
          activo: !serv.activo,
        },
      });
      showToast.info(
        `Servicio "${serv.nombre}" ${!serv.activo ? 'activado' : 'desactivado'}.`,
        'Disponibilidad',
      );
    } catch {
      showToast.error('No se pudo cambiar el estado del servicio.', 'Error');
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el servicio "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await eliminarMutation.mutateAsync(id);
      showToast.success(`Servicio "${nombre}" eliminado.`, 'Servicios Extras');
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Error al eliminar el servicio.';
      showToast.error(msg, 'Error');
    } finally {
      setDeletingId(null);
    }
  };

  const isSubmitting = crearMutation.isPending || actualizarMutation.isPending;

  return (
    <div
      className="servicios-extras-enterprise-panel"
      style={{
        width: '100%',
        marginTop: embedded ? 0 : '1rem',
      }}
    >
      {/* Container Enterprise con borde sutil 1px y esquinas estructuradas (rounded-sm) */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar Superior Enterprise */}
        <div
          style={{
            padding: '0.85rem 1.15rem',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '3px',
                background: '#ECFDF5',
                color: '#006D36',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
              }}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#0F172A',
                  }}
                >
                  Servicios Extras y Tarifas Complementarias
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.1rem 0.4rem',
                    background: '#E2E8F0',
                    color: '#334155',
                    borderRadius: '2px',
                    letterSpacing: '0.04em',
                  }}
                >
                  {servicios.length} {servicios.length === 1 ? 'REGISTRO' : 'REGISTROS'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
                Configuración de catálogo y cobros adicionales opcionales para conductores
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '3px',
              padding: '0.42rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 109, 54, 0.2)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#063D25')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#006D36')}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: '0.7rem' }}></i>
            <span>Registrar Servicio</span>
          </button>
        </div>

        {/* Estado de Carga */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748B' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '1.4rem', color: '#006D36' }}></i>
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>Cargando catálogo de servicios extras...</p>
          </div>
        )}

        {/* Error de Carga */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              borderBottom: '1px solid #FECACA',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span>No se pudieron cargar los servicios extras. Por favor intenta nuevamente.</span>
          </div>
        )}

        {/* Estado Vacío Enterprise */}
        {!isLoading && !error && servicios.length === 0 && (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#FAFAFA',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '4px',
                backgroundColor: '#ECFDF5',
                color: '#006D36',
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.15rem',
                marginBottom: '0.75rem',
              }}
            >
              <i className="fa-solid fa-tag"></i>
            </div>
            <h5
              style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: '0 0 0.25rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Sin servicios extras registrados
            </h5>
            <p
              style={{
                fontSize: '0.78rem',
                color: '#64748B',
                maxWidth: '400px',
                margin: '0 auto 1rem auto',
                lineHeight: 1.4,
              }}
            >
              Añade servicios complementarios como lavado de vehículo, inflado o carga de batería para ofrecer valor agregado a los conductores.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                background: '#FFFFFF',
                color: '#006D36',
                border: '1px solid #006D36',
                borderRadius: '3px',
                padding: '0.38rem 0.85rem',
                fontWeight: 700,
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-plus" style={{ marginRight: '0.35rem' }}></i>
              Añadir Primer Servicio
            </button>
          </div>
        )}

        {/* Tabla Enterprise de Alta Densidad */}
        {!isLoading && !error && servicios.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    background: '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0',
                  }}
                >
                  <th
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    SERVICIO
                  </th>
                  <th
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    DESCRIPCIÓN
                  </th>
                  <th
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    TARIFA
                  </th>
                  <th
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    ESTADO
                  </th>
                  <th
                    style={{
                      padding: '0.65rem 1rem',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#475569',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      textAlign: 'right',
                    }}
                  >
                    ACCIONES
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.8rem', color: '#1E293B' }}>
                {servicios.map((serv) => (
                  <tr
                    key={serv.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background-color 0.12s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Servicio con icono boxed */}
                    <td style={{ padding: '0.65rem 1rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '3px',
                            backgroundColor: serv.activo ? '#ECFDF5' : '#F1F5F9',
                            color: serv.activo ? '#006D36' : '#94A3B8',
                            border: serv.activo ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}
                        >
                          <i className="fa-solid fa-tag"></i>
                        </div>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>
                          {serv.nombre}
                        </span>
                      </div>
                    </td>

                    {/* Descripción */}
                    <td style={{ padding: '0.65rem 1rem', verticalAlign: 'middle', color: '#64748B', maxWidth: '300px' }}>
                      {serv.descripcion ? (
                        <span style={{ fontSize: '0.78rem' }}>{serv.descripcion}</span>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: '#94A3B8', fontSize: '0.75rem' }}>Sin descripción</span>
                      )}
                    </td>

                    {/* Tarifa */}
                    <td style={{ padding: '0.65rem 1rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          color: '#063D25',
                          fontSize: '0.85rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        Bs. {serv.precio.toFixed(2)}
                      </span>
                    </td>

                    {/* Disponibilidad Badge Boxed */}
                    <td style={{ padding: '0.65rem 1rem', verticalAlign: 'middle' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleActivo(serv)}
                        title="Clic para cambiar estado de disponibilidad"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '3px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          border: serv.activo ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                          backgroundColor: serv.activo ? '#ECFDF5' : '#F8FAFC',
                          color: serv.activo ? '#065F46' : '#64748B',
                          cursor: 'pointer',
                        }}
                      >
                        <i
                          className={serv.activo ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}
                          style={{ fontSize: '0.65rem' }}
                        ></i>
                        {serv.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>

                    {/* Acciones Compactas */}
                    <td style={{ padding: '0.65rem 1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(serv)}
                          title="Editar Servicio"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '3px',
                            color: '#334155',
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#006D36';
                            e.currentTarget.style.color = '#006D36';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#CBD5E1';
                            e.currentTarget.style.color = '#334155';
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(serv.id, serv.nombre)}
                          disabled={deletingId === serv.id}
                          title="Eliminar Servicio"
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #FECACA',
                            borderRadius: '3px',
                            color: '#DC2626',
                            width: '26px',
                            height: '26px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEF2F2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FFFFFF';
                          }}
                        >
                          {deletingId === serv.id ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-trash-can"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Enterprise para Registro / Edición */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Cabecera Modal Enterprise */}
            <div
              style={{
                padding: '0.85rem 1.15rem',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fa-solid fa-wand-magic-sparkles" style={{ color: '#006D36', fontSize: '0.85rem' }}></i>
                <h4
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#0F172A',
                  }}
                >
                  {editingServicio ? 'Modificar Servicio Extra' : 'Registrar Nuevo Servicio Extra'}
                </h4>
              </div>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.9rem',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div
                style={{
                  margin: '0.85rem 1.15rem 0 1.15rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  borderRadius: '3px',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.78rem',
                }}
              >
                {formError}
              </div>
            )}

            {/* Cuerpo del Formulario */}
            <form onSubmit={handleSubmit} style={{ padding: '1.15rem' }}>
              {/* Campo Nombre */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label
                  htmlFor="servicio-nombre"
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.35rem',
                  }}
                >
                  Nombre del Servicio <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="servicio-nombre"
                  type="text"
                  placeholder="Ej: Lavado Ecológico, Carga EV, Inflado"
                  value={formState.nombre}
                  onChange={(e) => setFormState({ ...formState, nombre: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '3px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Campo Precio */}
              <div style={{ marginBottom: '0.85rem' }}>
                <label
                  htmlFor="servicio-precio"
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.35rem',
                  }}
                >
                  Tarifa en Bolivianos (Bs.) <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontWeight: 800,
                      color: '#64748B',
                      fontSize: '0.78rem',
                    }}
                  >
                    Bs.
                  </span>
                  <input
                    id="servicio-precio"
                    type="number"
                    step="0.5"
                    min="0"
                    placeholder="0.00"
                    value={formState.precio}
                    onChange={(e) => setFormState({ ...formState, precio: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2.4rem',
                      borderRadius: '3px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      color: '#0F172A',
                      outline: 'none',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Campo Descripción */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  htmlFor="servicio-descripcion"
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#475569',
                    marginBottom: '0.35rem',
                  }}
                >
                  Descripción / Alcances del Servicio
                </label>
                <textarea
                  id="servicio-descripcion"
                  rows={2}
                  placeholder="Detalla lo que incluye el servicio..."
                  value={formState.descripcion}
                  onChange={(e) => setFormState({ ...formState, descripcion: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '3px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    color: '#0F172A',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Footer Acciones Enterprise */}
              <div
                style={{
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '3px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.45rem 1.15rem',
                    borderRadius: '3px',
                    border: 'none',
                    background: '#006D36',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 1px 2px rgba(0, 109, 54, 0.2)',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>{editingServicio ? 'Guardar Cambios' : 'Confirmar Registro'}</span>
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
