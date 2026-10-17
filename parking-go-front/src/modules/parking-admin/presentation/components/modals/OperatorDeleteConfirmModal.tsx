// src/modules/parking-admin/presentation/components/modals/OperatorDeleteConfirmModal.tsx
import React from 'react';
import type { ParkingOperator } from '../../../domain/ParkingOperator';

interface OperatorDeleteConfirmModalProps {
    operator: ParkingOperator | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const OperatorDeleteConfirmModal: React.FC<OperatorDeleteConfirmModalProps> = ({
    operator,
    isDeleting,
    onClose,
    onConfirm,
}) => {
    if (!operator) return null;

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
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            flexShrink: 0,
                        }}
                    >
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            Eliminar Operador de Parqueo
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Acción destructiva irreversible
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.25rem 1.5rem', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <p style={{ margin: '0 0 0.85rem 0' }}>
                        ¿Estás seguro de que deseas eliminar permanentemente al operador{' '}
                        <strong style={{ color: 'var(--text-main)' }}>{operator.fullName}</strong> (C.I. {operator.ci})?
                    </p>
                    <div
                        style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            borderRadius: '6px',
                            padding: '0.75rem 1rem',
                            fontSize: '0.8rem',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                        }}
                    >
                        <i className="fa-solid fa-circle-exclamation" style={{ marginTop: '0.15rem' }}></i>
                        <span>
                            El usuario perderá inmediatamente el acceso al sistema de caseta y su historial quedará desvinculado.
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'var(--bg-primary)',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        style={{
                            padding: '0.5rem 1.1rem',
                            background: '#DC2626',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            cursor: isDeleting ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                        }}
                    >
                        {isDeleting && <i className="fa-solid fa-spinner fa-spin"></i>}
                        <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Operador'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
