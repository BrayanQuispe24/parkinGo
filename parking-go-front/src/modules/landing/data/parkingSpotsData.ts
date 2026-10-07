export interface ParkingSpot {
    id: number;
    name: string;
    type: string;
    typeName: string;
    zone: string;
    address: string;
    distance: string;
    coords: [number, number];
    price: string;
    dayPrice: string;
    availableSpots: number;
    totalCapacity: number;
    rating: number;
    reviewsCount: number;
    badge: string;
    iconClass: string;
    operatingHours: string;
    description: string;
    features: string[];
    slides: { icon: string; label: string; bg: string }[];
}

export const parkingSpotsData: ParkingSpot[] = [
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
