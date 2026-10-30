import React from 'react';
import type { HorarioItemPayload } from '../../../estacionamientos/domain/Estacionamiento';
import { HorariosSemanaPicker } from '../../../estacionamientos/presentation/components/HorariosSemanaPicker';
import type { VehicleCategory } from './HostStepEspacioTarifas';

interface HostStepReglasAccesoProps {
  horarios: HorarioItemPayload[];
  setHorarios: (horarios: HorarioItemPayload[]) => void;
  instruccionesAcceso: string;
  setInstruccionesAcceso: (val: string) => void;
  // Datos para el resumen final
  resumen: {
    nombre: string;
    direccion: string;
    vehiculoPermitido: VehicleCategory;
    tarifaHora: number;
    esTechado: boolean;
    fotosCount: number;
  };
  disabled?: boolean;
}

export const HostStepReglasAcceso: React.FC<HostStepReglasAccesoProps> = ({
  horarios,
  setHorarios,
  instruccionesAcceso,
  setInstruccionesAcceso,
  resumen,
  disabled = false,
}) => {
  return (
    <div className="host-step-content">
      <div className="host-c2c-callout">
        <div className="host-c2c-callout-icon">
          <i className="fa-solid fa-clock"></i>
        </div>
        <div className="host-c2c-callout-text">
          <h4>Días, Horarios y Acceso a tu Domicilio</h4>
          <p>
            Define en qué días y horas tu cochera está desocupada para recibir reservas.
            También puedes indicar instrucciones breves para abrir el portón o tocar el timbre.
          </p>
        </div>
      </div>

      <div className="host-wizard-field">
        <label>
          Horario de Disponibilidad Semanal <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <div className="host-wizard-help" style={{ marginBottom: '0.6rem' }}>
          Activa los días en los que tu cochera está libre para alquiler.
        </div>
        <HorariosSemanaPicker horarios={horarios} onChange={setHorarios} disabled={disabled} />
      </div>

      <div className="host-wizard-field" style={{ marginTop: '1.5rem' }}>
        <label htmlFor="host-acceso">Instrucciones de Llegada / Acceso</label>
        <textarea
          id="host-acceso"
          rows={3}
          className="host-wizard-input"
          placeholder="Ej: Tocar el timbre blanco en la reja. Si no respondo de inmediato, llamar al teléfono registrado. El portón es corredizo manual."
          value={instruccionesAcceso}
          onChange={(e) => setInstruccionesAcceso(e.target.value)}
          disabled={disabled}
        />
        <div className="host-wizard-help">
          Estas instrucciones se mostrarán al conductor una vez confirmada su reserva.
        </div>
      </div>

      {/* Resumen del Aprovisionamiento Atómico */}
      <div
        style={{
          marginTop: '1.75rem',
          padding: '1.25rem',
          background: '#F8FAFC',
          border: '1.5px dashed #CBD5E1',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#006D36', fontSize: '1.1rem' }}></i>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>
            Resumen de tu Espacio Anfitrión
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Nombre</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>{resumen.nombre || 'Sin definir'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Dirección</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>{resumen.direccion || 'Sin definir'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Vehículo y Tarifa</span>
            <strong style={{ fontSize: '0.85rem', color: '#006D36' }}>
              {resumen.vehiculoPermitido} · {resumen.tarifaHora} Bs./hr
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>Estructura C2C</span>
            <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>
              1 Cochera · 1 Nivel · 1 Croquis · 1 Plaza
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
