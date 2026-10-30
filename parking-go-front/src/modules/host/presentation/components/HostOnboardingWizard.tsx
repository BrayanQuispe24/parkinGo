import React, { useState } from 'react';
import type {
  HorarioItemPayload,
  RegistrarEstacionamientoPayload,
} from '../../../estacionamientos/domain/Estacionamiento';
import type { LocationCoordinates } from '../../../estacionamientos/presentation/components/EstacionamientoLocationPicker';
import { HostStepUbicacion } from './HostStepUbicacion';
import { HostStepEspacioTarifas, type VehicleCategory } from './HostStepEspacioTarifas';
import { HostStepReglasAcceso } from './HostStepReglasAcceso';
import { showToast } from '../../../../core/utils/toastr';
import '../styles/host-wizard.css';

interface HostOnboardingWizardProps {
  onSubmit: (payload: RegistrarEstacionamientoPayload) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const DEFAULT_RESIDENTIAL_HORARIOS: HorarioItemPayload[] = [
  { dia: 'LUNES', horaInicio: '08:00', horaCierre: '18:00' },
  { dia: 'MARTES', horaInicio: '08:00', horaCierre: '18:00' },
  { dia: 'MIERCOLES', horaInicio: '08:00', horaCierre: '18:00' },
  { dia: 'JUEVES', horaInicio: '08:00', horaCierre: '18:00' },
  { dia: 'VIERNES', horaInicio: '08:00', horaCierre: '18:00' },
  { dia: 'SABADO', horaInicio: '08:00', horaCierre: '14:00' },
];

export const HostOnboardingWizard: React.FC<HostOnboardingWizardProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Datos Paso 1: Ubicación & Garaje
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [coordinates, setCoordinates] = useState<LocationCoordinates | null>({
    lat: -17.3935,
    lng: -66.157,
  });
  const [fotos, setFotos] = useState<File[]>([]);

  // Datos Paso 2: Espacio & Tarifas
  const [vehiculoPermitido, setVehiculoPermitido] = useState<VehicleCategory>('AUTOMOVIL');
  const [esTechado, setEsTechado] = useState<boolean>(true);
  const [tarifaHora, setTarifaHora] = useState<number>(5);
  const [observacionesEspacio, setObservacionesEspacio] = useState('');

  // Datos Paso 3: Horarios & Acceso
  const [horarios, setHorarios] = useState<HorarioItemPayload[]>(DEFAULT_RESIDENTIAL_HORARIOS);
  const [instruccionesAcceso, setInstruccionesAcceso] = useState('');

  const validateStep1 = (): boolean => {
    if (!nombre.trim()) {
      showToast.warning('Por favor ingresa un nombre para tu cochera.', 'Paso 1');
      return false;
    }
    if (!direccion.trim()) {
      showToast.warning('Por favor ingresa la dirección de tu domicilio.', 'Paso 1');
      return false;
    }
    if (!coordinates) {
      showToast.warning('Por favor selecciona la ubicación en el mapa.', 'Paso 1');
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (tarifaHora <= 0) {
      showToast.warning('Ingresa una tarifa válida por hora (mínimo 1 Bs.).', 'Paso 2');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) setCurrentStep(1);
    if (currentStep === 3) setCurrentStep(2);
  };

  const handleFinalSubmit = () => {
    if (!validateStep1() || !validateStep2()) return;

    if (horarios.length === 0) {
      showToast.warning('Debes habilitar al menos un día de atención con su horario.', 'Paso 3');
      return;
    }

    // Combinar detalles de acceso y características en la dirección o descripción para preservar el valor C2C
    const notasExtras = [
      `[Espacio: ${vehiculoPermitido} - ${esTechado ? 'Techado' : 'Al aire libre'} - Tarifa ref: Bs. ${tarifaHora}/h]`,
      observacionesEspacio ? `Detalles: ${observacionesEspacio}` : '',
      instruccionesAcceso ? `Acceso: ${instruccionesAcceso}` : '',
    ]
      .filter(Boolean)
      .join(' | ');

    const payload: RegistrarEstacionamientoPayload = {
      nombre: nombre.trim(),
      direccion: notasExtras ? `${direccion.trim()} (${notasExtras})` : direccion.trim(),
      latitud: coordinates ? coordinates.lat : -17.3935,
      longitud: coordinates ? coordinates.lng : -66.157,
      horarios,
      fotos,
    };

    onSubmit(payload);
  };

  return (
    <div className="host-wizard-container">
      {/* Header con Stepper Progress */}
      <div className="host-wizard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="host-wizard-badge">
              <i className="fa-solid fa-house-user"></i>
              <span>Alta Residencial · Plan Anfitrión</span>
            </div>
            <h2 className="host-wizard-title">Publica tu Cochera en 3 Pasos</h2>
            <p className="host-wizard-subtitle">
              Generaremos automáticamente la estructura de tu garaje (1 Nivel, 1 Croquis y 1 Plaza Única).
            </p>
          </div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-xmark" style={{ marginRight: '0.35rem' }}></i>
              Cancelar
            </button>
          )}
        </div>

