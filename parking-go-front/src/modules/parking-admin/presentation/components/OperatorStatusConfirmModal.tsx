// src/modules/parking-admin/presentation/components/OperatorStatusConfirmModal.tsx
import React from 'react';
import type { ParkingOperator } from '../../domain/ParkingOperator';

interface OperatorStatusConfirmModalProps {
    operator: ParkingOperator | null;
    isUpdating: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const OperatorStatusConfirmModal: React.FC<OperatorStatusConfirmModalProps> = ({
    operator,
    isUpdating,
    onClose,
    onConfirm,
}) => {
    if (!operator) return null;

    const willActivate = operator.status === 'inactivo';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2500,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '460px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--modal-shadow)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: willActivate ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: willActivate ? '#22C55E' : '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                        }}
                    >
                        <i className={`fa-solid ${willActivate ? 'fa-user-check' : 'fa-user-slash'}`}></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {willActivate ? 'Habilitar Operador' : 'Suspender Operador de Garita'}
                    </h3>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        ¿Estás seguro de que deseas{' '}
                        <strong>{willActivate ? 'habilitar el acceso' : 'suspender temporalmente'}</strong> al operador{' '}
                        <strong>{operator.fullName}</strong> ({operator.ci})?
                    </p>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {willActivate
                            ? 'El operador podrá iniciar sesión nuevamente en la caseta asignada y registrar movimientos.'
                            : 'El operador perderá inmediatamente el acceso a la terminal operativa de garita.'}
                    </p>
                </div>

                <div style={{ padding: '0.9rem 1.5rem', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isUpdating}
                        style={{
                            padding: '0.5rem 1.15rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            borderRadius: '6px',
                            border: 'none',
                            background: willActivate ? 'var(--accent-emerald)' : '#DC2626',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: 'var(--glow-shadow)',
                        }}
                    >
                        <i className={`fa-solid ${willActivate ? 'fa-check' : 'fa-ban'}`}></i>
                        <span>{isUpdating ? 'Actualizando...' : willActivate ? 'Sí, Habilitar' : 'Sí, Suspender'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
