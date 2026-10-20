import React, { useState, useEffect } from 'react';
import type {
  HorarioItemPayload,
  RegistrarEstacionamientoPayload,
} from '../../domain/Estacionamiento';
import { useTenantsQuery, useTenantHorariosQuery } from '../../../tenants/application/useTenantsQuery';
import { HorariosSemanaPicker } from './HorariosSemanaPicker';
import { FotosUploader } from './FotosUploader';
import {
  EstacionamientoLocationPicker,
  type LocationCoordinates,
} from './EstacionamientoLocationPicker';
import { showToast } from '../../../../core/utils/toastr';
import { useAuthStore } from '../../../../store/useAuthStore';

interface FormularioEstacionamientoProps {
  onSubmit: (payload: RegistrarEstacionamientoPayload) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const DEFAULT_HORARIOS: HorarioItemPayload[] = [
  { dia: 'LUNES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'MARTES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'MIERCOLES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'JUEVES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'VIERNES', horaInicio: '08:00', horaCierre: '20:00' },
  { dia: 'SABADO', horaInicio: '08:00', horaCierre: '14:00' },
];

export const FormularioEstacionamiento: React.FC<FormularioEstacionamientoProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [latitud, setLatitud] = useState<string>('-17.3935');
  const [longitud, setLongitud] = useState<string>('-66.1570');
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>({
    lat: -17.3935,
    lng: -66.157,
  });

  const { user } = useAuthStore();
  const { data: tenants = [], isLoading: isLoadingTenants } = useTenantsQuery();
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');

  const selectedTenant = tenants.find((t) => t.id === selectedTenantId);

  useEffect(() => {
    if (tenants.length > 0 && !selectedTenantId) {
      setSelectedTenantId(tenants[0].id);
    }
  }, [tenants, selectedTenantId]);

  const {
    data: tenantHorarios,
    isLoading: isLoadingTenantHorarios,
  } = useTenantHorariosQuery(selectedTenantId);

  const [horarios, setHorarios] = useState<HorarioItemPayload[]>(DEFAULT_HORARIOS);

  // Sincronizar reactivamente los horarios cuando se selecciona un tenant que ya tiene horarios establecidos
  useEffect(() => {
    if (tenantHorarios && tenantHorarios.length > 0) {
      setHorarios(tenantHorarios);
    }
  }, [tenantHorarios]);

  const [fotos, setFotos] = useState<File[]>([]);

  const handleCoordinatesChange = (coords: LocationCoordinates | null) => {
    setCoordinates(coords);
    if (coords) {
      setLatitud(coords.lat.toString());
      setLongitud(coords.lng.toString());
    } else {
      setLatitud('');
      setLongitud('');
    }
  };

  const handleLatitudChange = (val: string) => {
    setLatitud(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setCoordinates((prev) => ({
        lat: parsed,
        lng: prev?.lng ?? -66.157,
      }));
    }
  };

