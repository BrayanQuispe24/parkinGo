// src/modules/auth/presentation/components/TermsModal.tsx
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTermsQuery } from '../hooks/useTermsQuery';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
    const { data: terms = [], isLoading, isError } = useTermsQuery();

    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="modal-backdrop open active"
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'auto',
            }}
            onClick={onClose}
        >
            <div
                className="modal-box"
                style={{
                    backgroundColor: '#FFFFFF',
                    maxWidth: '580px',
                    width: '92%',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 100000,
                    pointerEvents: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="modal-header"
                    style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid #D8E2DA',
                        background: '#F4F6F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '6px',
                                background: 'rgba(0, 109, 54, 0.12)',
                                color: '#006D36',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem',
                            }}
                        >
                            <i className="fa-solid fa-file-shield"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F2417' }}>
                                Términos y Condiciones
                            </h3>
                            <span style={{ fontSize: '0.72rem', color: '#66736B' }}>
                                ParkinGo Bolivia • Contrato de Uso del Servicio
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        title="Cerrar modal"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.4rem',
                            color: '#82968A',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            lineHeight: 1,
                            pointerEvents: 'auto',
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Body con Scroll */}
                <div
                    className="modal-body"
                    style={{
                        padding: '1.25rem',
                        overflowY: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.85rem',
                    }}
                >
                    {isLoading && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.6rem', color: '#006D36' }}>
                            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.2rem' }}></i>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cargando cláusulas oficiales...</span>
                        </div>
                    )}

                    {isError && (
                        <div style={{ padding: '0.75rem', borderRadius: '8px', background: '#FEE2E2', color: '#B91C1C', fontSize: '0.8rem' }}>
                            No se pudieron sincronizar los términos en tiempo real, mostrando versión de contingencia.
                        </div>
                    )}

                    {!isLoading && terms.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '0.85rem 1rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                            }}
                        >
                            <h4
                                style={{
                                    margin: '0 0 0.35rem 0',
                                    fontSize: '0.88rem',
                                    fontWeight: 700,
                                    color: '#006D36',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                <i className="fa-solid fa-circle-check" style={{ fontSize: '0.75rem', color: '#22C55E' }}></i>
                                {item.title}
                            </h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#4A5E52', lineHeight: '1.45' }}>
                                {item.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer de Acciones */}
                <div
                    className="modal-footer"
                    style={{
                        padding: '0.85rem 1.25rem',
                        borderTop: '1px solid #D8E2DA',
                        background: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.65rem',
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        style={{
                            padding: '0.45rem 0.95rem',
                            borderRadius: '6px',
                            border: '1px solid #CBD5CE',
                            background: '#FFFFFF',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#4A5E52',
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                        }}
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onAccept}
                        style={{
                            padding: '0.45rem 1.15rem',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#006D36',
                            color: '#FFFFFF',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            pointerEvents: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 6px rgba(0, 109, 54, 0.2)',
                        }}
                    >
                        <i className="fa-solid fa-check"></i>
                        <span>Aceptar y Continuar</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
