/* ==========================================
   ParkinGo - Airbnb Grid & Santa Cruz Map Simulator (Sober Theme)
   Dataset, Listing Card Generator & Filter Sync
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSantaCruzMapAndGrid();
});

// ParkinGo Santa Cruz Parking Dataset (Airbnb Style Cards + Map Pins)
const parkingSpotsData = [
    {
        id: 1,
        name: "Garaje Privado Equipetrol Norte",
        type: "host",
        typeName: "Anfitrión Particular C2C",
        zone: "equipetrol",
        address: "Calle Dr. Arnaldo Gutiérrez #14",
        distance: "A 200m del Mall Ventura",
        coords: [-17.7590, -63.1930],
        price: "Bs. 5 / hr",
        dayPrice: "Bs. 25 / día",
        availableSpots: 3,
        totalCapacity: 4,
        rating: 4.9,
        reviewsCount: 38,
        badge: "Favorito de Anfitrión",
        iconClass: "fa-warehouse",
        operatingHours: "08:00 - 22:00",
        description: "Garaje privado cerrado en residencia particular en Equipetrol Norte. Portón eléctrico y máxima atención por el anfitrión Don Mario.",
        features: ["Portón Eléctrico", "Sombra", "Atención Directa"],
        slides: [
            { icon: "fa-warehouse", label: "Portón Eléctrico & Entorno", bg: "host" },
            { icon: "fa-shield-halved", label: "Zona Techada Privada", bg: "host" },
            { icon: "fa-car", label: "Plaza Asignada Don Mario", bg: "host" }
        ]
    },
    {
        id: 2,
        name: "Parqueo Comercial Equipetrol San Martín",
        type: "commercial",
        typeName: "Parqueo Comercial B2B",
        zone: "equipetrol",
        address: "Av. San Martín esq. 4to Anillo, Equipetrol",
        distance: "Frente a Torres Equipetrol",
        coords: [-17.7554, -63.1972],
        price: "Bs. 7 / hr",
        dayPrice: "Bs. 35 / día",
        availableSpots: 18,
        totalCapacity: 45,
        rating: 4.85,
        reviewsCount: 64,
        badge: "Verificado B2B",
        iconClass: "fa-building-circle-check",
        operatingHours: "07:00 - 23:00",
        description: "Estacionamiento techado de alta capacidad con cámaras HD, garita con operador y barrera automática.",
        features: ["Techado", "Camaras HD", "Operador 24h"],
        slides: [
            { icon: "fa-building-circle-check", label: "Acceso Comercial B2B", bg: "commercial" },
            { icon: "fa-square-parking", label: "Plazas Subterráneas Techadas", bg: "commercial" },
            { icon: "fa-cash-register", label: "Garita y Barrera Automática", bg: "commercial" }
        ]
    },
    {
        id: 3,
        name: "Parqueo Centro Histórico Plaza 24",
        type: "commercial",
        typeName: "Parqueo Comercial B2B",
        zone: "centro",
        address: "Calle René Moreno #140 (Centro)",
        distance: "A 1 cuadra de Plaza 24 de Septiembre",
        coords: [-17.7833, -63.1821],
        price: "Bs. 6 / hr",
        dayPrice: "Bs. 30 / día",
        availableSpots: 12,
        totalCapacity: 30,
        rating: 4.8,
        reviewsCount: 52,
        badge: "Ubicación Central",
        iconClass: "fa-landmark",
        operatingHours: "06:30 - 21:30",
        description: "Punto clave para trámites bancarios e institucionales en el centro de Santa Cruz.",
        features: ["Zona Banquera", "Techado", "Lector de Placas"],
        slides: [
            { icon: "fa-landmark", label: "Frente a Plaza 24 de Septiembre", bg: "commercial" },
            { icon: "fa-camera", label: "Lector de Placas LPR", bg: "commercial" },
            { icon: "fa-shield-cat", label: "Seguridad Privada 24/7", bg: "commercial" }
        ]
    },
    {
        id: 4,
        name: "Patio Particular René Moreno",
        type: "host",
        typeName: "Anfitrión Particular C2C",
        zone: "centro",
        address: "Calle Ballivián esq. La Paz #85",
        distance: "Centro Histórico",
        coords: [-17.7865, -63.1805],
        price: "Bs. 4 / hr",
        dayPrice: "Bs. 20 / día",
        availableSpots: 2,
        totalCapacity: 3,
        rating: 4.92,
        reviewsCount: 29,
        badge: "Económico",
        iconClass: "fa-house-user",
        operatingHours: "08:00 - 20:00",
        description: "Patio privado interno con sombra de árboles. Seguro y muy accesible.",
        features: ["Económico", "Sombra de Árboles", "Seguro"],
        slides: [
            { icon: "fa-house-user", label: "Patio con Sombra de Árboles", bg: "host" },
            { icon: "fa-key", label: "Ingreso Interno Cerrado", bg: "host" },
            { icon: "fa-tree", label: "Entorno Residencial Tranquilo", bg: "host" }
        ]
    },
    {
        id: 5,
        name: "Estacionamiento UAGRM Campus",
        type: "commercial",
        typeName: "Parqueo Comercial B2B",
        zone: "uagrm",
        address: "Av. Busch 2do Anillo (Frente a UAGRM)",
        distance: "Frente a Campus Universitario",
        coords: [-17.7760, -63.1950],
        price: "Bs. 4 / hr",
        dayPrice: "Bs. 18 / día",
        availableSpots: 22,
        totalCapacity: 50,
        rating: 4.75,
        reviewsCount: 88,
        badge: "Tarifa Estudiantil",
        iconClass: "fa-graduation-cap",
        operatingHours: "07:00 - 22:00",
        description: "Espacio amplio orientado a estudiantes y docentes de la universidad UAGRM.",
        features: ["Estudiantil", "Vigilancia", "Cupo Seguro"],
        slides: [
            { icon: "fa-graduation-cap", label: "Frente a Campus Universitario", bg: "commercial" },
            { icon: "fa-bars-progress", label: "Control de Ingreso y Salida", bg: "commercial" },
            { icon: "fa-users-gear", label: "Personal de Vigilancia UAGRM", bg: "commercial" }
        ]
    },
    {
        id: 6,
        name: "Terreno Eventos FEXPOCRUZ",
        type: "host",
        typeName: "Anfitrión Particular C2C",
        zone: "fexpocruz",
        address: "Av. Roca y Coronado 4to Anillo",
        distance: "A 50m de la Puerta Principal Fexpocruz",
        coords: [-17.7880, -63.2090],
        price: "Bs. 10 / hr",
        dayPrice: "Bs. 40 / evento",
        availableSpots: 5,
        totalCapacity: 6,
        rating: 5.0,
        reviewsCount: 41,
        badge: "Alta Demanda Ferias",
        iconClass: "fa-ticket",
        operatingHours: "24 Horas en Días de Feria",
        description: "Terreno completamente privado e iluminado a pasos de FEXPOCRUZ y Feria Barrio Lindo.",
        features: ["Especial Ferias", "Terreno Cercado", "Seguridad 24h"],
        slides: [
            { icon: "fa-ticket", label: "Acceso Inmediato a FEXPOCRUZ", bg: "host" },
            { icon: "fa-lightbulb", label: "Cercado e Iluminación Nocturna", bg: "host" },
            { icon: "fa-user-shield", label: "Seguridad Dedicada en Eventos", bg: "host" }
        ]
    },
    {
        id: 7,
        name: "Garaje Estadio Tahuichi Aguilera",
        type: "host",
        typeName: "Anfitrión Particular C2C",
        zone: "estadio",
        address: "Calle Choferes del Chaco #320",
        distance: "A 2 cuadras del Estadio Tahuichi",
        coords: [-17.7950, -63.1890],
        price: "Bs. 12 / evento",
        dayPrice: "Bs. 30 / día",
        availableSpots: 8,
        totalCapacity: 10,
        rating: 4.95,
        reviewsCount: 33,
        badge: "Especial Conciertos/Fútbol",
        iconClass: "fa-futbol",
        operatingHours: "Días de Partido / Concierto",
        description: "Reserva asegurada para partidos de fútbol y eventos musicales en el Estadio Tahuichi.",
        features: ["Cerca del Estadio", "Reserva Anticipada", "Ingreso Rápido"],
        slides: [
            { icon: "fa-futbol", label: "Zona Cercana Estadio Tahuichi", bg: "host" },
            { icon: "fa-road-barrier", label: "Salida Rápida Descongestionada", bg: "host" },
            { icon: "fa-circle-check", label: "Espacio Garantizado Pre-Partido", bg: "host" }
        ]
    }
];

let mapInstance = null;
let currentMarkers = [];
let wishlistedIds = new Set();
let spotSlideIndexMap = {};

function initSantaCruzMapAndGrid() {
    const mapElement = document.getElementById('santa-cruz-map');
    const gridContainer = document.getElementById('listing-cards-grid');

    if (!gridContainer) return;

    // Render Initial Grid Cards
    renderListingCards(parkingSpotsData);

    if (mapElement) {
        // Initialize Map
        const santaCruzCenter = [-17.7833, -63.1880];
        mapInstance = L.map('santa-cruz-map', {
            center: santaCruzCenter,
            zoom: 13,
            zoomControl: true
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(mapInstance);

        renderMapMarkers(parkingSpotsData);
    }

    // Category Slider Filters (Airbnb Category Bar)
    const categoryPills = document.querySelectorAll('.category-pill');
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const category = pill.getAttribute('data-cat');
            filterSpots(category, 'all');
        });
    });

    // Map Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const typeFilter = btn.getAttribute('data-filter');
            const zoneFilter = document.getElementById('select-zone').value;
            filterSpots('all', zoneFilter, typeFilter);
        });
    });

    // Zone Select Listener
    const zoneSelect = document.getElementById('select-zone');
    if (zoneSelect) {
        zoneSelect.addEventListener('change', (e) => {
            filterSpots('all', e.target.value);
        });
    }

    // Airbnb Hero Search Capsule Button Trigger
    const heroSearchBtn = document.getElementById('btn-hero-search');
    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', () => {
            const selectedZone = document.getElementById('search-zone-select').value;
            filterSpots('all', selectedZone);

            // Scroll down to grid
            const exploreSection = document.getElementById('explorar');
            if (exploreSection) exploreSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Setup Main Cards Carousel Controls & Drag Behavior
    setupCardsCarouselControls();
}

// Render Airbnb Cards Carousel
function renderListingCards(spots) {
    const gridContainer = document.getElementById('listing-cards-grid');
    const resultCountEl = document.getElementById('grid-results-count');

    if (!gridContainer) return;

    if (resultCountEl) {
        resultCountEl.textContent = `Mostrando ${spots.length} espacios disponibles para reserva en tiempo real`;
    }

    if (spots.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); width: 100%;">
                <i class="fa-solid fa-parking" style="font-size: 3rem; color: var(--primary-light); margin-bottom: 1rem; display:block;"></i>
                <h4>No se encontraron parqueos para esta selección</h4>
                <p>Intenta seleccionar "Ver todas las zonas de Santa Cruz".</p>
            </div>
        `;
        updateCarouselPaginationDots();
        return;
    }

    gridContainer.innerHTML = spots.map(spot => {
        const isWishlisted = wishlistedIds.has(spot.id);
        const heartClass = isWishlisted ? 'fa-solid fa-heart active' : 'fa-regular fa-heart';
        const currentSlide = spotSlideIndexMap[spot.id] || 0;
        const slides = spot.slides || [{ icon: spot.iconClass, label: spot.name, bg: spot.type }];

        return `
            <div class="listing-card">
                <div class="card-image-wrap" data-spot-id="${spot.id}">
                    <div class="card-carousel-track" style="transform: translateX(-${currentSlide * 100}%);">
                        ${slides.map((slide, idx) => `
                            <div class="card-carousel-slide ${slide.bg}">
                                <div class="slide-visual-inner">
                                    <i class="fa-solid ${slide.icon}"></i>
                                    <span class="slide-caption-tag">${slide.label}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    ${slides.length > 1 ? `
                        <button class="card-carousel-nav prev" onclick="event.stopPropagation(); changeCardSlide(${spot.id}, -1)" aria-label="Anterior foto">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button class="card-carousel-nav next" onclick="event.stopPropagation(); changeCardSlide(${spot.id}, 1)" aria-label="Siguiente foto">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                        <div class="card-carousel-dots">
                            ${slides.map((_, idx) => `
                                <span class="carousel-dot ${idx === currentSlide ? 'active' : ''}" onclick="event.stopPropagation(); setCardSlide(${spot.id}, ${idx})"></span>
                            `).join('')}
                        </div>
                    ` : ''}

                    <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist(${spot.id}, this)">
                        <i class="${heartClass}"></i>
                    </button>
                    <span class="card-badge-tag">${spot.badge}</span>
                </div>

                <div class="card-body">
                    <div class="card-header-row">
                        <h3 class="card-spot-title">${spot.name}</h3>
                        <div class="card-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${spot.rating}</span>
                        </div>
                    </div>

                    <div class="card-location-sub">
                        <i class="fa-solid fa-location-dot" style="color: var(--primary-light);"></i> ${spot.distance}
                    </div>

                    <div class="card-meta-chips">
                        <span class="card-chip"><i class="fa-solid fa-square-check" style="color: var(--primary-light);"></i> ${spot.availableSpots} Libres</span>
                        <span class="card-chip"><i class="fa-solid fa-clock"></i> ${spot.operatingHours}</span>
                    </div>

                    <div class="card-footer-row">
                        <div class="card-price-block">
                            <span class="price-primary">${spot.price}</span>
                            <span class="price-secondary">${spot.dayPrice}</span>
                        </div>
                        <button class="btn btn-xs btn-primary" onclick="openBookingModal('${spot.name}', '${spot.price}')">
                            <i class="fa-solid fa-calendar-check"></i> Reservar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Reset carousel position and refresh dots
    gridContainer.scrollLeft = 0;
    setTimeout(() => {
        updateCarouselPaginationDots();
        resetCarouselAutoplay();
    }, 50);
}

// Render Leaflet Map Pins with Sober Colors
function renderMapMarkers(spots) {
    if (!mapInstance) return;

    currentMarkers.forEach(m => mapInstance.removeLayer(m));
    currentMarkers = [];

    spots.forEach(spot => {
        const isCommercial = spot.type === 'commercial';
        const markerColor = isCommercial ? '#3b82f6' : '#0d9488';
        const iconSymbol = isCommercial ? 'fa-building' : 'fa-house-user';

        const customIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `
                <div style="
                    background: ${markerColor};
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 15px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
                    border: 2px solid #ffffff;
                    cursor: pointer;
                ">
                    <i class="fa-solid ${iconSymbol}"></i>
                </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 17]
        });

        const marker = L.marker(spot.coords, { icon: customIcon }).addTo(mapInstance);

        const popupContent = `
            <div class="map-popup-card">
                <h4>${spot.name}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${spot.address}</p>
                <div class="map-popup-price">${spot.price} • ${spot.availableSpots} Libres</div>
                <button class="btn btn-xs btn-primary btn-map-select" onclick="selectSpotForSidePanel(${spot.id})">
                    <i class="fa-solid fa-circle-info"></i> Detalle y Reserva
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => selectSpotForSidePanel(spot.id));
        currentMarkers.push(marker);
    });
}

// Unified Filter Logic
function filterSpots(category = 'all', zone = 'all', type = 'all') {
    let filtered = parkingSpotsData;

    if (category !== 'all') {
        if (category === 'host' || category === 'commercial') {
            filtered = filtered.filter(s => s.type === category);
        } else {
            filtered = filtered.filter(s => s.zone === category);
        }
    }

    if (zone !== 'all') {
        filtered = filtered.filter(s => s.zone === zone);
    }

    if (type !== 'all') {
        filtered = filtered.filter(s => s.type === type);
    }

    renderListingCards(filtered);

    if (mapInstance) {
        renderMapMarkers(filtered);
        if (filtered.length > 0) {
            mapInstance.flyTo(filtered[0].coords, 14, { duration: 1.2 });
        } else {
            mapInstance.flyTo([-17.7833, -63.1880], 13, { duration: 1.2 });
        }
    }
}

// Global Wishlist Toggle Function
window.toggleWishlist = function(spotId, btnEl) {
    if (wishlistedIds.has(spotId)) {
        wishlistedIds.delete(spotId);
        btnEl.classList.remove('active');
        btnEl.querySelector('i').className = 'fa-regular fa-heart';
    } else {
        wishlistedIds.add(spotId);
        btnEl.classList.add('active');
        btnEl.querySelector('i').className = 'fa-solid fa-heart active';
    }
};

window.selectSpotForSidePanel = function(spotId) {
    const spot = parkingSpotsData.find(s => s.id === spotId);
    if (!spot) return;

    const titleEl = document.getElementById('spot-detail-title');
    const typeEl = document.getElementById('spot-detail-type');
    const bodyEl = document.getElementById('spot-detail-body');

    if (titleEl && typeEl && bodyEl) {
        titleEl.textContent = spot.name;
        typeEl.textContent = spot.typeName;
        typeEl.style.background = spot.type === 'commercial' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 148, 136, 0.15)';
        typeEl.style.color = spot.type === 'commercial' ? 'var(--secondary)' : 'var(--primary-light)';

        bodyEl.innerHTML = `
            <div class="spot-detail-content">
                <div class="spot-price-highlight" style="font-size: 1.3rem; font-weight: 800; color: var(--primary-light); margin-bottom: 0.8rem;">
                    ${spot.price} <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal;">(${spot.dayPrice})</span>
                </div>

                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.9rem;">
                    <i class="fa-solid fa-location-dot" style="color: var(--primary-light);"></i> ${spot.address}
                </p>

                <div style="background: rgba(255,255,255,0.04); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.9rem; font-size: 0.82rem;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
                        <span>Disponibilidad Actual:</span>
                        <strong style="color: var(--primary-light);">${spot.availableSpots} de ${spot.totalCapacity} espacios</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>Horario:</span>
                        <strong>${spot.operatingHours}</strong>
                    </div>
                </div>

                <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.1rem; line-height: 1.5;">
                    ${spot.description}
                </p>

                <button class="btn btn-primary btn-block btn-trigger-booking" onclick="openBookingModal('${spot.name}', '${spot.price}')">
                    <i class="fa-solid fa-calendar-check"></i> Reservar Este Espacio
                </button>
            </div>
        `;
    }
};

// Global Card Carousel Handlers
window.changeCardSlide = function(spotId, direction) {
    const spot = parkingSpotsData.find(s => s.id === spotId);
    if (!spot || !spot.slides || spot.slides.length <= 1) return;

    let currentIndex = spotSlideIndexMap[spotId] || 0;
    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
        newIndex = spot.slides.length - 1;
    } else if (newIndex >= spot.slides.length) {
        newIndex = 0;
    }

    window.setCardSlide(spotId, newIndex);
};

window.setCardSlide = function(spotId, index) {
    const spot = parkingSpotsData.find(s => s.id === spotId);
    if (!spot || !spot.slides || index < 0 || index >= spot.slides.length) return;

    spotSlideIndexMap[spotId] = index;

    const wrapEl = document.querySelector(`.card-image-wrap[data-spot-id="${spotId}"]`);
    if (!wrapEl) return;

    const trackEl = wrapEl.querySelector('.card-carousel-track');
    if (trackEl) {
        trackEl.style.transform = `translateX(-${index * 100}%)`;
    }

    const dots = wrapEl.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
};

// Main Cards Carousel Controller Functions (Continuous Liquid-Smooth Animation)
let isDraggingCarousel = false;
let startXPos, scrollLeftPos;
let carouselAnimationFrame = null;
let isCarouselPaused = false;
let isUserInteracting = false;
let resumeAutoplayTimeout = null;
const CAROUSEL_SMOOTH_SPEED = 0.8; // pixels per frame for liquid continuous sliding

function setupCardsCarouselControls() {
    const carouselTrack = document.getElementById('listing-cards-grid');
    const carouselWrapper = document.querySelector('.listing-carousel-wrapper');
    const prevBtn = document.getElementById('cards-carousel-prev');
    const nextBtn = document.getElementById('cards-carousel-next');

    if (!carouselTrack) return;

    // Arrow Button Handlers with Smooth Discrete Transition
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            triggerManualCardScroll(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            triggerManualCardScroll(1);
        });
    }

    // Scroll listener for active dots and button state updates
    carouselTrack.addEventListener('scroll', () => {
        updateCarouselDotsState(carouselTrack);
    });

    // Mouse drag scrolling
    carouselTrack.addEventListener('mousedown', (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        isDraggingCarousel = true;
        isUserInteracting = true;
        carouselTrack.classList.add('dragging');
        startXPos = e.pageX - carouselTrack.offsetLeft;
        scrollLeftPos = carouselTrack.scrollLeft;
    });

    carouselTrack.addEventListener('mouseleave', () => {
        if (isDraggingCarousel) {
            isDraggingCarousel = false;
            carouselTrack.classList.remove('dragging');
        }
        isCarouselPaused = false;
        delayResumeAutoplay(2000);
    });

    carouselTrack.addEventListener('mouseup', () => {
        if (!isDraggingCarousel) return;
        isDraggingCarousel = false;
        carouselTrack.classList.remove('dragging');
        delayResumeAutoplay(2000);
    });

    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDraggingCarousel) return;
        e.preventDefault();
        const x = e.pageX - carouselTrack.offsetLeft;
        const walk = (x - startXPos) * 1.8;
        carouselTrack.scrollLeft = scrollLeftPos - walk;
    });

    // Pause Smooth Gliding on Hover
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            isCarouselPaused = true;
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            if (!isUserInteracting) {
                isCarouselPaused = false;
            }
        });
    }

    // Touch Support for Mobile Dragging
    carouselTrack.addEventListener('touchstart', () => {
        isUserInteracting = true;
        isCarouselPaused = true;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', () => {
        delayResumeAutoplay(3000);
    }, { passive: true });

    // Window resize listener to recalculate dots
    window.addEventListener('resize', () => {
        updateCarouselPaginationDots();
    });

    // Initial setup for dots, arrows and continuous gliding
    updateCarouselPaginationDots();
    startCarouselAutoplay();
}

function startCarouselAutoplay() {
    stopCarouselAutoplay();
    isCarouselPaused = false;

    function animate() {
        const carouselTrack = document.getElementById('listing-cards-grid');
        if (carouselTrack && !isCarouselPaused && !isDraggingCarousel && !isUserInteracting) {
            const maxScroll = carouselTrack.scrollWidth - carouselTrack.clientWidth;
            if (maxScroll > 0) {
                if (carouselTrack.scrollLeft >= maxScroll - 2) {
                    carouselTrack.scrollLeft = 0; // Smooth reset to start
                } else {
                    carouselTrack.scrollLeft += CAROUSEL_SMOOTH_SPEED;
                }
            }
        }
        carouselAnimationFrame = requestAnimationFrame(animate);
    }

    carouselAnimationFrame = requestAnimationFrame(animate);
}

function stopCarouselAutoplay() {
    if (carouselAnimationFrame) {
        cancelAnimationFrame(carouselAnimationFrame);
        carouselAnimationFrame = null;
    }
}

function resetCarouselAutoplay() {
    startCarouselAutoplay();
}

function delayResumeAutoplay(ms = 3000) {
    if (resumeAutoplayTimeout) clearTimeout(resumeAutoplayTimeout);
    resumeAutoplayTimeout = setTimeout(() => {
        isUserInteracting = false;
        isCarouselPaused = false;
    }, ms);
}

function triggerManualCardScroll(direction) {
    const carouselTrack = document.getElementById('listing-cards-grid');
    if (!carouselTrack) return;

    isUserInteracting = true;
    isCarouselPaused = true;

    const step = getCarouselScrollStep(carouselTrack);
    const targetScroll = carouselTrack.scrollLeft + (direction * step);

    carouselTrack.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });

    delayResumeAutoplay(3500);
}

function getCarouselScrollStep(track) {
    const firstCard = track.querySelector('.listing-card');
    if (!firstCard) return track.clientWidth * 0.8;
    const cardWidth = firstCard.offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    return cardWidth + gap;
}

function updateCarouselPaginationDots() {
    const carouselTrack = document.getElementById('listing-cards-grid');
    const dotsContainer = document.getElementById('listing-carousel-dots');
    if (!carouselTrack || !dotsContainer) return;

    const cards = carouselTrack.querySelectorAll('.listing-card');
    dotsContainer.innerHTML = '';

    if (cards.length <= 1) return;

    const firstCardWidth = cards[0]?.offsetWidth || 300;
    const visibleCards = Math.max(1, Math.round(carouselTrack.clientWidth / firstCardWidth));
    const dotsCount = Math.max(1, cards.length - visibleCards + 1);

    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.className = `listing-carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Ir a posición ${i + 1}`);
        dot.addEventListener('click', () => {
            const step = getCarouselScrollStep(carouselTrack);
            isUserInteracting = true;
            isCarouselPaused = true;
            carouselTrack.scrollTo({ left: i * step, behavior: 'smooth' });
            delayResumeAutoplay(3500);
        });
        dotsContainer.appendChild(dot);
    }

    updateCarouselDotsState(carouselTrack);
}

function updateCarouselDotsState(track) {
    const prevBtn = document.getElementById('cards-carousel-prev');
    const nextBtn = document.getElementById('cards-carousel-next');
    const dotsContainer = document.getElementById('listing-carousel-dots');

    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;

    // Enable/disable arrows
    if (prevBtn) prevBtn.disabled = scrollLeft <= 8;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 8;

    // Update active dot
    if (dotsContainer && dotsContainer.children.length > 0) {
        const step = getCarouselScrollStep(track);
        const activeIndex = Math.min(
            dotsContainer.children.length - 1,
            Math.max(0, Math.round(scrollLeft / step))
        );

        Array.from(dotsContainer.children).forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
        });
    }
}

