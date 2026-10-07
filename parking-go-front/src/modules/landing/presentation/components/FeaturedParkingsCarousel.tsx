import { useState, useRef, useEffect } from 'react';
import { parkingSpotsData } from '../../data/parkingSpotsData';

export function FeaturedParkingsCarousel() {
    const [category, setCategory] = useState('all');
    const trackRef = useRef<HTMLDivElement>(null);
    const categoryTrackRef = useRef<HTMLDivElement>(null);
    const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());

    // Drag to scroll logic for listing carousel
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);

    // Auto scroll logic
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isDragging && trackRef.current) {
                const maxScrollLeft = trackRef.current.scrollWidth - trackRef.current.clientWidth;
                if (trackRef.current.scrollLeft >= maxScrollLeft - 10) {
                     trackRef.current.scrollBy({ left: -trackRef.current.scrollLeft, behavior: 'smooth' });
                } else {
                     trackRef.current.scrollBy({ left: 350, behavior: 'smooth' });
                }
            }
        }, 4000);
        return () => clearInterval(intervalId);
    }, [isDragging, category]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!trackRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - trackRef.current.offsetLeft);
        setScrollLeftState(trackRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !trackRef.current) return;
        e.preventDefault();
        const x = e.pageX - trackRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        trackRef.current.scrollLeft = scrollLeftState - walk;
    };

    // Category slider manual scroll
    const scrollCategoryLeft = () => {
        if (categoryTrackRef.current) categoryTrackRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };
    const scrollCategoryRight = () => {
        if (categoryTrackRef.current) categoryTrackRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

    const toggleWishlist = (id: number) => {
        setWishlisted(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filteredSpots = parkingSpotsData.filter(s => {
        if (category === 'all') return true;
        if (category === 'near') return s.zone === 'equipetrol'; // mock near
        if (category === 'hour') return true; 
        if (category === 'day') return s.type === 'commercial';
        if (category === 'monthly') return s.type === 'host';
        return true;
    });

    const scrollLeft = () => {
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (trackRef.current) {
            trackRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <>
            <section className="category-bar-section reveal-up">
                <div className="container">
                    <div className="category-carousel-wrapper">
                        <button className="category-carousel-btn prev" onClick={scrollCategoryLeft} aria-label="Anterior categoría">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <div className="category-slider" ref={categoryTrackRef}>
                            <button className={`category-pill ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory('all')}>
                                <i className="fa-solid fa-border-all"></i>
                                <span>Todos</span>
                            </button>
                            <button className={`category-pill ${category === 'near' ? 'active' : ''}`} onClick={() => setCategory('near')}>
                                <i className="fa-solid fa-location-crosshairs"></i>
                                <span>Cerca de mí</span>
                            </button>
                            <button className={`category-pill ${category === 'hour' ? 'active' : ''}`} onClick={() => setCategory('hour')}>
                                <i className="fa-solid fa-clock"></i>
                                <span>Por hora</span>
                            </button>
                            <button className={`category-pill ${category === 'day' ? 'active' : ''}`} onClick={() => setCategory('day')}>
                                <i className="fa-solid fa-calendar-day"></i>
                                <span>Por día</span>
                            </button>
                            <button className={`category-pill ${category === 'monthly' ? 'active' : ''}`} onClick={() => setCategory('monthly')}>
                                <i className="fa-solid fa-calendar-check"></i>
                                <span>Mensual</span>
                            </button>
                        </div>
                        <button className="category-carousel-btn next" onClick={scrollCategoryRight} aria-label="Siguiente categoría">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section className="section listing-grid-section" id="explorar">
                <div className="container">
                    <div className="grid-header-row reveal-up">
                        <div>
                            <h2 className="section-title-sm">Espacios de Parqueo Disponibles en Santa Cruz</h2>
                            <p className="section-subtext">Mostrando {filteredSpots.length} espacios disponibles para reserva en tiempo real</p>
                        </div>
                        <div className="carousel-header-controls">
                            <div className="cards-carousel-arrows">
                                <button className="carousel-control-btn prev" onClick={scrollLeft} aria-label="Parqueos anteriores" title="Anterior">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <button className="carousel-control-btn next" onClick={scrollRight} aria-label="Siguientes parqueos" title="Siguiente">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                            <div className="view-toggle-btns">
                                <button className="btn btn-outline btn-xs active"><i className="fa-solid fa-sliders"></i> Carrusel</button>
                                <a href="#mapa-envivo" className="btn btn-outline btn-xs"><i className="fa-solid fa-map-location-dot"></i> Ver en Mapa</a>
                            </div>
                        </div>
                    </div>

                    <div className="listing-carousel-wrapper">
                        <div 
                            className={`listing-cards-carousel ${isDragging ? 'dragging' : ''}`} 
                            ref={trackRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeave}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {filteredSpots.map(spot => (
                                <div key={spot.id} className="listing-card">
                                    <div className="card-image-wrap">
                                        <div className="card-carousel-track">
                                            <div className={`card-carousel-slide ${spot.type}`}>
                                                <div className="slide-visual-inner">
                                                    <i className={`fa-solid ${spot.iconClass}`}></i>
                                                    <span className="slide-caption-tag">{spot.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className={`card-wishlist-btn ${wishlisted.has(spot.id) ? 'active' : ''}`} 
                                            onClick={() => toggleWishlist(spot.id)}
                                        >
                                            <i className={wishlisted.has(spot.id) ? 'fa-solid fa-heart active' : 'fa-regular fa-heart'}></i>
                                        </button>
                                        <span className="card-badge-tag">{spot.badge}</span>
                                    </div>

                                    <div className="card-body">
                                        <div className="card-header-row">
                                            <h3 className="card-spot-title">{spot.name}</h3>
                                            <div className="card-rating">
                                                <i className="fa-solid fa-star"></i>
                                                <span>{spot.rating}</span>
                                            </div>
                                        </div>

                                        <div className="card-location-sub">
                                            <i className="fa-solid fa-location-dot" style={{color: 'var(--primary-light)'}}></i> {spot.distance}
                                        </div>

                                        <div className="card-meta-chips">
                                            <span className="card-chip"><i className="fa-solid fa-square-check" style={{color: 'var(--primary-light)'}}></i> {spot.availableSpots} Libres</span>
                                            <span className="card-chip"><i className="fa-solid fa-clock"></i> {spot.operatingHours}</span>
                                        </div>

                                        <div className="card-footer-row">
                                            <div className="card-price-block">
                                                <span className="price-primary">{spot.price}</span>
                                                <span className="price-secondary">{spot.dayPrice}</span>
                                            </div>
                                            <button className="btn btn-xs btn-primary">
                                                <i className="fa-solid fa-calendar-check"></i> Reservar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
