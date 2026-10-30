import React from 'react';

export type VehicleCategory = 'AUTOMOVIL' | 'CAMIONETA_SUV' | 'MOTOCICLETA';

interface HostStepEspacioTarifasProps {
  vehiculoPermitido: VehicleCategory;
  setVehiculoPermitido: (cat: VehicleCategory) => void;
  esTechado: boolean;
  setEsTechado: (techado: boolean) => void;
  tarifaHora: number;
  setTarifaHora: (tarifa: number) => void;
  observacionesEspacio: string;
  setObservacionesEspacio: (obs: string) => void;
  disabled?: boolean;
}

export const HostStepEspacioTarifas: React.FC<HostStepEspacioTarifasProps> = ({
  vehiculoPermitido,
  setVehiculoPermitido,
  esTechado,
  setEsTechado,
  tarifaHora,
  setTarifaHora,
  observacionesEspacio,
  setObservacionesEspacio,
  disabled = false,
}) => {
  return (
    <div className="host-step-content">
      <div className="host-c2c-callout">
        <div className="host-c2c-callout-icon">
          <i className="fa-solid fa-car-side"></i>
        </div>
        <div className="host-c2c-callout-text">
          <h4>Configuración de tu Plaza Única</h4>
          <p>
            Como Anfitrión Residencial dispones de <strong>1 espacio individual</strong>. Selecciona qué tipo de
            vehículo cabe cómodamente en tu cochera y define tu tarifa por hora.
          </p>
        </div>
      </div>

      <div className="host-wizard-field">
        <label>
          Tipo de Vehículo Adecuado <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <div className="host-vehicle-grid">
          <div
            className={`host-vehicle-card ${vehiculoPermitido === 'AUTOMOVIL' ? 'selected' : ''}`}
            onClick={() => !disabled && setVehiculoPermitido('AUTOMOVIL')}
          >
            <div className="host-vehicle-icon">
              <i className="fa-solid fa-car"></i>
            </div>
            <div className="host-vehicle-name">Automóvil / Sedán</div>
          </div>

          <div
            className={`host-vehicle-card ${vehiculoPermitido === 'CAMIONETA_SUV' ? 'selected' : ''}`}
            onClick={() => !disabled && setVehiculoPermitido('CAMIONETA_SUV')}
          >
            <div className="host-vehicle-icon">
              <i className="fa-solid fa-truck-pickup"></i>
            </div>
            <div className="host-vehicle-name">Camioneta / SUV</div>
          </div>

          <div
            className={`host-vehicle-card ${vehiculoPermitido === 'MOTOCICLETA' ? 'selected' : ''}`}
            onClick={() => !disabled && setVehiculoPermitido('MOTOCICLETA')}
          >
            <div className="host-vehicle-icon">
              <i className="fa-solid fa-motorcycle"></i>
            </div>
            <div className="host-vehicle-name">Motocicleta</div>
          </div>
        </div>
      </div>

      <div className="host-wizard-field" style={{ marginTop: '1.25rem' }}>
        <label>Condición del Espacio</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="radio"
              name="techo"
              checked={esTechado}
              onChange={() => setEsTechado(true)}
              disabled={disabled}
            />
            <span>Techado / Garaje cerrado</span>
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="radio"
              name="techo"
              checked={!esTechado}
              onChange={() => setEsTechado(false)}
              disabled={disabled}
            />
            <span>Al aire libre / Patio delantero</span>
          </label>
        </div>
      </div>

      <div className="host-wizard-field" style={{ marginTop: '1.25rem' }}>
        <label htmlFor="host-tarifa">
          Tarifa por Hora sugerida (Bs.) <span style={{ color: '#DC2626' }}>*</span>
        </label>
        <div style={{ position: 'relative', maxWidth: '220px' }}>
          <input
            id="host-tarifa"
            type="number"
            min="1"
            step="0.5"
            className="host-wizard-input"
            value={tarifaHora}
            onChange={(e) => setTarifaHora(parseFloat(e.target.value) || 0)}
            disabled={disabled}
            style={{ paddingLeft: '2.5rem' }}
          />
          <span
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontWeight: 800,
              color: '#006D36',
              fontSize: '0.9rem',
            }}
          >
            Bs.
          </span>
        </div>
        <div className="host-wizard-help">
          El precio promedio residencial en la zona suele rondar entre 5 y 10 Bs./hora.
        </div>
      </div>

      <div className="host-wizard-field" style={{ marginTop: '1.25rem' }}>
        <label htmlFor="host-obs">Notas o Dimensiones del Espacio (Opcional)</label>
        <textarea
          id="host-obs"
          rows={3}
          className="host-wizard-input"
          placeholder="Ej: Ancho del portón 2.40m, apto para autos de hasta 4.5m de largo. Piso de cemento."
          value={observacionesEspacio}
          onChange={(e) => setObservacionesEspacio(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
