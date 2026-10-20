import React, { useState } from 'react';

interface ModalRechazoEstacionamientoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  isLoading?: boolean;
}

export const ModalRechazoEstacionamiento: React.FC<ModalRechazoEstacionamientoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!motivo.trim() || motivo.trim().length < 5) {
      setError('Por favor ingresa un motivo detallado (mínimo 5 caracteres).');
      return;
    }
    setError('');
    onConfirm(motivo.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="card-title" style={{ color: '#DC2626' }}>
          Rechazar Solicitud de Estacionamiento
        </h3>
        <p className="card-subtitle" style={{ marginBottom: '1rem' }}>
          Indica el motivo por el cual no se aprueba esta solicitud. El tenant podrá ver esta
          observación para realizar las correcciones necesarias.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="motivoRechazo">
              Motivo del Rechazo:
            </label>
            <textarea
              id="motivoRechazo"
              className="form-textarea"
              rows={4}
              placeholder="Ej. Las fotografías no coinciden con la ubicación declarada o faltan accesos visibles..."
              value={motivo}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setMotivo(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
            />
            {error && <span style={{ color: '#DC2626', fontSize: '0.8rem' }}>{error}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={isLoading}
            >
              {isLoading ? 'Rechazando...' : 'Confirmar Rechazo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
