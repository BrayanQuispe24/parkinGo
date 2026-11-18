import React from 'react';
import type { EstacionamientoModel } from '../../domain/Estacionamiento';

interface ModalEliminarEstacionamientoRechazadoProps {
  estacionamiento: EstacionamientoModel | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export const ModalEliminarEstacionamientoRechazado: React.FC<
  ModalEliminarEstacionamientoRechazadoProps
> = ({ estacionamiento, onClose, onConfirm, isLoading = false }) => {
  if (!estacionamiento) return null;

  const handleOverlayClick = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div className="estacionamiento-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="estacionamiento-modal-content"
        style={{ borderRadius: '8px', maxWidth: '480px' }}
        onClick={handleContentClick}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.85rem',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.05rem',
              flexShrink: 0,
            }}
          >
            <i className="fa-solid fa-trash-can"></i>
          </div>
          <div>
            <h3 className="card-title" style={{ color: '#991B1B', fontSize: '1.08rem', margin: 0 }}>
              Eliminar Parqueo Rechazado
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Esta acción eliminará la solicitud actual de forma permanente
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: '0 0 0.9rem 0' }}>
          ¿Confirmas que deseas eliminar <strong>{estacionamiento.nombre}</strong>? Al hacerlo,
          se borrarán los datos y fotografías de esta solicitud rechazada y podrás registrar una nueva
          solicitud con las correcciones necesarias.
        </p>

        {estacionamiento.motivoRechazo && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderLeft: '3px solid #DC2626',
              borderRadius: '6px',
              padding: '0.7rem 0.9rem',
              marginBottom: '1.15rem',
              fontSize: '0.8rem',
              color: '#7F1D1D',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>
              Motivo de rechazo registrado:
            </strong>
            <span>"{estacionamiento.motivoRechazo}"</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ borderRadius: '6px' }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-danger"
            style={{
              borderRadius: '6px',
              background: '#DC2626',
              color: '#FFFFFF',
              border: '1px solid #DC2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
            onClick={() => onConfirm(estacionamiento.id)}
            disabled={isLoading}
          >
            <i className={isLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-trash-can'}></i>
            <span>{isLoading ? 'Eliminando...' : 'Sí, Eliminar Parqueo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

