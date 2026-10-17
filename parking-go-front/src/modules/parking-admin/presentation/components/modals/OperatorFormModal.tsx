// src/modules/parking-admin/presentation/components/modals/OperatorFormModal.tsx
import { useState, useEffect } from 'react';
import type {
    ParkingOperator,
    OperatorShift,
    OperatorStatus,
    GaritaLocation,
    CreateOperatorPayload,
    UpdateOperatorPayload,
} from '../../../domain/ParkingOperator';

interface OperatorFormModalProps {
    isOpen: boolean;
    operatorToEdit: ParkingOperator | null;
    onClose: () => void;
    onSubmitCreate: (payload: CreateOperatorPayload) => Promise<unknown>;
    onSubmitUpdate: (payload: UpdateOperatorPayload) => Promise<unknown>;
}

export const OperatorFormModal = ({
    isOpen,
    operatorToEdit,
    onClose,
    onSubmitCreate,
    onSubmitUpdate,
}: OperatorFormModalProps) => {
    const [fullName, setFullName] = useState('');
    const [ci, setCi] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [garita, setGarita] = useState<GaritaLocation>('Caseta Principal Norte');
    const [shift, setShift] = useState<OperatorShift>('Turno Mañana (07:00 - 15:00)');
    const [status, setStatus] = useState<OperatorStatus>('activo');
    const [tempPassword, setTempPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (operatorToEdit) {
            setFullName(operatorToEdit.fullName);
            setCi(operatorToEdit.ci);
            setPhone(operatorToEdit.phone);
            setEmail(operatorToEdit.email);
            setGarita(operatorToEdit.garita || 'Caseta Principal Norte');
            setShift(operatorToEdit.shift || 'Turno Mañana (07:00 - 15:00)');
            setStatus(operatorToEdit.status);
            setTempPassword('');
        } else {
            setFullName('');
            setCi('');
            setPhone('');
            setEmail('');
            setGarita('Caseta Principal Norte');
            setShift('Turno Mañana (07:00 - 15:00)');
            setStatus('activo');
            setTempPassword('');
        }
        setErrorMsg(null);
    }, [operatorToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!fullName.trim() || !ci.trim() || !email.trim()) {
            setErrorMsg('Por favor completa todos los campos obligatorios (*)');
            return;
        }

        try {
            setIsSubmitting(true);
            if (operatorToEdit) {
                await onSubmitUpdate({
                    id: operatorToEdit.id,
                    fullName: fullName.trim(),
                    ci: ci.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    garita,
                    shift,
                    status,
                });
            } else {
                await onSubmitCreate({
                    fullName: fullName.trim(),
                    ci: ci.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    garita,
                    shift,
                    status,
                    temporaryPassword: tempPassword.trim() || undefined,
                });
            }
            onClose();
        } catch {
            setErrorMsg('Hubo un error al guardar los datos del operador');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="modal-overlay active"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
            onClick={onClose}
        >
            <div
                className="modal-card"
                style={{
                    background: 'var(--bg-card, #FFFFFF)',
                    borderRadius: 'var(--radius-lg, 12px)',
                    width: '100%',
                    maxWidth: '540px',
                    boxShadow: 'var(--modal-shadow, 0 20px 25px -5px rgba(0, 0, 0, 0.2))',
                    border: '1px solid var(--border-subtle, #E2E8F0)',
                    overflow: 'hidden',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="modal-header-custom"
                    style={{
                        padding: '1.1rem 1.5rem',
                        background: '#063D25',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className={operatorToEdit ? 'fa-solid fa-user-pen' : 'fa-solid fa-user-plus'}></i>
                        <span>{operatorToEdit ? 'Editar Operador de Garita' : 'Registrar Nuevo Operador'}</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '1.3rem', cursor: 'pointer' }}
                    >
                        &times;
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit}>
                    <div className="modal-body-custom" style={{ padding: '1.5rem' }}>
                        {errorMsg && (
                            <div
                                style={{
                                    background: '#FEF2F2',
                                    color: '#991B1B',
                                    padding: '0.65rem 0.95rem',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    fontSize: '0.82rem',
                                    border: '1px solid #FCA5A5',
                                }}
                            >
                                <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Nombre Completo <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Ej. Carlos Mendoza"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Cédula de Identidad (CI) <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={ci}
                                    onChange={(e) => setCi(e.target.value)}
                                    placeholder="Ej. 7849120 SC"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Teléfono de Contacto
                                </label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Ej. 77123456"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Correo Electrónico <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="carlos.mendoza@parkingo.bo"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Garita Asignada
                                </label>
                                <select
                                    value={garita}
                                    onChange={(e) => setGarita(e.target.value as GaritaLocation)}
                                    className="form-select"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                >
                                    <option value="Caseta Principal Norte">Caseta Principal Norte</option>
                                    <option value="Caseta Acceso Sur">Caseta Acceso Sur</option>
                                    <option value="Garita Nivel Subterráneo">Garita Nivel Subterráneo</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Turno Horario
                                </label>
                                <select
                                    value={shift}
                                    onChange={(e) => setShift(e.target.value as OperatorShift)}
                                    className="form-select"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                >
                                    <option value="Turno Mañana (07:00 - 15:00)">Turno Mañana (07:00 - 15:00)</option>
                                    <option value="Turno Tarde (15:00 - 23:00)">Turno Tarde (15:00 - 23:00)</option>
                                    <option value="Turno Noche (23:00 - 07:00)">Turno Noche (23:00 - 07:00)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.2rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    Estado Operativo
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as OperatorStatus)}
                                    className="form-select"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="en-sitio">En Turno Ahora</option>
                                    <option value="inactivo">Inactivo / Licencia</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ fontWeight: 600, fontSize: '0.82rem', display: 'block', marginBottom: '0.4rem' }}>
                                    {operatorToEdit ? 'Cambiar Contraseña (Opcional)' : 'Contraseña Temporal'}
                                </label>
                                <input
                                    type="password"
                                    value={tempPassword}
                                    onChange={(e) => setTempPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="form-control"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="modal-footer-custom"
                        style={{
                            padding: '1rem 1.5rem',
                            background: '#F8FAFC',
                            borderTop: '1px solid #E2E8F0',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '0.5rem',
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: '#006D36' }}
                            disabled={isSubmitting}
                        >
                            <i className="fa-solid fa-floppy-disk"></i>{' '}
                            {isSubmitting ? 'Guardando...' : operatorToEdit ? 'Actualizar Operador' : 'Guardar Operador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
