import React from 'react';
import {
  EstacionamientoLocationPicker,
  type LocationCoordinates,
} from '../../../estacionamientos/presentation/components/EstacionamientoLocationPicker';
import { FotosUploader } from '../../../estacionamientos/presentation/components/FotosUploader';

interface HostStepUbicacionProps {
  nombre: string;
  setNombre: (val: string) => void;
  direccion: string;
  setDireccion: (val: string) => void;
  coordinates: LocationCoordinates | null;
  setCoordinates: (coords: LocationCoordinates | null) => void;
  fotos: File[];
  setFotos: (fotos: File[]) => void;
  disabled?: boolean;
  isResolvingAddress?: boolean;
  isDetectingInitialLocation?: boolean;
}

export const HostStepUbicacion: React.FC<HostStepUbicacionProps> = ({
  nombre,
  setNombre,
  direccion,
  setDireccion,
  coordinates,
  setCoordinates,
  fotos,
  setFotos,
  disabled = false,
  isResolvingAddress = false,
  isDetectingInitialLocation = false,
}) => {
  return (
    <div className="host-step-content">
      <div className="host-c2c-callout">
        <div className="host-c2c-callout-icon">
          <i className="fa-solid fa-house-chimney"></i>
        </div>
        <div className="host-c2c-callout-text">
          <h4>¿Dónde se encuentra tu espacio?</h4>
          <p>
            Ingresa un nombre claro para que los conductores identifiquen tu cochera familiar o espacio disponible,
            y ubica con exactitud el punto en el mapa interactivo.
          </p>
        </div>
      </div>

      <div className="host-wizard-grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="host-wizard-field" style={{ marginBottom: 0 }}>
          <label htmlFor="host-nombre">
            Nombre de tu Cochera / Espacio <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <input
            id="host-nombre"
            type="text"
            className="host-wizard-input"
            placeholder="Ej: Cochera Familiar América, Garaje Don Pedro"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={disabled}
          />
          <div className="host-wizard-help">
            Un nombre amigable y descriptivo que verán los conductores al buscar estacionamiento.
          </div>
        </div>

        <div className="host-wizard-field" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <label htmlFor="host-direccion">
              Dirección y Referencias <span style={{ color: '#DC2626' }}>*</span>
            </label>
            {isResolvingAddress && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#006D36',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  marginBottom: '0.35rem',
                }}
              >
                <i className="fa-solid fa-spinner fa-spin"></i>
                Autocompletando...
              </span>
            )}
          </div>
          <input
            id="host-direccion"
            type="text"
            className="host-wizard-input"
            placeholder="Ej: Calle Colombia #450, casi esq. 25 de Mayo (portón café)"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            disabled={disabled}
          />
          <div className="host-wizard-help">
            Se autocompleta al fijar el pin en el mapa; puedes añadir referencias desde la acera.
          </div>
        </div>
      </div>

      <div className="host-wizard-split-grid">
        <div className="host-section-box">
          <div className="host-wizard-field" style={{ marginBottom: 0 }}>
            <label>
              Ubicación en el Mapa <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div className="host-wizard-help" style={{ marginBottom: '0.6rem' }}>
              Arrastra el pin al punto exacto donde se encuentra la entrada vehicular de tu domicilio.
            </div>
            <EstacionamientoLocationPicker
              coordinates={coordinates}
              onChangeCoordinates={setCoordinates}
              disabled={disabled}
              isResolvingAddress={isResolvingAddress}
              isDetectingInitialLocation={isDetectingInitialLocation}
            />
          </div>
        </div>

        <div className="host-section-box">
          <div className="host-wizard-field" style={{ marginBottom: 0 }}>
            <label>Fotos del Garaje o Entrada</label>
            <div className="host-wizard-help" style={{ marginBottom: '0.6rem' }}>
              Sube fotos reales del espacio libre y del portón para que el conductor reconozca tu casa con facilidad.
            </div>
            <FotosUploader fotos={fotos} onChange={setFotos} disabled={disabled} />
          </div>
        </div>
      </div>
    </div>
  );
};
