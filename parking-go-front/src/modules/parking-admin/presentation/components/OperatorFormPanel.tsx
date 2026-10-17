// src/modules/parking-admin/presentation/components/OperatorFormPanel.tsx
import React, { useState } from 'react';
import type {
    ParkingOperator,
    OperatorStatus,
    CreateOperatorPayload,
    UpdateOperatorPayload,
} from '../../domain/ParkingOperator';

interface OperatorFormPanelProps {
    operatorToEdit: ParkingOperator | null;
    isSubmitting: boolean;
    onSubmitCreate: (payload: CreateOperatorPayload) => Promise<void>;
    onSubmitUpdate: (payload: UpdateOperatorPayload) => Promise<void>;
    onCancel: () => void;
}

export const OperatorFormPanel: React.FC<OperatorFormPanelProps> = ({
    operatorToEdit,
    isSubmitting,
    onSubmitCreate,
    onSubmitUpdate,
    onCancel,
}) => {
    const isEdit = Boolean(operatorToEdit);

    // Separación de nombre y apellido si viene en fullName
    const initialNames = (operatorToEdit?.fullName || '').trim().split(' ');
    const initialFirstName = initialNames[0] || '';
    const initialLastName = initialNames.slice(1).join(' ') || '';

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [email, setEmail] = useState(operatorToEdit?.email || '');
    const [ci, setCi] = useState(operatorToEdit?.ci || '');
    const [phone, setPhone] = useState(operatorToEdit?.phone || '');
    const [status, setStatus] = useState<OperatorStatus>(operatorToEdit?.status || 'activo');
    const [tempPassword, setTempPassword] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !ci.trim()) {
            setFormError('Por favor completa todos los campos marcados como obligatorios (*).');
            return;
        }

        if (!isEdit && (!tempPassword || tempPassword.length < 6)) {
            setFormError('La contraseña inicial es requerida y debe contener al menos 6 caracteres.');
            return;
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`;

        try {
            if (isEdit && operatorToEdit) {
                await onSubmitUpdate({
                    id: operatorToEdit.id,
                    fullName,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    ci: ci.trim(),
                    phone: phone.trim(),
                    email: email.trim().toLowerCase(),
                    status,
                });
            } else {
                await onSubmitCreate({
                    fullName,
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    ci: ci.trim(),
                    phone: phone.trim(),
                    email: email.trim().toLowerCase(),
                    status,
                    temporaryPassword: tempPassword.trim() || undefined,
                });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error inesperado al procesar el operador';
            setFormError(message);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
                {/* Panel Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <i className={`fa-solid ${isEdit ? 'fa-user-pen' : 'fa-user-plus'}`} style={{ color: 'var(--border-highlight)', fontSize: '1rem' }}></i>
                        <span>{isEdit ? 'Editar Operador de Garita' : 'Registrar Nuevo Operador'}</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                        title="Cancelar y volver"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Form Error Banner */}
                {formError && (
                    <div style={{ margin: '1rem 1.5rem 0 1.5rem', padding: '0.75rem 1rem', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>{formError}</span>
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    {/* Grid 2 Columnas idéntico a UserFormPanel */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
                        {/* Nombre(s) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Nombre(s) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ej. Roberto"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Apellido(s) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Apellido(s) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ej. Gómez"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Correo Electrónico <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="email"
                                required
                                disabled={isEdit}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: isEdit ? 'var(--bg-primary)' : 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                            {!isEdit && (
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                                    <i className="fa-solid fa-paper-plane" style={{ color: 'var(--border-highlight)' }}></i>
                                    Se enviarán las credenciales de acceso a este correo (requiere dominio activo).
                                </span>
                            )}
                        </div>

                        {/* C.I. */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                C.I. (Cédula de Identidad) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                                placeholder="Ej. 7894561 SC"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>


                        {/* Teléfono / Celular */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Teléfono / Celular
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ej. 70012345"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Contraseña Inicial / Temporal */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                {isEdit ? 'Contraseña / PIN (Opcional)' : 'Contraseña Inicial'} {!isEdit && <span style={{ color: '#EF4444' }}>*</span>}
                            </label>
                            <input
                                type="password"
                                required={!isEdit}
                                value={tempPassword}
                                onChange={(e) => setTempPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {/* Estado Operativo */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                                Estado Operativo <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as OperatorStatus)}
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-strong)', background: 'var(--bg-card)', fontSize: '0.85rem', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                            >
                                <option value="activo">Activo</option>
                                <option value="en-sitio">En Turno Ahora</option>
                                <option value="inactivo">Inactivo / Licencia</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Footer idéntico a UserFormPanel */}
                    <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancelar y Volver
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: '0.55rem 1.5rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: 'var(--accent-emerald)',
                                color: '#FFFFFF',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                cursor: isSubmitting ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: 'var(--glow-shadow)',
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    <span>{isEdit ? 'Actualizar Operador' : 'Crear Operador'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
