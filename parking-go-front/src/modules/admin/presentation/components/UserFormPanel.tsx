// src/modules/admin/presentation/components/UserFormPanel.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { AdminUser, CreateAdminUserPayload } from '../../domain/AdminUser';
import type { RoleWithPermissions } from '../../domain/RolePermission';

interface UserFormPanelProps {
    userToEdit: AdminUser | null;
    roles: RoleWithPermissions[];
    isSubmitting: boolean;
    onSubmit: (payload: CreateAdminUserPayload) => Promise<void>;
    onCancel: () => void;
}

export const UserFormPanel: React.FC<UserFormPanelProps> = ({
    userToEdit,
    roles,
    isSubmitting,
    onSubmit,
    onCancel,
}) => {
    const isEdit = Boolean(userToEdit);

    const [firstName, setFirstName] = useState(userToEdit?.firstName || '');
    const [lastName, setLastName] = useState(userToEdit?.lastName || '');
    const [email, setEmail] = useState(userToEdit?.email || '');
    const [password, setPassword] = useState('');
    const [ci, setCi] = useState(userToEdit?.ci || '');
    const [roleId, setRoleId] = useState(userToEdit?.roleId || userToEdit?.role?.id || roles[0]?.id || '');
    const [gender, setGender] = useState<'M' | 'F' | 'U'>(
        (userToEdit?.gender as 'M' | 'F' | 'U') || 'M'
    );
    const [phone, setPhone] = useState(userToEdit?.phone || '');
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (userToEdit) {
            setFirstName(userToEdit.firstName || '');
            setLastName(userToEdit.lastName || '');
            setEmail(userToEdit.email || '');
            setCi(userToEdit.ci || '');
            setRoleId(userToEdit.roleId || userToEdit.role?.id || roles[0]?.id || '');
            setGender((userToEdit.gender as 'M' | 'F' | 'U') || 'M');
            setPhone(userToEdit.phone || '');
            setPassword('');
        } else {
            setFirstName('');
            setLastName('');
            setEmail('');
            setCi('');
            setRoleId(roles[0]?.id || '');
            setGender('M');
            setPhone('');
            setPassword('');
        }
    }, [userToEdit, roles]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!firstName.trim() || !lastName.trim() || !email.trim() || !ci.trim()) {
            setFormError('Por favor completa todos los campos marcados como obligatorios.');
            return;
        }

        if (!isEdit && (!password || password.length < 6)) {
            setFormError('La contraseña inicial es requerida y debe contener al menos 6 caracteres.');
            return;
        }

        try {
            await onSubmit({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                password: password || undefined,
                ci: ci.trim(),
                roleId: roleId || roles[0]?.id,
                gender,
                phone: phone.trim() || undefined,
            });
        } catch (err: unknown) {
            let message = 'Error al procesar el usuario';
            if (axios.isAxiosError(err)) {
                const apiMsg = err.response?.data?.message;
                message = Array.isArray(apiMsg) ? apiMsg.join(', ') : apiMsg || err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            setFormError(message);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {/* Panel Header */}
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <i className="fa-solid fa-user-plus" style={{ color: '#006D36', fontSize: '1rem' }}></i>
                        <span>{isEdit ? 'Editar Usuario del Sistema' : 'Registrar Nuevo Usuario'}</span>
                    </h3>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
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
                    <div style={{ margin: '1rem 1.5rem 0 1.5rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>{formError}</span>
                    </div>
                )}

                {/* Form Body */}
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                    {/* Grid 2 Columnas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Nombre(s) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ej. Roberto"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Apellido(s) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ej. Gómez"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Correo Electrónico <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="email"
                                required
                                disabled={isEdit}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="correo@ejemplo.com"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: isEdit ? '#F1F5F9' : '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                C.I. (Cédula de Identidad) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                                placeholder="Ej. 7894561 SC"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Rol del Sistema <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                            >
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name === 'DRIVER'
                                            ? 'Conductor'
                                            : r.name === 'HOST'
                                            ? 'Anfitrión / Dueño de Parqueo'
                                            : r.name === 'PARKING_ADMIN'
                                            ? 'Administrador de Parqueo'
                                            : r.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Género / Sexo
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'U')}
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="U">No especificado</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                Teléfono / Celular
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Ej. 70012345"
                                style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                            />
                        </div>

                        {!isEdit && (
                            <div>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569', marginBottom: '0.35rem' }}>
                                    Contraseña Inicial <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    required={!isEdit}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '0.85rem', color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Action Footer */}
                    <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{ padding: '0.55rem 1.25rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
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
                                background: '#006D36',
                                color: '#FFFFFF',
                                fontSize: '0.84rem',
                                fontWeight: 700,
                                cursor: isSubmitting ? 'wait' : 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 1px 3px rgba(0, 109, 54, 0.25)',
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
                                    <span>{isEdit ? 'Actualizar Usuario' : 'Crear Usuario'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
