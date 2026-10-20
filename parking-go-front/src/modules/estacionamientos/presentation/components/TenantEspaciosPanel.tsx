import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { useMisNivelesQuery } from '../../application/useNivelesQuery';
import { useMisEspaciosQuery } from '../../application/useEspaciosQuery';
import {
  useCrearEspacioMutation,
  useActualizarEspacioMutation,
  useEliminarEspacioMutation,
} from '../../application/useEspaciosMutations';
import type {
  EspacioModel,
  TipoEspacio,
  EstadoEspacio,
} from '../../domain/Espacio';
import type { ModalidadTarifa } from '../../domain/Tarifa';
import { showToast } from '../../../../core/utils/toastr';

export interface TenantEspaciosPanelProps {
  embedded?: boolean;
  readOnly?: boolean;
  initialNivelId?: string;
  onGoToNiveles?: () => void;
}

interface FormEspacioState {
  codigoEspacio: string;
  nivelId: string;
  tipo: TipoEspacio;
  modalidad: ModalidadTarifa;
  estado: EstadoEspacio;
}

const INITIAL_FORM: FormEspacioState = {
  codigoEspacio: '',
  nivelId: '',
  tipo: 'AUTO',
  modalidad: 'HORA',
  estado: 'DISPONIBLE',
};

