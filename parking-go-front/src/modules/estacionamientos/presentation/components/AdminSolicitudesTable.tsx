import React, { useMemo, useState } from 'react';
import type { EstacionamientoModel, EstadoEstacionamiento } from '../../domain/Estacionamiento';
import { EstadoBadge } from './EstadoBadge';

interface AdminSolicitudesTableProps {
  solicitudes: EstacionamientoModel[];
  loading?: boolean;
  onViewSolicitud: (parqueo: EstacionamientoModel) => void;
  statusFilter: EstadoEstacionamiento | 'ALL';
  onChangeStatusFilter: (status: EstadoEstacionamiento | 'ALL') => void;
}

export const AdminSolicitudesTable: React.FC<AdminSolicitudesTableProps> = ({
  solicitudes,
  loading = false,
  onViewSolicitud,
  statusFilter,
  onChangeStatusFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return solicitudes.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.tenant?.nombre && item.tenant.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || item.estado === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [solicitudes, searchTerm, statusFilter]);

  // Contadores para los filtros
  const counts = useMemo(() => {
    return {
      all: solicitudes.length,
      pendiente: solicitudes.filter((s) => s.estado === 'PENDIENTE').length,
      aprobado: solicitudes.filter((s) => s.estado === 'APROBADO').length,
      rechazado: solicitudes.filter((s) => s.estado === 'RECHAZADO').length,
      inhabilitado: solicitudes.filter((s) => s.estado === 'INHABILITADO').length,
    };
  }, [solicitudes]);

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
      {/* Barra de Filtros y Búsqueda */}
      <div
        style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FAFCFA',
        }}
      >
        {/* Pestañas de Filtro Rápido */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onChangeStatusFilter('PENDIENTE')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: statusFilter === 'PENDIENTE' ? '1px solid #006D36' : '1px solid #CBD5E1',
              background: statusFilter === 'PENDIENTE' ? '#006D36' : '#FFFFFF',
              color: statusFilter === 'PENDIENTE' ? '#FFFFFF' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Pendientes</span>
            {counts.pendiente > 0 && (
              <span
                style={{
                  background: statusFilter === 'PENDIENTE' ? '#FFFFFF' : '#F59E0B',
                  color: statusFilter === 'PENDIENTE' ? '#006D36' : '#FFFFFF',
                  borderRadius: '10px',
                  padding: '0.1rem 0.45rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                {counts.pendiente}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onChangeStatusFilter('ALL')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: statusFilter === 'ALL' ? '1px solid #006D36' : '1px solid #CBD5E1',
              background: statusFilter === 'ALL' ? '#006D36' : '#FFFFFF',
              color: statusFilter === 'ALL' ? '#FFFFFF' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Todos ({counts.all})
          </button>

          <button
            type="button"
            onClick={() => onChangeStatusFilter('APROBADO')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: statusFilter === 'APROBADO' ? '1px solid #006D36' : '1px solid #CBD5E1',
              background: statusFilter === 'APROBADO' ? '#006D36' : '#FFFFFF',
              color: statusFilter === 'APROBADO' ? '#FFFFFF' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Aprobados ({counts.aprobado})
          </button>

          <button
            type="button"
            onClick={() => onChangeStatusFilter('RECHAZADO')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: statusFilter === 'RECHAZADO' ? '1px solid #006D36' : '1px solid #CBD5E1',
              background: statusFilter === 'RECHAZADO' ? '#006D36' : '#FFFFFF',
              color: statusFilter === 'RECHAZADO' ? '#FFFFFF' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Rechazados ({counts.rechazado})
          </button>

          <button
            type="button"
            onClick={() => onChangeStatusFilter('INHABILITADO')}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: statusFilter === 'INHABILITADO' ? '1px solid #006D36' : '1px solid #CBD5E1',
              background: statusFilter === 'INHABILITADO' ? '#006D36' : '#FFFFFF',
              color: statusFilter === 'INHABILITADO' ? '#FFFFFF' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Inhabilitados ({counts.inhabilitado})
          </button>
        </div>

        {/* Buscador Integrado */}
        <div style={{ position: 'relative', width: '280px' }}>
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
            placeholder="Buscar por nombre, empresa o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.45rem 0.85rem 0.45rem 2.2rem',
              border: '1px solid var(--border-subtle, #CBD5E1)',
              borderRadius: '6px',
              fontSize: '0.82rem',
              color: '#0F172A',
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>
      </div>

      {/* Tabla Enterprise */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600 }}>
              <th style={{ padding: '0.75rem 1.25rem' }}>Estacionamiento</th>
              <th style={{ padding: '0.75rem 1rem' }}>Empresa (Tenant)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
              <th style={{ padding: '0.75rem 1rem' }}>Fecha Solicitud</th>
              <th style={{ padding: '0.75rem 1rem' }}>Fotos / Horarios</th>
              <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748B' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: '#006D36', marginBottom: '0.5rem' }}></i>
                  <p style={{ margin: 0, fontWeight: 600 }}>Cargando solicitudes...</p>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                  <h4 style={{ margin: 0, color: '#334155', fontWeight: 700 }}>No hay solicitudes encontradas</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>
                    {searchTerm ? 'No se encontraron registros que coincidan con la búsqueda.' : 'No existen solicitudes en este estado.'}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((parqueo) => (
                <tr
                  key={parqueo.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                  onClick={() => onViewSolicitud(parqueo)}
                >
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-square-parking" style={{ color: '#006D36' }}></i>
                      <span>{parqueo.nombre}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      {parqueo.direccion}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>
                      {parqueo.tenant?.nombre || 'Tenant asignado'}
                    </div>
                    {parqueo.tenant?.nit && (
                      <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        NIT: {parqueo.tenant.nit}
                      </div>
                    )}
                    {parqueo.tenant?.usuario && (
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#006D36',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '0.2rem',
                        }}
                      >
                        <i className="fa-solid fa-user-tie" style={{ fontSize: '0.68rem' }}></i>
                        <span>
                          {parqueo.tenant.usuario.firstName} {parqueo.tenant.usuario.lastName}
                        </span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <EstadoBadge estado={parqueo.estado} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#64748B', fontSize: '0.8rem' }}>
                    {new Date(parqueo.createdAt).toLocaleDateString('es-BO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.72rem',
                          color: '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <i className="fa-regular fa-image" style={{ color: '#006D36' }}></i>
                        {parqueo.fotos?.length || 0} fotos
                      </span>
                      <span
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.72rem',
                          color: '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <i className="fa-regular fa-clock" style={{ color: '#006D36' }}></i>
                        {parqueo.horarios?.length || 0} días
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewSolicitud(parqueo);
                      }}
                      style={{
                        background: parqueo.estado === 'PENDIENTE' ? '#006D36' : '#F1F5F9',
                        color: parqueo.estado === 'PENDIENTE' ? '#FFFFFF' : '#006D36',
                        border: parqueo.estado === 'PENDIENTE' ? 'none' : '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <i className="fa-regular fa-eye"></i>
                      <span>{parqueo.estado === 'PENDIENTE' ? 'Evaluar Solicitud' : 'Ver Ficha'}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con Resumen */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-subtle, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: '#64748B',
          background: '#FAFCFA',
        }}
      >
        <span>
          Mostrando <strong>{filtered.length}</strong> de <strong>{solicitudes.length}</strong> solicitudes
        </span>
        <span style={{ fontSize: '0.75rem' }}>
          ParkinGo Enterprise &bull; Control de Solicitudes
        </span>
      </div>
    </div>
  );
};
