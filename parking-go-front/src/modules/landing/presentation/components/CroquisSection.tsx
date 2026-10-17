export const CroquisSection = () => {
    return (
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
                            <span className="legend-item"><span className="legend-color out-of-service"></span> Fuera de servicio</span>
                            <span className="legend-item"><span className="legend-color selected"></span> Seleccionado</span>
                            <span className="legend-item"><span className="legend-color disabled"></span> Accesible</span>
                        </div>
                    </div>

                    <div className="croquis-layout-grid">
                        <div className="parking-spot-box spot-available" onClick={() => {}}>
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

                        <div className="parking-spot-box spot-disabled" onClick={() => {}}>
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
                            <i className="fa-solid fa-road"></i> VÍA PRINCIPAL DE CIRCULACIÓN VEHICULAR (SENTIDO ÚNICO) <i className="fa-solid fa-arrow-right"></i>
                        </div>

                        <div className="parking-spot-box spot-available" onClick={() => {}}>
                            <span className="spot-id">B-01</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        <div className="parking-spot-box spot-available" onClick={() => {}}>
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

                        <div className="parking-spot-box spot-available" onClick={() => {}}>
                            <span className="spot-id">B-05</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>

                        <div className="parking-spot-box spot-available" onClick={() => {}}>
                            <span className="spot-id">B-06</span>
                            <span className="spot-status-text"><i className="fa-solid fa-circle-check"></i> Disponible</span>
                            <span className="spot-rate-tag">Por hora</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