export const TenantEspaciosPanel: React.FC<TenantEspaciosPanelProps> = ({
  readOnly = false,
  initialNivelId,
  onGoToNiveles,
}) => {
  const { data: niveles = [], isLoading: isLoadingNiveles } = useMisNivelesQuery();
  const [selectedNivelId, setSelectedNivelId] = useState<string>(initialNivelId || 'ALL');
  const [filterEstado, setFilterEstado] = useState<string>('ALL');
  const [filterTipo, setFilterTipo] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const queryNivelParam = selectedNivelId === 'ALL' ? undefined : selectedNivelId;
  const {
    data: espacios = [],
    isLoading: isLoadingEspacios,
    error,
  } = useMisEspaciosQuery(queryNivelParam);

  const crearMutation = useCrearEspacioMutation();
  const actualizarMutation = useActualizarEspacioMutation();
  const eliminarMutation = useEliminarEspacioMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState<EspacioModel | null>(null);
  const [formState, setFormState] = useState<FormEspacioState>(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [quickUpdatingId, setQuickUpdatingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingEspacio(null);
    setFormState({
      ...INITIAL_FORM,
      nivelId:
        selectedNivelId !== 'ALL'
          ? selectedNivelId
          : niveles.length > 0
          ? niveles[0].id
          : '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (espacio: EspacioModel) => {
    setEditingEspacio(espacio);
    setFormState({
      codigoEspacio: espacio.codigoEspacio,
      nivelId: espacio.nivelId,
      tipo: espacio.tipo,
      modalidad: espacio.modalidad,
      estado: espacio.estado,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEspacio(null);
    setFormState(INITIAL_FORM);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const codigoTrim = formState.codigoEspacio.trim();
    if (!codigoTrim) {
      setFormError('El código del espacio es obligatorio (ej. A-01, E-12).');
      return;
    }

    if (!formState.nivelId) {
      setFormError('Debes seleccionar el nivel o piso al que pertenece el espacio.');
      return;
    }

    try {
      if (editingEspacio) {
        await actualizarMutation.mutateAsync({
          id: editingEspacio.id,
          payload: {
            codigoEspacio: codigoTrim,
            nivelId: formState.nivelId,
            tipo: formState.tipo,
            modalidad: formState.modalidad,
            estado: formState.estado,
          },
        });
        showToast.success('Espacio actualizado con éxito.', 'Espacios');
      } else {
        await crearMutation.mutateAsync({
          codigoEspacio: codigoTrim,
          nivelId: formState.nivelId,
          tipo: formState.tipo,
          modalidad: formState.modalidad,
          estado: formState.estado,
        });
        showToast.success('Espacio registrado con éxito.', 'Espacios');
      }
      closeModal();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ||
          'Ocurrió un error al guardar el espacio.';
        setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setFormError('Error inesperado al guardar el espacio.');
      }
    }
  };

  const handleDelete = async (espacio: EspacioModel) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar permanentemente el espacio "${espacio.codigoEspacio}"?`,
    );
    if (!confirmed) return;

    setDeletingId(espacio.id);
    try {
      await eliminarMutation.mutateAsync(espacio.id);
      showToast.success(`Espacio "${espacio.codigoEspacio}" eliminado.`, 'Espacios');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message || 'Error al eliminar el espacio.';
        showToast.error(Array.isArray(msg) ? msg.join(', ') : msg, 'Error');
      } else {
        showToast.error('Error inesperado al eliminar el espacio.', 'Error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuickStatusChange = async (
    espacio: EspacioModel,
    nuevoEstado: EstadoEspacio,
  ) => {
    if (espacio.estado === nuevoEstado) return;
    setQuickUpdatingId(espacio.id);
    try {
      await actualizarMutation.mutateAsync({
        id: espacio.id,
        payload: { estado: nuevoEstado },
      });
      showToast.info(`Estado de ${espacio.codigoEspacio} cambiado a ${nuevoEstado}.`, 'Espacios');
    } catch {
      showToast.error('No se pudo actualizar el estado rápido.', 'Error');
    } finally {
      setQuickUpdatingId(null);
    }
  };

  // Filtrado en memoria
  const filteredEspacios = useMemo(() => {
    return espacios.filter((item) => {
      if (filterEstado !== 'ALL' && item.estado !== filterEstado) return false;
      if (filterTipo !== 'ALL' && item.tipo !== filterTipo) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesCodigo = item.codigoEspacio.toLowerCase().includes(term);
        const matchesNivel = item.nivelCodigo?.toLowerCase().includes(term) ?? false;
        if (!matchesCodigo && !matchesNivel) return false;
      }
      return true;
    });
  }, [espacios, filterEstado, filterTipo, searchTerm]);

  // Contadores para métricas
  const counts = useMemo(() => {
    const total = espacios.length;
    const disponibles = espacios.filter((e) => e.estado === 'DISPONIBLE').length;
    const ocupados = espacios.filter((e) => e.estado === 'OCUPADO').length;
    const reservados = espacios.filter((e) => e.estado === 'RESERVADO').length;
    const mantenimiento = espacios.filter((e) => e.estado === 'MANTENIMIENTO').length;
    return { total, disponibles, ocupados, reservados, mantenimiento };
  }, [espacios]);

  const getTipoIcon = (tipo: TipoEspacio) => {
    switch (tipo) {
      case 'AUTO':
        return 'fa-solid fa-car';
      case 'MOTO':
        return 'fa-solid fa-motorcycle';
      case 'CAMIONETA':
        return 'fa-solid fa-truck-pickup';
      case 'DISCAPACITADO':
        return 'fa-solid fa-wheelchair';
      case 'ELECTRICO':
        return 'fa-solid fa-bolt';
      default:
        return 'fa-solid fa-square-parking';
    }
  };

  const getEstadoBadgeStyle = (estado: EstadoEspacio) => {
    switch (estado) {
      case 'DISPONIBLE':
        return {
          bg: '#DCFCE7',
          color: '#166534',
          border: '#BBF7D0',
          dot: '#22C55E',
        };
      case 'OCUPADO':
        return {
          bg: '#FEE2E2',
          color: '#991B1B',
          border: '#FECACA',
          dot: '#EF4444',
        };
      case 'RESERVADO':
        return {
          bg: '#DBEAFE',
          color: '#1E40AF',
          border: '#BFDBFE',
          dot: '#3B82F6',
        };
      case 'MANTENIMIENTO':
        return {
          bg: '#FEF3C7',
          color: '#92400E',
          border: '#FDE68A',
          dot: '#F59E0B',
        };
      default:
        return {
          bg: '#F1F5F9',
          color: '#475569',
          border: '#CBD5E1',
          dot: '#94A3B8',
        };
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
      {/* 1. Header Toolbar de Gestión */}
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
            <i className="fa-solid fa-square-parking" style={{ color: '#006D36' }}></i>
            <span>Control y Distribución de Espacios</span>
          </h2>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#64748B',
              margin: '0.15rem 0 0 0',
            }}
          >
            Gestiona los boxes individuales, modalidades, tipos de vehículo y estado de disponibilidad en tiempo real.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          {!readOnly && (
            <button
              type="button"
              onClick={openCreateModal}
              disabled={niveles.length === 0}
              title={
                niveles.length === 0
                  ? 'Debes crear primero al menos un nivel o piso'
                  : 'Crear nuevo espacio'
              }
              style={{
                background: niveles.length === 0 ? '#94A3B8' : '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '3px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: niveles.length === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (niveles.length > 0) e.currentTarget.style.backgroundColor = '#005429';
              }}
              onMouseLeave={(e) => {
                if (niveles.length > 0) e.currentTarget.style.backgroundColor = '#006D36';
              }}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Nuevo Espacio</span>
            </button>
          )}
        </div>
      </div>

      {/* Alerta si no hay niveles registrados aún */}
      {niveles.length === 0 && !isLoadingNiveles && (
        <div
          style={{
            padding: '0.85rem 1rem',
            background: '#FFFBEB',
            border: '1px solid #FCD34D',
            borderRadius: '4px',
            color: '#92400E',
            fontSize: '0.78rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1rem', color: '#D97706' }}></i>
            <div>
              <strong>No hay niveles configurados:</strong> Los espacios deben pertenecer a un piso o nivel. Crea tu primer nivel para comenzar a registrar boxes.
            </div>
          </div>
          {onGoToNiveles && (
            <button
              type="button"
              onClick={onGoToNiveles}
              style={{
                background: '#D97706',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: '3px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Ir a Niveles
            </button>
          )}
        </div>
      )}

      {/* 2. Barra de Filtros y Métricas Rápidas */}
      {niveles.length > 0 && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '4px',
            padding: '0.65rem 0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {/* Fila 1: Pestañas / Chips de Niveles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginRight: '0.2rem' }}>
              Nivel / Planta:
            </span>
            <button
              type="button"
              onClick={() => setSelectedNivelId('ALL')}
              style={{
                background: selectedNivelId === 'ALL' ? '#006D36' : '#F1F5F9',
                color: selectedNivelId === 'ALL' ? '#FFFFFF' : '#475569',
                border: '1px solid ' + (selectedNivelId === 'ALL' ? '#006D36' : '#CBD5E1'),
                borderRadius: '3px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Todos los Niveles ({niveles.reduce((acc, n) => acc + (n.totalEspacios || 0), 0)})
            </button>
            {niveles.map((n) => {
              const isSelected = selectedNivelId === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNivelId(n.id)}
                  style={{
                    background: isSelected ? '#006D36' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: '1px solid ' + (isSelected ? '#006D36' : '#CBD5E1'),
                    borderRadius: '3px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>{n.codigo}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      opacity: 0.8,
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                      padding: '0.05rem 0.3rem',
                      borderRadius: '8px',
                    }}
                  >
                    {n.totalEspacios || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fila 2: Filtros de Estado, Tipo y Buscador */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.6rem',
              paddingTop: '0.45rem',
              borderTop: '1px solid #F1F5F9',
            }}
          >
            {/* Filtros Izquierda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {/* Buscador */}
              <div style={{ position: 'relative' }}>
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{
                    position: 'absolute',
                    left: '0.6rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.7rem',
                    color: '#94A3B8',
                  }}
                ></i>
                <input
                  type="text"
                  placeholder="Buscar código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.25rem 0.6rem 0.25rem 1.6rem',
                    fontSize: '0.74rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    width: '130px',
                  }}
                />
              </div>

              {/* Filtro Estado */}
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.72rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  color: '#334155',
                  outline: 'none',
                  background: '#FFFFFF',
                }}
              >
                <option value="ALL">Todos los Estados</option>
                <option value="DISPONIBLE">Disponible ({counts.disponibles})</option>
                <option value="OCUPADO">Ocupado ({counts.ocupados})</option>
                <option value="RESERVADO">Reservado ({counts.reservados})</option>
                <option value="MANTENIMIENTO">Mantenimiento ({counts.mantenimiento})</option>
              </select>

              {/* Filtro Tipo */}
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.72rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '3px',
                  color: '#334155',
                  outline: 'none',
                  background: '#FFFFFF',
                }}
              >
                <option value="ALL">Todos los Tipos</option>
                <option value="AUTO">Auto</option>
                <option value="MOTO">Moto</option>
                <option value="CAMIONETA">Camioneta</option>
                <option value="DISCAPACITADO">Discapacitado</option>
                <option value="ELECTRICO">Eléctrico</option>
              </select>
            </div>

            {/* Badges de Conteo Derecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: '#DCFCE7',
                  color: '#166534',
                  fontWeight: 700,
                  border: '1px solid #BBF7D0',
                }}
              >
                Disp: {counts.disponibles}
              </span>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 700,
                  border: '1px solid #FECACA',
                }}
              >
                Ocup: {counts.ocupados}
              </span>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: '#DBEAFE',
                  color: '#1E40AF',
                  fontWeight: 700,
                  border: '1px solid #BFDBFE',
                }}
              >
                Resv: {counts.reservados}
              </span>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontWeight: 700,
                  border: '1px solid #FDE68A',
                }}
              >
                Mant: {counts.mantenimiento}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Lista / Grid de Espacios */}
      {isLoadingEspacios && (
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
          <div>Cargando espacios del estacionamiento...</div>
        </div>
      )}

      {error && !isLoadingEspacios && (
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
          <div>Error al cargar los espacios. Intenta recargar la vista.</div>
        </div>
      )}

      {!isLoadingEspacios && !error && filteredEspacios.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {filteredEspacios.map((espacio) => {
            const badgeStyle = getEstadoBadgeStyle(espacio.estado);
            const isDeleting = deletingId === espacio.id;
            const isQuickUpdating = quickUpdatingId === espacio.id;

            return (
              <div
                key={espacio.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                  position: 'relative',
                  borderTop: `3px solid ${badgeStyle.dot}`,
                }}
              >
                {/* Cabecera de la Tarjeta del Espacio */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '3px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0F172A',
                        fontSize: '0.8rem',
                      }}
                      title={`Tipo: ${espacio.tipo}`}
                    >
                      <i className={getTipoIcon(espacio.tipo)}></i>
                    </div>
                    <div>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          color: '#0F172A',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {espacio.codigoEspacio}
                      </span>
                    </div>
                  </div>

                  {/* Tag del Nivel */}
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '3px',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    {espacio.nivelCodigo || 'Nivel'}
                  </span>
                </div>

                {/* Detalles: Modalidad y Tipo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: '#64748B',
                  }}
                >
                  <span>
                    Cobro:{' '}
                    <strong style={{ color: '#334155' }}>{espacio.modalidad}</strong>
                  </span>
                  <span>
                    Vehículo:{' '}
                    <strong style={{ color: '#334155' }}>{espacio.tipo}</strong>
                  </span>
                </div>

                {/* Badge de Estado Interactivo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: badgeStyle.bg,
                    border: `1px solid ${badgeStyle.border}`,
                    borderRadius: '3px',
                    padding: '0.3rem 0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: badgeStyle.dot,
                        display: 'inline-block',
                      }}
                    ></span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: badgeStyle.color,
                      }}
                    >
                      {espacio.estado}
                    </span>
                  </div>

                  {/* Selector rápido de estado in situ */}
                  {!readOnly && (
                    <select
                      value={espacio.estado}
                      disabled={isQuickUpdating}
                      onChange={(e) =>
                        handleQuickStatusChange(
                          espacio,
                          e.target.value as EstadoEspacio,
                        )
                      }
                      title="Cambiar estado rápidamente"
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        border: 'none',
                        background: 'transparent',
                        color: badgeStyle.color,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="DISPONIBLE">DISPONIBLE</option>
                      <option value="OCUPADO">OCUPADO</option>
                      <option value="RESERVADO">RESERVADO</option>
                      <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                    </select>
                  )}
                </div>

                {/* Acciones de Edición / Eliminación */}
                {!readOnly && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '0.4rem',
                      paddingTop: '0.35rem',
                      borderTop: '1px solid #F1F5F9',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => openEditModal(espacio)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #CBD5E1',
                        borderRadius: '3px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        color: '#334155',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      <span>Editar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(espacio)}
                      disabled={isDeleting}
                      style={{
                        background: 'transparent',
                        border: '1px solid #FECACA',
                        borderRadius: '3px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.7rem',
                        color: '#DC2626',
                        fontWeight: 600,
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isDeleting ? (
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      ) : (
                        <i className="fa-solid fa-trash-can"></i>
                      )}
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Estado Vacío de Espacios */}
      {!isLoadingEspacios && !error && filteredEspacios.length === 0 && (
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
            <i className="fa-solid fa-square-parking"></i>
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
            No se encontraron espacios
          </h3>
          <p
            style={{
              fontSize: '0.76rem',
              color: '#64748B',
              margin: '0.35rem auto 1rem auto',
              maxWidth: '380px',
            }}
          >
            {searchTerm || filterEstado !== 'ALL' || filterTipo !== 'ALL'
              ? 'No hay espacios que coincidan con los filtros seleccionados.'
              : 'Añade el primer espacio o box de estacionamiento en tus niveles configurados.'}
          </p>

          {!readOnly && niveles.length > 0 && (
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
              <span>Crear Espacio</span>
            </button>
          )}
        </div>
      )}

      {/* Modal Crear / Editar Espacio */}
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
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera */}
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
                <i className="fa-solid fa-square-parking" style={{ color: '#006D36' }}></i>
                <span>
                  {editingEspacio ? 'Editar Espacio / Box' : 'Registrar Nuevo Espacio / Box'}
                </span>
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
            <form onSubmit={handleSubmit} style={{ padding: '1.15rem' }}>
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

              {/* Código del Espacio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.9rem' }}>
                <label
                  htmlFor="codigo-espacio"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}
                >
                  Código / Identificador del Espacio <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input
                  id="codigo-espacio"
                  type="text"
                  placeholder="Ej: A-01, BOX-14, P1-05..."
                  value={formState.codigoEspacio}
                  onChange={(e) =>
                    setFormState({ ...formState, codigoEspacio: e.target.value })
                  }
                  autoFocus
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Nivel / Piso */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.9rem' }}>
                <label
                  htmlFor="nivel-espacio"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}
                >
                  Nivel / Planta Asociada <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select
                  id="nivel-espacio"
                  value={formState.nivelId}
                  onChange={(e) =>
                    setFormState({ ...formState, nivelId: e.target.value })
                  }
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  {niveles.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.codigo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fila: Tipo de Vehículo y Modalidad */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label
                    htmlFor="tipo-espacio"
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}
                  >
                    Tipo de Vehículo
                  </label>
                  <select
                    id="tipo-espacio"
                    value={formState.tipo}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        tipo: e.target.value as TipoEspacio,
                      })
                    }
                    style={{
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      outline: 'none',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="AUTO">Auto</option>
                    <option value="MOTO">Moto</option>
                    <option value="CAMIONETA">Camioneta</option>
                    <option value="DISCAPACITADO">Discapacitado</option>
                    <option value="ELECTRICO">Eléctrico</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label
                    htmlFor="modalidad-espacio"
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}
                  >
                    Modalidad Cobro
                  </label>
                  <select
                    id="modalidad-espacio"
                    value={formState.modalidad}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        modalidad: e.target.value as ModalidadTarifa,
                      })
                    }
                    style={{
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      outline: 'none',
                      background: '#FFFFFF',
                    }}
                  >
                    <option value="HORA">Por Hora</option>
                    <option value="DIA">Por Día</option>
                    <option value="MES">Por Mes</option>
                  </select>
                </div>
              </div>

              {/* Estado Inicial */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.15rem' }}>
                <label
                  htmlFor="estado-espacio"
                  style={{ fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}
                >
                  Estado
                </label>
                <select
                  id="estado-espacio"
                  value={formState.estado}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      estado: e.target.value as EstadoEspacio,
                    })
                  }
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '3px',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="OCUPADO">OCUPADO</option>
                  <option value="RESERVADO">RESERVADO</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                </select>
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
                  disabled={crearMutation.isPending || actualizarMutation.isPending}
                  style={{
                    background: '#006D36',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '3px',
                    padding: '0.4rem 0.95rem',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor:
                      crearMutation.isPending || actualizarMutation.isPending
                        ? 'not-allowed'
                        : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    opacity:
                      crearMutation.isPending || actualizarMutation.isPending ? 0.7 : 1,
                  }}
                >
                  {(crearMutation.isPending || actualizarMutation.isPending) && (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  )}
                  <span>{editingEspacio ? 'Actualizar Espacio' : 'Guardar Espacio'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
