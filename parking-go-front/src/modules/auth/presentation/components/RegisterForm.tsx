import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { DocumentUploadField } from './DocumentUploadField';
import { EmailOtpModal } from './EmailOtpModal';
import { TermsModal } from './TermsModal';

export const RegisterForm = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('conductor');
    const [estado, setEstado] = useState('Santa Cruz');
    const [birthdate, setBirthdate] = useState('');
    const [sexo, setSexo] = useState('M');
    const [ciNumber, setCiNumber] = useState('');
    const [ciExp, setCiExp] = useState('SC');
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [termsError, setTermsError] = useState<string | null>(null);

    // Estado para documentos PDF según rol (Strategy Pattern)
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [documentError, setDocumentError] = useState<string | null>(null);

    // Estado del modal de verificación OTP de 6 dígitos
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [otpError, setOtpError] = useState<string | null>(null);

    const { register, verifyOtp, resendOtp, loading, error, success } = useAuth();
    const navigate = useNavigate();

    const handleRoleChange = (newRole: string) => {
        setRole(newRole);
        setDocumentError(null);
        if (newRole === 'conductor') {
            setDocumentFile(null);
        }
    };

    let score = 0;
    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    let strengthColor = '#EF4444';
    let strengthLabelText = 'Fuerza de la contraseña';
    if (password) {
        if (score < 40) {
            strengthColor = '#EF4444';
            strengthLabelText = 'Débil';
        } else if (score < 75) {
            strengthColor = '#F59E0B';
            strengthLabelText = 'Aceptable';
        } else {
            strengthColor = '#22C55E';
            strengthLabelText = 'Segura';
        }
    }

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms) {
            setTermsError('Debes aceptar obligatoriamente los Términos y Condiciones del servicio para poder registrarte.');
            return;
        }
        setTermsError(null);
        setOtpError(null);

        // Validación de documentación PDF obligatoria según rol (Strategy Pattern)
        if ((role === 'anfitrion' || role === 'admin') && !documentFile) {
            setDocumentError('Es obligatorio adjuntar la documentación de respaldo en formato PDF para este rol.');
            return;
        }
        setDocumentError(null);

        const user = await register({
            fullname,
            email,
            password,
            role,
            estado,
            birthdate,
            sexo,
            ci: `${ciNumber} ${ciExp}`,
            acceptedTerms: true,
            document: documentFile || undefined,
        });

        if (user) {
            setRegisteredEmail(email);
            setIsOtpModalOpen(true);
        }
    };

    const handleVerifyOtp = async (code: string): Promise<boolean> => {
        setOtpError(null);
        const verifiedUser = await verifyOtp(registeredEmail, code);
        if (verifiedUser) {
            setIsOtpModalOpen(false);
                const operatorRoles = ['PARKING_OPERATOR', 'OPERATOR', 'operador'];
                const parkingRoles = ['PARKING_ADMIN', 'HOST', 'anfitrion'];
                if (operatorRoles.includes(verifiedUser.role)) {
                    navigate('/dashboard/operator');
                } else if (parkingRoles.includes(verifiedUser.role)) {
                    navigate('/dashboard/parking-admin');
                } else if (verifiedUser.role === 'GENERAL_ADMIN') {
                    navigate('/dashboard/general-admin');
                } else if (['SUPER_ADMIN', 'admin'].includes(verifiedUser.role)) {
                    navigate('/dashboard/admin');
                } else {
                    navigate('/dashboard');
                }
            return true;
        } else {
            setOtpError(error || 'Código incorrecto o expirado');
            return false;
        }
    };

    const handleResendOtp = async (): Promise<boolean> => {
        setOtpError(null);
        const ok = await resendOtp(registeredEmail);
        if (!ok && error) {
            setOtpError(error);
        }
        return ok;
    };

    return (
        <div className="auth-form-panel active">
            {(error || termsError) && (
                <div className="auth-feedback-toast error" style={{ display: 'flex' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> <span>{termsError || error}</span>
                </div>
            )}
            {success && (
                <div className="auth-feedback-toast success" style={{ display: 'flex' }}>
                    <i className="fa-solid fa-circle-check"></i> <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate>
                <div className="form-group-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-fullname">
                            Nombre Completo <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-user input-icon"></i>
                            <input type="text" id="reg-fullname" className="form-control"
                                placeholder="Ej. Juan Pérez" required 
                                value={fullname} onChange={e => setFullname(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">
                            Correo Electrónico <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-envelope input-icon"></i>
                            <input type="email" id="reg-email" className="form-control"
                                placeholder="juan.perez@ejemplo.com" required 
                                value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">
                        Contraseña <span className="required-star">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                        <i className="fa-solid fa-lock input-icon"></i>
                        <input type={showPassword ? 'text' : 'password'} id="reg-password" className="form-control"
                            placeholder="Mínimo 6 caracteres" required 
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="button" className="btn-toggle-password" title="Mostrar/ocultar contraseña"
                            onClick={() => setShowPassword(!showPassword)}>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    <div className="password-strength-wrap">
                        <div className="password-strength-bar">
                            <div className="password-strength-fill" style={{ width: `${password ? score : 0}%`, backgroundColor: strengthColor }}></div>
                        </div>
                        <div className="password-strength-text">
                            <span>{strengthLabelText}</span>
                            <span>{password && score >= 75 ? 'Seguridad alta' : (password ? 'Seguridad media/baja' : '')}</span>
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        Tipo de usuario <span className="required-star">*</span>
                    </label>
                    <div className="roles-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        <label className="role-badge-option">
                            <input type="radio" name="reg_role" value="conductor" checked={role === 'conductor'} onChange={e => handleRoleChange(e.target.value)} />
                            <div className="role-badge-card">
                                <div className="role-badge-icon"><i className="fa-solid fa-car"></i></div>
                                <div className="role-badge-info">
                                    <h5>Conductor</h5>
                                    <p>Reservo parqueos</p>
                                </div>
                            </div>
                        </label>
                        <label className="role-badge-option">
                            <input type="radio" name="reg_role" value="anfitrion" checked={role === 'anfitrion'} onChange={e => handleRoleChange(e.target.value)} />
                            <div className="role-badge-card">
                                <div className="role-badge-icon"><i className="fa-solid fa-warehouse"></i></div>
                                <div className="role-badge-info">
                                    <h5>Anfitrión</h5>
                                    <p>Alquilo mi parqueo</p>
                                </div>
                            </div>
                        </label>
                        <label className="role-badge-option">
                            <input type="radio" name="reg_role" value="admin" checked={role === 'admin'} onChange={e => handleRoleChange(e.target.value)} />
                            <div className="role-badge-card">
                                <div className="role-badge-icon"><i className="fa-solid fa-shield-halved"></i></div>
                                <div className="role-badge-info">
                                    <h5>Admin Parqueo</h5>
                                    <p>Gestión completa</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-estado">
                            Estado / Depto. <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-location-dot input-icon"></i>
                            <select id="reg-estado" className="form-control" required value={estado} onChange={e => setEstado(e.target.value)}>
                                {['Santa Cruz', 'La Paz', 'Cochabamba', 'Oruro', 'Potosí', 'Tarija', 'Chuquisaca', 'Beni', 'Pando'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-birthdate">
                            Fecha Nacimiento <span className="required-star">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                            <i className="fa-solid fa-calendar-days input-icon"></i>
                            <input type="date" id="reg-birthdate" className="form-control" required value={birthdate} onChange={e => setBirthdate(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-group">
                        <label className="form-label">
                            Sexo <span className="required-star">*</span>
                        </label>
                        <div className="sex-options-group">
                            <label className="sex-pill-option">
                                <input type="radio" name="reg_sexo" value="M" checked={sexo === 'M'} onChange={e => setSexo(e.target.value)} />
                                <span className="sex-pill-label"><i className="fa-solid fa-mars"></i> Masc.</span>
                            </label>
                            <label className="sex-pill-option">
                                <input type="radio" name="reg_sexo" value="F" checked={sexo === 'F'} onChange={e => setSexo(e.target.value)} />
                                <span className="sex-pill-label"><i className="fa-solid fa-venus"></i> Fem.</span>
                            </label>
                            <label className="sex-pill-option">
                                <input type="radio" name="reg_sexo" value="O" checked={sexo === 'O'} onChange={e => setSexo(e.target.value)} />
                                <span className="sex-pill-label">Otro</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-ci-number">
                            Carnet de Identidad (C.I.) <span className="required-star">*</span>
                        </label>
                        <div className="ci-input-group">
                            <input type="text" id="reg-ci-number" className="form-control ci-number-input no-icon"
                                placeholder="Ej. 8492014" required value={ciNumber} onChange={e => setCiNumber(e.target.value)} />
                            <select id="reg-ci-exp" className="form-control ci-expedido-select no-icon" required value={ciExp} onChange={e => setCiExp(e.target.value)}>
                                {['SC', 'LP', 'CB', 'OR', 'PT', 'TJ', 'CH', 'BE', 'PA'].map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Subida de Documentación PDF Condicional (Strategy Pattern) */}
                {(role === 'anfitrion' || role === 'admin') && (
                    <DocumentUploadField
                        file={documentFile}
                        onChange={(f) => {
                            setDocumentFile(f);
                            if (f) setDocumentError(null);
                        }}
                        roleName={role}
                        error={documentError}
                    />
                )}

                {/* Términos y Condiciones Obligatorios */}
                <div className="terms-checkbox-group" style={{ margin: '0.45rem 0 0.65rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <input
                        type="checkbox"
                        id="reg-terms"
                        checked={acceptedTerms}
                        onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                            if (e.target.checked) setTermsError(null);
                        }}
                        style={{ accentColor: '#006D36', width: '16px', height: '16px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                        required
                    />
                    <label htmlFor="reg-terms" style={{ fontSize: '0.78rem', color: '#4A5E52', lineHeight: '1.3', cursor: 'pointer' }}>
                        He leído y acepto obligatoriamente los{' '}
                        <button
                            type="button"
                            onClick={() => setIsTermsModalOpen(true)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#006D36', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit' }}
                        >
                            Términos y Condiciones del Servicio
                        </button>{' '}
                        <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                </div>

                <button type="submit" className={`btn-auth-submit ${loading ? 'loading' : ''}`} style={{ marginTop: '0.35rem' }} disabled={loading}>
                    <i className="fa-solid fa-spinner spinner-icon"></i>
                    <span className="btn-text-content">Crear mi Cuenta en ParkinGo</span>
                </button>
            </form>

            {/* Modal de Términos y Condiciones Dinámico */}
            <TermsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
                onAccept={() => {
                    setAcceptedTerms(true);
                    setTermsError(null);
                    setIsTermsModalOpen(false);
                }}
            />

            {/* Modal de Verificación de Correo OTP (6 dígitos) */}
            <EmailOtpModal
                isOpen={isOtpModalOpen}
                email={registeredEmail}
                isLoading={loading}
                errorMessage={otpError || (error && isOtpModalOpen ? error : null)}
                onVerify={handleVerifyOtp}
                onResend={handleResendOtp}
                onClose={() => setIsOtpModalOpen(false)}
            />
        </div>
    );
};
