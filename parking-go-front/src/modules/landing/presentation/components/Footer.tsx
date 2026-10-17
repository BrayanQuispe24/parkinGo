import logopngImg from '../../../../assets/logo.png';

export const Footer = () => {
    return (
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
    );
};
