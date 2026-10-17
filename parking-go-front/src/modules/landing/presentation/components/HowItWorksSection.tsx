import step1encuentrapngImg from '../../../../assets/step1_encuentra.png';
import step2reservapngImg from '../../../../assets/step2_reserva.png';
import step3estacionapngImg from '../../../../assets/step3_estaciona.png';

export const HowItWorksSection = () => {
    return (
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
    );
};
