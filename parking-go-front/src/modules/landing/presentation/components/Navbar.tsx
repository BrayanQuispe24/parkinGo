import { Link } from 'react-router';
import logoImg from '../../../../assets/logo.png';

export function Navbar() {
  return (
    <header className="header classgo-pill-header" id="header">
        <div className="pill-header-wrapper">
            <Link to="/" className="logo">
                <img src={logoImg} alt="ParkinGo Logo" className="logo-img" />
                <span className="logo-text" style={{color: '#ffffff', fontSize: '1.6rem', fontWeight: 800}}>
                    Parkin<span style={{color: 'var(--color-accent)'}}>Go!</span>
                </span>
            </Link>

            <nav className="pill-nav-links">
                <a href="#explorar">Parqueos</a>
                <a href="#como-funciona">Cómo funciona</a>
                <a href="#explora-tipos">Zonas</a>
                <a href="#calculadora">Ser Anfitrión</a>
                <a href="#mapa-envivo">Mapa en Vivo</a>
            </nav>

            <div className="pill-header-actions">
                <button className="pill-lang-btn" title="Idioma Bolivia">
                    <span className="flag-icon" style={{fontSize: '1.05rem', marginRight: '0.3rem'}}>🇧🇴</span>
                    <span>Español</span>
                </button>

                <Link to="/auth?mode=login" className="btn-pill-login">Ingresar</Link>

                <div className="user-menu-dropdown-wrapper">
                    <div className="user-avatar-circle-btn" id="user-menu-trigger" title="Cuenta de Usuario">
                        {/* FontAwesome Placeholder */}
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </header>
  );
}

