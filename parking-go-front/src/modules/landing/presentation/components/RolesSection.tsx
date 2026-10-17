import VehiculopngImg from '../../../../assets/Vehiculo.png';
import admindashboardpreviewpngImg from '../../../../assets/admin_dashboard_preview.png';

export const RolesSection = () => {
    return (
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
                                <span className="role-badge"><i className="fa-solid fa-mobile-screen"></i> App Móvil Conductor</span>
                                <h3>Encuentra espacio en tiempo real y llega sin estrés</h3>
                                <p>
                                    La app móvil te permite buscar parqueos cercanos a tu destino, comparar precios por
                                    hora o por día, reservar con anticipación y obtener la ruta directa.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-shield-halved"></i> <strong>Garantía de Cupo:</strong> Tu reserva congela el espacio por el tiempo acordado.</li>
                                    <li><i className="fa-solid fa-map-pin"></i> <strong>Navegación GPS:</strong> Integración directa con mapas y rutas recomendadas.</li>
                                    <li><i className="fa-solid fa-bell"></i> <strong>Alertas Inteligentes:</strong> Notificaciones cuando tu reserva esté por vencer.</li>
                                    <li><i className="fa-solid fa-receipt"></i> <strong>Pago Flexible:</strong> Tarifa por servicio transparente de Bs. 1 a Bs. 5.</li>
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
                                <span className="role-badge b2b"><i className="fa-solid fa-desktop"></i> PARA ADMINISTRADORES</span>
                                <h3>Tu parqueo bajo control.</h3>
                                <p>
                                    Gestiona plazas, reservas, operadores, disponibilidad y movimientos desde una sola plataforma profesional.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-chart-line"></i> <strong>Reportes y Ocupación:</strong> Métricas detalladas de ingresos y horas pico.</li>
                                    <li><i className="fa-solid fa-users-gear"></i> <strong>Gestión de Operadores:</strong> Asigna empleados para control en garita.</li>
                                    <li><i className="fa-solid fa-tags"></i> <strong>Precios Dinámicos:</strong> Ajusta tarifas para días festivos o eventos.</li>
                                    <li><i className="fa-solid fa-handshake"></i> <strong>Planes B2B Flexibles:</strong> Adaptados a la escala de tu parqueo.</li>
                                </ul>
                                <button className="btn btn-accent btn-open-demo-role" data-demo-type="comercial">
                                    <i className="fa-solid fa-play"></i> Probar Dashboard Web B2B
                                </button>
                            </div>

                            <div className="role-visual">
                                <div className="surface-card" style={{overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)'}}>
                                    <img src={admindashboardpreviewpngImg} alt="ParkinGo Web Admin Dashboard Preview" style={{width: '100%', height: 'auto', display: 'block'}}/>
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
                                    ¿Tienes un garaje, patio o terreno cerca del Estadio, Fexpocruz, UAGRM o Centro? Publícalo sin pagar mensualidad fija y gana dinero por cada reserva.
                                </p>
                                <ul className="feature-list">
                                    <li><i className="fa-solid fa-percent"></i> <strong>Modelo 0 Bs. Inicial:</strong> Solo pagas comisión por reserva concretada.</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> <strong>Horarios Flexibles:</strong> Elige qué días y horas alquilar tu plaza.</li>
                                    <li><i className="fa-solid fa-bolt"></i> <strong>Tarifas para Eventos:</strong> Incrementa tus ingresos durante eventos masivos.</li>
                                    <li><i className="fa-solid fa-lock"></i> <strong>Verificación de Usuarios:</strong> Conductores identificados por su placa.</li>
                                </ul>
                                <button className="btn btn-accent btn-open-demo-role" data-demo-type="anfitrion">
                                    <i className="fa-solid fa-plus-circle"></i> Registrar mi Garaje Gratis
                                </button>
                            </div>

                            <div className="role-visual">
                                <div className="surface-card" style={{padding: '2.2rem'}}>
                                    <div style={{fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                                        <i className="fa-solid fa-house-flag"></i> ANFITRIÓN PARKINGO
                                    </div>
                                    <h4 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.4rem'}}>Garaje Privado Calle 21 de Septiembre</h4>
                                    <p style={{fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem'}}>
                                        <i className="fa-solid fa-location-dot" style={{color: 'var(--color-accent)'}}></i> A 2 cuadras del Estadio Tahuichi
                                    </p>

                                    <div style={{background: 'var(--color-background)', border: '1px solid var(--color-border)', padding: '1.2rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '1.5rem'}}>
                                        <span style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)'}}>Ganancia estimada este mes:</span>
                                        <div style={{fontSize: '2.2rem', fontWeight: '700', color: 'var(--color-primary)', marginTop: '0.2rem', fontFamily: 'var(--font-heading)'}}>Bs. 1,450</div>
                                    </div>

                                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                                        <span style={{color: 'var(--color-text-secondary)'}}>Estado del Garaje Hoy:</span>
                                        <span className="badge-status badge-disponible"><i className="fa-solid fa-circle-check"></i> DISPONIBLE</span>
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
    );
};
