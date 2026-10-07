import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parkingSpotsData, type ParkingSpot } from '../../data/parkingSpotsData';

const getCustomIcon = (isCommercial: boolean) => {
    const markerColor = isCommercial ? '#3b82f6' : '#0d9488';
    const iconSymbol = isCommercial ? 'fa-building' : 'fa-house-user';
    return L.divIcon({
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
};

function MapUpdater({ spots }: { spots: ParkingSpot[] }) {
    const map = useMap();
    useEffect(() => {
        if (spots.length > 0) {
            map.flyTo(spots[0].coords, 14, { duration: 1.2 });
        } else {
            map.flyTo([-17.7833, -63.1880], 13, { duration: 1.2 });
        }
    }, [spots, map]);
    return null;
}

export function InteractiveMap() {
    const [zoneFilter, setZoneFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter] = useState('all');

    const filteredSpots = parkingSpotsData.filter(s => {
        if (categoryFilter !== 'all') {
            if (categoryFilter === 'host' || categoryFilter === 'commercial') {
                if (s.type !== categoryFilter) return false;
            } else {
                if (s.zone !== categoryFilter) return false;
            }
        }
        if (zoneFilter !== 'all' && s.zone !== zoneFilter) return false;
        if (typeFilter !== 'all' && s.type !== typeFilter) return false;
        return true;
    });

    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);

    return (
        <section className="section map-section" id="mapa-envivo">
            <div className="container">
                <div className="section-header text-center reveal-up reveal-visible">
                    <span className="section-subtitle">MAPA EN VIVO</span>
                    <h2 className="section-title">Mapa de Parqueos en Santa Cruz de la Sierra</h2>
                    <p className="section-description">
                        Encuentra y reserva tu parqueo ideal en las principales zonas de la ciudad. 
                        Compara tarifas comerciales y de particulares.
                    </p>
                </div>

                {/* Map Interface Container */}
                <div className="map-interface-container reveal-up reveal-visible">
                    
                    {/* Map Filters */}
                    <div className="map-filters-bar">
                        <div className="map-filter-group">
                            <button className={`filter-btn ${typeFilter === 'all' ? 'active' : ''}`} onClick={() => setTypeFilter('all')}>
                                Todos
                            </button>
                            <button className={`filter-btn ${typeFilter === 'commercial' ? 'active' : ''}`} onClick={() => setTypeFilter('commercial')}>
                                <i className="fa-solid fa-building"></i> Comerciales B2B
                            </button>
                            <button className={`filter-btn ${typeFilter === 'host' ? 'active' : ''}`} onClick={() => setTypeFilter('host')}>
                                <i className="fa-solid fa-house-user"></i> Particulares C2C
                            </button>
                        </div>
                        
                        <div className="map-filter-group right">
                            <select className="zone-select" id="select-zone" value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
                                <option value="all">Ver todas las zonas de Santa Cruz</option>
                                <option value="equipetrol">Zona Equipetrol / Mall Ventura</option>
                                <option value="centro">Centro Histórico / René Moreno</option>
                                <option value="uagrm">Zona Universitaria (UAGRM)</option>
                                <option value="fexpocruz">Fexpocruz / Feria Barrio Lindo</option>
                                <option value="estadio">Estadio Tahuichi Aguilera</option>
                            </select>
                        </div>
                    </div>

                    <div className="map-layout-grid">
                        <div className="map-canvas-wrapper" style={{ height: '500px' }}>
                            <MapContainer center={[-17.7833, -63.1880]} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '12px' }}>
                                <TileLayer
                                    attribution='&copy; OpenStreetMap &copy; CARTO'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                                <MapUpdater spots={filteredSpots} />
                                {filteredSpots.map(spot => (
                                    <Marker 
                                        key={spot.id} 
                                        position={spot.coords} 
                                        icon={getCustomIcon(spot.type === 'commercial')}
                                        eventHandlers={{ click: () => setSelectedSpot(spot) }}
                                    >
                                        <Popup>
                                            <div className="map-popup-card">
                                                <h4>{spot.name}</h4>
                                                <p><i className="fa-solid fa-location-dot"></i> {spot.address}</p>
                                                <div className="map-popup-price">{spot.price} • {spot.availableSpots} Libres</div>
                                                <button className="btn btn-xs btn-primary btn-map-select" onClick={() => setSelectedSpot(spot)}>
                                                    <i className="fa-solid fa-circle-info"></i> Detalle y Reserva
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>

                        <div className="map-side-panel">
                            {!selectedSpot ? (
                                <div className="map-empty-state">
                                    <div className="pulse-dot-container">
                                        <div className="pulse-dot"></div>
                                        <div className="pulse-ring"></div>
                                    </div>
                                    <p>Selecciona un pin en el mapa para ver los detalles, disponibilidad en tiempo real y opciones de reserva.</p>
                                </div>
                            ) : (
                                <div className="spot-detail-content">
                                    <h3 id="spot-detail-title">{selectedSpot.name}</h3>
                                    <span id="spot-detail-type" className="card-badge-tag" style={{
                                        background: selectedSpot.type === 'commercial' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                                        color: selectedSpot.type === 'commercial' ? 'var(--secondary)' : 'var(--primary-light)'
                                    }}>{selectedSpot.typeName}</span>
                                    
                                    <div id="spot-detail-body">
                                        <div className="spot-price-highlight" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: '0.8rem' }}>
                                            {selectedSpot.price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({selectedSpot.dayPrice})</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                                            <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary-light)' }}></i> {selectedSpot.address}
                                        </p>
                                        <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.9rem', fontSize: '0.82rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                <span>Disponibilidad Actual:</span>
                                                <strong style={{ color: 'var(--primary-light)' }}>{selectedSpot.availableSpots} de {selectedSpot.totalCapacity} espacios</strong>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>Horario:</span>
                                                <strong>{selectedSpot.operatingHours}</strong>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.1rem', lineHeight: 1.5 }}>
                                            {selectedSpot.description}
                                        </p>
                                        <button className="btn btn-primary btn-block btn-trigger-booking" onClick={() => console.log('Reserva')}>
                                            <i className="fa-solid fa-calendar-check"></i> Reservar Este Espacio
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
