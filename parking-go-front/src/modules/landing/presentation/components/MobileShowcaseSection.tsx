import VehiculopngImg from '../../../../assets/Vehiculo.png';

export const MobileShowcaseSection = () => {
    return (
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
                                        <strong>Cero tiempo perdido:</strong> Encuentra y reserva tu espacio antes de salir de casa o del trabajo.
                                    </div>
                                </li>
                                <li className="benefit-item">
                                    <div className="benefit-item-icon">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <div className="benefit-item-text">
                                        <strong>Disponibilidad en tiempo real:</strong> Conoce plazas libres, ubicación exacta y tarifas transparentes.
                                    </div>
                                </li>
                                <li className="benefit-item">
                                    <div className="benefit-item-icon">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <div className="benefit-item-text">
                                        <strong>Ingreso 100% digital sin contacto:</strong> Accede a la garita escaneando tu código QR desde tu celular.
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
    );
};
