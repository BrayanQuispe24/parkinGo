export const PlansSection = () => {
    return (
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
    );
};
