import React, { useState } from 'react';
import axios from 'axios';
import { useMisNivelesQuery } from '../../application/useNivelesQuery';
import {
  useCrearNivelMutation,
  useEliminarNivelMutation,
} from '../../application/useNivelesMutations';
import type { NivelModel } from '../../domain/Nivel';
import { showToast } from '../../../../core/utils/toastr';

export interface TenantNivelesPanelProps {
  embedded?: boolean;
  readOnly?: boolean;
  onSelectNivelParaEspacios?: (nivelId: string) => void;
}

export const TenantNivelesPanel: React.FC<TenantNivelesPanelProps> = ({
  readOnly = false,
  onSelectNivelParaEspacios,
}) => {
  const { data: niveles = [], isLoading, error } = useMisNivelesQuery();
  const crearMutation = useCrearNivelMutation();
  const eliminarMutation = useEliminarNivelMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [codigoInput, setCodigoInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setCodigoInput('');
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCodigoInput('');
    setFormError(null);
  };

  const handleCreateNivel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const codigoTrim = codigoInput.trim();
    if (!codigoTrim) {
      setFormError('El código o nombre del nivel es obligatorio.');
      return;
    }

    try {
      await crearMutation.mutateAsync({ codigo: codigoTrim });
      showToast.success('Nivel registrado con éxito.', 'Niveles');
      closeModal();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ||
          'Ocurrió un error al registrar el nivel.';
        setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setFormError('Error inesperado al crear el nivel.');
      }
    }
  };

  const handleDeleteNivel = async (nivel: NivelModel) => {
    if (nivel.totalEspacios && nivel.totalEspacios > 0) {
      showToast.warning(
        `No se puede eliminar el nivel "${nivel.codigo}" porque contiene ${nivel.totalEspacios} espacio(s) registrado(s).`,
        'Niveles',
      );
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar permanentemente el nivel "${nivel.codigo}"?`,
    );
    if (!confirmed) return;

    setDeletingId(nivel.id);
    try {
      await eliminarMutation.mutateAsync(nivel.id);
      showToast.success(`Nivel "${nivel.codigo}" eliminado con éxito.`, 'Niveles');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message || 'Error al eliminar el nivel.';
        showToast.error(Array.isArray(msg) ? msg.join(', ') : msg, 'Error');
      } else {
        showToast.error('Error inesperado al eliminar el nivel.', 'Error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const totalEspaciosGlobal = niveles.reduce(
    (acc, n) => acc + (n.totalEspacios || 0),
    0,
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
      }}
    >
      {/* Barra de cabecera con métricas y botón de acción */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          padding: '0.75rem 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <h2
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <i className="fa-solid fa-layer-group" style={{ color: '#006D36' }}></i>
              <span>Gestión de Niveles y Pisos</span>
            </h2>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                margin: '0.15rem 0 0 0',
              }}
            >
              Organiza físicamente las plantas de tu estacionamiento para distribuir los espacios y boxes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Badge Resumen */}
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.35rem 0.65rem',
              borderRadius: '3px',
              background: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>Niveles: {niveles.length}</span>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <span>Espacios Totales: {totalEspaciosGlobal}</span>
          </div>

          {!readOnly && (
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '3px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005429')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#006D36')}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nuevo Nivel</span>
            </button>
          )}
        </div>
      </div>

      {/* Estado de Carga / Error */}
      {isLoading && (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '4px',
            color: '#64748B',
            fontSize: '0.85rem',
          }}
        >
          <i
            className="fa-solid fa-spinner fa-spin"
            style={{ color: '#006D36', fontSize: '1.2rem', marginBottom: '0.5rem' }}
          ></i>
          <div>Cargando niveles del estacionamiento...</div>
        </div>
      )}

      {error && !isLoading && (
        <div
          style={{
            padding: '1rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '4px',
            color: '#991B1B',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
          }}
        >
          <i className="fa-solid fa-circle-exclamation" style={{ fontSize: '1rem' }}></i>
          <div>Error al cargar los niveles. Por favor, intenta nuevamente.</div>
        </div>
      )}

      {/* Tabla Enterprise de Niveles */}
      {!isLoading && !error && niveles.length > 0 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.78rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  color: '#475569',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  fontSize: '0.7rem',
                }}
              >
                <th style={{ padding: '0.65rem 1rem' }}>Nivel / Planta</th>
                <th style={{ padding: '0.65rem 1rem' }}>Espacios Asignados</th>
                <th style={{ padding: '0.65rem 1rem' }}>Fecha de Registro</th>
                <th style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {niveles.map((nivel) => {
                const isDeleting = deletingId === nivel.id;
                return (
                  <tr
                    key={nivel.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '3px',
                            background: '#F0FDF4',
                            border: '1px solid #BBF7D0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#006D36',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                          }}
                        >
                          <i className="fa-solid fa-stairs"></i>
                        </div>
                        <div>
                          <span
                            style={{
                              fontWeight: 700,
                              color: '#0F172A',
                              fontSize: '0.82rem',
                            }}
                          >
                            {nivel.codigo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '3px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background:
                              (nivel.totalEspacios || 0) > 0 ? '#DCFCE7' : '#F1F5F9',
                            color:
                              (nivel.totalEspacios || 0) > 0 ? '#166534' : '#64748B',
                            border:
                              (nivel.totalEspacios || 0) > 0
                                ? '1px solid #BBF7D0'
                                : '1px solid #E2E8F0',
                          }}
                        >
                          {nivel.totalEspacios || 0} espacio(s)
                        </span>

                        {onSelectNivelParaEspacios && (
                          <button
                            type="button"
                            onClick={() => onSelectNivelParaEspacios(nivel.id)}
                            title="Ir a gestionar espacios de este nivel"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#006D36',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0,
                            }}
                          >
                            Ver espacios
                          </button>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '0.65rem 1rem', color: '#64748B' }}>
                      {nivel.createdAt ? new Date(nivel.createdAt).toLocaleDateString() : '-'}
                    </td>

                    <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => handleDeleteNivel(nivel)}
                          disabled={isDeleting}
                          title={
                            (nivel.totalEspacios || 0) > 0
                              ? 'No se puede eliminar porque contiene espacios asignados'
                              : 'Eliminar nivel'
                          }
                          style={{
                            background: 'transparent',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            borderRadius: '3px',
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            cursor:
                              (nivel.totalEspacios || 0) > 0 ? 'not-allowed' : 'pointer',
                            opacity: (nivel.totalEspacios || 0) > 0 || isDeleting ? 0.5 : 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if ((nivel.totalEspacios || 0) === 0 && !isDeleting) {
                              e.currentTarget.style.backgroundColor = '#FEF2F2';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {isDeleting ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fa-solid fa-trash-can"></i>
                          )}
                          <span>Eliminar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Estado Vacío */}
      {!isLoading && !error && niveles.length === 0 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '4px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            color: '#64748B',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
              color: '#94A3B8',
              fontSize: '1.25rem',
            }}
          >
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
            No hay niveles o pisos registrados
          </h3>
          <p
            style={{
              fontSize: '0.76rem',
              color: '#64748B',
              margin: '0.35rem auto 1rem auto',
              maxWidth: '380px',
            }}
          >
            Comienza registrando las plantas físicas de tu parqueo (ej. "Piso 1", "Planta Baja", "Sótano A") para luego asignarles los espacios.
          </p>

          {!readOnly && (
            <button
              type="button"
              onClick={openCreateModal}
              style={{
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '3px',
                padding: '0.45rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Crear Primer Nivel</span>
            </button>
          )}
        </div>
      )}

      {/* Modal para Crear Nivel */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
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
              width: '100%',
              maxWidth: '420px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
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
              <h3
                style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <i className="fa-solid fa-layer-group" style={{ color: '#006D36' }}></i>
                <span>Registrar Nuevo Nivel / Planta</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  padding: '0.2rem',
                }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleCreateNivel} style={{ padding: '1.15rem' }}>
              {formError && (
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '3px',
                    color: '#991B1B',
                    fontSize: '0.75rem',
                    marginBottom: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{formError}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.15rem' }}>
                <label
                  htmlFor="codigo-nivel"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                >
                  Código / Identificador del Nivel <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="codigo-nivel"
                  type="text"
                  placeholder="Ej: Piso 1, Sótano 1, Nivel Terraza..."
                  value={codigoInput}
                  onChange={(e) => setCodigoInput(e.target.value)}
                  autoFocus
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                  Este nombre identificará los espacios y boxes pertenecientes a este piso.
                </span>
              </div>

              {/* Acciones */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.6rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #E2E8F0',
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    borderRadius: '3px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={crearMutation.isPending}
                  style={{
                    background: '#006D36',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '3px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: crearMutation.isPending ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity: crearMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {crearMutation.isPending && <i className="fa-solid fa-spinner fa-spin"></i>}
                  <span>Guardar Nivel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
