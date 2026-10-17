import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import logoImg from '../../../../assets/logo.png';
import vehiculoImg from '../../../../assets/Vehiculo.png';

export const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    
    const [activeTab, setActiveTab] = useState<'login' | 'register'>(
        (mode === 'register' || mode === 'registro') ? 'register' : 'login'
    );

    useEffect(() => {
        document.body.classList.add('auth-body');
        return () => {
            document.body.classList.remove('auth-body');
        };
    }, []);

    return (
        <div className="auth-wrapper">
            <div className="auth-hero-pane">
                <div className="auth-hero-top">
                    <Link to="/" className="auth-brand-logo">
                        <img src={logoImg} alt="ParkinGo Logo" />
                        <span>Parkin<span style={{ color: 'var(--color-accent, #FF9500)' }}>Go!</span></span>
                    </Link>
                </div>

                <div className="auth-hero-content">
                    <h1 className="auth-hero-title">
                        Tu Espacio de Parqueo<br />
                        <span className="glow-accent">Al Alcance de un Clic</span>
                    </h1>
                    <p className="auth-hero-desc">
                        La plataforma inteligente para conductores y propietarios de parqueos en Santa Cruz. Reserva, monetiza y gestiona sin complicaciones.
                    </p>

                    <div className="auth-hero-features">
                        <div className="hero-feature-item">
                            <div className="hero-feature-icon">
                                <i className="fa-solid fa-shield-halved"></i>
                            </div>
                            <div className="hero-feature-text">
                                <h4>Acceso Seguro y Verificado</h4>
                                <p>Tus datos y transacciones protegidas con estándares enterprise.</p>
                            </div>
                        </div>

                        <div className="hero-feature-item">
                            <div className="hero-feature-icon">
                                <i className="fa-solid fa-map-location-dot"></i>
                            </div>
                            <div className="hero-feature-text">
                                <h4>Disponibilidad en Tiempo Real</h4>
                                <p>Encuentra lugares libres en zonas de alto tráfico instantáneamente.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-hero-mascot">
                    <img src={vehiculoImg} alt="Vehículo ParkinGo Ilustración" />
                </div>
            </div>

            <div className="auth-form-pane">
                <div className="auth-top-nav">
                    <Link to="/" className="btn-back-home">
                        <i className="fa-solid fa-arrow-left"></i> Volver a la Landing
                    </Link>
                </div>

                <div className="auth-card">
                    <div className="auth-card-header">
                        <h2 className="auth-card-title">
                            {activeTab === 'register' ? 'Crear una Cuenta' : '¡Bienvenido de Nuevo!'}
                        </h2>
                        <p className="auth-card-subtitle">
                            {activeTab === 'register' ? 'Únete a ParkinGo y gestiona o reserva parqueos en Bolivia' : 'Ingresa tus credenciales para acceder a tu panel'}
                        </p>
                    </div>

                    <div className="auth-tabs-container">
                        <button type="button" className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
                            <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión
                        </button>
                        <button type="button" className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>
                            <i className="fa-solid fa-user-plus"></i> Registrarse
                        </button>
                    </div>

                    {activeTab === 'login' && <LoginForm />}
                    {activeTab === 'register' && <RegisterForm />}

                    <div className="auth-card-footer">
                        Al ingresar o registrarte en ParkinGo, aceptas nuestros<br />
                        <a href="#">Términos y Condiciones</a> y nuestra <a href="#">Política de Privacidad</a>.
                    </div>
                </div>
            </div>
        </div>
    );
};
