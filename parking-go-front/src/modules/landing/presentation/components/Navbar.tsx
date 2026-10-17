import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import logoImg from '../../../../assets/logo.png';
import { useAuthStore } from '../../../../store/useAuthStore';

export function Navbar() {
  const { user, isAuthenticated, logoutState } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logoutState();
    setMenuOpen(false);
    navigate('/auth?mode=login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardPath = user?.role === 'DRIVER' || user?.role === 'conductor'
    ? '/dashboard'
    : '/dashboard/admin';

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

                {isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Link to={dashboardPath} className="btn-pill-login" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-user" style={{ marginRight: '0.4rem' }}></i>
                      {user?.firstName || 'Mi Panel'}
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="btn-pill-login" 
                      style={{ background: '#ef4444', borderColor: '#ef4444', color: '#ffffff', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                      title="Cerrar Sesión"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/auth?mode=login" className="btn-pill-login">Ingresar</Link>

                    <div className="user-menu-dropdown-wrapper" ref={menuRef}>
                        <div 
                            className="user-avatar-circle-btn" 
                            id="user-menu-trigger" 
                            title="Cuenta de Usuario"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <i className="fa-solid fa-user-plus"></i>
                        </div>
                        <div className={`user-menu-popover ${menuOpen ? 'show' : ''}`} id="user-menu-popover">
                            <Link to="/auth?mode=login" className="popover-item highlight" onClick={() => setMenuOpen(false)}>
                                <i className="fa-solid fa-right-to-bracket"></i> Iniciar Sesión / Registro
                            </Link>
                            <Link to="/dashboard" className="popover-item" onClick={() => setMenuOpen(false)}>
                                <i className="fa-solid fa-shield-halved"></i> Admin General
                            </Link>
                            <Link to="/dashboard/admin" className="popover-item" onClick={() => setMenuOpen(false)}>
                                <i className="fa-solid fa-square-parking"></i> Admin de Parqueo
                            </Link>
                            <div className="popover-divider"></div>
                            <a href="#calculadora" className="popover-item" onClick={() => setMenuOpen(false)}>
                                <i className="fa-solid fa-house-circle-check"></i> Registrar mi Parqueo
                            </a>
                        </div>
                    </div>
                  </>
                )}
            </div>
        </div>
    </header>
  );
}

