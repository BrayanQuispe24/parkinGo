import React, { useState, useEffect } from 'react';
import { useSettingsStore } from '../../../../store/useSettingsStore';
import type { User } from '../../domain/User';
import type { UpdateUserProfilePayload } from '../../domain/UserProfile';

interface SharedProfilePanelProps {
    user: User | null;
    roleBadgeLabel?: string;
    roleIconClass?: string;
    subtitle?: string;
    onUpdateProfile: (payload: UpdateUserProfilePayload) => Promise<void>;
    isUpdating?: boolean;
}

export const SharedProfilePanel: React.FC<SharedProfilePanelProps> = ({
    user,
    roleBadgeLabel,
    roleIconClass,
    subtitle,
    onUpdateProfile,
    isUpdating,
}) => {
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const openSettings = useSettingsStore((state) => state.openSettings);
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [gender, setGender] = useState<'M' | 'F' | 'U'>(
        (user?.gender as 'M' | 'F' | 'U') || (user?.sexo as 'M' | 'F' | 'U') || 'M'
    );
    const [birthDate, setBirthDate] = useState(
        user?.birthDate ? user.birthDate.split('T')[0] : user?.birthdate ? user.birthdate.split('T')[0] : ''
    );

    // Sincronizar estado local si el usuario cambia externamente
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setPhone(user.phone || '');
            setGender((user.gender as 'M' | 'F' | 'U') || (user.sexo as 'M' | 'F' | 'U') || 'M');
            setBirthDate(user.birthDate ? user.birthDate.split('T')[0] : user.birthdate ? user.birthdate.split('T')[0] : '');
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onUpdateProfile({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim() || undefined,
            gender,
            birthDate: birthDate || undefined,
        });
    };

    const userInitials = (user?.fullname || `${firstName} ${lastName}`)
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'PG';

    const getRoleBadge = () => {
        if (roleBadgeLabel) {
            return {
                label: roleBadgeLabel,
                icon: roleIconClass || 'fa-solid fa-user-check',
            };
        }

        switch (user?.role) {
            case 'SUPER_ADMIN':
            case 'GENERAL_ADMIN':
                return { label: 'ADMINISTRADOR DEL SISTEMA', icon: 'fa-solid fa-shield-halved' };
            case 'PARKING_ADMIN':
                return { label: 'ADMINISTRADOR DE PARQUEO', icon: 'fa-solid fa-square-parking' };
            case 'HOST':
                return { label: 'ANFITRIÓN DE PARQUEO', icon: 'fa-solid fa-building' };
            case 'PARKING_OPERATOR':
            case 'OPERATOR':
                return { label: 'OPERADOR DE CASETA', icon: 'fa-solid fa-user-tie' };
            case 'DRIVER':
            default:
                return { label: 'CONDUCTOR VERIFICADO', icon: 'fa-solid fa-car-side' };
        }
    };

    const roleInfo = getRoleBadge();

    return (
        <div className="profile-panel-container">
            {/* Header del Perfil */}
            <div className="profile-card profile-header-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div className="profile-avatar">
                        {userInitials}
                    </div>

                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                            <h2 className="profile-title">
                                {user?.fullname || `${firstName} ${lastName}`.trim() || 'Usuario ParkinGo'}
                            </h2>
                            <span className="profile-role-badge">
                                <i className={roleInfo.icon}></i>
                                <span>{roleInfo.label}</span>
                            </span>
                        </div>
                        <p className="profile-text-muted">
                            {user?.email} • CI: <strong>{user?.ci || 'Registrado'}</strong>
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                        type="button"
                        onClick={openSettings}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            cursor: 'pointer',
                        }}
                        title="Configurar tema y tamaño de fuente"
                    >
                        <i className="fa-solid fa-sliders" style={{ color: 'var(--border-highlight)' }}></i>
                        <span>Ajustes Visuales</span>
                    </button>

                    <span
                        style={{
                            background: 'rgba(34, 197, 94, 0.12)',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            color: '#22C55E',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '6px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                        }}
                    >
                        <i className="fa-solid fa-circle-check"></i>
                        <span>Cuenta Activa</span>
                    </span>
                </div>
            </div>

            {/* Formulario de Información Personal */}
            <div className="profile-card">
                <div className="profile-section-divider">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        Información Personal del Perfil
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                        {subtitle || 'Actualiza tus datos de contacto, nombres y fecha de nacimiento vinculados a tu cuenta de ParkinGo.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Fila 1: Nombres y Apellidos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="profile-field-label">
                                Nombres *
                            </label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="profile-input"
                            />
                        </div>

                        <div>
                            <label className="profile-field-label">
                                Apellidos *
                            </label>
                            <input
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="profile-input"
                            />
                        </div>
                    </div>

                    {/* Fila 2: Teléfono y Género */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="profile-field-label">
                                Teléfono / Celular
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+591 70000000"
                                className="profile-input"
                            />
                        </div>

                        <div>
                            <label className="profile-field-label">
                                Género
                            </label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'M' | 'F' | 'U')}
                                className="profile-input"
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="U">Prefiero no especificar</option>
                            </select>
                        </div>
                    </div>

                    {/* Fila 3: Fecha de Nacimiento y C.I. */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                        <div>
                            <label className="profile-field-label">
                                Fecha de Nacimiento
                            </label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="profile-input"
                            />
                        </div>

                        {/* Campo No Editable: C.I. */}
                        <div>
                            <label className="profile-field-label-muted">
                                Documento de Identidad (C.I.)
                            </label>
                            <div className="profile-readonly-field">
                                <span style={{ fontWeight: 700 }}>{user?.ci || 'No disponible'}</span>
                                <i className="fa-solid fa-lock" style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }} title="Dato de identidad protegido"></i>
                            </div>
                        </div>
                    </div>

                    {/* Fila 4: Correo Electrónico (Protegido) */}
                    <div>
                        <label className="profile-field-label-muted">
                            Correo Electrónico Vinculado
                        </label>
                        <div className="profile-readonly-field">
                            <span>{user?.email}</span>
                            <span style={{ color: '#22C55E', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                <i className="fa-solid fa-circle-check"></i> Verificado por OTP
                            </span>
                        </div>
                    </div>

                    {/* Botón de Guardado */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="profile-btn-save"
                        >
                            {isUpdating ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-floppy-disk"></i>
                            )}
                            <span>{isUpdating ? 'Guardando Cambios...' : 'Guardar Información'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
