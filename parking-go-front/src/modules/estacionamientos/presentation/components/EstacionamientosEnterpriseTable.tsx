import React, { useMemo, useState } from 'react';
import type { EstacionamientoModel, EstadoEstacionamiento } from '../../domain/Estacionamiento';
import { EstadoBadge } from './EstadoBadge';

interface EstacionamientosEnterpriseTableProps {
  estacionamientos: EstacionamientoModel[];
  loading?: boolean;
  onViewEstacionamiento: (estacionamiento: EstacionamientoModel) => void;
  onGoToRegister: () => void;
}

export const EstacionamientosEnterpriseTable: React.FC<EstacionamientosEnterpriseTableProps> = ({
  estacionamientos,
  loading = false,
  onViewEstacionamiento,
  onGoToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | EstadoEstacionamiento>('ALL');

  const filtered = useMemo(() => {
    return estacionamientos.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.direccion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || item.estado === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [estacionamientos, searchTerm, statusFilter]);

  return (
    <div
      style={{
        background: 'var(--surface-card, #FFFFFF)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle, #CBD5CE)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Toolbar Superior */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
          display: 'flex',
          gap: '0.85rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px', flexWrap: 'wrap' }}>
          {/* Buscador */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                fontSize: '0.85rem',
              }}
            ></i>
            <input
              type="text"
              placeholder="Buscar estacionamiento por nombre o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                border: '1px solid var(--border-subtle, #CBD5E1)',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0F172A',
                outline: 'none',
                background: '#FFFFFF',
              }}
            />
          </div>

          {/* Filtro por Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | EstadoEstacionamiento)}
            style={{
              padding: '0.55rem 0.85rem',
              border: '1px solid var(--border-subtle, #CBD5E1)',
              borderRadius: '6px',
              fontSize: '0.85rem',
              color: '#0F172A',
              background: '#FFFFFF',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobados / Activos</option>
            <option value="RECHAZADO">Rechazados</option>
            <option value="INHABILITADO">Inhabilitados</option>
          </select>
        </div>

        {/* Contador */}
        <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
          Total: <strong style={{ color: '#0F172A' }}>{filtered.length}</strong> estacionamiento(s)
        </div>
      </div>

      {/* Contenido: Tabla o Estado Vacío */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#006D36' }}></i>
          <p style={{ margin: '0.75rem 0 0 0', fontWeight: 600, color: '#475569' }}>
            Cargando listado de estacionamientos...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: '#006D36',
              fontSize: '1.75rem',
            }}
          >
            <i className="fa-solid fa-square-parking"></i>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
            No se encontraron estacionamientos
          </h3>
          <p style={{ margin: '0.35rem 0 1.25rem 0', fontSize: '0.85rem', color: '#64748B' }}>
            Aún no tienes estacionamientos registrados. Utiliza la pestaña de registro para crear tu solicitud.
          </p>
          <button
            type="button"
            onClick={onGoToRegister}
            style={{
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '0.55rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Registrar Nuevo Estacionamiento</span>
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700 }}>Estacionamiento</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Ubicación</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Horarios</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Fotos</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Estado</th>
                <th style={{ padding: '0.75rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #E2E8F0',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          background: '#ECFDF5',
                          color: '#006D36',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}
                      >
                        <i className="fa-solid fa-square-parking"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.nombre}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.direccion}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#475569' }}>
                      {item.latitud.toFixed(4)}, {item.longitud.toFixed(4)}
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: '0.35rem', color: '#006D36' }}></i>
                      {item.horarios.length} día(s) configurado(s)
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                      <i className="fa-solid fa-camera" style={{ marginRight: '0.35rem', color: '#0284C7' }}></i>
                      {item.fotos.length} foto(s)
                    </div>
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <EstadoBadge estado={item.estado} />
                  </td>

                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onViewEstacionamiento(item)}
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#006D36';
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.borderColor = '#006D36';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.color = '#0F172A';
                        e.currentTarget.style.borderColor = '#CBD5E1';
                      }}
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span>Ver Ficha Técnica</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
