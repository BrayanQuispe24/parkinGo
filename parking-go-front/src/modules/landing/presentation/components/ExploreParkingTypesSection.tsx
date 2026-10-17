import parkingempresarial1789393502203pngImg from '../../../../assets/parking_empresarial_1789393502203.png';
import parkingcomercial1789393577233pngImg from '../../../../assets/parking_comercial_1789393577233.png';
import parkingaeropuerto1789393564642pngImg from '../../../../assets/parking_aeropuerto_1789393564642.png';
import parkingcentro1789393632373pngImg from '../../../../assets/parking_centro_1789393632373.png';
import parkinguniversidad1789393620994pngImg from '../../../../assets/parking_universidad_1789393620994.png';
import parkingeventos1789393554270pngImg from '../../../../assets/parking_eventos_1789393554270.png';

export const ExploreParkingTypesSection = () => {
    return (
        <section className="section explore-parking-types-section" id="explora-tipos">
            <div className="container">
                <div className="section-header text-center reveal-up">
                    <h2 className="section-title" style={{color: 'var(--color-primary)'}}>Explora Nuestros Parqueos</h2>
                    <p className="section-description" style={{color: 'var(--color-text-secondary)'}}>Parqueos listos en distintas áreas clave de la ciudad</p>
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
    );
};
