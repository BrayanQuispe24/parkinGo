// src/modules/tenants/presentation/components/TenantStatusConfirmModal.tsx
import React from 'react';
import type { Tenant } from '../../domain/Tenant';

interface TenantStatusConfirmModalProps {
    tenant: Tenant | null;
    isUpdating: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const TenantStatusConfirmModal: React.FC<TenantStatusConfirmModalProps> = ({
    tenant,
    isUpdating,
    onClose,
    onConfirm,
}) => {
    if (!tenant) return null;

    const willActivate = tenant.estado === 'INACTIVO';

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
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: '460px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: willActivate ? '#DCFCE7' : '#FEF3C7',
                            color: willActivate ? '#15803D' : '#D97706',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                        }}
                    >
                        <i className={`fa-solid ${willActivate ? 'fa-circle-check' : 'fa-power-off'}`}></i>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                            {willActivate ? 'Reactivar Empresa' : 'Dar de Baja Empresa'}
                        </h3>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                            NIT: {tenant.nit}
                        </p>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                    <p style={{ marginTop: 0 }}>
                        ¿Estás seguro de que deseas {willActivate ? 'reactivar' : 'dar de baja temporalmente'} la empresa{' '}
                        <strong>{tenant.nombre}</strong>?
                    </p>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#475569' }}>
                        <div><strong>Razón Social:</strong> {tenant.razonSocial}</div>
                        <div><strong>Estado actual:</strong> {tenant.estado}</div>
                    </div>
                </div>

                <div
                    style={{
                        padding: '1rem 1.5rem',
                        background: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.65rem',
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '6px',
                            padding: '0.45rem 1rem',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: '#475569',
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
                            background: willActivate ? '#006D36' : '#D97706',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.45rem 1.15rem',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                        }}
                    >
                        {isUpdating && <i className="fa-solid fa-spinner fa-spin"></i>}
                        <span>{willActivate ? 'Confirmar Reactivación' : 'Confirmar Baja'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
