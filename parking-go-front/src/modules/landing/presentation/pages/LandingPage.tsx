
import { useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Calculator } from '../components/Calculator';
import { InteractiveMap } from '../components/InteractiveMap';
import { FeaturedParkingsCarousel } from '../components/FeaturedParkingsCarousel.tsx';
import { AnimatedCarAssistant } from '../components/AnimatedCarAssistant';
import VehiculopngImg from '../../../../assets/Vehiculo.png';
import step1encuentrapngImg from '../../../../assets/step1_encuentra.png';
import step2reservapngImg from '../../../../assets/step2_reserva.png';
import step3estacionapngImg from '../../../../assets/step3_estaciona.png';
import parkingempresarial1789393502203pngImg from '../../../../assets/parking_empresarial_1789393502203.png';
import parkingcomercial1789393577233pngImg from '../../../../assets/parking_comercial_1789393577233.png';
import parkingaeropuerto1789393564642pngImg from '../../../../assets/parking_aeropuerto_1789393564642.png';
import parkingcentro1789393632373pngImg from '../../../../assets/parking_centro_1789393632373.png';
import parkinguniversidad1789393620994pngImg from '../../../../assets/parking_universidad_1789393620994.png';
import parkingeventos1789393554270pngImg from '../../../../assets/parking_eventos_1789393554270.png';
import admindashboardpreviewpngImg from '../../../../assets/admin_dashboard_preview.png';
import logopngImg from '../../../../assets/logo.png';

