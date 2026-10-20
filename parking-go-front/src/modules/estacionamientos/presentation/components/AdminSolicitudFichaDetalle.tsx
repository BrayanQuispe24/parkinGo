import React from 'react';
import type { EstacionamientoModel } from '../../domain/Estacionamiento';
import { EstadoBadge } from './EstadoBadge';
import { EstacionamientoMapViewer } from './EstacionamientoMapViewer';
import { GaleriaFotosEnterprise } from './GaleriaFotosEnterprise';

interface AdminSolicitudFichaDetalleProps {
  parqueo: EstacionamientoModel;
  onBackToList: () => void;
  onAprobar: (id: string) => Promise<void>;
  onRechazar: (id: string) => void;
  onInhabilitar: (id: string) => Promise<void>;
  isProcessing?: boolean;
}

export const AdminSolicitudFichaDetalle: React.FC<AdminSolicitudFichaDetalleProps> = ({
  parqueo,
  onBackToList,
  onAprobar,
  onRechazar,
  onInhabilitar,
  isProcessing = false,
}) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${parqueo.latitud},${parqueo.longitud}`;

  return (
    <div style={{ width: '100%' }}>

      {/* Barra de Navegación Superior: Volver y Pestaña Activa */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={onBackToList}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#006D36',
            fontWeight: 700,
            fontSize: '0.86rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#005228';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = '#006D36';
          }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Volver al Listado de Solicitudes</span>
        </button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Estado actual:</span>
          <EstadoBadge estado={parqueo.estado} />
        </div>
      </div>

      {/* Contenedor Principal de la Ficha Técnica */}
      <div
        style={{
          background: 'var(--surface-card, #FFFFFF)',
          borderRadius: '10px',
          border: '1px solid var(--border-subtle, #CBD5CE)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Cabecera de la Ficha */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-subtle, #E2E8F0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            background: '#FAFCFA',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: '#DCFCE7',
                  color: '#006D36',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  flexShrink: 0,
                }}
              >
                <i className="fa-solid fa-square-parking"></i>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  {parqueo.nombre}
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
                  <i className="fa-solid fa-location-dot" style={{ marginRight: '0.35rem', color: '#006D36' }}></i>
                  {parqueo.direccion} &bull; Empresa:{' '}
                  <strong style={{ color: '#0F172A' }}>{parqueo.tenant?.nombre || 'Tenant asignado'}</strong>
                  {parqueo.tenant?.nit && <span> (NIT: {parqueo.tenant.nit})</span>}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Registrado: {new Date(parqueo.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Cuerpo de la Ficha */}
        <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Banner según Estado */}
          {parqueo.estado === 'PENDIENTE' && (
            <div className="banner-alert warning" style={{ margin: 0, padding: '0.95rem 1.25rem' }}>
              <span style={{ fontSize: '1.35rem' }}>⏳</span>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Solicitud Pendiente de Evaluación</strong>
                <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  Esta solicitud de registro está a la espera de resolución. Evalúa la ubicación física en el mapa, los horarios de apertura y las fotografías de la fachada antes de aprobar o rechazar.
                </p>
              </div>
            </div>
          )}

          {parqueo.estado === 'RECHAZADO' && (
            <div className="banner-alert danger" style={{ margin: 0, padding: '0.95rem 1.25rem' }}>
              <span style={{ fontSize: '1.35rem' }}>⚠️</span>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Solicitud Rechazada</strong>
                <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  <strong>Motivo de rechazo:</strong> "{parqueo.motivoRechazo || 'Sin motivo detallado'}"
                </p>
              </div>
            </div>
          )}

          {parqueo.estado === 'APROBADO' && (
            <div className="banner-alert success" style={{ margin: 0, padding: '0.95rem 1.25rem' }}>
              <span style={{ fontSize: '1.35rem' }}>✅</span>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Estacionamiento Aprobado y Operativo</strong>
                <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  Este estacionamiento está habilitado en la red pública de ParkinGo.
                </p>
              </div>
            </div>
          )}

          {parqueo.estado === 'INHABILITADO' && (
            <div className="banner-alert danger" style={{ margin: 0, padding: '0.95rem 1.25rem' }}>
              <span style={{ fontSize: '1.35rem' }}>🚫</span>
              <div style={{ fontSize: '0.85rem' }}>
                <strong>Estacionamiento Inhabilitado Temporalmente</strong>
                <p style={{ margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  Las operaciones de este estacionamiento han sido pausadas en la plataforma.
                </p>
              </div>
            </div>
          )}

          {/* Card de Solicitante y Empresa */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1.15rem 1.25rem',
            }}
          >
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                color: '#006D36',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <i className="fa-solid fa-address-card"></i>
              <span>Identificación del Solicitante y Empresa Responsable</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* Bloque Usuario Solicitante */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    color: '#006D36',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div style={{ fontSize: '0.82rem', lineHeight: 1.45, flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Usuario Solicitante
                  </div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem', marginTop: '0.1rem' }}>
                    {parqueo.tenant?.usuario
                      ? `${parqueo.tenant.usuario.firstName} ${parqueo.tenant.usuario.lastName}`
                      : 'Usuario solicitante'}
                  </div>
                  <div style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <i className="fa-solid fa-envelope" style={{ color: '#94A3B8', fontSize: '0.75rem' }}></i>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {parqueo.tenant?.usuario?.email || 'Correo no disponible'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.3rem', color: '#64748B', fontSize: '0.76rem' }}>
                    {parqueo.tenant?.usuario?.phone && (
                      <span>
                        <i className="fa-solid fa-phone" style={{ color: '#94A3B8', marginRight: '0.25rem' }}></i>
                        {parqueo.tenant.usuario.phone}
                      </span>
                    )}
                    {parqueo.tenant?.usuario?.ci && (
                      <span>
                        <i className="fa-solid fa-id-card" style={{ color: '#94A3B8', marginRight: '0.25rem' }}></i>
                        CI: {parqueo.tenant.usuario.ci}
                      </span>
                    )}
                    {parqueo.tenant?.usuario?.roleName && (
                      <span style={{ background: '#F1F5F9', padding: '0.1rem 0.45rem', borderRadius: '4px', fontWeight: 600 }}>
                        {parqueo.tenant.usuario.roleName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bloque Tenant / Empresa */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: '#E0E7FF',
                    color: '#4338CA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.15rem',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <i className="fa-solid fa-building"></i>
                </div>
                <div style={{ fontSize: '0.82rem', lineHeight: 1.45, flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Empresa / Tenant Registrante
                  </div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem', marginTop: '0.1rem' }}>
                    {parqueo.tenant?.nombre || 'Tenant asignado'}
                  </div>
                  <div style={{ color: '#334155', marginTop: '0.25rem' }}>
                    <strong>NIT:</strong> {parqueo.tenant?.nit || 'N/A'}
                    {parqueo.tenant?.razonSocial && (
                      <span style={{ color: '#64748B' }}> &bull; {parqueo.tenant.razonSocial}</span>
                    )}
                  </div>
                  {(parqueo.tenant?.direccion || parqueo.tenant?.ciudad) && (
                    <div style={{ color: '#64748B', fontSize: '0.76rem', marginTop: '0.25rem' }}>
                      <i className="fa-solid fa-location-dot" style={{ color: '#94A3B8', marginRight: '0.25rem' }}></i>
                      {parqueo.tenant?.direccion}
                      {parqueo.tenant?.ciudad && ` (${parqueo.tenant.ciudad})`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Datos Generales con Acceso a Google Maps */}
          <div className="form-grid-2">
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span className="form-label" style={{ margin: 0 }}>Coordenadas Geográficas</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.78rem',
                    color: '#006D36',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <i className="fa-brands fa-google" style={{ color: '#EA4335' }}></i>
                  <span>Ver en Google Maps</span>
                  <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.68rem' }}></i>
                </a>
              </div>
              <div className="form-input" style={{ background: 'var(--bg-subtle, #F8FAFC)' }}>
                Latitud: {parqueo.latitud} | Longitud: {parqueo.longitud}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label" style={{ marginBottom: '0.3rem' }}>Fecha y Hora de Envío</span>
              <div className="form-input" style={{ background: 'var(--bg-subtle, #F8FAFC)' }}>
                {new Date(parqueo.createdAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Visor de Ubicación en Mapa Embebido */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <h4 className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fa-solid fa-map-location-dot" style={{ color: '#006D36' }}></i>
                <span>Ubicación Geográfica en el Mapa</span>
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Pin interactivo con dirección
              </span>
            </div>
            <EstacionamientoMapViewer
              latitud={parqueo.latitud}
              longitud={parqueo.longitud}
              nombre={parqueo.nombre}
              direccion={parqueo.direccion}
              height="260px"
            />
          </div>

          {/* Horarios de Atención */}
          {parqueo.horarios && parqueo.horarios.length > 0 && (
            <div>
              <h4 className="form-label" style={{ marginBottom: '0.5rem' }}>
                Horarios de Atención Configurados ({parqueo.horarios.length} días)
              </h4>
              <table className="horarios-picker-table">
                <thead>
                  <tr>
                    <th>Día</th>
                    <th>Hora Apertura</th>
                    <th>Hora Cierre</th>
                  </tr>
                </thead>
                <tbody>
                  {parqueo.horarios.map((h) => (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 700, color: '#006D36' }}>{h.dia}</td>
                      <td>{h.horaInicio}</td>
                      <td>{h.horaCierre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fotografías Registradas */}
          <GaleriaFotosEnterprise fotos={parqueo.fotos ?? []} readOnly={true} />
        </div>

        {/* Footer de Acciones del Administrador General */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid var(--border-subtle, #E2E8F0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FAFCFA',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          <button
            type="button"
            className="btn-secondary"
            onClick={onBackToList}
            disabled={isProcessing}
          >
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.4rem' }}></i>
            Volver al Listado
          </button>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {parqueo.estado === 'PENDIENTE' && (
              <>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => onRechazar(parqueo.id)}
                  disabled={isProcessing}
                >
                  <i className="fa-solid fa-xmark" style={{ marginRight: '0.4rem' }}></i>
                  Rechazar Solicitud
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onAprobar(parqueo.id)}
                  disabled={isProcessing}
                >
                  <i className="fa-solid fa-check" style={{ marginRight: '0.4rem' }}></i>
                  Aprobar Parqueo
                </button>
              </>
            )}

            {parqueo.estado === 'APROBADO' && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => onInhabilitar(parqueo.id)}
                disabled={isProcessing}
              >
                <i className="fa-solid fa-ban" style={{ marginRight: '0.4rem' }}></i>
                Inhabilitar Parqueo
              </button>
            )}

            {parqueo.estado === 'INHABILITADO' && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => onAprobar(parqueo.id)}
                disabled={isProcessing}
              >
                <i className="fa-solid fa-rotate-left" style={{ marginRight: '0.4rem' }}></i>
                Reactivar / Aprobar Parqueo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
