import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, loading, error, success, setError } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Por favor complete el correo electrónico y la contraseña.');
            return;
        }

        const user = await login(email, password);
        if (user) {
            setTimeout(() => {
                const operatorRoles = ['PARKING_OPERATOR', 'OPERATOR', 'operador'];
                const parkingRoles = ['PARKING_ADMIN', 'HOST', 'anfitrion'];
                if (operatorRoles.includes(user.role)) {
                    navigate('/dashboard/operator');
                } else if (parkingRoles.includes(user.role)) {
                    navigate('/dashboard/parking-admin');
                } else if (user.role === 'GENERAL_ADMIN') {
                    navigate('/dashboard/general-admin');
                } else if (user.role === 'SUPER_ADMIN' || user.role === 'admin') {
                    navigate('/dashboard/admin');
                } else {
                    navigate('/dashboard'); 
                }
            }, 1200);
        }
    };

    return (
        <div className="auth-form-panel active">
            {error && (
                <div className="auth-feedback-toast error" style={{ display: 'flex' }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> <span>{error}</span>
                </div>
            )}
            {success && (
                <div className="auth-feedback-toast success" style={{ display: 'flex' }}>
                    <i className="fa-solid fa-circle-check"></i> <span>{success}</span>
                </div>
            )}

            <form onSubmit={handleLoginSubmit} noValidate>
                <div className="form-group">
                    <label className="form-label" htmlFor="login-email">
                        Correo Electrónico <span className="required-star">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                        <i className="fa-solid fa-envelope input-icon"></i>
                        <input type="email" id="login-email" className="form-control"
                            placeholder="ejemplo@parkingo.bo" required 
                            value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="login-password">
                        Contraseña <span className="required-star">*</span>
                    </label>
                    <div className="input-icon-wrapper">
                        <i className="fa-solid fa-lock input-icon"></i>
                        <input type={showPassword ? 'text' : 'password'} id="login-password" className="form-control"
                            placeholder="••••••••••••" required 
                            value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="button" className="btn-toggle-password" title="Mostrar/ocultar contraseña"
                            onClick={() => setShowPassword(!showPassword)}>
                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div className="form-options-row">
                    <label className="checkbox-container">
                        <input type="checkbox" id="login-remember" defaultChecked />
                        <span>Recordar mi sesión</span>
                    </label>
                    <a href="#" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Funcionalidad de recuperación simulada. Envíe correo a soporte@parkingo.bo'); }}>¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className={`btn-auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
                    <i className="fa-solid fa-spinner spinner-icon"></i>
                    <span className="btn-text-content">Ingresar a ParkinGo</span>
                </button>
            </form>
        </div>
    );
};
