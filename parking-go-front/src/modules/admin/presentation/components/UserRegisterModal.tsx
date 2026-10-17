// src/modules/admin/presentation/components/UserRegisterModal.tsx
import { useState } from 'react';
import type { RoleWithPermissions } from '../../domain/RolePermission';
import type { CreateAdminUserPayload } from '../../domain/AdminUser';

interface UserRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: RoleWithPermissions[];
    onSubmit: (payload: CreateAdminUserPayload) => Promise<void>;
}

export const UserRegisterModal = ({ isOpen, onClose, roles, onSubmit }: UserRegisterModalProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ci, setCi] = useState('');
    const [phone, setPhone] = useState('');
    const [roleId, setRoleId] = useState(roles[0]?.id || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!firstName || !lastName || !email || !ci || !roleId) {
            setError('Por favor complete todos los campos obligatorios (*)');
            return;
        }

        try {
            setLoading(true);
            await onSubmit({
                firstName,
                lastName,
                email,
                password: password || 'Password123!',
                ci,
                phone,
                roleId,
            });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '1rem',
            }}
        >
            <div
                style={{
                    background: '#ffffff',
                    borderRadius: '10px',
                    width: '100%',
                    maxWidth: '520px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
            >
                {/* Modal Header */}
                <div
                    style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#f8fafc',
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                        Registrar Usuario Administrativo
                    </h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.1rem' }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.6rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                Nombre(s) *
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Ej. Carlos"
                                required
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                Apellido(s) *
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Ej. Mendoza"
                                required
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                            Correo Electrónico *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="carlos.mendoza@estacionort.com"
                            required
                            style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                C.I. / Documento *
                            </label>
                            <input
                                type="text"
                                value={ci}
                                onChange={(e) => setCi(e.target.value)}
                                placeholder="Ej. 71049128 SC"
                                required
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+591 710 49128"
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                Rol en el Sistema *
                            </label>
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none', background: '#fff' }}
                            >
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>
                                Contraseña Inicial
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Por defecto: Password123!"
                                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.65rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '0.45rem 0.9rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '0.45rem 1.15rem',
                                borderRadius: '6px',
                                border: 'none',
                                background: '#006D36',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                cursor: loading ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                            }}
                        >
                            {loading && <i className="fa-solid fa-spinner fa-spin"></i>}
                            <span>Crear Usuario</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