export function useScrollReveal() {
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
        if (!revealElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
}

export function useRoleTabs() {
    useEffect(() => {
        let currentRoleIndex = 0;
        const roleKeys = ['conductor', 'comercial', 'anfitrion'];
        let interval: ReturnType<typeof setInterval>;

        const setRoleCarousel = (index: number) => {
            currentRoleIndex = index;
            const role = roleKeys[index];
            if (!role) return;

            const tabs = document.querySelectorAll('.role-tab');
            const panels = document.querySelectorAll('.role-panel');

            tabs.forEach((t, idx) => {
                if (idx === index) t.classList.add('active');
                else t.classList.remove('active');
            });

            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${role}`);
            if (targetPanel) targetPanel.classList.add('active');
        };

        const startInterval = () => {
            interval = setInterval(() => {
                currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
                setRoleCarousel(currentRoleIndex);
            }, 5000);
        };

        startInterval();

        const handleTabClick = (idx: number) => {
            clearInterval(interval);
            setRoleCarousel(idx);
            startInterval();
        };

        const tabs = document.querySelectorAll('.role-tab');
        tabs.forEach((tab, idx) => {
            const listener = () => handleTabClick(idx);
            tab.addEventListener('click', listener);
            // Storing listener to remove it is complex without a map, but we don't strictly need to remove it on unmount if it's the main page.
        });

        const prevBtn = document.getElementById('role-prev-btn');
        const nextBtn = document.getElementById('role-next-btn');

        const handlePrev = () => {
            clearInterval(interval);
            currentRoleIndex = (currentRoleIndex - 1 + roleKeys.length) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        const handleNext = () => {
            clearInterval(interval);
            currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        if (prevBtn) prevBtn.addEventListener('click', handlePrev);
        if (nextBtn) nextBtn.addEventListener('click', handleNext);

        return () => {
            clearInterval(interval);
            if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
            if (nextBtn) nextBtn.removeEventListener('click', handleNext);
        };
    }, []);
}

export function LandingPage() {
    useScrollReveal();
    useRoleTabs();

    return (
        <>
            <div className="top-scroll-fade-overlay" id="top-scroll-fade"></div>
            <Navbar />

    <main>
        
        <section className="hero-classgo" id="inicio">
            <div className="container hero-classgo-grid">
                <div className="hero-classgo-text reveal-up">
                    <h1 className="classgo-hero-h1">
                        Reserva de Parqueos<br/>
                        <span className="glow-cyan-text">Cuando más lo necesitas</span>
                    </h1>
                    <p className="classgo-hero-p">
                        Alcanza tu destino sin estrés con parqueos personalizados de los mejores espacios en Santa Cruz.
                        Conéctate con parqueos autorizados para asegurar tu éxito.
                    </p>
                    <div className="classgo-pill-btn-group">
                        <a href="#explorar" className="btn-classgo-outline" id="btn-hero-cta-search">
                            <i className="fa-solid fa-compass"></i> Parqueos
                        </a>
                        <a href="auth.html?mode=register" className="btn-classgo-outline" id="btn-hero-cta-host">
                            <i className="fa-solid fa-user-plus"></i> Regístrate
                        </a>
                        <a href="auth.html?mode=login" className="btn-classgo-outline">
                            <i className="fa-solid fa-right-to-bracket"></i> Ingresa
                        </a>
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

        
        <FeaturedParkingsCarousel />

        
        <section className="section how-it-works-section" id="como-funciona"
            style={{background: 'var(--color-primary)', color: '#ffffff', padding: '6rem 0 5rem', position: 'relative'}}>
            
            
            <div className="section-fade-divider fade-top-green"></div>

            
            <div className="section-wave-divider wave-top fill-green">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,32 C280,85 560,95 840,50 C1120,5 1320,40 1440,55 L1440,120 L0,120 Z"></path>
                </svg>
            </div>

            <div className="container" style={{maxWidth: '1280px'}}>
                <div className="section-header reveal-up text-center mb-5">
                    <div className="section-subtitle-guide">
                        <span className="guide-line"></span>
                        <span>Una guía paso a paso</span>
                        <span className="guide-line"></span>
                    </div>
                    <h2 className="section-title-steps">
                        Estacionar Debería Ser Así De <span className="highlight-pill-text">Simple</span>
                    </h2>
                    <p className="section-subtext-steps">Encuentra y reserva los mejores parqueos en Santa Cruz, fácil y
                        rápido.</p>
                </div>

                <div className="classgo-steps-grid reveal-up delay-1">
                    
                    <div className="classgo-step-card">
                        <div className="step-badge-pill">Paso 1</div>
                        <div className="step-card-img-wrapper">
                            <img src={step1encuentrapngImg} alt="Encuentra tu parqueo"/>
                        </div>
                        <h3 className="classgo-step-title">Encuentra</h3>
                        <p className="classgo-step-desc">Busca parqueos cerca de tu destino y consulta su disponibilidad en
                            tiempo real.</p>
                        <a href="#explorar" className="btn-step-action-orange">Comenzar</a>
                    </div>

                    
                    <div className="classgo-step-card">
                        <div className="step-badge-pill">Paso 2</div>
                        <div className="step-card-img-wrapper">
                            <img src={step2reservapngImg} alt="Reserva tu espacio"/>
                        </div>
                        <h3 className="classgo-step-title">Reserva ahora</h3>
                        <p className="classgo-step-desc">Selecciona tu espacio y confirma tu reserva antes de llegar para
                            asegurar tu cupo.</p>
                        <a href="#explorar" className="btn-step-action-orange">Buscar Ahora</a>
                    </div>

                    
                    <div className="classgo-step-card">
                        <div className="step-badge-pill">Paso 3</div>
                        <div className="step-card-img-wrapper">
                            <img src={step3estacionapngImg} alt="Estaciona seguro"/>
                        </div>
                        <h3 className="classgo-step-title">Estaciona</h3>
                        <p className="classgo-step-desc">Llega a la garita, ingresa con tu código QR o placa y ocupa tu
                            plaza sin esperas.</p>
                        <a href="#explorar" className="btn-step-action-orange">Empecemos</a>
                    </div>

                    
                    <div className="classgo-step-card cta-card-highlight">
                        <div className="cta-icon-bubble">
                            <i className="fa-solid fa-person-running"></i>
                        </div>
                        <h3 className="classgo-cta-title">Comienza tu jornada</h3>
                        <p className="classgo-cta-desc">Comienza tu viaje sin estrés con nosotros. ¡Reserva tu primera
                            sesión hoy mismo!</p>
                        <a href="#explorar" className="btn-step-action-dark">Empieza ahora</a>
                    </div>
                </div>
            </div>
            
            <div className="section-wave-divider wave-bottom fill-bg">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,40 C320,90 640,100 960,45 C1200,10 1360,40 1440,50 L1440,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>

        
        <section className="section mobile-showcase-section" id="parqueo-en-mano">
            <div className="container" style={{maxWidth: '1240px'}}>
                <div className="mobile-feature-banner reveal-up">
                    <div className="banner-ambient-glow glow-1"></div>
                    <div className="banner-ambient-glow glow-2"></div>

                    
                    <div className="speech-bubble bubble-top-left float-anim-1">
                        <div className="bubble-icon-badge orange"><i className="fa-solid fa-bolt"></i></div>
                        <span>Reserva al Instante</span>
                        <div className="bubble-arrow arrow-right"></div>
                    </div>

                    <div className="speech-bubble bubble-top-right float-anim-2">
                        <div className="bubble-icon-badge green"><i className="fa-solid fa-location-dot"></i></div>
                        <span>Zonas Estratégicas</span>
                        <div className="bubble-arrow arrow-left"></div>
                    </div>

                    <div className="speech-bubble bubble-mid-left float-anim-3">
                        <div className="bubble-icon-badge blue"><i className="fa-solid fa-credit-card"></i></div>
                        <span>Pago 100% Digital</span>
                        <div className="bubble-arrow arrow-right"></div>
                    </div>

                    <div className="speech-bubble bubble-mid-right float-anim-4">
                        <div className="bubble-icon-badge purple"><i className="fa-solid fa-qrcode"></i></div>
                        <span>Acceso con QR</span>
                        <div className="bubble-arrow arrow-left"></div>
                    </div>

                    
                    <div className="phone-device-frame">
                        <div className="phone-dynamic-island">
                            <span className="island-camera-lens"></span>
                        </div>
                        <div className="phone-screen-glare"></div>
                        <div className="phone-screen-content">
                            <div className="phone-app-header">
                                <div className="phone-menu-btn"><i className="fa-solid fa-bars"></i></div>
                                <div className="phone-app-brand">Parkin<span>Go!</span></div>
                                <div className="phone-user-icon"><i className="fa-solid fa-circle-user"></i></div>
                            </div>
                            <div className="phone-app-hero">
                                <span className="phone-hero-tag"><i className="fa-solid fa-mobile-screen-button"></i> App
                                    Móvil</span>
                                <h3>Tu Parqueo al Alcance de la Mano</h3>
                                <div className="phone-search-capsule">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                    <span>¿A dónde te diriges hoy?</span>
                                </div>
                            </div>
                            <div className="phone-quick-actions">
                                <div className="phone-action-btn">
                                    <i className="fa-solid fa-map-location-dot"></i>
                                    <span>Mapa</span>
                                </div>
                                <div className="phone-action-btn active">
                                    <i className="fa-solid fa-calendar-check"></i>
                                    <span>Reserva</span>
                                </div>
                                <div className="phone-action-btn">
                                    <i className="fa-solid fa-qrcode"></i>
                                    <span>Mi QR</span>
                                </div>
                            </div>
                            <div className="phone-live-status-pill">
                                <span className="status-pulse-dot"></span>
                                <span>74 Parqueos Libres Ahora</span>
                            </div>
                            <div className="phone-mascot-wrapper">
                                <img src={VehiculopngImg} alt="Vehículo ParkinGo"/>
                            </div>
                        </div>
                    </div>

                    <div className="reveal-up delay-1" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', zIndex: 5, pointerEvents: 'none' }}>
                        <div className="floating-benefit-card" style={{ pointerEvents: 'auto' }}>
                            <div className="benefit-card-badge">
                            <i className="fa-solid fa-star" style={{color: '#FF9500'}}></i> Beneficios ParkinGo
                        </div>
                        <h4 className="benefit-card-title">
                            ¿Por qué tener un parqueo al alcance de tu mano?
                        </h4>

                        <ul className="benefit-item-list">
                            <li className="benefit-item">
                                <div className="benefit-item-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="benefit-item-text">
                                    <strong>Cero tiempo perdido:</strong> Encuentra y reserva tu espacio antes de salir
                                    de casa o del trabajo.
                                </div>
                            </li>
                            <li className="benefit-item">
                                <div className="benefit-item-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="benefit-item-text">
                                    <strong>Disponibilidad en tiempo real:</strong> Conoce plazas libres, ubicación
                                    exacta y tarifas transparentes.
                                </div>
                            </li>
                            <li className="benefit-item">
                                <div className="benefit-item-icon">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="benefit-item-text">
                                    <strong>Ingreso 100% digital sin contacto:</strong> Accede a la garita escaneando tu
                                    código QR desde tu celular.
                                </div>
                            </li>
                        </ul>

                        <a href="#explorar" className="btn-benefit-action">
                            <span>Encontrar Parqueo Ahora</span>
                            <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                    </div>

                </div>
            </div>
        </section>

        
        <section className="section explore-parking-types-section" id="explora-tipos">
            <div className="container">
                <div className="section-header text-center reveal-up">
                    <h2 className="section-title" style={{color: 'var(--color-primary)'}}>Explora Nuestros Parqueos</h2>
                    <p className="section-description" style={{color: 'var(--color-text-secondary)'}}>Parqueos listos en
                        distintas áreas clave de la ciudad</p>
                </div>

                <div className="masonry-grid reveal-up delay-1">
                    <div className="masonry-card tall">
                        <img src={parkingempresarial1789393502203pngImg} alt="Zona Empresarial"/>
                        <div className="masonry-content">
                            <h3>Zona Empresarial</h3>
                            <p>Equipetrol, Torres Empresariales, Oficinas.</p>
                        </div>
                    </div>
                    <div className="masonry-card short">
                        <img src={parkingcomercial1789393577233pngImg} alt="Centros Comerciales"/>
                        <div className="masonry-content">
                            <h3>Centros Comerciales</h3>
                            <p>Mall Ventura, Las Brisas, Supermercados.</p>
                        </div>
                    </div>
                    <div className="masonry-card short">
                        <img src={parkingaeropuerto1789393564642pngImg} alt="Aeropuerto"/>
                        <div className="masonry-content">
                            <h3>Aeropuerto y Viajes</h3>
                            <p>Viru Viru, El Trompillo, Terminal Bimodal.</p>
                        </div>
                    </div>
                    <div className="masonry-card tall">
                        <img src={parkingcentro1789393632373pngImg} alt="Centro Histórico"/>
                        <div className="masonry-content">
                            <h3>Centro Histórico</h3>
                            <p>Plaza 24 de Septiembre, Bancos, Comercios.</p>
                        </div>
                    </div>
                    <div className="masonry-card short">
                        <img src={parkinguniversidad1789393620994pngImg} alt="Universidades"/>
                        <div className="masonry-content">
                            <h3>Universidades</h3>
                            <p>UAGRM, Udabol, UPSA.</p>
                        </div>
                    </div>
                    <div className="masonry-card short">
                        <img src={parkingeventos1789393554270pngImg} alt="Eventos"/>
                        <div className="masonry-content">
                            <h3>Eventos</h3>
                            <p>Fexpocruz, Estadio Tahuichi, Conciertos.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <section className="section croquis-section" id="croquis-seccion">
            <div className="container">
                <div className="section-header text-center reveal-up">
                    <span className="section-subtitle">GESTIÓN DE PLAZAS</span>
                    <h2 className="section-title">Cada espacio, visible en tiempo real.</h2>
                    <p className="section-description">
                        Codificación visual clara de cada plaza. Reconocimiento rápido de estados con alto contraste.
                    </p>
                </div>

                <div className="croquis-container reveal-up delay-1">
                    <div className="croquis-header">
                        <div className="croquis-title">
                            <i className="fa-solid fa-layer-group"></i> Croquis Nivel 1 • Parqueo Central Equipetrol
                        </div>
                        <div className="croquis-legend">
                            <span className="legend-item"><span className="legend-color available"></span> Disponible</span>
                            <span className="legend-item"><span className="legend-color occupied"></span> Ocupado</span>
                            <span className="legend-item"><span className="legend-color reserved"></span> Reservado</span>
                            <span className="legend-item"><span className="legend-color out-of-service"></span> Fuera de
                                servicio</span>
                            <span className="legend-item"><span className="legend-color selected"></span> Seleccionado</span>
                            <span className="legend-item"><span className="legend-color disabled"></span> Accesible</span>
                        </div>
                    </div>

                    <div className="croquis-layout-grid">
                        
                        <div className="parking-spot-box spot-available"
                            onClick={() => {}}>
                            <span className="spot-id">A-01</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        
                        <div className="parking-spot-box spot-occupied">
                            <span className="spot-id">A-02</span>
                            <span className="spot-status-text"><i className="fa-solid fa-ban"></i> Ocupado</span>
                            <span className="spot-rate-tag">Placa 4821-KLX</span>
                        </div>

                        
                        <div className="parking-spot-box spot-reserved">
                            <span className="spot-id">A-03</span>
                            <span className="spot-status-text"><i className="fa-solid fa-clock"></i> Reservado</span>
                            <span className="spot-rate-tag">Placa 3912-BZX</span>
                        </div>

                        
                        <div className="parking-spot-box spot-selected">
                            <span className="spot-id">A-04</span>
                            <span className="spot-status-text"><i className="fa-solid fa-hand-pointer"></i> Seleccionado</span>
                            <span className="spot-rate-tag">En consulta</span>
                        </div>

                        
                        <div className="parking-spot-box spot-disabled"
                            onClick={() => {}}>
                            <span className="spot-id">A-05</span>
                            <span className="spot-status-text"><i className="fa-solid fa-wheelchair"></i> Accesible</span>
                            <span className="spot-rate-tag">Preferencia</span>
                        </div>

                        
                        <div className="parking-spot-box spot-out-of-service">
                            <span className="spot-id">A-06</span>
                            <span className="spot-status-text"><i className="fa-solid fa-wrench"></i> Mantenimiento</span>
                            <span className="spot-rate-tag">Bloqueado</span>
                        </div>

                        
                        <div className="croquis-street-lane">
                            <i className="fa-solid fa-road"></i> VÍA PRINCIPAL DE CIRCULACIÓN VEHICULAR (SENTIDO ÚNICO) <i
                                className="fa-solid fa-arrow-right"></i>
                        </div>

                        
                        <div className="parking-spot-box spot-available"
                            onClick={() => {}}>
                            <span className="spot-id">B-01</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        <div className="parking-spot-box spot-available"
                            onClick={() => {}}>
                            <span className="spot-id">B-02</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        <div className="parking-spot-box spot-occupied">
                            <span className="spot-id">B-03</span>
                            <span className="spot-status-text"><i className="fa-solid fa-ban"></i> Ocupado</span>
                            <span className="spot-rate-tag">Placa 2019-LKP</span>
                        </div>

                        <div className="parking-spot-box spot-reserved">
                            <span className="spot-id">B-04</span>
                            <span className="spot-status-text"><i className="fa-solid fa-clock"></i> Reservado</span>
                            <span className="spot-rate-tag">Placa 5821-XTR</span>
                        </div>

                        <div className="parking-spot-box spot-available"
                            onClick={() => {}}>
                            <span className="spot-id">B-05</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        <div className="parking-spot-box spot-available"
                            onClick={() => {}}>
                            <span className="spot-id">B-06</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        
        <InteractiveMap />

        
        <section className="section roles-section" id="roles">
            <div className="container">
                <div className="section-header text-center reveal-up">
                    <span className="section-subtitle">Ecosistema Multirol</span>
                    <h2 className="section-title">Diseñado para cada actor de la movilidad urbana</h2>
                    <p className="section-description">
                        ParkinGo conecta tres perfiles clave con herramientas hechas a la medida en entorno Web y Móvil.
                    </p>
                </div>

                
                <div className="role-tabs">
                    <button className="role-tab active" data-role="conductor">
                        <i className="fa-solid fa-car"></i>
                        <span>Conductores / Clientes</span>
                    </button>
                    <button className="role-tab" data-role="comercial">
                        <i className="fa-solid fa-building-shield"></i>
                        <span>Parqueos Comerciales (B2B)</span>
                    </button>
                    <button className="role-tab" data-role="anfitrion">
                        <i className="fa-solid fa-house-circle-check"></i>
                        <span>Anfitriones Particulares (C2C)</span>
                    </button>
                </div>

                
                <div className="role-content-wrapper surface-card">
                    <button className="role-carousel-nav prev" id="role-prev-btn" onClick={() => {}}
                        aria-label="Anterior componente">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="role-carousel-nav next" id="role-next-btn" onClick={() => {}}
                        aria-label="Siguiente componente">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                    
                    <div className="role-panel active" id="panel-conductor">
                        <div className="grid grid-2 align-center calculator-wrapper">
                            <div className="calc-box surface-card reveal-left">
                                <span className="role-badge"><i className="fa-solid fa-mobile-screen"></i> App Móvil
                                    Conductor</span>
                                <h3>Encuentra espacio en tiempo real y llega sin estrés</h3>
                                <p>
                                    La app móvil te permite buscar parqueos cercanos a tu destino, comparar precios por
                                    hora o por día, reservar con anticipación y obtener la ruta directa.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-shield-halved"></i> <strong>Garantía de Cupo:</strong> Tu
                                        reserva congela el espacio por el tiempo acordado.</li>
                                    <li><i className="fa-solid fa-map-pin"></i> <strong>Navegación GPS:</strong> Integración
                                        directa con mapas y rutas recomendadas.</li>
                                    <li><i className="fa-solid fa-bell"></i> <strong>Alertas Inteligentes:</strong>
                                        Notificaciones cuando tu reserva esté por vencer.</li>
                                    <li><i className="fa-solid fa-receipt"></i> <strong>Pago Flexible:</strong> Tarifa por
                                        servicio transparente de Bs. 1 a Bs. 5.</li>
                                </ul>
                                <button className="btn btn-accent btn-open-demo-role" data-demo-type="conductor">
                                    <i className="fa-solid fa-play"></i> Probar Demo Conductor
                                </button>
                            </div>

                            <div className="role-visual reveal-right">
                                <div className="phone-device-frame">
                                    <div className="phone-dynamic-island">
                                        <span className="island-camera-lens"></span>
                                    </div>
                                    <div className="phone-screen-glare"></div>
                                    <div className="phone-screen-content">
                                        <div className="phone-app-header">
                                            <div className="phone-menu-btn"><i className="fa-solid fa-bars"></i></div>
                                            <div className="phone-app-brand">Parkin<span>Go!</span></div>
                                            <div className="phone-user-icon"><i className="fa-solid fa-circle-user"></i></div>
                                        </div>
                                        <div className="phone-app-hero">
                                            <span className="phone-hero-tag"><i className="fa-solid fa-mobile-screen-button"></i> App Móvil</span>
                                            <h3>Tu Parqueo al Alcance de la Mano</h3>
                                            <div className="phone-search-capsule">
                                                <i className="fa-solid fa-magnifying-glass"></i>
                                                <span>¿A dónde te diriges hoy?</span>
                                            </div>
                                        </div>
                                        <div className="phone-quick-actions">
                                            <div className="phone-action-btn">
                                                <i className="fa-solid fa-map-location-dot"></i>
                                                <span>Mapa</span>
                                            </div>
                                            <div className="phone-action-btn active">
                                                <i className="fa-solid fa-calendar-check"></i>
                                                <span>Reserva</span>
                                            </div>
                                            <div className="phone-action-btn">
                                                <i className="fa-solid fa-qrcode"></i>
                                                <span>Mi QR</span>
                                            </div>
                                        </div>
                                        <div className="phone-live-status-pill">
                                            <span className="status-pulse-dot"></span>
                                            <span>74 Parqueos Libres Ahora</span>
                                        </div>
                                        <div className="phone-mascot-wrapper">
                                            <img src={VehiculopngImg} alt="Vehículo ParkinGo"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="role-panel" id="panel-comercial">
                        <div className="grid grid-2 align-center">
                            <div className="role-info">
                                <span className="role-badge b2b"><i className="fa-solid fa-desktop"></i> PARA
                                    ADMINISTRADORES</span>
                                <h3>Tu parqueo bajo control.</h3>
                                <p>
                                    Gestiona plazas, reservas, operadores, disponibilidad y movimientos desde una sola
                                    plataforma profesional.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-chart-line"></i> <strong>Reportes y Ocupación:</strong>
                                        Métricas detalladas de ingresos y horas pico.</li>
                                    <li><i className="fa-solid fa-users-gear"></i> <strong>Gestión de Operadores:</strong>
                                        Asigna empleados para control en garita.</li>
                                    <li><i className="fa-solid fa-tags"></i> <strong>Precios Dinámicos:</strong> Ajusta
                                        tarifas para días festivos o eventos.</li>
                                    <li><i className="fa-solid fa-handshake"></i> <strong>Planes B2B Flexibles:</strong>
                                        Adaptados a la escala de tu parqueo.</li>
                                </ul>
                                <button className="btn btn-accent btn-open-demo-role" data-demo-type="comercial">
                                    <i className="fa-solid fa-play"></i> Probar Dashboard Web B2B
                                </button>
                            </div>

                            <div className="role-visual">
                                
                                <div className="surface-card"
                                    style={{overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)'}}>
                                    <img src={admindashboardpreviewpngImg}
                                        alt="ParkinGo Web Admin Dashboard Preview"
                                        style={{width: '100%', height: 'auto', display: 'block'}}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="role-panel" id="panel-anfitrion">
                        <div className="grid grid-2 align-center">
                            <div className="role-info">
                                <span className="role-badge c2c"><i className="fa-solid fa-coins"></i> PARA ANFITRIONES</span>
                                <h3>Convierte tu espacio en una oportunidad.</h3>
                                <p>
                                    ¿Tienes un garaje, patio o terreno cerca del Estadio, Fexpocruz, UAGRM o Centro?
                                    Publícalo sin pagar mensualidad fija y gana dinero por cada reserva.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-percent"></i> <strong>Modelo 0 Bs. Inicial:</strong> Solo
                                        pagas comisión por reserva concretada.</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> <strong>Horarios Flexibles:</strong>
                                        Elige qué días y horas alquilar tu plaza.</li>
                                    <li><i className="fa-solid fa-bolt"></i> <strong>Tarifas para Eventos:</strong>
                                        Incrementa tus ingresos durante eventos masivos.</li>
                                    <li><i className="fa-solid fa-lock"></i> <strong>Verificación de Usuarios:</strong>
                                        Conductores identificados por su placa.</li>
                                </ul>
                                <button className="btn btn-accent btn-open-demo-role" data-demo-type="anfitrion">
                                    <i className="fa-solid fa-plus-circle"></i> Registrar mi Garaje Gratis
                                </button>
                            </div>

                            <div className="role-visual">
                                <div className="surface-card" style={{padding: '2.2rem'}}>
                                    <div
                                        style={{fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                                        <i className="fa-solid fa-house-flag"></i> ANFITRIÓN PARKINGO
                                    </div>
                                    <h4 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.4rem'}}>Garaje
                                        Privado Calle 21 de Septiembre</h4>
                                    <p
                                        style={{fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem'}}>
                                        <i className="fa-solid fa-location-dot" style={{color: 'var(--color-accent)'}}></i> A 2
                                        cuadras del Estadio Tahuichi
                                    </p>

                                    <div
                                        style={{background: 'var(--color-background)', border: '1px solid var(--color-border)', padding: '1.2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem'}}>
                                        <span style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)'}}>Ganancia
                                            estimada este mes:</span>
                                        <div
                                            style={{fontSize: '2.2rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '0.2rem', fontFamily: 'var(--font-heading)'}}>
                                            Bs. 1,450</div>
                                    </div>

                                    <div
                                        style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                                        <span style={{color: 'var(--color-text-secondary)'}}>Estado del Garaje Hoy:</span>
                                        <span className="badge-status badge-disponible"><i
                                                className="fa-solid fa-circle-check"></i> DISPONIBLE</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="role-carousel-dots">
                        <span className="role-dot active" onClick={() => {}} title="Conductor"></span>
                        <span className="role-dot" onClick={() => {}} title="Parqueo Comercial"></span>
                        <span className="role-dot" onClick={() => {}} title="Anfitrión Particular"></span>
                    </div>
                </div>
            </div>
        </section>

        
        <Calculator />

        
        <section className="section plans-section" id="planes">
            <div className="container">
                <div className="section-header text-center reveal-up">
                    <span className="section-subtitle">MODELO COMERCIAL</span>
                    <h2 className="section-title">Elige la modalidad perfecta para tu parqueo</h2>
                    <p className="section-description">
                        Sin costos ocultos. Diseñado para adaptarse desde un garaje particular de 1 plaza hasta parqueos
                        comerciales de más de 100 espacios.
                    </p>
                </div>

                <div className="pricing-carousel-wrapper">
                    <button className="plans-carousel-nav prev" id="plan-prev-btn" onClick={() => {}}
                        aria-label="Anterior plan">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <div className="grid grid-3 pricing-grid" id="pricing-grid">
                        
                        <div className="pricing-card reveal-left delay-1">
                            <div className="plan-tag">RECOMENDADO ANFITRIONES</div>
                            <h3 className="plan-title">Plan Comisión Sin Cuota Fija</h3>
                            <div className="plan-price">
                                <span className="price-amount">Bs. 0</span>
                                <span className="price-period">/ mes</span>
                            </div>
                            <p className="plan-desc">Ideal para garajes, patios, terrenos y parqueos pequeños sin inversión
                                inicial.</p>

                            <div className="plan-fee-highlight">
                                <i className="fa-solid fa-percent"></i> <strong>20% de comisión</strong> únicamente por
                                reserva concretada.
                            </div>

                            <ul className="plan-features">
                                <li><i className="fa-solid fa-check"></i> Registro de hasta 5 espacios</li>
                                <li><i className="fa-solid fa-check"></i> Panel de control de disponibilidad</li>
                                <li><i className="fa-solid fa-check"></i> Tarifas ajustables por evento</li>
                                <li><i className="fa-solid fa-check"></i> Verificación de placas</li>
                                <li><i className="fa-solid fa-check"></i> Cobro automático</li>
                            </ul>

                            <button className="btn btn-secondary btn-block btn-select-plan"
                                data-plan="Plan Comisión 20%">Registrarme Gratis</button>
                        </div>

                        
                        <div className="pricing-card popular-card reveal-up delay-2">
                            <div className="popular-badge"><i className="fa-solid fa-star"></i> MÁS POPULAR B2B</div>
                            <h3 className="plan-title">Parqueo Comercial Pro</h3>
                            <div className="plan-price">
                                <span className="price-amount">Bs. 350</span>
                                <span className="price-period">/ mes</span>
                            </div>
                            <p className="plan-desc">Para empresas y parqueos comerciales que buscan máxima visibilidad y
                                herramientas completas.</p>

                            <div className="plan-fee-highlight">
                                <i className="fa-solid fa-gem"></i> <strong>Comisión reducida o fija</strong> +
                                Posicionamiento VIP en mapa.
                            </div>

                            <ul className="plan-features">
                                <li><i className="fa-solid fa-check"></i> Espacios e ingresos ilimitados</li>
                                <li><i className="fa-solid fa-check"></i> Multi-operador con roles y turnos</li>
                                <li><i className="fa-solid fa-check"></i> Posicionamiento destacado en búsquedas</li>
                                <li><i className="fa-solid fa-check"></i> Módulo de clientes frecuentes</li>
                                <li><i className="fa-solid fa-check"></i> Reportes avanzados en Excel/PDF</li>
                            </ul>

                            <button className="btn btn-accent btn-block btn-select-plan"
                                data-plan="Parqueo Comercial Pro">Contratar Plan Comercial</button>
                        </div>

                        
                        <div className="pricing-card reveal-right delay-3">
                            <div className="plan-tag">PARA CONDUCTORES</div>
                            <h3 className="plan-title">Tarifa por Reserva Conductor</h3>
                            <div className="plan-price">
                                <span className="price-amount">Bs. 1 - 5</span>
                                <span className="price-period">/ reserva</span>
                            </div>
                            <p className="plan-desc">Aplicada al cliente por el uso de mapas, reserva garantizada y rutas
                                directas.</p>

                            <div className="plan-fee-highlight">
                                <i className="fa-solid fa-car"></i> <strong>Ahorro garantizado</strong> en tiempo y consumo
                                de combustible.
                            </div>

                            <ul className="plan-features">
                                <li><i className="fa-solid fa-check"></i> Reserva inmediata o anticipada</li>
                                <li><i className="fa-solid fa-check"></i> Visualización de mapa en tiempo real</li>
                                <li><i className="fa-solid fa-check"></i> Alertas y recordatorios de vencimiento</li>
                                <li><i className="fa-solid fa-check"></i> Rutas directas por GPS</li>
                                <li><i className="fa-solid fa-check"></i> Historial y comprobante digital</li>
                            </ul>

                            <button className="btn btn-outline btn-block btn-select-plan"
                                data-plan="Tarifa por Reserva Conductor">Ver Tarifas Conductor</button>
                        </div>
                    </div>
                    <button className="plans-carousel-nav next" id="plan-next-btn" onClick={() => {}}
                        aria-label="Siguiente plan">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>

        
        <section className="section cta-banner-section">
            <div className="container">
                <div className="cta-banner-card reveal-up">
                    <div className="cta-content">
                        <h2>Muévete mejor con ParkinGo.</h2>
                        <p>Encuentra un parqueo o comienza a gestionar tus espacios desde una sola plataforma.</p>
                    </div>
                    <div className="cta-buttons">
                        <a href="#explorar" className="btn btn-accent btn-lg" id="btn-cta-demo">
                            <i className="fa-solid fa-magnifying-glass"></i> Buscar parqueo
                        </a>
                        <a href="#calculadora" className="btn btn-secondary btn-lg" id="btn-cta-contact">
                            <i className="fa-solid fa-house-circle-check"></i> Registrar mi parqueo
                        </a>
                    </div>
                </div>
            </div>
            
            <div className="section-wave-divider wave-bottom fill-dark">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0,45 C360,95 720,80 1080,40 C1260,20 1380,45 1440,60 L1440,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    </main>

    
    <footer className="footer reveal-up">
        
        <div className="section-fade-divider fade-top-dark"></div>

        
        <div className="section-wave-divider wave-top fill-dark">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M0,32 C280,85 560,95 840,50 C1120,5 1320,40 1440,55 L1440,120 L0,120 Z"></path>
            </svg>
        </div>
        <div className="container">
            <div className="footer-top grid grid-4">
                <div className="footer-col brand-col">
                    <a href="#" className="logo">
                        <img src={logopngImg} alt="ParkinGo Logo" className="logo-img"/>
                        <span className="logo-text">Parkin<span>Go</span></span>
                    </a>
                    <p>
                        Tecnología para encontrar, reservar y gestionar espacios de estacionamiento en Santa Cruz de la
                        Sierra, Bolivia.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
                        <a href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Producto</h4>
                    <ul>
                        <li><a href="#como-funciona">Cómo funciona</a></li>
                        <li><a href="#explorar">Buscar parqueos</a></li>
                        <li><a href="#croquis-seccion">Croquis de plazas</a></li>
                        <li><a href="#mapa-envivo">Mapa en vivo</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Empresa</h4>
                    <ul>
                        <li><a href="#roles">Para conductores</a></li>
                        <li><a href="#roles">Para propietarios</a></li>
                        <li><a href="#planes">Planes y tarifas</a></li>
                        <li><a href="#calculadora">Calculadora de ingresos</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Acceso & Soporte</h4>
                    <ul>
                        <li><a href="#" className="btn-open-demo-role" data-demo-type="conductor">Iniciar sesión</a></li>
                        <li><a href="#calculadora">Registrar mi parqueo</a></li>
                        <li><i className="fa-solid fa-envelope"></i> contacto@parkingo.bo</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom text-center">
                <p>&copy; 2026 ParkinGo Bolivia. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>
    <AnimatedCarAssistant />
        </>
    );
}
