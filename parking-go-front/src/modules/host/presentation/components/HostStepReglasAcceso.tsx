import React from 'react';
import type { HorarioItemPayload } from '../../../estacionamientos/domain/Estacionamiento';
import { HorariosSemanaPicker } from '../../../estacionamientos/presentation/components/HorariosSemanaPicker';

interface HostStepReglasAccesoProps {
  horarios: HorarioItemPayload[];
  setHorarios: (horarios: HorarioItemPayload[]) => void;
  // Datos para el resumen final
  resumen: {
    nombre: string;
    direccion: string;
    fotosCount: number;
    horariosCount: number;
  };
  disabled?: boolean;
}

export const HostStepReglasAcceso: React.FC<HostStepReglasAccesoProps> = ({
  horarios,
  setHorarios,
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
          <h4>Días y Horarios de Disponibilidad</h4>
          <p>
            Define en qué días y horas tu cochera está desocupada para recibir reservas.
            Podrás configurar tus precios luego en la sección Esquema de Tarifas.
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

      {/* Resumen del Aprovisionamiento Atómico */}
      <div className="host-summary-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <i className="fa-solid fa-circle-check" style={{ color: '#006D36', fontSize: '1rem' }}></i>
          <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main, #0F172A)' }}>
            Resumen de tu Espacio Anfitrión
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748B)', display: 'block' }}>Nombre</span>
            <strong style={{ fontSize: '0.84rem', color: 'var(--text-main, #1E293B)' }}>{resumen.nombre || 'Sin definir'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748B)', display: 'block' }}>Dirección</span>
            <strong style={{ fontSize: '0.84rem', color: 'var(--text-main, #1E293B)' }}>{resumen.direccion || 'Sin definir'}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748B)', display: 'block' }}>Fotografías</span>
            <strong style={{ fontSize: '0.84rem', color: 'var(--text-main, #1E293B)' }}>
              {resumen.fotosCount} {resumen.fotosCount === 1 ? 'foto adjunta' : 'fotos adjuntas'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748B)', display: 'block' }}>Días Configurados</span>
            <strong style={{ fontSize: '0.84rem', color: '#006D36' }}>
              {resumen.horariosCount} {resumen.horariosCount === 1 ? 'día activo' : 'días activos'}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted, #64748B)', display: 'block' }}>Estructura C2C</span>
            <strong style={{ fontSize: '0.84rem', color: 'var(--text-main, #1E293B)' }}>
              1 Cochera · 1 Nivel · 1 Croquis · 1 Plaza
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
