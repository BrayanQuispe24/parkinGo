export const CtaBannerSection = () => {
    return (
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
    );
};
