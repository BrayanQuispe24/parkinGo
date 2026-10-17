import { Link } from 'react-router';
import VehiculopngImg from '../../../../assets/Vehiculo.png';
import logoSinFondoImg from '../../../../assets/logoSinFondo.png';

export const HeroSection = () => {
    return (
        <section className="hero-classgo" id="inicio">
            {/* Watermark Santa Cruz & ParkinGo background emblem */}
            <div 
                className="hero-watermark" 
                style={{ backgroundImage: `url(${logoSinFondoImg})` }}
                aria-hidden="true"
            />

            <div className="container hero-classgo-grid">
                <div className="hero-classgo-text reveal-up">
                    <h1 className="classgo-hero-h1">
                        Reserva de Parqueos<br/>
                        <span className="glow-cyan-text">
                            Cuando más lo<br/>
                            necesitas
                        </span>
                    </h1>
                    <p className="classgo-hero-p">
                        Alcanza tu destino sin estrés con parqueos personalizados de los mejores espacios en Santa Cruz.
                        Conéctate con parqueos autorizados para asegurar tu éxito.
                    </p>
                    <div className="classgo-pill-btn-group">
                        <a href="#explorar" className="btn-classgo-outline" id="btn-hero-cta-search">
                            <i className="fa-solid fa-compass"></i> Parqueos
                        </a>
                        <Link to="/auth?mode=register" className="btn-classgo-outline" id="btn-hero-cta-host">
                            <i className="fa-solid fa-user-plus"></i> Regístrate
                        </Link>
                        <Link to="/auth?mode=login" className="btn-classgo-outline">
                            <i className="fa-solid fa-right-to-bracket"></i> Ingresa
                        </Link>
                    </div>
                </div>

                <div className="hero-classgo-mascot reveal-up delay-1">
                    <img src={VehiculopngImg} alt="Vehículo ParkinGo" className="mascot-img"/>
                    <div className="mascot-floor-shadow"></div>
                </div>
            </div>

            <div className="floating-corner-widgets">
                <button className="widget-btn help-btn" title="Centro de Ayuda"><i
                        className="fa-solid fa-question"></i></button>
                <button className="widget-btn user-btn" title="Mi Cuenta"><i className="fa-solid fa-user"></i><span
                        className="red-badge"></span></button>
                <button className="widget-btn action-btn" title="Reserva Rápida"><i className="fa-solid fa-bolt"></i></button>
            </div>

            <div className="section-fade-divider fade-bottom-green"></div>

            <div className="hero-wave-divider">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,32 C280,85 560,95 840,50 C1120,5 1320,40 1440,55 L1440,120 L0,120 Z" fill="var(--color-background, #F4F6F4)"></path>
                </svg>
            </div>
        </section>
    );
};
