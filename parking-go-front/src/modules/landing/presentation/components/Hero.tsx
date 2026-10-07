import { Link } from 'react-router';
import vehiculoImg from '../../../../assets/Vehiculo.png';

export function Hero() {
  return (
    <section className="hero-classgo" id="inicio">
      <div className="container hero-classgo-grid">
        <div className="hero-classgo-text reveal-up">
          <h1 className="classgo-hero-h1">
            Reserva de Parqueos<br />
            <span className="glow-cyan-text">Cuando más lo necesitas</span>
          </h1>
          <p className="classgo-hero-p">
            Alcanza tu destino sin estrés con parqueos personalizados de los mejores espacios en Santa Cruz.
            Conéctate con parqueos autorizados para asegurar tu éxito.
          </p>
          <div className="classgo-pill-btn-group">
            <a href="#explorar" className="btn-classgo-outline" id="btn-hero-cta-search">
              {/* FontAwesome placeholders */}
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M16.24 7.76l-8.48 8.48L5.64 12l8.48-8.48z"/></svg> Parqueos
            </a>
            <Link to="/auth?mode=register" className="btn-classgo-outline" id="btn-hero-cta-host">
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> Regístrate
            </Link>
            <Link to="/auth?mode=login" className="btn-classgo-outline">
              <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"/></svg> Ingresa
            </Link>
          </div>
        </div>

        {/* Right Mascot Showcase */}
        <div className="hero-classgo-mascot reveal-up delay-1">
          <img src={vehiculoImg} alt="Vehículo ParkinGo" className="mascot-img" />
          <div className="mascot-floor-shadow"></div>
        </div>
      </div>

      {/* Floating Corner Widgets (Bottom-Right) */}
      <div className="floating-corner-widgets">
        <button className="widget-btn help-btn" title="Centro de Ayuda">?</button>
        <button className="widget-btn user-btn" title="Mi Cuenta"><span className="red-badge"></span>👤</button>
        <button className="widget-btn action-btn" title="Reserva Rápida">⚡</button>
      </div>

      {/* Soft Gradient Blur Fade Overlay */}
      <div className="section-fade-divider fade-bottom-green"></div>

      {/* Organic Wave Divider */}
      <div className="hero-wave-divider">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,32 C280,85 560,95 840,50 C1120,5 1320,40 1440,55 L1440,120 L0,120 Z" fill="var(--color-background, #F4F6F4)"></path>
        </svg>
      </div>
    </section>
  );
}
