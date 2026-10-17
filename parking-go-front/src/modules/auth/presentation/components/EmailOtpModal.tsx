// src/modules/auth/presentation/components/EmailOtpModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface EmailOtpModalProps {
    isOpen: boolean;
    email: string;
    onVerify: (code: string) => Promise<boolean>;
    onResend: () => Promise<boolean>;
    onClose: () => void;
    isLoading?: boolean;
    errorMessage?: string | null;
}

export const EmailOtpModal: React.FC<EmailOtpModalProps> = ({
    isOpen,
    email,
    onVerify,
    onResend,
    onClose,
    isLoading = false,
    errorMessage = null,
}) => {
    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [cooldown, setCooldown] = useState<number>(60);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [resendSuccess, setResendSuccess] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Temporizador de 60s para habilitar reenvío
    useEffect(() => {
        if (!isOpen) return;
        setCooldown(60);
        setDigits(['', '', '', '', '', '']);
        setResendSuccess(null);

        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    // Autofoco en la primera casilla al abrir
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDigitChange = (index: number, value: string) => {
        const char = value.slice(-1);
        if (char && !/^[0-9]$/.test(char)) return;

        const newDigits = [...digits];
        newDigits[index] = char;
        setDigits(newDigits);

        if (char && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Si se completaron los 6 dígitos, disparar verificación
        if (char && index === 5) {
            const fullCode = newDigits.join('');
            if (fullCode.length === 6) {
                void onVerify(fullCode);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (!digits[index] && index > 0) {
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                setDigits(newDigits);
                inputRefs.current[index - 1]?.focus();
            } else {
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        const numericMatch = pastedData.replace(/\D/g, '').slice(0, 6);

        if (numericMatch.length > 0) {
            const newDigits = [...digits];
            for (let i = 0; i < 6; i++) {
                newDigits[i] = numericMatch[i] || '';
            }
            setDigits(newDigits);

            const nextIndex = Math.min(numericMatch.length, 5);
            inputRefs.current[nextIndex]?.focus();

            if (numericMatch.length === 6) {
                void onVerify(numericMatch);
            }
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = digits.join('');
        if (fullCode.length === 6) {
            void onVerify(fullCode);
        }
    };

    const handleResendClick = async () => {
        if (cooldown > 0 || isResending) return;
        setIsResending(true);
        setResendSuccess(null);
        try {
            const ok = await onResend();
            if (ok) {
                setResendSuccess('¡Nuevo código enviado a tu bandeja!');
                setCooldown(60);
                setDigits(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } finally {
            setIsResending(false);
        }
    };

    const isCodeComplete = digits.every((d) => d.length === 1);

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
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(6px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <div
                className="modal-box"
                style={{
                    backgroundColor: '#FFFFFF',
                    maxWidth: '480px',
                    width: '95%',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: 'fadeIn 0.25s ease-out',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #E2E8F0',
                        background: 'linear-gradient(135deg, #063D25 0%, #006D36 100%)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                color: '#A7F3D0',
                            }}
                        >
                            <i className="fa-solid fa-envelope-circle-check"></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                                Verifica tu Correo
                            </h3>
                            <span style={{ fontSize: '0.75rem', color: '#D1FAE5' }}>
                                Código de seguridad único (OTP)
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        title="Cerrar"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            color: '#A7F3D0',
                            cursor: 'pointer',
                            lineHeight: 1,
                        }}
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleManualSubmit} style={{ padding: '1.75rem 1.5rem' }}>
                    <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.88rem', color: '#475569', lineHeight: '1.5', textAlign: 'center' }}>
                        Hemos enviado un código numérico de <strong>6 dígitos</strong> a la dirección:
                        <br />
                        <span style={{ color: '#006D36', fontWeight: 700, fontSize: '0.92rem' }}>{email}</span>
                    </p>

                    {/* Casillas de los 6 dígitos */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            margin: '1.5rem 0 1.25rem 0',
                        }}
                        onPaste={handlePaste}
                    >
                        {digits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => {
                                    inputRefs.current[idx] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                disabled={isLoading}
                                style={{
                                    width: '48px',
                                    height: '56px',
                                    fontSize: '1.6rem',
                                    fontWeight: 800,
                                    textAlign: 'center',
                                    borderRadius: '10px',
                                    border: digit ? '2px solid #006D36' : '1.5px solid #CBD5E1',
                                    background: digit ? '#F0FDF4' : '#FFFFFF',
                                    color: '#0F2417',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    boxShadow: digit ? '0 0 0 3px rgba(34, 197, 94, 0.15)' : 'none',
                                }}
                            />
                        ))}
                    </div>

                    {/* Mensaje de error */}
                    {errorMessage && (
                        <div
                            style={{
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                background: '#FEE2E2',
                                color: '#B91C1C',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                margin: '0.5rem 0 1rem 0',
                            }}
                        >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Mensaje de éxito al reenviar */}
                    {resendSuccess && (
                        <div
                            style={{
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                background: '#DCFCE7',
                                color: '#15803D',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                margin: '0.5rem 0 1rem 0',
                            }}
                        >
                            <i className="fa-solid fa-circle-check"></i>
                            <span>{resendSuccess}</span>
                        </div>
                    )}

                    {/* Botón de confirmación */}
                    <button
                        type="submit"
                        disabled={!isCodeComplete || isLoading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: isCodeComplete && !isLoading ? '#006D36' : '#94A3B8',
                            color: '#FFFFFF',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            cursor: isCodeComplete && !isLoading ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: isCodeComplete ? '0 4px 12px rgba(0, 109, 54, 0.25)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        {isLoading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Verificando código...</span>
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-shield-check"></i>
                                <span>Confirmar y Entrar</span>
                            </>
                        )}
                    </button>

                    {/* Reenviar código */}
                    <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: '#64748B' }}>
                        ¿No recibiste el código?{' '}
                        {cooldown > 0 ? (
                            <span style={{ color: '#006D36', fontWeight: 600 }}>
                                Reenviar en {cooldown}s
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendClick}
                                disabled={isResending}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#006D36',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline',
                                }}
                            >
                                {isResending ? 'Enviando...' : 'Reenviar código'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