        {/* Stepper Bar */}
        <div className="host-stepper-bar">
          <div className="host-stepper-track">
            <div
              className="host-stepper-progress"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            ></div>
          </div>

          <div
            className={`host-step-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="host-step-circle">
              {currentStep > 1 ? <i className="fa-solid fa-check"></i> : 1}
            </div>
            <span className="host-step-label">1. Ubicación y Fotos</span>
          </div>

          <div
            className={`host-step-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
            onClick={() => validateStep1() && setCurrentStep(2)}
          >
            <div className="host-step-circle">
              {currentStep > 2 ? <i className="fa-solid fa-check"></i> : 2}
            </div>
            <span className="host-step-label">2. Tu Espacio y Tarifa</span>
          </div>

          <div
            className={`host-step-item ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => validateStep1() && validateStep2() && setCurrentStep(3)}
          >
            <div className="host-step-circle">3</div>
            <span className="host-step-label">3. Horarios y Acceso</span>
          </div>
        </div>
      </div>

      {/* Body dinámico por paso */}
      <div className="host-wizard-body">
        {currentStep === 1 && (
          <HostStepUbicacion
            nombre={nombre}
            setNombre={setNombre}
            direccion={direccion}
            setDireccion={setDireccion}
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            fotos={fotos}
            setFotos={setFotos}
            disabled={isLoading}
          />
        )}

        {currentStep === 2 && (
          <HostStepEspacioTarifas
            vehiculoPermitido={vehiculoPermitido}
            setVehiculoPermitido={setVehiculoPermitido}
            esTechado={esTechado}
            setEsTechado={setEsTechado}
            tarifaHora={tarifaHora}
            setTarifaHora={setTarifaHora}
            observacionesEspacio={observacionesEspacio}
            setObservacionesEspacio={setObservacionesEspacio}
            disabled={isLoading}
          />
        )}

        {currentStep === 3 && (
          <HostStepReglasAcceso
            horarios={horarios}
            setHorarios={setHorarios}
            instruccionesAcceso={instruccionesAcceso}
            setInstruccionesAcceso={setInstruccionesAcceso}
            resumen={{
              nombre,
              direccion,
              vehiculoPermitido,
              tarifaHora,
              esTechado,
              fotosCount: fotos.length,
            }}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Footer con Botones de Navegación */}
      <div className="host-wizard-footer">
        {currentStep > 1 ? (
          <button
            type="button"
            className="host-wizard-btn-prev"
            onClick={handlePrev}
            disabled={isLoading}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Anterior</span>
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            className="host-wizard-btn-next"
            onClick={handleNext}
            disabled={isLoading}
          >
            <span>Continuar</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          <button
            type="button"
            className="host-wizard-btn-next"
            onClick={handleFinalSubmit}
            disabled={isLoading}
            style={{ background: '#006D36' }}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Registrando tu Cochera...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-check"></i>
                <span>Confirmar y Publicar Cochera</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
