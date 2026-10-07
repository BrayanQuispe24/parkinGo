/* ==========================================================================
   ParkinGo Enterprise - Portal Web del Conductor / Cliente
   Controller JS: Búsqueda, Reservas, Pago Anticipado, Mis Vehículos, Notificaciones & Reseñas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  DriverApp.init();
});

const DriverApp = {
  state: {
    activeView: 'mapa-busqueda',
    currentDriver: {
      name: 'Gonzalo Claros',
      email: 'gonzalo.claros@gmail.com',
      phone: '+591 71009988',
      activeVehicle: '9912-KLS'
    },
    vehicles: [
      { id: 1, plate: '9912-KLS', model: 'Toyota Corolla', type: 'Automóvil', color: 'Gris Plata', isEV: false, isDefault: true },
      { id: 2, plate: '4410-QWE', model: 'Tesla Model 3', type: 'Vehículo Eléctrico (EV)', color: 'Azul Metálico', isEV: true, isDefault: false },
      { id: 3, plate: '6543-BBB', model: 'Hyundai Tucson', type: 'SUV / Camioneta', color: 'Blanco', isEV: false, isDefault: false }
    ],
    parkings: [
      {
        id: 101,
        name: 'ParkinGo Equipetrol Central',
        address: 'Av. San Martín #450, Equipetrol, Santa Cruz',
        distance: '0.4 km',
        rating: 4.8,
        reviewsCount: 124,
        pricePerHour: 10.00,
        availableSlots: 42,
        totalSlots: 60,
        features: ['Seguridad 24/7', 'Carga EV', 'Cámaras IoT', 'Cubierto'],
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 102,
        name: 'ParkinGo Centro Histórico',
        address: 'Calle Junín #120, Casco Viejo, Santa Cruz',
        distance: '1.2 km',
        rating: 4.6,
        reviewsCount: 89,
        pricePerHour: 8.00,
        availableSlots: 15,
        totalSlots: 40,
        features: ['Seguridad 24/7', 'Bateas Amplias', 'Acceso Táctil'],
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 103,
        name: 'ParkinGo Plaza Abaroa',
        address: 'Av. 20 de Octubre #2210, La Paz',
        distance: '2.5 km',
        rating: 4.9,
        reviewsCount: 210,
        pricePerHour: 12.00,
        availableSlots: 8,
        totalSlots: 35,
        features: ['Carga Rápida EV', 'Techado', 'Lava Autos'],
        image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80'
      }
    ],
    reservations: [
      {
        code: 'RES-9043',
        parkingId: 101,
        parkingName: 'ParkinGo Equipetrol Central',
        parkingAddress: 'Av. San Martín #450, Equipetrol, Santa Cruz',
        plate: '9912-KLS',
        vehicleModel: 'Toyota Corolla (Gris Plata)',
        driverName: 'Gonzalo Claros',
        driverPhone: '+591 71009988',
        sector: 'Nivel 1 - Sector Techado A',
        slot: 'A-05',
        timeWindow: '10:00 AM - 12:00 PM',
        date: 'Hoy (11/09/2026)',
        status: 'activa',
        checkInTime: '10:05 AM',
        checkOutTime: null,
        totalPaid: 20.00,
        paymentMethod: 'QR Simbol Digital (Tx #QR-99081)',
        rated: false
      },
      {
        code: 'RES-8812',
        parkingId: 101,
        parkingName: 'ParkinGo Equipetrol Central',
        parkingAddress: 'Av. San Martín #450, Equipetrol, Santa Cruz',
        plate: '4410-QWE',
        vehicleModel: 'Tesla Model 3 (Azul Metálico)',
        driverName: 'Gonzalo Claros',
        driverPhone: '+591 71009988',
        sector: 'Nivel 1 - Estación Carga EV',
        slot: 'A-15',
        timeWindow: '08:00 AM - 11:00 AM',
        date: 'Ayer (10/09/2026)',
        status: 'completada',
        checkInTime: '08:02 AM',
        checkOutTime: '10:58 AM',
        totalPaid: 45.00,
        paymentMethod: 'Tarjeta **** 4821',
        rated: true,
        ratingStars: 5,
        ratingComment: 'Excelente servicio de carga EV en Plaza A-15.'
      },
      {
        code: 'RES-7741',
        parkingId: 102,
        parkingName: 'ParkinGo Centro Histórico',
        parkingAddress: 'Calle Junín #120, Casco Viejo, Santa Cruz',
        plate: '9912-KLS',
        vehicleModel: 'Toyota Corolla (Gris Plata)',
        driverName: 'Gonzalo Claros',
        driverPhone: '+591 71009988',
        sector: 'Planta Baja - Sector B',
        slot: 'B-02',
        timeWindow: '14:00 PM - 16:00 PM',
        date: '08/09/2026',
        status: 'completada',
        checkInTime: '14:01 PM',
        checkOutTime: '15:55 PM',
        totalPaid: 16.00,
        paymentMethod: 'Efectivo en Garita',
        rated: true,
        ratingStars: 4,
        ratingComment: 'Muy buena atención del operador de turno.'
      }
    ]
  },

  init() {
    this.setupEventListeners();
    this.startActiveTimer();
    this.renderActiveView();
    this.renderVehiclesList();
  },

  setupEventListeners() {
    // 1. Navigation items
    document.querySelectorAll('.driver-nav-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        this.switchView(viewId);
      });
    });

    // 2. Search input filtering
    const searchInput = document.getElementById('driver-search-parking');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderParkingCards(e.target.value.trim());
      });
    }

    // 3. Vehicle form submission
    const vehicleForm = document.getElementById('vehicle-add-form');
    if (vehicleForm) {
      vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleVehicleSubmit();
      });
    }

    // 4. Rating stars interactive selection
    const starLabels = {
      1: "1.0 / 5.0 - Deficiente",
      2: "2.0 / 5.0 - Regular",
      3: "3.0 / 5.0 - Aceptable",
      4: "4.0 / 5.0 - Muy Bueno",
      5: "5.0 / 5.0 - Excelente"
    };

    document.querySelectorAll('.star-rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-value'), 10);
        const inputVal = document.getElementById('selected-rating-val');
        if (inputVal) inputVal.value = val;

        const labelText = document.getElementById('star-rating-label-text');
        if (labelText) labelText.textContent = starLabels[val] || `${val}.0 / 5.0`;

        document.querySelectorAll('.star-rating-btn').forEach((b, idx) => {
          if (idx < val) {
            b.classList.add('active');
            b.style.color = '#F59E0B';
          } else {
            b.classList.remove('active');
            b.style.color = '#CBD5E1';
          }
        });
      });
    });

    // 5. Rating form submission
    const ratingForm = document.getElementById('rating-service-form');
    if (ratingForm) {
      ratingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRatingSubmit();
      });
    }
  },

  switchView(viewId) {
    this.state.activeView = viewId;

    document.querySelectorAll('.driver-nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.dashboard-view').forEach(sec => {
      if (sec.id === `view-${viewId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    this.renderActiveView();
  },

  renderActiveView() {
    if (this.state.activeView === 'mapa-busqueda') {
      this.renderParkingCards();
    } else if (this.state.activeView === 'ticket-activo') {
      this.renderActiveTicket();
    } else if (this.state.activeView === 'mis-vehiculos') {
      this.renderVehiclesList();
    } else if (this.state.activeView === 'mis-reservas') {
      this.renderReservationsHistory();
    } else if (this.state.activeView === 'calificar') {
      this.populateRatingReservationOptions();
      this.renderReviewsHistory();
    }
  },

  renderParkingCards(searchQuery = '') {
    const container = document.getElementById('driver-parking-cards-container');
    if (!container) return;

    let filtered = this.state.parkings;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
    }

    const countEl = document.getElementById('driver-parkings-count');
    if (countEl) countEl.textContent = `Mostrando ${filtered.length} parqueo(s)`;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="fa-solid fa-square-parking text-muted" style="font-size: 3rem;"></i>
          <h4 class="mt-3">No se encontraron parqueos que coincidan</h4>
          <p class="text-muted">Intente buscar por otro término o zona geográfica.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => `
      <div class="airbnb-card" onclick="if(event.target.tagName !== 'BUTTON' && !event.target.closest('button')) window.location.href='parking-detail.html?id=${p.id}'" style="cursor:pointer;">
        <div class="airbnb-card-img-wrapper">
          <img src="${p.image}" alt="${p.name}" class="airbnb-card-img">
          <div class="airbnb-card-badge">
            <i class="fa-solid fa-square-parking me-1"></i> ${p.availableSlots} de ${p.totalSlots} Libres
          </div>
          <div class="airbnb-card-fav" title="Guardar en Favoritos" onclick="event.stopPropagation();">
            <i class="fa-regular fa-heart"></i>
          </div>
        </div>
        <div class="airbnb-card-content">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-1">
              <h4 style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1.1rem; color:var(--text-main); margin:0;">
                <a href="parking-detail.html?id=${p.id}" style="text-decoration:none; color:inherit;">${p.name}</a>
              </h4>
              <span style="color:var(--text-main); font-weight:800; font-size:0.9rem; white-space:nowrap;">
                <i class="fa-solid fa-star text-warning me-1"></i>${p.rating}
              </span>
            </div>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.6rem;" class="text-truncate">
              <i class="fa-solid fa-location-dot text-emerald me-1"></i> ${p.address} • <strong>${p.distance}</strong>
            </p>
            <div class="mb-3">
              ${p.features.map(f => `<span class="feature-pill">${f}</span>`).join('')}
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <div>
              <strong style="font-family:'Outfit',sans-serif; font-size:1.25rem; color:var(--text-main);">Bs ${p.pricePerHour.toFixed(2)}</strong>
              <span style="font-size:0.78rem; color:var(--text-muted);"> / hora</span>
            </div>
            <div class="d-flex gap-1">
              <a href="parking-detail.html?id=${p.id}" class="btn btn-outline-secondary btn-sm" style="border-radius:20px; font-weight:700; font-size:0.78rem; padding:0.35rem 0.75rem;">
                <i class="fa-solid fa-eye me-1"></i> Detalle
              </a>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); DriverApp.openBookingModal(${p.id});" style="background:var(--accent-emerald); border:none; padding:0.35rem 0.85rem; font-weight:700; border-radius:20px; font-size:0.78rem;">
                <i class="fa-solid fa-calendar-check me-1"></i> Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  filterByTag(tag, btnEl) {
    document.querySelectorAll('.airbnb-categories-bar .category-item').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    const container = document.getElementById('driver-parking-cards-container');
    if (!container) return;

    let filtered = this.state.parkings;
    if (tag === 'ev') {
      filtered = filtered.filter(p => p.features.some(f => f.toLowerCase().includes('ev') || f.toLowerCase().includes('carga')));
    } else if (tag === 'cubierto') {
      filtered = filtered.filter(p => p.features.some(f => f.toLowerCase().includes('cubierto') || f.toLowerCase().includes('techado')));
    } else if (tag === 'seguridad') {
      filtered = filtered.filter(p => p.features.some(f => f.toLowerCase().includes('seguridad')));
    }

    const countEl = document.getElementById('driver-parkings-count');
    if (countEl) countEl.textContent = `Mostrando ${filtered.length} parqueo(s)`;

    container.innerHTML = filtered.map(p => `
      <div class="airbnb-card" onclick="if(event.target.tagName !== 'BUTTON' && !event.target.closest('button')) window.location.href='parking-detail.html?id=${p.id}'" style="cursor:pointer;">
        <div class="airbnb-card-img-wrapper">
          <img src="${p.image}" alt="${p.name}" class="airbnb-card-img">
          <div class="airbnb-card-badge">
            <i class="fa-solid fa-square-parking me-1"></i> ${p.availableSlots} de ${p.totalSlots} Libres
          </div>
          <div class="airbnb-card-fav" title="Guardar en Favoritos" onclick="event.stopPropagation();">
            <i class="fa-regular fa-heart"></i>
          </div>
        </div>
        <div class="airbnb-card-content">
          <div>
            <div class="d-flex justify-content-between align-items-start mb-1">
              <h4 style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1.1rem; color:var(--text-main); margin:0;">
                <a href="parking-detail.html?id=${p.id}" style="text-decoration:none; color:inherit;">${p.name}</a>
              </h4>
              <span style="color:var(--text-main); font-weight:800; font-size:0.9rem; white-space:nowrap;">
                <i class="fa-solid fa-star text-warning me-1"></i>${p.rating}
              </span>
            </div>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.6rem;" class="text-truncate">
              <i class="fa-solid fa-location-dot text-emerald me-1"></i> ${p.address} • <strong>${p.distance}</strong>
            </p>
            <div class="mb-3">
              ${p.features.map(f => `<span class="feature-pill">${f}</span>`).join('')}
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-center pt-2 border-top">
            <div>
              <strong style="font-family:'Outfit',sans-serif; font-size:1.25rem; color:var(--text-main);">Bs ${p.pricePerHour.toFixed(2)}</strong>
              <span style="font-size:0.78rem; color:var(--text-muted);"> / hora</span>
            </div>
            <div class="d-flex gap-1">
              <a href="parking-detail.html?id=${p.id}" class="btn btn-outline-secondary btn-sm" style="border-radius:20px; font-weight:700; font-size:0.78rem; padding:0.35rem 0.75rem;">
                <i class="fa-solid fa-eye me-1"></i> Detalle
              </a>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); DriverApp.openBookingModal(${p.id});" style="background:var(--accent-emerald); border:none; padding:0.35rem 0.85rem; font-weight:700; border-radius:20px; font-size:0.78rem;">
                <i class="fa-solid fa-calendar-check me-1"></i> Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  filterParkingsByButton() {
    const query = document.getElementById('driver-search-parking').value.trim();
    this.renderParkingCards(query);
  },

  toggleMapDisplay() {
    const mapCard = document.getElementById('map-container-card');
    const label = document.getElementById('map-toggle-label');
    if (!mapCard) return;

    if (mapCard.style.display === 'none') {
      mapCard.style.display = 'block';
      if (label) label.textContent = 'Ocultar Mapa';
    } else {
      mapCard.style.display = 'none';
      if (label) label.textContent = 'Mostrar Mapa';
    }
  },

  openBookingModal(parkingId) {
    const parking = this.state.parkings.find(p => p.id === parkingId);
    if (!parking) return;

    document.getElementById('booking-parking-id').value = parking.id;
    document.getElementById('modal-booking-title').textContent = `Reserva - ${parking.name}`;
    document.getElementById('modal-booking-subtitle').textContent = parking.address;

    const vehSelect = document.getElementById('booking-vehicle-select');
    if (vehSelect) {
      vehSelect.innerHTML = this.state.vehicles.map(v => `
        <option value="${v.plate}" ${v.isDefault ? 'selected' : ''}>${v.plate} - ${v.model} (${v.type})</option>
      `).join('');
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('booking-date');
    if (dateInput) dateInput.value = todayStr;

    const timeInput = document.getElementById('booking-time');
    if (timeInput) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      timeInput.value = `${hh}:${mm}`;
    }

    this.recalculateBookingPrice();
    this.openModal('modalBookingForm');
  },

  closeBookingModal() {
    this.closeModal('modalBookingForm');
  },

  recalculateBookingPrice() {
    const parkingId = parseInt(document.getElementById('booking-parking-id').value || '101', 10);
    const parking = this.state.parkings.find(p => p.id === parkingId) || this.state.parkings[0];

    const hours = parseInt(document.getElementById('booking-hours-select').value || '2', 10);
    const slotType = document.getElementById('booking-slot-type').value;

    let baseRate = parking.pricePerHour;
    if (slotType === 'ev') baseRate += 5.00;

    let total = baseRate * (hours === 8 ? 6.5 : hours);

    document.getElementById('summary-price-per-hour').textContent = `Bs ${baseRate.toFixed(2)}`;
    document.getElementById('summary-hours-count').textContent = hours === 8 ? 'Pase de Día (8h)' : `${hours} Hora(s)`;
    document.getElementById('summary-total-price').textContent = `Bs ${total.toFixed(2)}`;
  },

  confirmBookingProcess() {
    const parkingId = parseInt(document.getElementById('booking-parking-id').value || '101', 10);
    const parking = this.state.parkings.find(p => p.id === parkingId) || this.state.parkings[0];

    const plate = document.getElementById('booking-vehicle-select').value;
    const vehicle = this.state.vehicles.find(v => v.plate === plate) || this.state.vehicles[0];

    const dateVal = document.getElementById('booking-date').value;
    const timeVal = document.getElementById('booking-time').value;
    const hours = parseInt(document.getElementById('booking-hours-select').value || '2', 10);

    const paymentRadios = document.getElementsByName('payment-method');
    let payMethod = 'QR Simbol';
    for (const r of paymentRadios) {
      if (r.checked) payMethod = r.value;
    }

    const slotNum = Math.floor(Math.random() * 15) + 1;
    const slot = `A-${slotNum < 10 ? '0' + slotNum : slotNum}`;

    const newResCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes = {
      code: newResCode,
      parkingId: parking.id,
      parkingName: parking.name,
      parkingAddress: parking.address,
      plate: vehicle.plate,
      vehicleModel: `${vehicle.model} (${vehicle.color})`,
      driverName: this.state.currentDriver.name,
      driverPhone: this.state.currentDriver.phone,
      sector: 'Nivel 1 - Sector Techado A',
      slot: slot,
      timeWindow: `${timeVal} - Duración: ${hours}h`,
      date: 'Hoy (' + dateVal + ')',
      status: 'activa',
      checkInTime: timeVal,
      checkOutTime: null,
      totalPaid: parking.pricePerHour * (hours === 8 ? 6.5 : hours),
      paymentMethod: `${payMethod} Digital`,
      rated: false
    };

    this.state.reservations.unshift(newRes);
    this.closeModal('modalBookingForm');
    this.showToast('Reserva Confirmada', `Boleta #${newResCode} generada exitosamente. Plaza asignada: ${slot}`, 'success');

    this.switchView('ticket-activo');
  },

  // ==========================================================================
  // 2. TICKET DIGITAL COMPLETO Y ASISTENCIA DE UBICACIÓN
  // ==========================================================================
  renderActiveTicket() {
    const activeRes = this.state.reservations.find(r => r.status === 'activa');
    const container = document.getElementById('active-ticket-details-container') || document.getElementById('active-ticket-container');
    if (!container) return;

    if (!activeRes) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1.5rem;">
          <i class="fa-solid fa-ticket text-emerald" style="font-size:3rem; margin-bottom:1rem;"></i>
          <h3 style="font-size:1.2rem; color:var(--text-main);">No tiene reservas activas actualmente</h3>
          <p style="color:var(--text-muted); font-size:0.88rem; margin:0.5rem 0 1.5rem 0;">Explore los parqueos disponibles e inicie una reserva anticipada.</p>
          <button class="btn btn-primary" onclick="DriverApp.switchView('mapa-busqueda')" style="background:var(--accent-emerald); border:none;">
            <i class="fa-solid fa-magnifying-glass me-1"></i> Buscar Parqueos
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="ticket-voucher-card">
        <!-- Boleta Voucher Header Banner -->
        <div class="ticket-header-banner">
          <div class="d-flex align-items-center gap-3">
            <div style="width: 48px; height: 48px; background: #22C55E; color: #063D25; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.4rem; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);">
              <i class="fa-solid fa-ticket"></i>
            </div>
            <div>
              <h4 style="font-family:'Outfit',sans-serif; font-size:1.25rem; font-weight:800; color:#FFFFFF; margin:0; letter-spacing:0.5px;">BOLETA DIGITAL DE PARQUEO</h4>
              <span style="font-size:0.8rem; color:#A7F3D0; font-weight:600;"><i class="fa-solid fa-shield-halved me-1"></i> ParkinGo Enterprise • Garita Digital</span>
            </div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#22C55E; color:#063D25; font-weight:800; font-size:0.82rem; padding:0.4rem 0.85rem; border-radius:20px; box-shadow: 0 2px 8px rgba(34,197,94,0.4);">
              <i class="fa-solid fa-circle me-1" style="font-size:0.55rem; color:#063D25;"></i> VÁLIDA / EN CURSO
            </span>
            <div style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1.2rem; color:#FEF08A; margin-top:0.35rem;">
              #${activeRes.code}
            </div>
          </div>
        </div>

        <!-- Ticket Tear Divider Notch -->
        <div class="ticket-tear-line">
          <div class="ticket-tear-notch-left"></div>
          <div class="ticket-tear-dots"></div>
          <div class="ticket-tear-notch-right"></div>
        </div>

        <!-- Live Countdown Clock Box (Spacious Padding) -->
        <div style="background: linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%); border-bottom: 1px solid #BBF7D0; padding: 1.75rem 2rem; text-align: center;">
          <span style="font-size:0.75rem; font-weight:800; color:#15803D; letter-spacing:1.5px; text-transform:uppercase;">TIEMPO RESTANTE DE ESTADÍA</span>
          <div id="live-countdown-timer" style="font-family:'Outfit',sans-serif; font-size:3.2rem; font-weight:800; color:#063D25; line-height:1.05; margin:0.4rem 0;">01:04:15</div>
          <div style="font-size:0.88rem; color:#166534; font-weight:600;">
            <i class="fa-solid fa-clock text-emerald me-1"></i> Ventana: <strong>${activeRes.timeWindow}</strong> | Ingreso Registrado: <strong>${activeRes.checkInTime}</strong>
          </div>
        </div>

        <!-- Detailed Reservation Breakdown Specs Grid -->
        <div class="ticket-body-container">
          <div class="row g-3 mb-3">
            <!-- Conductor Info -->
            <div class="col-md-6">
              <div class="ticket-spec-card">
                <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.4rem;">
                  <i class="fa-solid fa-user text-emerald me-1"></i> Conductor Registrado
                </span>
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle-sm" style="width:36px; height:36px; font-size:0.85rem;">GC</div>
                  <div>
                    <strong style="font-size:0.98rem; color:var(--text-main); display:block; line-height:1.2;">${activeRes.driverName}</strong>
                    <span style="font-size:0.8rem; color:var(--text-muted);">${activeRes.driverPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vehículo Info -->
            <div class="col-md-6">
              <div class="ticket-spec-card">
                <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.4rem;">
                  <i class="fa-solid fa-car text-emerald me-1"></i> Vehículo & Placa
                </span>
                <div class="bolivian-plate-badge" style="font-size:1rem; padding:0.2rem 0.6rem;">
                  <i class="fa-solid fa-car-side text-primary"></i> ${activeRes.plate}
                </div>
                <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-top:0.3rem;">${activeRes.vehicleModel || 'Toyota Corolla'}</span>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-3">
            <!-- Parqueo & Ubicación GPS -->
            <div class="col-md-7">
              <div class="ticket-spec-card">
                <div>
                  <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.3rem;">
                    <i class="fa-solid fa-building text-emerald me-1"></i> Parqueo de Destino
                  </span>
                  <strong style="font-size:0.98rem; color:var(--text-main); display:block;">${activeRes.parkingName}</strong>
                  <span style="font-size:0.8rem; color:var(--text-muted); display:block;" class="text-truncate">
                    ${activeRes.parkingAddress}
                  </span>
                </div>
                <button class="btn btn-link p-0 text-decoration-none fw-bold mt-2" style="font-size:0.82rem; color:var(--accent-emerald); text-align:left;" onclick="DriverApp.openParkingLocationModal(${activeRes.parkingId || 101})">
                  <i class="fa-solid fa-map-location-dot me-1"></i> Ver Ubicación GPS del Parqueo ➔
                </button>
              </div>
            </div>

            <!-- Plaza Asignada & Link a Croquis -->
            <div class="col-md-5">
              <div class="ticket-spec-card" style="background: #F0FDF4; border: 1.5px solid #22C55E; text-align:center;">
                <div>
                  <span style="font-size:0.72rem; font-weight:800; color:#15803D; text-transform:uppercase; display:block;">
                    <i class="fa-solid fa-square-parking me-1"></i> Plaza Reservada
                  </span>
                  <strong style="font-size:1.45rem; font-family:'Outfit',sans-serif; color:#063D25; display:block; margin:0.2rem 0;">PLAZA ${activeRes.slot}</strong>
                  <span style="font-size:0.76rem; color:#166534; font-weight:700;">${activeRes.sector || 'Sector Techado A'}</span>
                </div>
                <button class="btn btn-link p-0 text-decoration-none fw-bold mt-2" style="font-size:0.82rem; color:#006D36;" onclick="DriverApp.openSlotLocationModal('${activeRes.slot}')">
                  <i class="fa-solid fa-location-crosshairs me-1"></i> Ver Ubicación en Croquis ➔
                </button>
              </div>
            </div>
          </div>

          <!-- Invoice Itemized Table Breakdown -->
          <div class="ticket-invoice-box">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted" style="font-size:0.88rem;">Método de Pago Seleccionado:</span>
              <strong class="text-dark" style="font-size:0.9rem;"><i class="fa-solid fa-qrcode text-emerald me-1"></i> ${activeRes.paymentMethod}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="text-muted" style="font-size:0.88rem;">Facturación Digital (13% IVA Inclusivo):</span>
              <span class="badge bg-light text-dark border" style="font-size:0.78rem;"><i class="fa-solid fa-receipt me-1 text-primary"></i> Emitida</span>
            </div>
            <hr class="my-3" style="border-top-color:#CBD5CE;">
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold text-dark" style="font-size:0.95rem;">Monto Total Cancelado:</span>
              <span class="badge" style="background:#006D36; color:#FFFFFF; font-weight:800; font-size:1.05rem; padding:0.45rem 1rem; border-radius:20px;">
                Bs ${activeRes.totalPaid.toFixed(2)} PAGADO
              </span>
            </div>
          </div>

          <!-- Barcode / QR Optical Scanner Simulator -->
          <div class="ticket-barcode-box">
            <div style="font-family:monospace; letter-spacing:8px; font-size:1.8rem; font-weight:800; color:#063D25; margin-bottom:0.3rem;">||| | |||| ||| |||| | |||</div>
            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">
              <i class="fa-solid fa-qrcode text-emerald me-1"></i> Presente este código en el lector óptico de garita para apertura LPR
            </span>
          </div>

          <!-- Interactive Action Buttons Toolbar -->
          <div class="d-flex flex-wrap gap-2">
            <button class="btn btn-outline-primary flex-fill py-2.5 px-3" onclick="DriverApp.openParkingLocationModal(${activeRes.parkingId || 101})" style="font-weight:700; font-size:0.85rem; border-radius:10px;">
              <i class="fa-solid fa-map-location-dot me-1"></i> Ubicación Parqueo
            </button>
            <button class="btn btn-outline-success flex-fill py-2.5 px-3" onclick="DriverApp.openSlotLocationModal('${activeRes.slot}')" style="font-weight:700; font-size:0.85rem; color:#006D36; border-color:#006D36; border-radius:10px;">
              <i class="fa-solid fa-location-crosshairs me-1"></i> Ubicación Plaza
            </button>
            <button class="btn btn-outline-secondary flex-fill py-2.5 px-3" onclick="DriverApp.printReceipt('${activeRes.code}')" style="font-size:0.85rem; font-weight:700; border-radius:10px;">
              <i class="fa-solid fa-receipt me-1"></i> Comprobante PDF
            </button>
            <button class="btn btn-outline-warning flex-fill py-2.5 px-3" onclick="DriverApp.extendActiveTime('${activeRes.code}')" style="font-weight:700; font-size:0.85rem; color:#D97706; border-color:#D97706; border-radius:10px;">
              <i class="fa-solid fa-clock-rotate-left me-1"></i> Extender (+Bs 10)
          </div>
        </div>
      </div>
    `;
  },

  startActiveTimer() {
    setInterval(() => {
      const timerEl = document.getElementById('live-countdown-timer');
      if (!timerEl) return;
      const now = new Date();
      const seconds = 59 - now.getSeconds();
      const minutes = 44 - (now.getMinutes() % 45);
      const hours = 1;
      timerEl.textContent = `0${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
  },

  extendActiveTime(resCode) {
    const res = this.state.reservations.find(r => r.code === resCode);
    if (!res) return;
    res.totalPaid += 10.00;
    this.showToast('Tiempo Extendido', `Se ha agregado 1 hora adicional a su estadía en la plaza ${res.slot}`, 'success');
    this.renderActiveTicket();
  },

  // ==========================================================================
  // MODALES DE UBICACIÓN EXACTA (PARQUEO & PLAZA EN CROQUIS)
  // ==========================================================================
  openParkingLocationModal(parkingId) {
    const parking = this.state.parkings.find(p => p.id === parkingId) || this.state.parkings[0];
    
    let modalEl = document.getElementById('modalParkingLocation');
    if (!modalEl) return;

    const modalBody = document.getElementById('parking-location-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="p-3 mb-3" style="background:var(--bg-primary); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
          <div class="fw-bold text-dark" style="font-size:1rem; margin-bottom:0.2rem;">${parking.name}</div>
          <div style="font-size:0.88rem; color:var(--text-muted);" class="mb-2">
            <i class="fa-solid fa-location-dot text-emerald me-1"></i> ${parking.address}
          </div>
          <div class="d-flex gap-2">
            <span class="badge bg-success">Distancia: ${parking.distance}</span>
            <span class="badge bg-secondary">Coordenadas GPS: -17.7689, -63.1834</span>
          </div>
        </div>

        <!-- Enterprise Vector Map Container (Light Palette) -->
        <div style="height:220px; background:#F0F4F1; background-image: radial-gradient(circle at 50% 50%, rgba(0,109,54,0.08) 0%, transparent 70%), linear-gradient(#DDE3DE 1px, transparent 1px), linear-gradient(90deg, #DDE3DE 1px, transparent 1px); background-size:100% 100%, 30px 30px, 30px 30px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); position:relative; overflow:hidden; margin-bottom:1rem;">
          <div style="position:absolute; top:40%; left:0; right:0; height:12px; background:#CBD5CE;"></div>
          <div style="position:absolute; top:0; bottom:0; left:45%; width:12px; background:#CBD5CE;"></div>
          <div style="position:absolute; top:40%; left:45%; transform:translate(-50%,-100%); background:#006D36; color:white; padding:6px 14px; border-radius:20px; font-weight:800; font-size:0.85rem; box-shadow:0 4px 12px rgba(0,109,54,0.3); border:2px solid #FFF;">
            <i class="fa-solid fa-square-parking me-1"></i> ${parking.name}
          </div>
        </div>

        <div class="alert alert-info py-2 px-3 mb-3" style="font-size:0.85rem;">
          <i class="fa-solid fa-circle-info me-1"></i> <strong>Entrada Vehicular:</strong> Acceso por el carril derecho principal con lectura automática de placa LPR.
        </div>

        <div class="d-grid gap-2">
          <button class="btn btn-primary" onclick="DriverApp.simulateGPSNavigation()" style="background:var(--accent-emerald); border:none; font-weight:700;">
            <i class="fa-solid fa-diamond-turn-right me-1"></i> Abrir en Waze / Google Maps GPS
          </button>
        </div>
      `;
    }

    this.openModal('modalParkingLocation');
  },

  openSlotLocationModal(slotCode = 'A-05') {
    let modalEl = document.getElementById('modalSlotLocationMap');
    if (!modalEl) return;

    const modalBody = document.getElementById('slot-location-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3 p-3" style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:6px;">
          <div>
            <span style="font-size:0.75rem; font-weight:700; color:#15803D; text-transform:uppercase;">TUS DATOS DE PARQUEO</span>
            <div style="font-weight:800; font-family:'Outfit',sans-serif; font-size:1.3rem; color:#063D25;">PLAZA REGISTRADA: ${slotCode}</div>
          </div>
          <span class="badge" style="background:#006D36; color:white; font-size:0.85rem; padding:0.4rem 0.8rem;">
            <i class="fa-solid fa-circle-dot me-1 text-warning"></i> RESERVADO PARA TI
          </span>
        </div>

        <h6 class="fw-bold mb-2" style="font-size:0.88rem; color:var(--text-main);">Croquis de Distribución Interna del Parqueo:</h6>

        <!-- Visual Floorplan Grid -->
        <div style="background:#1E293B; border-radius:8px; padding:1.25rem; color:white; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:0.5rem; margin-bottom:1rem; font-size:0.8rem; color:#94A3B8;">
            <span>🚪 GARITA DE ENTRADA (CARRIL A)</span>
            <span>🚗 SENTIDO DE CIRCULACIÓN ➔</span>
          </div>

          <!-- Slots Row -->
          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:0.75rem;">
            <div style="background:#334155; border-radius:6px; padding:0.75rem; text-align:center; border:1px solid #475569;">
              <span style="font-size:0.68rem; color:#94A3B8;">PLAZA</span>
              <div style="font-weight:700; font-size:1rem;">A-01</div>
              <span class="badge bg-secondary" style="font-size:0.6rem;">Ocupado</span>
            </div>

            <div style="background:#334155; border-radius:6px; padding:0.75rem; text-align:center; border:1px solid #475569;">
              <span style="font-size:0.68rem; color:#94A3B8;">PLAZA</span>
              <div style="font-weight:700; font-size:1rem;">A-02</div>
              <span class="badge bg-secondary" style="font-size:0.6rem;">Ocupado</span>
            </div>

            <div style="background:#334155; border-radius:6px; padding:0.75rem; text-align:center; border:1px solid #475569;">
              <span style="font-size:0.68rem; color:#94A3B8;">PLAZA</span>
              <div style="font-weight:700; font-size:1rem;">A-03</div>
              <span class="badge bg-secondary" style="font-size:0.6rem;">Ocupado</span>
            </div>

            <div style="background:#334155; border-radius:6px; padding:0.75rem; text-align:center; border:1px solid #475569;">
              <span style="font-size:0.68rem; color:#94A3B8;">PLAZA</span>
              <div style="font-weight:700; font-size:1rem;">A-04</div>
              <span class="badge bg-secondary" style="font-size:0.6rem;">Ocupado</span>
            </div>

            <!-- TARGET HIGHLIGHTED SLOT -->
            <div style="background:#006D36; border-radius:6px; padding:0.75rem; text-align:center; border:2.5px solid #22C55E; box-shadow:0 0 15px rgba(34,197,94,0.4); transform:scale(1.05);">
              <span style="font-size:0.68rem; color:#A7F3D0; font-weight:800;">TU LUGAR</span>
              <div style="font-weight:800; font-size:1.15rem; color:#FFFFFF;">${slotCode}</div>
              <span class="badge" style="background:#22C55E; color:#063D25; font-size:0.62rem; font-weight:800;">📍 ASIGNADO</span>
            </div>
          </div>

          <div style="display:flex; justify-content:center; margin-top:1.25rem; font-size:0.78rem; color:#CBD5E1; gap:1.5rem;">
            <span><i class="fa-solid fa-square text-success me-1"></i> Tu Plaza Reservada</span>
            <span><i class="fa-solid fa-square text-secondary me-1"></i> Ocupado por otros</span>
          </div>
        </div>

        <div class="modal-footer-custom px-0 pb-0">
          <button type="button" class="btn btn-primary w-100" onclick="DriverApp.closeModal('modalSlotLocationMap')" style="background:var(--accent-emerald); border:none; font-weight:700;">
            <i class="fa-solid fa-check me-1"></i> Entendido, Ir a mi Plaza
          </button>
        </div>
      `;
    }

    this.openModal('modalSlotLocationMap');
  },

  // ==========================================================================
  // 3. GESTIÓN DE MIS VEHÍCULOS
  // ==========================================================================
  renderVehiclesList() {
    const container = document.getElementById('driver-vehicles-grid') || document.getElementById('vehicles-list-container');
    if (!container) return;

    container.innerHTML = this.state.vehicles.map(v => `
      <div class="card" style="margin-bottom:0.85rem; display:flex; justify-content:space-between; align-items:center; padding:0.85rem 1.15rem; border-radius:6px; border:1px solid #CBD5CE; background:#FFFFFF;">
        <div style="display:flex; align-items:center; gap:1rem;">
          <div style="width:42px; height:42px; border-radius:6px; background:${v.isEV ? '#DCFCE7' : '#F0FDF4'}; color:${v.isEV ? '#15803D' : '#006D36'}; border:1px solid ${v.isEV ? '#86EFAC' : '#BBF7D0'}; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">
            <i class="fa-solid ${v.isEV ? 'fa-charging-station' : (v.type.includes('SUV') ? 'fa-truck-monster' : 'fa-car')}"></i>
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.2rem;">
              <h3 style="font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:800; margin:0; color:#063D25; line-height:1.3;">${v.plate}</h3>
              ${v.isDefault ? '<span class="badge bg-success fw-bold" style="font-size:0.68rem; padding:0.25rem 0.5rem; border-radius:4px;">Principal</span>' : ''}
              ${v.isEV ? '<span class="badge bg-info fw-bold text-dark" style="font-size:0.68rem; padding:0.25rem 0.5rem; border-radius:4px;">⚡ Eléctrico</span>' : ''}
            </div>
            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4; font-weight:500;">${v.model} • ${v.color}</div>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger" onclick="DriverApp.deleteVehicle(${v.id})" title="Eliminar vehículo" style="padding:0.35rem 0.65rem; border-radius:6px; font-size:0.85rem;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  },

  openAddVehicleModal() {
    this.openModal('modalAddVehicle');
  },

  closeAddVehicleModal() {
    this.closeModal('modalAddVehicle');
  },

  handleVehicleSubmit() {
    const plate = document.getElementById('veh-plate').value.trim().toUpperCase();
    const model = document.getElementById('veh-model').value.trim();
    const type = document.getElementById('veh-type').value;
    const color = document.getElementById('veh-color').value.trim();
    const isEV = document.getElementById('veh-is-ev').checked;

    const newVeh = {
      id: Date.now(),
      plate: plate,
      model: model,
      type: type,
      color: color,
      isEV: isEV,
      isDefault: this.state.vehicles.length === 0
    };

    this.state.vehicles.push(newVeh);
    this.closeModal('modalAddVehicle');
    this.showToast('Vehículo Registrado', `Placa ${plate} agregada correctamente a su garaje digital`, 'success');
    this.renderVehiclesList();
  },

  deleteVehicle(id) {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      this.state.vehicles = this.state.vehicles.filter(v => v.id !== id);
      this.showToast('Vehículo Eliminado', 'Se ha retirado el vehículo de su cuenta', 'info');
      this.renderVehiclesList();
    }
  },

  // ==========================================================================
  // 4. HISTORIAL DE RESERVAS
  // ==========================================================================
  renderReservationsHistory() {
    const tbody = document.getElementById('driver-history-tbody');
    if (!tbody) return;

    if (this.state.reservations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center py-4 text-muted">No tiene reservas registradas.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.reservations.map(r => `
      <tr>
        <td><strong style="font-family:'Outfit',sans-serif; color:var(--text-main);">${r.code}</strong></td>
        <td>
          <div class="fw-bold" style="font-size:0.88rem;">${r.parkingName}</div>
          <div class="text-muted" style="font-size:0.75rem;">${r.parkingAddress || 'Santa Cruz'}</div>
        </td>
        <td>
          <div class="bolivian-plate-badge" style="font-size:0.78rem; padding:0.1rem 0.4rem;">
            ${r.plate}
          </div>
        </td>
        <td><span class="badge bg-success" style="font-size:0.75rem;">Plaza ${r.slot}</span></td>
        <td style="font-size:0.82rem;">${r.timeWindow}<br><small class="text-muted">${r.date}</small></td>
        <td><strong style="color:var(--accent-emerald);">Bs ${r.totalPaid.toFixed(2)}</strong></td>
        <td style="font-size:0.8rem;">${r.paymentMethod}</td>
        <td>
          <span class="badge ${r.status === 'activa' ? 'bg-success' : (r.status === 'completada' ? 'bg-secondary' : 'bg-danger')}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-sm btn-outline-secondary" onclick="DriverApp.printReceipt('${r.code}')" title="Ver Comprobante Digital">
              <i class="fa-solid fa-receipt"></i> Boleta
            </button>
            <button class="btn btn-sm btn-outline-primary" onclick="DriverApp.openSlotLocationModal('${r.slot}')" title="Ver Ubicación de Plaza">
              <i class="fa-solid fa-location-crosshairs"></i> Plaza
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  filterHistoryTable(query) {
    const q = query.toLowerCase().trim();
    const tbody = document.getElementById('driver-history-tbody');
    if (!tbody) return;

    const filtered = this.state.reservations.filter(r => 
      r.code.toLowerCase().includes(q) || r.parkingName.toLowerCase().includes(q) || r.plate.toLowerCase().includes(q)
    );

    tbody.innerHTML = filtered.map(r => `
      <tr>
        <td><strong style="font-family:'Outfit',sans-serif; color:var(--text-main);">${r.code}</strong></td>
        <td>
          <div class="fw-bold" style="font-size:0.88rem;">${r.parkingName}</div>
          <div class="text-muted" style="font-size:0.75rem;">${r.parkingAddress || 'Santa Cruz'}</div>
        </td>
        <td>
          <div class="bolivian-plate-badge" style="font-size:0.78rem; padding:0.1rem 0.4rem;">
            ${r.plate}
          </div>
        </td>
        <td><span class="badge bg-success" style="font-size:0.75rem;">Plaza ${r.slot}</span></td>
        <td style="font-size:0.82rem;">${r.timeWindow}<br><small class="text-muted">${r.date}</small></td>
        <td><strong style="color:var(--accent-emerald);">Bs ${r.totalPaid.toFixed(2)}</strong></td>
        <td style="font-size:0.8rem;">${r.paymentMethod}</td>
        <td>
          <span class="badge ${r.status === 'activa' ? 'bg-success' : (r.status === 'completada' ? 'bg-secondary' : 'bg-danger')}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="btn btn-sm btn-outline-secondary" onclick="DriverApp.printReceipt('${r.code}')" title="Ver Comprobante Digital">
              <i class="fa-solid fa-receipt"></i> Boleta
            </button>
            <button class="btn btn-sm btn-outline-primary" onclick="DriverApp.openSlotLocationModal('${r.slot}')" title="Ver Ubicación de Plaza">
              <i class="fa-solid fa-location-crosshairs"></i> Plaza
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  printReceipt(code) {
    const res = this.state.reservations.find(r => r.code === code) || this.state.reservations[0];
    if (!res) return;

    const body = document.getElementById('receipt-modal-content') || document.getElementById('receipt-modal-body');
    if (body) {
      body.innerHTML = `
        <div style="padding:1.25rem 1.5rem;">
          <!-- Factura / Boleta Header -->
          <div style="text-align:center; border-bottom:2px dashed #CBD5CE; padding-bottom:1.5rem; margin-bottom:1.5rem;">
            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
              <div style="width:34px; height:34px; background:#006D36; color:white; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem; box-shadow:0 3px 8px rgba(0,109,54,0.3);">
                <i class="fa-solid fa-car"></i>
              </div>
              <h3 style="margin:0; font-family:'Outfit',sans-serif; font-weight:800; font-size:1.45rem; color:#063D25;">PARKINGO BOLIVIA S.R.L.</h3>
            </div>
            <p style="margin:0.25rem 0 0 0; font-size:0.82rem; color:var(--text-muted);">NIT: 304918021 | Autorización: 49010048291</p>
            <div class="mt-2.5 d-flex justify-content-center gap-2 align-items-center">
              <span class="badge bg-success" style="font-size:0.8rem; font-weight:700; padding:0.4rem 0.8rem; border-radius:20px;">FACTURA DIGITAL / COMPROBANTE N° ${res.code}</span>
            </div>
          </div>

          <!-- Factura Spec Lines -->
          <div style="font-size:0.88rem; margin-bottom:1.5rem;">
            <div class="d-flex justify-content-between align-items-center mb-2.5 pb-1.5 border-bottom">
              <span class="text-muted">Cliente / Conductor:</span>
              <strong class="text-dark">${res.driverName || 'Gonzalo Claros'}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2.5 pb-1.5 border-bottom">
              <span class="text-muted">Fecha & Hora Emisión:</span>
              <span class="fw-semibold">${res.date} • ${res.timeWindow}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2.5 pb-1.5 border-bottom">
              <span class="text-muted">Vehículo & Placa:</span>
              <div class="bolivian-plate-badge" style="font-size:0.9rem; padding:0.15rem 0.55rem;">
                <i class="fa-solid fa-car text-primary"></i> ${res.plate}
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2.5 pb-1.5 border-bottom">
              <span class="text-muted">Parqueo Destino:</span>
              <strong class="text-dark">${res.parkingName}</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2.5 pb-1.5 border-bottom">
              <span class="text-muted">Plaza Asignada:</span>
              <strong class="text-success" style="font-family:'Outfit',sans-serif; font-size:1.05rem;">PLAZA ${res.slot} (${res.sector || 'Sector Techado A'})</strong>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-muted">Método de Pago:</span>
              <span class="fw-bold">${res.paymentMethod}</span>
            </div>
          </div>

          <!-- Financial Total Box -->
          <div class="p-3.5 mb-4" style="background:#F0FDF4; border:1.5px solid #22C55E; border-radius:12px; padding:1.25rem 1.5rem;">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="fw-bold text-dark" style="font-size:0.95rem; display:block;">IMPORTE TOTAL PAGADO:</span>
                <span class="text-muted" style="font-size:0.75rem;">Incluye 13% IVA según Ley N° 843</span>
              </div>
              <strong style="font-family:'Outfit',sans-serif; font-size:1.75rem; color:#063D25;">Bs ${res.totalPaid.toFixed(2)}</strong>
            </div>
          </div>

          <!-- Quick Interactive Links to GPS & Croquis -->
          <div class="d-grid gap-2.5 mb-3">
            <button class="btn btn-outline-primary py-2.5 fw-bold" onclick="DriverApp.closeModal('modalPrintReceipt'); DriverApp.openParkingLocationModal(${res.parkingId || 101});" style="border-radius:6px; font-size:0.85rem;">
              <i class="fa-solid fa-map-location-dot me-1"></i> Ver Ubicación GPS del Parqueo (Google Maps / Waze)
            </button>
            <button class="btn btn-outline-success py-2.5 fw-bold" onclick="DriverApp.closeModal('modalPrintReceipt'); DriverApp.openSlotLocationModal('${res.slot}');" style="color:#006D36; border-color:#006D36; border-radius:6px; font-size:0.85rem;">
              <i class="fa-solid fa-location-crosshairs me-1"></i> Ver Ubicación Exacta de Plaza ${res.slot} en Croquis
            </button>
          </div>

          <div style="text-align:center; font-size:0.75rem; color:var(--text-dim);" class="mt-3">
            Ley N° 843: "ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PAÍS. EL USO ILÍCITO SERÁ SANCIONADO DE ACUERDO A LEY."
          </div>
        </div>
      `;
    }

    this.openModal('modalPrintReceipt');
  },

  openActiveReceiptModal() {
    const activeRes = this.state.reservations.find(r => r.status === 'activa') || this.state.reservations[0];
    if (activeRes) {
      this.printReceipt(activeRes.code);
    }
  },

  // ==========================================================================
  // 5. CALIFICACIÓN DEL SERVICIO
  // ==========================================================================
  populateRatingReservationOptions() {
    const selectRes = document.getElementById('rating-reservation-select');
    if (!selectRes) return;
    const unrated = this.state.reservations.filter(r => r.status === 'completada' && !r.rated);
    if (unrated.length === 0) {
      selectRes.innerHTML = `<option value="">Todas sus reservas completadas ya fueron calificadas</option>`;
    } else {
      selectRes.innerHTML = unrated.map(r => `<option value="${r.code}">${r.code} - ${r.parkingName} (${r.date})</option>`).join('');
    }
  },

  renderReviewsHistory() {
    const container = document.getElementById('driver-reviews-history-container');
    if (!container) return;

    const ratedRes = this.state.reservations.filter(r => r.rated);

    if (ratedRes.length === 0) {
      container.innerHTML = `<div class="text-center py-5" style="color:var(--text-muted); font-size:1rem; font-weight:500;"><i class="fa-solid fa-comments text-muted opacity-50 d-block mb-2" style="font-size:2rem;"></i>Aún no has publicado reseñas de tus parqueos.</div>`;
      return;
    }

    container.innerHTML = ratedRes.map(r => `
      <div class="review-card-modern" style="background:#FFFFFF; border:1px solid #CBD5CE; border-radius:6px; padding:0.95rem 1.15rem; margin-bottom:0.9rem;">
        <div class="d-flex justify-content-between align-items-start mb-2" style="gap:0.75rem;">
          <div class="d-flex align-items-center gap-2.5">
            <div class="avatar-circle-sm" style="width:38px; height:38px; border-radius:6px; background:#063D25; color:#FFFFFF; font-weight:800; font-family:'Outfit',sans-serif; font-size:0.9rem; display:flex; align-items:center; justify-content:center; border:1px solid #006D36; flex-shrink:0;">GC</div>
            <div>
              <div class="d-flex align-items-center gap-2 mb-0.5">
                <strong style="font-size:0.98rem; color:#063D25; font-weight:800; font-family:'Outfit',sans-serif; line-height:1.3;">${r.parkingName}</strong>
                <span class="badge" style="background:#DCFCE7; color:#15803D; font-size:0.68rem; font-weight:700; padding:0.25rem 0.5rem; border-radius:4px; border:1px solid #86EFAC;">
                  <i class="fa-solid fa-circle-check me-1"></i> Reseña Publicada
                </span>
              </div>
              <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.4;">
                <span style="font-weight:600; color:#334155;">Reserva: #${r.code}</span> • <span style="font-weight:600; color:#334155;">Placa: ${r.plate}</span>
              </div>
            </div>
          </div>

          <div class="rating-stars-badge" style="background:#FEF3C7; color:#D97706; font-size:0.82rem; font-weight:700; padding:0.3rem 0.65rem; border-radius:4px; border:1px solid #FDE68A; display:inline-flex; align-items:center; flex-shrink:0;">
            <i class="fa-solid fa-star me-1" style="color:#F59E0B;"></i>${(r.ratingStars || 5).toFixed(1)} / 5.0
          </div>
        </div>

        <div style="font-size:0.88rem; color:#1E293B; line-height:1.5; padding:0.65rem 0.85rem; background:#F8FAFC; border-radius:6px; border-left:3px solid #006D36; margin-top:0.5rem; font-style:italic;">
          <i class="fa-solid fa-quote-left text-muted opacity-50 me-1.5"></i>${r.ratingComment || 'Excelente servicio de parqueo.'}"
        </div>
      </div>
    `).join('');
  },

  openRatingModal(resCode) {
    this.switchView('calificar');
    const selectRes = document.getElementById('rating-reservation-select');
    if (selectRes) selectRes.value = resCode;
  },

  handleRatingSubmit() {
    const selectEl = document.getElementById('rating-reservation-select');
    if (!selectEl) return;
    const resCode = selectEl.value;
    const stars = parseInt(document.getElementById('selected-rating-val').value || '5', 10);
    const comment = document.getElementById('rating-comment-text').value.trim();

    const res = this.state.reservations.find(r => r.code === resCode);
    if (res) {
      res.rated = true;
      res.ratingStars = stars;
      res.ratingComment = comment;
    }

    this.showToast('Calificación Enviada', `Gracias por calificar el servicio con ${stars} estrellas ⭐`, 'success');
    this.renderReviewsHistory();
    this.populateRatingReservationOptions();
  },

  simulateGPSNavigation() {
    this.openParkingLocationModal(101);
  },

  // Helpers with strict display toggling
  openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      el.style.display = 'flex';
    }
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      el.style.display = 'none';
    }
  },

  showToast(title, message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const colors = { success: '#006D36', warning: '#D97706', danger: '#DC2626', info: '#2563EB' };

    toast.style.cssText = `
      background: #FFFFFF;
      border-left: 5px solid ${colors[type] || colors.info};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 6px;
      padding: 12px 16px;
      min-width: 280px;
      max-width: 360px;
    `;

    toast.innerHTML = `
      <div style="font-weight:700; font-size:0.9rem; color:#0F172A; margin-bottom:2px;">${title}</div>
      <div style="font-size:0.8rem; color:#475569;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }
};
