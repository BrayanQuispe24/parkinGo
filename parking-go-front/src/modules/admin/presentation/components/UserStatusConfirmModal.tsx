// src/modules/admin/presentation/components/UserStatusConfirmModal.tsx
import React from 'react';
import type { AdminUser } from '../../domain/AdminUser';

interface UserStatusConfirmModalProps {
    isOpen: boolean;
    user: AdminUser | null;
    isUpdating: boolean;
    onConfirm: () => Promise<void>;
    onClose: () => void;
}

export const UserStatusConfirmModal: React.FC<UserStatusConfirmModalProps> = ({
    isOpen,
    user,
    isUpdating,
    onConfirm,
    onClose,
}) => {
    if (!isOpen || !user) return null;

    const isSuspending = user.status === 'ACTIVE';
    const displayName = user.fullname || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
    const roleName = user.role?.name || 'USUARIO';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10050,
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
                    borderRadius: '6px',
                    width: '100%',
                    maxWidth: '480px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Encabezado Enterprise */}
                <div
                    style={{
                        padding: '1.15rem 1.4rem',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#F8FAFC',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '4px',
                                background: isSuspending ? '#FEF2F2' : '#ECFDF5',
                                border: '1px solid ' + (isSuspending ? '#FECACA' : '#A7F3D0'),
                                color: isSuspending ? '#DC2626' : '#006D36',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1rem',
                                flexShrink: 0,
                            }}
                        >
                            <i className={`fa-solid ${isSuspending ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                        </div>
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    fontSize: '0.92rem',
                                    fontWeight: 800,
                                    color: '#0F172A',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                {isSuspending ? 'Suspender Acceso de Usuario' : 'Reactivar Cuenta de Usuario'}
                            </h3>
                            <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#64748B' }}>
                                {isSuspending
                                    ? 'Acción de control y restricción de acceso'
                                    : 'Restablecimiento de credenciales operativas'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isUpdating}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Cerrar"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Cuerpo del Modal */}
                <div style={{ padding: '1.4rem' }}>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                        ¿Confirmas que deseas {isSuspending ? 'suspender el acceso a la plataforma para' : 'reactivar la cuenta del usuario'}{' '}
                        <strong style={{ color: '#0F172A' }}>{displayName}</strong>?
                    </p>

                    {/* Ficha Técnica de Auditoría de Usuario (Enterprise Data Box) */}
                    <div
                        style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '4px',
                            padding: '0.85rem 1rem',
                            margin: '1rem 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.45rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                                {displayName}
                            </div>
                            <span
                                style={{
                                    background: '#ECFDF5',
                                    border: '1px solid #BBF7D0',
                                    color: '#006D36',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '3px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                }}
                            >
                                <i className="fa-solid fa-shield-halved" style={{ fontSize: '0.62rem' }}></i>
                                {roleName}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.74rem', color: '#64748B' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                <i className="fa-solid fa-envelope" style={{ color: '#94A3B8' }}></i>
                                <span style={{ fontFamily: 'monospace', color: '#334155' }}>{user.email}</span>
                            </div>
                            {user.ci && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <i className="fa-solid fa-id-card" style={{ color: '#94A3B8' }}></i>
                                    <span>CI: {user.ci}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#64748B', paddingTop: '0.25rem', borderTop: '1px dashed #E2E8F0' }}>
                            <span>Estado actual:</span>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontWeight: 700,
                                    color: user.status === 'ACTIVE' ? '#166534' : '#DC2626',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: user.status === 'ACTIVE' ? '#16A34A' : '#DC2626',
                                        display: 'inline-block',
                                    }}
                                />
                                {user.status}
                            </span>
                        </div>
                    </div>

                    {/* Mensaje de Alerta Contextual */}
                    <div
                        style={{
                            background: isSuspending ? '#FFFBEB' : '#F0FDF4',
                            border: '1px solid ' + (isSuspending ? '#FDE68A' : '#BBF7D0'),
                            borderRadius: '4px',
                            padding: '0.65rem 0.85rem',
                            fontSize: '0.74rem',
                            color: isSuspending ? '#92400E' : '#166534',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.55rem',
                            lineHeight: 1.45,
                        }}
                    >
                        <i
                            className={`fa-solid ${isSuspending ? 'fa-triangle-exclamation' : 'fa-circle-info'}`}
                            style={{ marginTop: '0.15rem', color: isSuspending ? '#D97706' : '#059669', flexShrink: 0 }}
                        ></i>
                        <span>
                            {isSuspending
                                ? 'Al suspender la cuenta, el usuario no podrá iniciar sesión en garitas, terminales ni módulos administrativos hasta que sea reactivado.'
                                : 'El usuario podrá autenticarse nuevamente de inmediato y continuar con la operación de sus asignaciones.'}
                        </span>
                    </div>
                </div>

                {/* Pie de Acciones Enterprise */}
                <div
                    style={{
                        padding: '0.9rem 1.4rem',
                        background: '#F8FAFC',
                        borderTop: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
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
                            borderRadius: '4px',
                            padding: '0.45rem 1rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            color: '#475569',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isUpdating}
                        style={{
                            background: isSuspending ? '#DC2626' : '#006D36',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '0.45rem 1.15rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            cursor: isUpdating ? 'wait' : 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                            transition: 'background-color 0.15s ease',
                            opacity: isUpdating ? 0.75 : 1,
                        }}
                    >
                        {isUpdating ? (
                            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                        ) : (
                            <i className={`fa-solid ${isSuspending ? 'fa-ban' : 'fa-check'} text-xs`}></i>
                        )}
                        <span>{isSuspending ? 'Sí, Suspender Cuenta' : 'Sí, Activar Cuenta'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
