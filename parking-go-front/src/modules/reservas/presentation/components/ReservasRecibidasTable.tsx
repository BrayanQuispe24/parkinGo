// src/modules/reservas/presentation/components/ReservasRecibidasTable.tsx
import React, { useMemo, useState } from 'react';
import type { BoletaReserva, EstadoReserva, DetalleBoletaEspacio } from '../../../driver/domain/DriverBooking';
import { TableSkeletonRows } from '../../../estacionamientos/presentation/components/TableSkeletonRows';

interface ReservasRecibidasTableProps {
  reservas: BoletaReserva[];
  loading?: boolean;
  onCobrarEfectivo: (reserva: BoletaReserva) => void;
  onViewDetalle?: (reserva: BoletaReserva) => void;
}

export const ReservasRecibidasTable: React.FC<ReservasRecibidasTableProps> = ({
  reservas,
  loading = false,
  onCobrarEfectivo,
  onViewDetalle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | EstadoReserva>('ALL');

  const filtered = useMemo(() => {
    return reservas.filter((r) => {
      const matchSearch =
        !searchTerm.trim() ||
        r.codigoReserva.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.detalles.some(
          (d: DetalleBoletaEspacio) =>
            d.codigoEspacio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (d.vehiculoPlaca && d.vehiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase())),
        );

      const matchStatus = statusFilter === 'ALL' || r.estado === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reservas, searchTerm, statusFilter]);

  // Contadores y métricas financieras en tiempo real
  const kpis = useMemo(() => {
    const pendientesPago = reservas.filter((r) => r.estado === 'PENDIENTE_PAGO');
    const confirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA' || r.estado === 'EN_CURSO');
    const completadas = reservas.filter((r) => r.estado === 'COMPLETADA');

    const totalPorCobrar = pendientesPago.reduce((acc, r) => acc + r.total, 0);
    const totalRecaudado = [...confirmadas, ...completadas].reduce((acc, r) => acc + r.total, 0);

    return {
      totalCount: reservas.length,
      pendientesCount: pendientesPago.length,
      confirmadasCount: confirmadas.length,
      completadasCount: completadas.length,
      totalPorCobrar,
      totalRecaudado,
    };
  }, [reservas]);

  const getStatusBadge = (estado: EstadoReserva, metodoPago?: string) => {
    switch (estado) {
      case 'PENDIENTE_PAGO':
        return (
          <span
            style={{
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FCD34D',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-clock"></i> Pendiente de Pago
          </span>
        );
      case 'CONFIRMADA':
        return (
          <span
            style={{
              background: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #86EFAC',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-circle-check"></i> {metodoPago === 'QR' ? 'Pagado vía QR' : 'Efectivo Cobrado'}
          </span>
        );
      case 'EN_CURSO':
        return (
          <span
            style={{
              background: '#E0F2FE',
              color: '#0369A1',
              border: '1px solid #7DD3FC',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-car-side"></i> Vehículo en Cochera
          </span>
        );
      case 'COMPLETADA':
        return (
          <span
            style={{
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            Completada
          </span>
        );
      case 'CANCELADA':
        return (
          <span
            style={{
              background: '#FEF2F2',
              color: '#B91C1C',
              border: '1px solid #FECACA',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            Cancelada
          </span>
        );
      default:
        return <span>{estado}</span>;
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Métricas Financieras (KPI Cards) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* KPI: Por Cobrar en Efectivo */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #FCD34D',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase' }}>
              Por Cobrar en Garita
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A' }}>
              Bs. {kpis.totalPorCobrar.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              {kpis.pendientesCount} reserva(s) pendientes
            </div>
          </div>
        </div>

        {/* KPI: Total Recaudado */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #86EFAC',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
              Total Cobrado
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#006D36' }}>
              Bs. {kpis.totalRecaudado.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Efectivo en mano + pagos QR
            </div>
          </div>
        </div>

        {/* KPI: Activas en Cochera */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle, #CBD5CE)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#E0F2FE',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-square-parking"></i>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>
              Plazas Confirmadas
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0F172A' }}>
              {kpis.confirmadasCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
              De {kpis.totalCount} reservas registradas
            </div>
          </div>
        </div>
      </div>

      {/* 2. Contenedor de Tabla con Toolbar */}
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
              onClick={() => setStatusFilter('ALL')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: statusFilter === 'ALL' ? '1px solid #006D36' : '1px solid #CBD5E1',
                background: statusFilter === 'ALL' ? '#006D36' : '#FFFFFF',
                color: statusFilter === 'ALL' ? '#FFFFFF' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Todos ({kpis.totalCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('PENDIENTE_PAGO')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: statusFilter === 'PENDIENTE_PAGO' ? '1px solid #D97706' : '1px solid #CBD5E1',
                background: statusFilter === 'PENDIENTE_PAGO' ? '#D97706' : '#FFFFFF',
                color: statusFilter === 'PENDIENTE_PAGO' ? '#FFFFFF' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Pendientes de Cobro</span>
              {kpis.pendientesCount > 0 && (
                <span
                  style={{
                    background: statusFilter === 'PENDIENTE_PAGO' ? '#FFFFFF' : '#F59E0B',
                    color: statusFilter === 'PENDIENTE_PAGO' ? '#92400E' : '#FFFFFF',
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {kpis.pendientesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('CONFIRMADA')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: statusFilter === 'CONFIRMADA' ? '1px solid #006D36' : '1px solid #CBD5E1',
                background: statusFilter === 'CONFIRMADA' ? '#006D36' : '#FFFFFF',
                color: statusFilter === 'CONFIRMADA' ? '#FFFFFF' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Confirmadas ({kpis.confirmadasCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('COMPLETADA')}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                border: statusFilter === 'COMPLETADA' ? '1px solid #006D36' : '1px solid #CBD5E1',
                background: statusFilter === 'COMPLETADA' ? '#006D36' : '#FFFFFF',
                color: statusFilter === 'COMPLETADA' ? '#FFFFFF' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Completadas ({kpis.completadasCount})
            </button>
          </div>

          {/* Campo de Búsqueda */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem' }}
            ></i>
            <input
              type="text"
              placeholder="Buscar por boleta, conductor, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Tabla Enterprise */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Boleta / Fecha</th>
                <th style={{ padding: '0.75rem 1rem' }}>Conductor</th>
                <th style={{ padding: '0.75rem 1rem' }}>Vehículo / Espacio</th>
                <th style={{ padding: '0.75rem 1rem' }}>Método / Total</th>
                <th style={{ padding: '0.75rem 1rem' }}>Estado</th>
                <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Cobro & Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows rowsCount={3} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748B' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                    <h4 style={{ margin: 0, color: '#334155', fontWeight: 700 }}>
                      No se encontraron reservas
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>
                      {searchTerm
                        ? 'No existen boletas que coincidan con el término de búsqueda.'
                        : 'Aún no se registran reservas en este estado.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((reserva) => {
                  const primerDetalle = reserva.detalles[0];
                  const esEfectivo = reserva.metodoPago === 'EFECTIVO' || !reserva.metodoPago;
                  const esPendiente = reserva.estado === 'PENDIENTE_PAGO';

                  return (
                    <tr
                      key={reserva.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* 1. Boleta / Fecha */}
                      <td style={{ padding: '0.9rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#006D36', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {reserva.codigoReserva}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {new Date(reserva.fechaCreacion).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </td>

                      {/* 2. Conductor */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{reserva.clienteNombre}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {reserva.clienteTelefono || reserva.clienteEmail}
                        </div>
                      </td>

                      {/* 3. Vehículo / Espacio */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                          {primerDetalle?.vehiculoPlaca ? (
                            <span
                              style={{
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                borderRadius: '4px',
                                padding: '0.1rem 0.35rem',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                color: '#1E293B',
                              }}
                            >
                              {primerDetalle.vehiculoPlaca}
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Sin placa</span>
                          )}
                          <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {primerDetalle?.vehiculoModelo}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#006D36', fontWeight: 600 }}>
                          <i className="fa-solid fa-square-parking" style={{ marginRight: '0.25rem' }}></i>
                          Plaza {primerDetalle?.codigoEspacio || 'General'}
                        </div>
                      </td>

                      {/* 4. Método / Total */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                          Bs. {reserva.total.toFixed(2)}
                        </div>
                        <div style={{ marginTop: '0.2rem' }}>
                          {reserva.metodoPago === 'QR' ? (
                            <span
                              style={{
                                background: '#EFF6FF',
                                color: '#2563EB',
                                border: '1px solid #BFDBFE',
                                borderRadius: '4px',
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                              }}
                            >
                              <i className="fa-solid fa-qrcode" style={{ marginRight: '0.25rem' }}></i> QR Digital
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FDE68A',
                                borderRadius: '4px',
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                              }}
                            >
                              <i className="fa-solid fa-money-bill-wave" style={{ marginRight: '0.25rem' }}></i> Efectivo en Garita
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Estado */}
                      <td style={{ padding: '0.9rem 1rem' }}>
                        {getStatusBadge(reserva.estado, reserva.metodoPago)}
                      </td>

                      {/* 6. Cobro & Acciones */}
                      <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {esPendiente ? (
                            esEfectivo ? (
                              <button
                                type="button"
                                onClick={() => onCobrarEfectivo(reserva)}
                                style={{
                                  background: '#006D36',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '0.45rem 0.85rem',
                                  fontSize: '0.8rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  boxShadow: '0 2px 4px rgba(0, 109, 54, 0.25)',
                                  transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#00562B')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = '#006D36')}
                              >
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                                <span>Cobrar Bs. {reserva.total.toFixed(2)}</span>
                              </button>
                            ) : (
                              <span
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#2563EB',
                                  fontWeight: 700,
                                  background: '#EFF6FF',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '6px',
                                  border: '1px solid #BFDBFE',
                                }}
                              >
                                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.3rem' }}></i>
                                Esperando Pago QR
                              </span>
                            )
                          ) : (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: '#15803D',
                                fontWeight: 700,
                                background: '#DCFCE7',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                border: '1px solid #86EFAC',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                              }}
                            >
                              <i className="fa-solid fa-circle-check"></i>
                              {reserva.metodoPago === 'QR' ? 'Pagado con QR' : 'Cobro Asentado'}
                            </span>
                          )}

                          {onViewDetalle && (
                            <button
                              type="button"
                              onClick={() => onViewDetalle(reserva)}
                              title="Ver Ficha de Reserva"
                              style={{
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                borderRadius: '6px',
                                padding: '0.45rem 0.65rem',
                                fontSize: '0.8rem',
                                color: '#334155',
                                cursor: 'pointer',
                              }}
                            >
                              <i className="fa-solid fa-eye"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
