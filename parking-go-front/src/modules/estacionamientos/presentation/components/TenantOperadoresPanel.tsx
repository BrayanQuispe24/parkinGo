import React, { useMemo, useState } from 'react';
import axios from 'axios';
import {
  useOperadoresDisponiblesQuery,
  useOperadoresEstacionamientoQuery,
} from '../../application/useEstacionamientoOperadoresQuery';
import {
  useAsignarOperadoresMutation,
  useDesasignarOperadorMutation,
} from '../../application/useEstacionamientoOperadoresMutations';
import type { OperadorEstacionamientoModel } from '../../domain/EstacionamientoOperador';
import { showToast } from '../../../../core/utils/toastr';

interface TenantOperadoresPanelProps {
  estacionamientoId: string;
}

type PanelViewMode = 'asignados' | 'asignar';

export const TenantOperadoresPanel: React.FC<TenantOperadoresPanelProps> = ({
  estacionamientoId,
}) => {
  const [viewMode, setViewMode] = useState<PanelViewMode>('asignados');
  const [searchTermAsignados, setSearchTermAsignados] = useState('');
  const [searchTermDisponibles, setSearchTermDisponibles] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [desasignandoId, setDesasignandoId] = useState<string | null>(null);
  const [confirmOperator, setConfirmOperator] = useState<OperadorEstacionamientoModel | null>(null);

  // Consultas TanStack Query
  const {
    data: operadoresAsignados = [],
    isLoading: isLoadingAsignados,
    isError: isErrorAsignados,
  } = useOperadoresEstacionamientoQuery(estacionamientoId);

  const {
    data: operadoresDisponibles = [],
    isLoading: isLoadingDisponibles,
    isError: isErrorDisponibles,
  } = useOperadoresDisponiblesQuery(estacionamientoId);

  // Mutaciones TanStack Query
  const asignarMutation = useAsignarOperadoresMutation(estacionamientoId);
  const desasignarMutation = useDesasignarOperadorMutation(estacionamientoId);

  // Filtros reactivos en memoria
  const filteredAsignados = useMemo(() => {
    if (!searchTermAsignados.trim()) return operadoresAsignados;
    const term = searchTermAsignados.toLowerCase().trim();
    return operadoresAsignados.filter(
      (op) =>
        op.nombreCompleto.toLowerCase().includes(term) ||
        op.email.toLowerCase().includes(term) ||
        op.ci.toLowerCase().includes(term),
    );
  }, [operadoresAsignados, searchTermAsignados]);

  const filteredDisponibles = useMemo(() => {
    if (!searchTermDisponibles.trim()) return operadoresDisponibles;
    const term = searchTermDisponibles.toLowerCase().trim();
    return operadoresDisponibles.filter(
      (op) =>
        op.nombreCompleto.toLowerCase().includes(term) ||
        op.email.toLowerCase().includes(term) ||
        op.ci.toLowerCase().includes(term),
    );
  }, [operadoresDisponibles, searchTermDisponibles]);

  // Manejo de Selección para Asignación
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredDisponibles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDisponibles.map((op) => op.id));
    }
  };

  const handleAsignar = async () => {
    if (selectedIds.length === 0) return;
    try {
      await asignarMutation.mutateAsync({ usuarioIds: selectedIds });
      showToast.success(
        `${selectedIds.length} operador(es) vinculado(s) correctamente al parqueo.`,
      );
      setSelectedIds([]);
      setSearchTermDisponibles('');
      setViewMode('asignados');
    } catch (err: unknown) {
      let msg = 'Error al vincular operadores.';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      }
      showToast.error(msg);
    }
  };

  const handleDesasignar = async (operador: OperadorEstacionamientoModel) => {
    setDesasignandoId(operador.id);
    try {
      await desasignarMutation.mutateAsync(operador.id);
      showToast.success(
        `El operador ${operador.nombreCompleto} ha sido desvinculado del parqueo.`,
      );
      setConfirmOperator(null);
    } catch (err: unknown) {
      let msg = 'Error al desvincular al operador.';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || msg;
      }
      showToast.error(msg);
    } finally {
      setDesasignandoId(null);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%',
      }}
    >
      {/* Contenedor Principal Enterprise */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '4px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {/* Cabecera del Módulo con Barra de Pestañas Enterprise */}
        <div
          style={{
            borderBottom: '1px solid #CBD5E1',
            background: '#F8FAFC',
            padding: '0.65rem 1rem 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Tabs Directos Enterprise */}
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              onClick={() => setViewMode('asignados')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom:
                  viewMode === 'asignados'
                    ? '3px solid #006D36'
                    : '3px solid transparent',
                color: viewMode === 'asignados' ? '#006D36' : '#64748B',
                fontWeight: viewMode === 'asignados' ? 800 : 600,
                padding: '0.55rem 0.85rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-users"></i>
              <span>Operadores Asignados</span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px',
                  background:
                    viewMode === 'asignados' ? '#DCFCE7' : '#E2E8F0',
                  color: viewMode === 'asignados' ? '#166534' : '#475569',
                }}
              >
                {operadoresAsignados.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('asignar')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom:
                  viewMode === 'asignar'
                    ? '3px solid #006D36'
                    : '3px solid transparent',
                color: viewMode === 'asignar' ? '#006D36' : '#64748B',
                fontWeight: viewMode === 'asignar' ? 800 : 600,
                padding: '0.55rem 0.85rem',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              <i className="fa-solid fa-user-plus"></i>
              <span>Vincular Operadores</span>
              {operadoresDisponibles.length > 0 && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    background:
                      viewMode === 'asignar' ? '#DCFCE7' : '#EFF6FF',
                    color: viewMode === 'asignar' ? '#166534' : '#1E40AF',
                  }}
                >
                  {operadoresDisponibles.length} disponibles
                </span>
              )}
            </button>
          </div>

          {/* Botón Rápido cuando está en vista de listado */}
          {viewMode === 'asignados' && operadoresDisponibles.length > 0 && (
            <div style={{ paddingBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setViewMode('asignar')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#006D36',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '0.38rem 0.85rem',
                  fontSize: '0.74rem',
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
                <span>Vincular Operadores</span>
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* VISTA 1: LISTADO DE OPERADORES ASIGNADOS                */}
        {/* ======================================================== */}
        {viewMode === 'asignados' && (
          <div>
            {/* Toolbar con Buscador */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                  }}
                ></i>
                <input
                  type="text"
                  value={searchTermAsignados}
                  onChange={(e) => setSearchTermAsignados(e.target.value)}
                  placeholder="Buscar en operadores asignados..."
                  style={{
                    width: '100%',
                    padding: '0.42rem 0.75rem 0.42rem 2.1rem',
                    fontSize: '0.78rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    background: '#F8FAFC',
                  }}
                />
                {searchTermAsignados && (
                  <button
                    type="button"
                    onClick={() => setSearchTermAsignados('')}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                Mostrando <strong>{filteredAsignados.length}</strong> de{' '}
                <strong>{operadoresAsignados.length}</strong> operadores asignados
              </div>
            </div>

            {/* Carga */}
            {isLoadingAsignados && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <i
                  className="fa-solid fa-circle-notch fa-spin"
                  style={{ fontSize: '1.4rem', color: '#006D36' }}
                ></i>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  Cargando equipo de operadores...
                </p>
              </div>
            )}

            {/* Error */}
            {isErrorAsignados && (
              <div
                style={{
                  padding: '1rem',
                  margin: '1rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '4px',
                  color: '#991B1B',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>No fue posible cargar los operadores del parqueo.</span>
              </div>
            )}

            {/* Tabla Alta Densidad Enterprise */}
            {!isLoadingAsignados && !isErrorAsignados && filteredAsignados.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#F8FAFC',
                        borderBottom: '1px solid #E2E8F0',
                        color: '#475569',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Operador</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Cédula de Identidad</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Teléfono</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Rol</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Estado</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Fecha Registro</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800, textAlign: 'right' }}>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAsignados.map((operador) => (
                      <tr
                        key={operador.id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          transition: 'background 0.12s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Operador Avatar + Nombre + Email */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#DCFCE7',
                                color: '#166534',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                flexShrink: 0,
                                overflow: 'hidden',
                                border: '1px solid #CBD5E1',
                              }}
                            >
                              {operador.photoUrl ? (
                                <img
                                  src={operador.photoUrl}
                                  alt={operador.nombreCompleto}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                `${operador.firstName[0] || ''}${operador.lastName[0] || ''}`.toUpperCase()
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>
                                {operador.nombreCompleto}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                {operador.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* CI */}
                        <td style={{ padding: '0.65rem 1rem', color: '#334155', fontWeight: 600 }}>
                          <span
                            style={{
                              background: '#F1F5F9',
                              padding: '0.12rem 0.4rem',
                              borderRadius: '2px',
                              border: '1px solid #E2E8F0',
                              fontSize: '0.72rem',
                            }}
                          >
                            {operador.ci}
                          </span>
                        </td>

                        {/* Teléfono */}
                        <td style={{ padding: '0.65rem 1rem', color: '#475569' }}>
                          {operador.phone ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <i className="fa-solid fa-phone" style={{ fontSize: '0.65rem', color: '#94A3B8' }}></i>
                              {operador.phone}
                            </span>
                          ) : (
                            <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Sin registrar</span>
                          )}
                        </td>

                        {/* Rol */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span
                            style={{
                              background: '#E0E7FF',
                              color: '#3730A3',
                              padding: '0.12rem 0.45rem',
                              borderRadius: '3px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                            }}
                          >
                            {operador.roleName}
                          </span>
                        </td>

                        {/* Estado */}
                        <td style={{ padding: '0.65rem 1rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: operador.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                              color: operador.status === 'ACTIVE' ? '#166534' : '#64748B',
                              padding: '0.12rem 0.45rem',
                              borderRadius: '3px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: operador.status === 'ACTIVE' ? '#16A34A' : '#94A3B8',
                              }}
                            />
                            {operador.status === 'ACTIVE' ? 'Activo' : operador.status}
                          </span>
                        </td>

                        {/* Fecha */}
                        <td style={{ padding: '0.65rem 1rem', color: '#64748B', fontSize: '0.72rem' }}>
                          {new Date(operador.createdAt).toLocaleDateString('es-BO', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setConfirmOperator(operador)}
                            disabled={desasignandoId === operador.id}
                            title="Desvincular operador del parqueo"
                            style={{
                              background: '#FEF2F2',
                              border: '1px solid #FECACA',
                              color: '#DC2626',
                              borderRadius: '3px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#FEE2E2';
                              e.currentTarget.style.borderColor = '#FCA5A5';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#FEF2F2';
                              e.currentTarget.style.borderColor = '#FECACA';
                            }}
                          >
                            <i className="fa-solid fa-user-minus"></i>
                            <span>Desvincular</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Estado Vacío Asignados */}
            {!isLoadingAsignados && !isErrorAsignados && operadoresAsignados.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  color: '#64748B',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    color: '#94A3B8',
                    fontSize: '1.25rem',
                  }}
                >
                  <i className="fa-solid fa-users"></i>
                </div>
                <h4 style={{ margin: '0 0 0.35rem', color: '#0F172A', fontSize: '0.9rem', fontWeight: 800 }}>
                  Aún no tienes operadores asignados a este parqueo
                </h4>
                <p style={{ margin: '0 auto 1.15rem', fontSize: '0.76rem', maxWidth: '380px', lineHeight: 1.45 }}>
                  Vincula operadores para que puedan iniciar sesión y gestionar el ingreso y cobro de vehículos.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('asignar')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: '#006D36',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '0.45rem 1rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                  <span>Vincular Operadores Disponibles</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: VINCULAR OPERADORES DISPONIBLES (ENTERPRISE)    */}
        {/* ======================================================== */}
        {viewMode === 'asignar' && (
          <div>
            {/* Toolbar con Buscador y Selector Todo */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #E2E8F0',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    color: '#94A3B8',
                    fontSize: '0.78rem',
                  }}
                ></i>
                <input
                  type="text"
                  value={searchTermDisponibles}
                  onChange={(e) => setSearchTermDisponibles(e.target.value)}
                  placeholder="Buscar operador por nombre, CI o correo..."
                  style={{
                    width: '100%',
                    padding: '0.42rem 0.75rem 0.42rem 2.1rem',
                    fontSize: '0.78rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    background: '#F8FAFC',
                  }}
                />
                {searchTermDisponibles && (
                  <button
                    type="button"
                    onClick={() => setSearchTermDisponibles('')}
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              {filteredDisponibles.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    style={{
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#334155',
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    {selectedIds.length === filteredDisponibles.length
                      ? 'Deseleccionar todos'
                      : 'Seleccionar todos'}
                  </button>
                </div>
              )}
            </div>

            {/* Carga */}
            {isLoadingDisponibles && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                <i
                  className="fa-solid fa-circle-notch fa-spin"
                  style={{ fontSize: '1.4rem', color: '#006D36' }}
                ></i>
                <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  Buscando operadores disponibles...
                </p>
              </div>
            )}

            {/* Error */}
            {isErrorDisponibles && (
              <div
                style={{
                  padding: '1rem',
                  margin: '1rem',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '4px',
                  color: '#991B1B',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>No fue posible cargar los operadores disponibles.</span>
              </div>
            )}

            {/* Tabla de Candidatos Disponibles */}
            {!isLoadingDisponibles && !isErrorDisponibles && filteredDisponibles.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                    fontSize: '0.78rem',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: '#F8FAFC',
                        borderBottom: '1px solid #E2E8F0',
                        color: '#475569',
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      <th style={{ width: '40px', padding: '0.65rem 0.75rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={
                            filteredDisponibles.length > 0 &&
                            selectedIds.length === filteredDisponibles.length
                          }
                          onChange={handleToggleSelectAll}
                          style={{ accentColor: '#006D36', cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Operador</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Cédula (CI)</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Teléfono</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800 }}>Estado</th>
                      <th style={{ padding: '0.65rem 1rem', fontWeight: 800, textAlign: 'right' }}>
                        Selección
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDisponibles.map((operador) => {
                      const isSelected = selectedIds.includes(operador.id);
                      return (
                        <tr
                          key={operador.id}
                          onClick={() => handleToggleSelect(operador.id)}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            background: isSelected ? '#F0FDF4' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background 0.12s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {/* Checkbox */}
                          <td
                            style={{
                              padding: '0.65rem 0.75rem',
                              textAlign: 'center',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(operador.id)}
                              style={{
                                width: '16px',
                                height: '16px',
                                accentColor: '#006D36',
                                cursor: 'pointer',
                              }}
                            />
                          </td>

                          {/* Operador Avatar + Nombre + Email */}
                          <td style={{ padding: '0.65rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isSelected ? '#DCFCE7' : '#F1F5F9',
                                  color: isSelected ? '#166534' : '#475569',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                  border: '1px solid #CBD5E1',
                                }}
                              >
                                {operador.photoUrl ? (
                                  <img
                                    src={operador.photoUrl}
                                    alt={operador.nombreCompleto}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  `${operador.firstName[0] || ''}${operador.lastName[0] || ''}`.toUpperCase()
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>
                                  {operador.nombreCompleto}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                  {operador.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* CI */}
                          <td style={{ padding: '0.65rem 1rem', color: '#334155', fontWeight: 600 }}>
                            <span
                              style={{
                                background: '#F1F5F9',
                                padding: '0.12rem 0.4rem',
                                borderRadius: '2px',
                                border: '1px solid #E2E8F0',
                                fontSize: '0.72rem',
                              }}
                            >
                              {operador.ci}
                            </span>
                          </td>

                          {/* Teléfono */}
                          <td style={{ padding: '0.65rem 1rem', color: '#475569' }}>
                            {operador.phone ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <i className="fa-solid fa-phone" style={{ fontSize: '0.65rem', color: '#94A3B8' }}></i>
                                {operador.phone}
                              </span>
                            ) : (
                              <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>Sin registrar</span>
                            )}
                          </td>

                          {/* Estado */}
                          <td style={{ padding: '0.65rem 1rem' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                background: operador.status === 'ACTIVE' ? '#DCFCE7' : '#F1F5F9',
                                color: operador.status === 'ACTIVE' ? '#166534' : '#64748B',
                                padding: '0.12rem 0.45rem',
                                borderRadius: '3px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                              }}
                            >
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  background: operador.status === 'ACTIVE' ? '#16A34A' : '#94A3B8',
                                }}
                              />
                              {operador.status === 'ACTIVE' ? 'Disponible' : operador.status}
                            </span>
                          </td>

                          {/* Estado de Selección */}
                          <td style={{ padding: '0.65rem 1rem', textAlign: 'right' }}>
                            {isSelected ? (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  color: '#166534',
                                  background: '#DCFCE7',
                                  padding: '0.12rem 0.5rem',
                                  borderRadius: '10px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                }}
                              >
                                <i className="fa-solid fa-check"></i>
                                <span>Seleccionado</span>
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                                Clic para seleccionar
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Sin operadores disponibles */}
            {!isLoadingDisponibles && !isErrorDisponibles && operadoresDisponibles.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  color: '#64748B',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem',
                    color: '#94A3B8',
                    fontSize: '1.25rem',
                  }}
                >
                  <i className="fa-solid fa-user-check"></i>
                </div>
                <h4 style={{ margin: '0 0 0.35rem', color: '#0F172A', fontSize: '0.9rem', fontWeight: 800 }}>
                  No hay operadores disponibles para vincular
                </h4>
                <p style={{ margin: '0 auto 1.15rem', fontSize: '0.76rem', maxWidth: '380px', lineHeight: 1.45 }}>
                  Todos tus operadores ya están vinculados a un parqueo, o aún no has registrado personal con rol de operador.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode('asignados')}
                  style={{
                    padding: '0.42rem 0.95rem',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: '#334155',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  Volver a Operadores Asignados
                </button>
              </div>
            )}

            {/* Barra de Acciones Fija Inferior */}
            {!isLoadingDisponibles && operadoresDisponibles.length > 0 && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#475569' }}>
                  <strong>{selectedIds.length}</strong> operador(es) seleccionado(s) de{' '}
                  <strong>{filteredDisponibles.length}</strong> disponibles
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIds([]);
                      setViewMode('asignados');
                    }}
                    disabled={asignarMutation.isPending}
                    style={{
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      color: '#475569',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={handleAsignar}
                    disabled={selectedIds.length === 0 || asignarMutation.isPending}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.45rem 1.15rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background:
                        selectedIds.length === 0 || asignarMutation.isPending
                          ? '#94A3B8'
                          : '#006D36',
                      border: 'none',
                      borderRadius: '3px',
                      cursor:
                        selectedIds.length === 0 || asignarMutation.isPending
                          ? 'not-allowed'
                          : 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {asignarMutation.isPending ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Guardando cambios...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i>
                        <span>Vincular Operadores Seleccionados ({selectedIds.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diálogo de Confirmación para Desvincular (Estricto Enterprise Blueprint) */}
      {confirmOperator && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !desasignarMutation.isPending) {
              setConfirmOperator(null);
            }
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '430px',
              padding: '1.25rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #CBD5E1',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '4px',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-user-minus"></i>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#0F172A', fontWeight: 800 }}>
                  ¿Desvincular operador?
                </h4>
                <p style={{ margin: '0 0 0.85rem', fontSize: '0.76rem', color: '#64748B', lineHeight: 1.45 }}>
                  ¿Estás seguro de que deseas desvincular a{' '}
                  <strong style={{ color: '#0F172A' }}>{confirmOperator.nombreCompleto}</strong> de este parqueo? El operador quedará disponible para ser asignado nuevamente cuando lo requieras.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setConfirmOperator(null)}
                    disabled={desasignarMutation.isPending}
                    style={{
                      padding: '0.38rem 0.8rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#475569',
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDesasignar(confirmOperator)}
                    disabled={desasignarMutation.isPending}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.38rem 0.9rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: '#DC2626',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: desasignarMutation.isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {desasignarMutation.isPending ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Desvinculando...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-user-minus"></i>
                        <span>Sí, Desvincular</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