  const handleLongitudChange = (val: string) => {
    setLongitud(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) {
      setCoordinates((prev) => ({
        lat: prev?.lat ?? -17.3935,
        lng: parsed,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim()) {
      showToast.warning('El nombre comercial del estacionamiento es obligatorio (*).', 'Campo Requerido');
      return;
    }
    if (!direccion.trim()) {
      showToast.warning('La dirección física es obligatoria (*).', 'Campo Requerido');
      return;
    }

    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);

    if (isNaN(lat) || isNaN(lng)) {
      showToast.warning('Por favor fija las coordenadas geográficas válidas en el mapa o campos numéricos.', 'Ubicación Requerida');
      return;
    }

    if (horarios.length === 0) {
      showToast.warning('Debes configurar el horario de atención para al menos un día (*).', 'Horarios Requeridos');
      return;
    }

    onSubmit({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      latitud: lat,
      longitud: lng,
      horarios,
      fotos,
      tenantId: selectedTenantId || undefined,
    });
  };

  return (
    <div className="tenant-form-panel">
      {/* Header del Formulario */}
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
            <i className="fa-solid fa-square-parking"></i>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
              Registrar Solicitud de Estacionamiento
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
              Completa los datos de tu parqueo. Al enviar, la solicitud quedará en estado{' '}
              <strong style={{ color: '#006D36' }}>PENDIENTE</strong> para revisión por el Administrador General.
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: '1.2rem',
              cursor: 'pointer',
              flexShrink: 0,
              padding: '0.25rem',
            }}
            title="Cerrar formulario"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="tenant-form-body">
        {/* Info Banner */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            padding: '0.85rem 1.15rem',
            fontSize: '0.82rem',
            color: '#166534',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}
        >
          <i className="fa-solid fa-circle-info" style={{ marginTop: '2px', color: '#006D36' }}></i>
          <div>
            <strong>Restricción Multi-Tenant:</strong> Solo se permite el registro de 1 estacionamiento por empresa/tenant. Asegúrate de ingresar las fotos y horarios reales para su pronta aprobación.
          </div>
        </div>

        {/* Resumen del Solicitante y Empresa Responsable */}
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1rem 1.15rem',
            marginBottom: '1.35rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#006D36',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <i className="fa-solid fa-id-badge"></i>
            <span>Información del Solicitante y Empresa</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Usuario Solicitante */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.75rem 0.95rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  color: '#006D36',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: 1.45, minWidth: 0, flex: 1 }}>
                <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Usuario Solicitante (En Sesión)
                </div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                  {user?.fullname || `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'Usuario Solicitante'}
                </div>
                <div style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <i className="fa-solid fa-envelope" style={{ fontSize: '0.72rem', color: '#94A3B8' }}></i>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email || 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#64748B' }}>
                  {user?.phone && (
                    <span>
                      <i className="fa-solid fa-phone" style={{ marginRight: '0.25rem', color: '#94A3B8' }}></i>
                      {user.phone}
                    </span>
                  )}
                  {user?.ci && (
                    <span>
                      <i className="fa-solid fa-id-card" style={{ marginRight: '0.25rem', color: '#94A3B8' }}></i>
                      CI: {user.ci}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tenant / Empresa */}
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.75rem 0.95rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  background: '#E0E7FF',
                  color: '#4338CA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <i className="fa-solid fa-building"></i>
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: 1.45, minWidth: 0, flex: 1 }}>
                <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  Empresa / Tenant Registrante
                </div>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                  {selectedTenant?.nombre || (isLoadingTenants ? 'Cargando...' : 'Ninguna empresa')}
                </div>
                {selectedTenant ? (
                  <>
                    <div style={{ color: '#475569', marginTop: '0.2rem' }}>
                      <strong>NIT:</strong> {selectedTenant.nit}
                      {selectedTenant.razonSocial && (
                        <span style={{ color: '#64748B' }}> &bull; {selectedTenant.razonSocial}</span>
                      )}
                    </div>
                    {selectedTenant.direccion && (
                      <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                        <i className="fa-solid fa-location-dot" style={{ marginRight: '0.25rem', color: '#94A3B8' }}></i>
                        {selectedTenant.direccion}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    Selecciona una empresa en el desplegable inferior
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Tenant / Empresa Vinculada */}
        <div style={{ marginBottom: '1.35rem' }}>
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
            <i className="fa-solid fa-building-circle-check" style={{ color: '#006D36' }}></i>
            <span>
              Empresa / Tenant Vinculado <span style={{ color: '#DC2626' }}>*</span>
            </span>
          </label>

          {isLoadingTenants ? (
            <div
              style={{
                fontSize: '0.82rem',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.85rem',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
              }}
            >
              <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36' }}></i>
              <span>Cargando tus empresas registradas...</span>
            </div>
          ) : tenants.length === 0 ? (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '6px',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                color: '#B45309',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1rem', flexShrink: 0 }}></i>
              <div>
                <strong>Aviso:</strong> Aún no cuentas con empresas registradas. Al enviar la solicitud, el sistema
                creará un Tenant automáticamente con los datos comerciales ingresados abajo.
              </div>
            </div>
          ) : (
            <div>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedTenantId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTenantId(e.target.value)}
                  disabled={isLoading}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.6rem 2.2rem 0.6rem 0.85rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
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
                    fontSize: '0.85rem',
                  }}
                >
                  <i className="fa-solid fa-chevron-down"></i>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.3rem', display: 'block' }}>
                El estacionamiento operará y emitirá comprobantes bajo la razón social del tenant seleccionado.
              </span>
            </div>
          )}
        </div>

        {/* Campos Principales */}
        <div className="tenant-form-grid" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Nombre Comercial del Estacionamiento <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
              placeholder="Ej. Estacionamiento Central San Martín"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.55rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Dirección Completa <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDireccion(e.target.value)}
              placeholder="Ej. Calle Jordán #234 entre Ayacucho y Junín"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.55rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Coordenadas Numéricas */}
        <div className="tenant-form-grid" style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Latitud Geográfica <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={latitud}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLatitudChange(e.target.value)}
              placeholder="-17.3935"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.55rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Longitud Geográfica <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={longitud}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLongitudChange(e.target.value)}
              placeholder="-66.1570"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '0.55rem 0.85rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '0.85rem',
                color: '#0F172A',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Geolocalización Interactiva Leaflet con GPS */}
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
            Ubicación en Mapa & GPS <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <EstacionamientoLocationPicker
            coordinates={coordinates}
            onChangeCoordinates={handleCoordinatesChange}
            disabled={isLoading}
          />
        </div>

        {/* Horarios de Atención por Día */}
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Horarios de Atención por Día <span style={{ color: '#DC2626' }}>*</span>
            </label>
            {selectedTenantId && (
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '4px',
                  background: tenantHorarios && tenantHorarios.length > 0 ? '#DCFCE7' : '#F1F5F9',
                  color: tenantHorarios && tenantHorarios.length > 0 ? '#166534' : '#475569',
                  border: tenantHorarios && tenantHorarios.length > 0 ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <i className={`fa-solid ${tenantHorarios && tenantHorarios.length > 0 ? 'fa-building-circle-check' : 'fa-circle-info'}`}></i>
                <span>
                  {isLoadingTenantHorarios
                    ? 'Cargando horarios de la empresa...'
                    : tenantHorarios && tenantHorarios.length > 0
                    ? `Horarios establecidos por ${tenants.find((t) => t.id === selectedTenantId)?.nombre || 'la empresa'}`
                    : 'Sin horarios previos para esta empresa'}
                </span>
              </span>
            )}
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748B' }}>
            Se muestran los horarios relacionados con la empresa seleccionada. Puedes habilitar o ajustar los horarios de apertura y cierre para este parqueo.
          </p>

          {isLoadingTenantHorarios ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36', marginRight: '0.5rem' }}></i>
              Sincronizando horarios con la empresa...
            </div>
          ) : (
            <HorariosSemanaPicker
              horarios={horarios}
              onChange={setHorarios}
              disabled={isLoading}
            />
          )}
        </div>

        {/* Fotografías */}
        <div style={{ marginBottom: '1.5rem', width: '100%' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
            Fotografías del Estacionamiento
          </label>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748B' }}>
            Sube fotos claras de la fachada, entrada y plazas interiores para agilizar la aprobación.
          </p>
          <FotosUploader
            fotos={fotos}
            onChange={setFotos}
            disabled={isLoading}
          />
        </div>

        {/* Acciones */}
        <div className="tenant-form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              style={{
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '0.5rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#475569',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: '#006D36',
              border: 'none',
              borderRadius: '6px',
              padding: '0.55rem 1.5rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Enviando Solicitud...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                <span>Enviar Solicitud de Registro</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
