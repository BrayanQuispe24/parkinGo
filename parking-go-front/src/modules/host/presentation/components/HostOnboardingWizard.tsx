import React, { useState } from 'react';
import type {
  HorarioItemPayload,
  RegistrarEstacionamientoPayload,
} from '../../../estacionamientos/domain/Estacionamiento';
import { useParkingLocationState } from '../../../estacionamientos/application/useParkingLocationState';
import { HostStepUbicacion } from './HostStepUbicacion';
import { HostStepReglasAcceso } from './HostStepReglasAcceso';
import { showToast } from '../../../../core/utils/toastr';
import { DEFAULT_FALLBACK_COORDINATES } from '../../../../core/services/geocoding/useDeviceGeolocation';
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
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Datos Paso 1: Ubicación & Garaje
  const [nombre, setNombre] = useState('');
  const {
    coordinates,
    direccion,
    isLocatingDevice,
    isResolvingAddress,
    handleDireccionInputChange,
    handleCoordinatesChange,
  } = useParkingLocationState();
  const [fotos, setFotos] = useState<File[]>([]);

  // Datos Paso 2: Horarios & Confirmación
  const [horarios, setHorarios] = useState<HorarioItemPayload[]>(DEFAULT_RESIDENTIAL_HORARIOS);

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

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    }
  };

  const handlePrev = () => {
    if (currentStep === 2) setCurrentStep(1);
  };

  const handleFinalSubmit = () => {
    if (!validateStep1()) return;

    if (horarios.length === 0) {
      showToast.warning('Debes habilitar al menos un día de atención con su horario.', 'Paso 2');
      return;
    }

    const payload: RegistrarEstacionamientoPayload = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      latitud: coordinates ? coordinates.lat : DEFAULT_FALLBACK_COORDINATES.lat,
      longitud: coordinates ? coordinates.lng : DEFAULT_FALLBACK_COORDINATES.lng,
      horarios,
      fotos,
    };

    onSubmit(payload);
  };

  return (
    <div className="host-wizard-container">
      {/* Header Enterprise con Stepper Tabular */}
      <div className="host-wizard-header">
        <div className="host-wizard-header-top">
          <div className="host-wizard-header-main">
            <div className="host-wizard-header-icon">
              <i className="fa-solid fa-warehouse"></i>
            </div>
            <div>
              <div className="host-wizard-badge">
                <i className="fa-solid fa-house-user"></i>
                <span>Alta Residencial · Plan Anfitrión</span>
              </div>
              <h2 className="host-wizard-title">Publica tu Cochera en 2 Pasos</h2>
              <p className="host-wizard-subtitle">
                Generaremos automáticamente la estructura de tu garaje (1 Nivel, 1 Croquis y 1 Plaza Única).
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              <i className="fa-solid fa-xmark"></i>
              <span>Cancelar</span>
            </button>
          )}
        </div>

        {/* Stepper Bar Enterprise */}
        <div className="host-stepper-bar">
          <div className="host-stepper-track">
            <div
              className="host-stepper-progress"
              style={{
                width: currentStep === 1 ? '0%' : '100%',
              }}
            ></div>
          </div>

          <div
            className={`host-step-item ${currentStep === 1 ? 'active' : 'completed'}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="host-step-circle">
              {currentStep > 1 ? <i className="fa-solid fa-check"></i> : 1}
            </div>
            <span className="host-step-label">1. Ubicación y Fotos</span>
          </div>

          <div
            className={`host-step-item ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => validateStep1() && setCurrentStep(2)}
          >
            <div className="host-step-circle">2</div>
            <span className="host-step-label">2. Horarios y Confirmación</span>
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
            setDireccion={handleDireccionInputChange}
            coordinates={coordinates}
            setCoordinates={handleCoordinatesChange}
            fotos={fotos}
            setFotos={setFotos}
            disabled={isLoading}
            isResolvingAddress={isResolvingAddress}
            isDetectingInitialLocation={isLocatingDevice}
          />
        )}

        {currentStep === 2 && (
          <HostStepReglasAcceso
            horarios={horarios}
            setHorarios={setHorarios}
            resumen={{
              nombre,
              direccion,
              fotosCount: fotos.length,
              horariosCount: horarios.length,
            }}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Footer con Botones Enterprise */}
      <div className="host-wizard-footer">
        {currentStep > 1 ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={isLoading}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Anterior</span>
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < 2 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={isLoading}
          >
            <span>Continuar</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleFinalSubmit}
            disabled={isLoading}
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
