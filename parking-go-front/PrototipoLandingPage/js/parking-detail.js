/* ==========================================================================
   ParkinGo Enterprise - Vista Exclusiva de Detalle de Parqueo
   Controller JS: Galería Airbnb, Croquis Interactivo de Plazas, Tarifas, Reseñas y Widget de Reserva
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  ParkingDetailApp.init();
});

const ParkingDetailApp = {
  state: {
    currentParking: null,
    selectedSlot: 'A-05',
    selectedHours: 2,
    selectedVehicle: '9912-KLS',
    selectedSlotType: 'standard',
    vehicles: [
      { plate: '9912-KLS', model: 'Toyota Corolla (Gris Plata)', isDefault: true },
      { plate: '4410-QWE', model: 'Tesla Model 3 (Azul EV)', isDefault: false },
      { plate: '6543-BBB', model: 'Hyundai Tucson (Blanco)', isDefault: false }
    ],
    parkingsData: {
      101: {
        id: 101,
        name: 'ParkinGo Equipetrol Central',
        tagline: 'Parqueo inteligente con tecnología de lectura de placas LPR y estaciones de carga EV de alta velocidad.',
        address: 'Av. San Martín #450, Equipetrol Norte, Santa Cruz',
        distance: '0.4 km',
        rating: 4.8,
        reviewsCount: 124,
        pricePerHour: 10.00,
        dayPassPrice: 65.00,
        monthlyPlanPrice: 450.00,
        evExtraPerHour: 5.00,
        availableSlots: 42,
        totalSlots: 60,
        maxHeight: '2.20 metros',
        security247: true,
        gallery: [
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'
        ],
        features: [
          { icon: 'fa-camera-retro', name: 'Cámaras LPR 24/7', desc: 'Apertura automática de barrera al detectar tu placa.' },
          { icon: 'fa-charging-station', name: 'Estación Carga EV', desc: 'Cargadores Tipo 2 para vehículos eléctricos e híbridos.' },
          { icon: 'fa-warehouse', name: 'Plazas 100% Techadas', desc: 'Protección contra lluvia, granizo y radiación solar.' },
          { icon: 'fa-shield-halved', name: 'Seguridad Custodiada', desc: 'Personal de garita permanente y sensores de presencia.' },
          { icon: 'fa-wheelchair', name: 'Plazas Preferenciales PMR', desc: 'Espacios de fácil acceso para personas con movilidad reducida.' },
          { icon: 'fa-soap', name: 'Servicio Lava Autos (Opcional)', desc: 'Lavado ecológico opcional mientras tu vehículo está estacionado.' }
        ],
        slots: [
          { code: 'A-01', sector: 'Sector Techado A', status: 'ocupado' },
          { code: 'A-02', sector: 'Sector Techado A', status: 'ocupado' },
          { code: 'A-03', sector: 'Sector Techado A', status: 'disponible' },
          { code: 'A-04', sector: 'Sector Techado A', status: 'ocupado' },
          { code: 'A-05', sector: 'Sector Techado A', status: 'disponible', isSelected: true },
          { code: 'A-06', sector: 'Sector Techado A', status: 'disponible' },
          { code: 'A-07', sector: 'Estación Carga EV', status: 'ev-disponible' },
          { code: 'A-08', sector: 'Estación Carga EV', status: 'ev-disponible' },
          { code: 'A-09', sector: 'Sector Preferencial PMR', status: 'pmr-disponible' },
          { code: 'A-10', sector: 'Sector Techado A', status: 'disponible' }
        ],
        reviews: [
          { name: 'Marcelo Vaca', date: 'Hace 3 días', rating: 5, comment: 'Excelente parqueo en Equipetrol, la barrera LPR abrió de inmediato sin sacar ticket de papel.', car: 'Suzuki Vitara' },
          { name: 'Lucía Fernández', date: 'Hace 1 semana', rating: 5, comment: 'Súper seguro y la plaza de carga EV funcionó impecable para mi Tesla.', car: 'Tesla Model Y' },
          { name: 'Jorge Aguilera', date: 'Hace 2 semanas', rating: 4, comment: 'Muy iluminado y cómodo. Buena atención del operador de garita.', car: 'Nissan Kicks' }
        ]
      },
      102: {
        id: 102,
        name: 'ParkinGo Centro Histórico',
        tagline: 'Ubicación privilegiada en el corazón del casco viejo con acceso táctil y seguridad permanente.',
        address: 'Calle Junín #120, Casco Viejo, Santa Cruz',
        distance: '1.2 km',
        rating: 4.6,
        reviewsCount: 89,
        pricePerHour: 8.00,
        dayPassPrice: 50.00,
        monthlyPlanPrice: 380.00,
        evExtraPerHour: 5.00,
        availableSlots: 15,
        totalSlots: 40,
        maxHeight: '2.10 metros',
        security247: true,
        gallery: [
          'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80'
        ],
        features: [
          { icon: 'fa-shield-halved', name: 'Seguridad 24/7', desc: 'Vigilancia continua y control de entradas/salidas.' },
          { icon: 'fa-truck-monster', name: 'Bateas Amplias', desc: 'Espacios cómodos para camionetas y SUVs grandes.' },
          { icon: 'fa-id-card', name: 'Acceso Táctil Garita', desc: 'Ingreso rápido con QR o lector de placa.' }
        ],
        slots: [
          { code: 'B-01', sector: 'Sector Planta Baja', status: 'disponible' },
          { code: 'B-02', sector: 'Sector Planta Baja', status: 'disponible', isSelected: true },
          { code: 'B-03', sector: 'Sector Planta Baja', status: 'ocupado' }
        ],
        reviews: [
          { name: 'Patricia Moreno', date: 'Hace 5 días', rating: 4.5, comment: 'Muy conveniente para hacer trámites en la plaza principal.', car: 'Toyota Rav4' }
        ]
      },
      103: {
        id: 103,
        name: 'ParkinGo Plaza Abaroa',
        tagline: 'Infraestructura moderna en Sopocachi con carga rápida EV y servicio de lavado ecológico.',
        address: 'Av. 20 de Octubre #2210, Sopocachi, La Paz',
        distance: '2.5 km',
        rating: 4.9,
        reviewsCount: 210,
        pricePerHour: 12.00,
        dayPassPrice: 75.00,
        monthlyPlanPrice: 520.00,
        evExtraPerHour: 5.00,
        availableSlots: 8,
        totalSlots: 35,
        maxHeight: '2.30 metros',
        security247: true,
        gallery: [
          'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80'
        ],
        features: [
          { icon: 'fa-charging-station', name: 'Carga Rápida EV DC', desc: 'Cargador de alta velocidad 50kW.' },
          { icon: 'fa-warehouse', name: 'Plazas Cubiertas', desc: 'Techado de estructura metálica de alta durabilidad.' }
        ],
        slots: [
          { code: 'C-01', sector: 'Sector Abaroa Techado', status: 'disponible', isSelected: true },
          { code: 'C-02', sector: 'Sector Abaroa Techado', status: 'ocupado' }
        ],
        reviews: [
          { name: 'Daniel Zeballos', date: 'Hace 1 día', rating: 5, comment: 'El mejor parqueo de la zona Sopocachi.', car: 'Hyundai Tucson' }
        ]
      }
    }
  },

  init() {
    // Read parking ID from URL query string ?id=101
    const urlParams = new URLSearchParams(window.location.search);
    const parkingId = parseInt(urlParams.get('id') || '101', 10);
    this.state.currentParking = this.state.parkingsData[parkingId] || this.state.parkingsData[101];

    this.renderPageDetails();
    this.setupEventListeners();
    this.recalculateWidgetPrice();
  },

  renderPageDetails() {
    const p = this.state.currentParking;
    if (!p) return;

    // 1. Title & Header Info
    const titleEl = document.getElementById('detail-parking-name');
    if (titleEl) titleEl.textContent = p.name;

    const ratingEl = document.getElementById('detail-parking-rating');
    if (ratingEl) ratingEl.innerHTML = `<i class="fa-solid fa-star text-warning me-1"></i>${p.rating} (${p.reviewsCount} reseñas)`;

    const addressEl = document.getElementById('detail-parking-address');
    if (addressEl) addressEl.innerHTML = `<i class="fa-solid fa-location-dot text-emerald me-1"></i> ${p.address} • <strong>${p.distance}</strong>`;

    const tagEl = document.getElementById('detail-parking-tagline');
    if (tagEl) tagEl.textContent = p.tagline;

    // 2. Photo Gallery (Airbnb Grid Style)
    const galleryContainer = document.getElementById('detail-gallery-grid');
    if (galleryContainer && p.gallery.length > 0) {
      const mainImg = p.gallery[0];
      const secImgs = p.gallery.slice(1, 5);

      galleryContainer.innerHTML = `
        <div class="gallery-main">
          <img src="${mainImg}" alt="${p.name}">
        </div>
        <div class="gallery-sub-grid">
          ${secImgs.map((img, idx) => `
            <img src="${img}" alt="${p.name} - foto ${idx + 2}">
          `).join('')}
        </div>
      `;
    }

    // 3. Features & Amenities Grid
    const featuresContainer = document.getElementById('detail-features-grid');
    if (featuresContainer) {
      featuresContainer.innerHTML = p.features.map(f => `
        <div class="d-flex align-items-start gap-3 p-3 style="background:#F8FAFC; border-radius:8px; border:1px solid #E2E8F0;">
          <div style="width:40px; height:40px; background:#DCFCE7; color:#006D36; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0;">
            <i class="fa-solid ${f.icon}"></i>
          </div>
          <div>
            <h6 class="fw-bold mb-1" style="font-size:0.92rem; color:var(--text-main);">${f.name}</h6>
            <div style="font-size:0.8rem; color:var(--text-muted);">${f.desc}</div>
          </div>
        </div>
      `).join('');
    }

    // 4. Interactive Croquis Slots
    this.renderCroquisSlots();

    // 5. Rates & Plans Matrix
    const hourlyRateEl = document.getElementById('plan-hourly-rate');
    if (hourlyRateEl) hourlyRateEl.textContent = `Bs ${p.pricePerHour.toFixed(2)} / hora`;

    const dayPassEl = document.getElementById('plan-day-pass');
    if (dayPassEl) dayPassEl.textContent = `Bs ${p.dayPassPrice.toFixed(2)} / día (8h)`;

    const monthlyEl = document.getElementById('plan-monthly-price');
    if (monthlyEl) monthlyEl.textContent = `Bs ${p.monthlyPlanPrice.toFixed(2)} / mes`;

    // 6. Reviews List & Rating Summary System (Crisp Executive Layout)
    const reviewsContainer = document.getElementById('detail-reviews-container');
    if (reviewsContainer) {
      const totalCount = p.reviewsCount || 124;
      const ratingAvg = p.rating || 4.8;

      reviewsContainer.innerHTML = `
        <!-- Summary Rating Breakdown Card (Solid Flex Layout) -->
        <div style="background:#F8FAFC; border:1px solid #CBD5CE; border-radius:6px; padding:1.25rem; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap;">
            <!-- Left Score Column -->
            <div style="text-align:center; padding-right:1.5rem; border-right:1px solid #CBD5CE; min-width:140px;">
              <div style="font-family:'Outfit',sans-serif; font-size:3rem; font-weight:800; color:#063D25; line-height:1;">${ratingAvg}</div>
              <div style="color:#F59E0B; font-size:1.05rem; margin:0.3rem 0;">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
              </div>
              <span style="font-size:0.75rem; color:#64748B; font-weight:600; display:block;">Basado en ${totalCount} opiniones</span>
            </div>

            <!-- Right Progress Bars Column -->
            <div style="flex:1; min-width:240px;">
              <!-- 5 Stars Row -->
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.4rem; font-size:0.8rem;">
                <span style="width:75px; font-weight:700; color:#475569; white-space:nowrap;">5 Estrellas</span>
                <div style="flex:1; height:8px; background:#E2E8F0; border-radius:3px; overflow:hidden; display:flex;">
                  <div style="width:92%; height:100%; background:#006D36; border-radius:3px;"></div>
                </div>
                <span style="width:35px; text-align:right; font-weight:800; color:#0F172A;">92%</span>
              </div>

              <!-- 4 Stars Row -->
              <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.4rem; font-size:0.8rem;">
                <span style="width:75px; font-weight:700; color:#475569; white-space:nowrap;">4 Estrellas</span>
                <div style="flex:1; height:8px; background:#E2E8F0; border-radius:3px; overflow:hidden; display:flex;">
                  <div style="width:6%; height:100%; background:#0284C7; border-radius:3px;"></div>
                </div>
                <span style="width:35px; text-align:right; font-weight:800; color:#0F172A;">6%</span>
              </div>

              <!-- 3 Stars Row -->
              <div style="display:flex; align-items:center; gap:0.75rem; font-size:0.8rem;">
                <span style="width:75px; font-weight:700; color:#475569; white-space:nowrap;">3 Estrellas</span>
                <div style="flex:1; height:8px; background:#E2E8F0; border-radius:3px; overflow:hidden; display:flex;">
                  <div style="width:2%; height:100%; background:#D97706; border-radius:3px;"></div>
                </div>
                <span style="width:35px; text-align:right; font-weight:800; color:#0F172A;">2%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Reviews Cards Grid (Subtle 6px Border Radius) -->
        ${p.reviews.map(r => {
          const initials = r.initials || r.name.split(' ').map(n => n[0]).join('');
          return `
            <div class="review-card-modern">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="d-flex align-items-center gap-3">
                  <div class="avatar-circle-sm">${initials}</div>
                  <div>
                    <div class="d-flex align-items-center gap-2 flex-wrap">
                      <strong style="font-size:0.95rem; color:var(--text-main); font-weight:800;">${r.name}</strong>
                      <span class="badge" style="background:#DCFCE7; color:#15803D; font-size:0.68rem; font-weight:700; border:1px solid #86EFAC; border-radius:4px; padding:0.25rem 0.5rem;">
                        <i class="fa-solid fa-circle-check me-1"></i> Conductor Verificado
                      </span>
                    </div>
                    <div style="font-size:0.76rem; color:var(--text-muted);" class="mt-1">
                      <span class="me-2"><i class="fa-solid fa-car text-emerald me-1"></i> ${r.car}</span> • 
                      <span class="ms-1"><i class="fa-regular fa-clock me-1"></i> ${r.date}</span>
                    </div>
                  </div>
                </div>

                <div class="rating-stars-badge">
                  <i class="fa-solid fa-star me-1" style="color:#F59E0B;"></i>${r.rating.toFixed(1)} / 5.0
                </div>
              </div>

              <p style="font-size:0.88rem; color:var(--text-main); line-height:1.5; margin:0.6rem 0 0.5rem 0;">
                <i class="fa-solid fa-quote-left text-muted opacity-25 me-1"></i>${r.comment}"
              </p>

              <div class="d-flex gap-1.5 mt-2.5 flex-wrap">
                <span class="badge bg-light text-dark border" style="font-size:0.68rem; border-radius:4px; padding:0.25rem 0.5rem;"><i class="fa-solid fa-shield-halved text-emerald me-1"></i> Acceso LPR Garita</span>
                <span class="badge bg-light text-dark border" style="font-size:0.68rem; border-radius:4px; padding:0.25rem 0.5rem;"><i class="fa-solid fa-broom text-primary me-1"></i> Excelente Limpieza</span>
                <span class="badge bg-light text-dark border" style="font-size:0.68rem; border-radius:4px; padding:0.25rem 0.5rem;"><i class="fa-solid fa-lightbulb text-warning me-1"></i> Muy Iluminado</span>
              </div>
            </div>
          `;
        }).join('')}
      `;
    }

    // 7. Widget Sticky Price
    const widgetPriceEl = document.getElementById('widget-price-display');
    if (widgetPriceEl) widgetPriceEl.textContent = `Bs ${p.pricePerHour.toFixed(2)}`;

    // Populate Vehicle Select
    const vehSelect = document.getElementById('widget-vehicle-select');
    if (vehSelect) {
      vehSelect.innerHTML = this.state.vehicles.map(v => `
        <option value="${v.plate}" ${v.isDefault ? 'selected' : ''}>${v.plate} - ${v.model}</option>
      `).join('');
    }

    // Populate Date & Time Default
    const dateInput = document.getElementById('widget-booking-date');
    if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

    const timeInput = document.getElementById('widget-booking-time');
    if (timeInput) {
      const now = new Date();
      timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
  },

  renderCroquisSlots() {
    const p = this.state.currentParking;
    const container = document.getElementById('detail-croquis-slots-grid');
    if (!container || !p) return;

    container.innerHTML = p.slots.map(s => {
      const isSelected = s.code === this.state.selectedSlot;
      let statusBg = '#334155';
      let statusText = 'Ocupado';

      if (s.status === 'disponible' || s.status === 'ev-disponible' || s.status === 'pmr-disponible') {
        statusBg = isSelected ? '#006D36' : '#F0FDF4';
        statusText = isSelected ? 'ELEGIDO' : 'Disponible';
      }

      return `
        <div class="slot-pick-card ${isSelected ? 'selected' : ''} ${s.status}" onclick="ParkingDetailApp.selectSlotFromCroquis('${s.code}')">
          <span style="font-size:0.68rem; opacity:0.8;">PLAZA</span>
          <div style="font-family:'Outfit',sans-serif; font-weight:800; font-size:1.15rem; margin:0.1rem 0;">${s.code}</div>
          <span class="badge ${isSelected ? 'bg-success' : 'bg-light text-dark'}" style="font-size:0.62rem;">${statusText}</span>
        </div>
      `;
    }).join('');

    const selectedDisplay = document.getElementById('widget-selected-slot');
    if (selectedDisplay) selectedDisplay.value = this.state.selectedSlot;
  },

  selectSlotFromCroquis(slotCode) {
    this.state.selectedSlot = slotCode;
    this.renderCroquisSlots();
    this.recalculateWidgetPrice();
    this.showToast('Plaza Seleccionada', `Has elegido la plaza ${slotCode} para tu reserva`, 'info');
  },

  setupEventListeners() {
    const hoursSelect = document.getElementById('widget-hours-select');
    if (hoursSelect) {
      hoursSelect.addEventListener('change', (e) => {
        this.state.selectedHours = parseInt(e.target.value, 10);
        this.recalculateWidgetPrice();
      });
    }

    const slotTypeSelect = document.getElementById('widget-slot-type-select');
    if (slotTypeSelect) {
      slotTypeSelect.addEventListener('change', (e) => {
        this.state.selectedSlotType = e.target.value;
        this.recalculateWidgetPrice();
      });
    }

    const bookingForm = document.getElementById('detail-widget-booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.confirmBookingFromDetail();
      });
    }
  },

  recalculateWidgetPrice() {
    const p = this.state.currentParking;
    if (!p) return;

    let baseRate = p.pricePerHour;
    if (this.state.selectedSlotType === 'ev') baseRate += p.evExtraPerHour;

    const hours = parseInt(document.getElementById('widget-hours-select')?.value || '2', 10);
    const total = baseRate * (hours === 8 ? 6.5 : hours);

    const hourlyDisplay = document.getElementById('summary-rate-hour');
    if (hourlyDisplay) hourlyDisplay.textContent = `Bs ${baseRate.toFixed(2)}`;

    const totalDisplay = document.getElementById('summary-total-price');
    if (totalDisplay) totalDisplay.textContent = `Bs ${total.toFixed(2)}`;
  },

  confirmBookingFromDetail() {
    const p = this.state.currentParking;
    const plate = document.getElementById('widget-vehicle-select').value;
    const dateVal = document.getElementById('widget-booking-date').value;
    const timeVal = document.getElementById('widget-booking-time').value;
    const hours = parseInt(document.getElementById('widget-hours-select').value || '2', 10);

    const paymentRadios = document.getElementsByName('detail-payment-method');
    let payMethod = 'QR Simbol';
    for (const r of paymentRadios) {
      if (r.checked) payMethod = r.value;
    }

    const newResCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes = {
      code: newResCode,
      parkingId: p.id,
      parkingName: p.name,
      parkingAddress: p.address,
      plate: plate,
      vehicleModel: 'Toyota Corolla (Gris Plata)',
      driverName: 'Gonzalo Claros',
      driverPhone: '+591 71009988',
      sector: 'Nivel 1 - Sector Techado A',
      slot: this.state.selectedSlot,
      timeWindow: `${timeVal} - Duración: ${hours}h`,
      date: 'Hoy (' + dateVal + ')',
      status: 'activa',
      checkInTime: timeVal,
      checkOutTime: null,
      totalPaid: p.pricePerHour * (hours === 8 ? 6.5 : hours),
      paymentMethod: `${payMethod} Digital`,
      rated: false
    };

    // Save into localStorage for persistence
    try {
      const existing = JSON.parse(localStorage.getItem('parkingo_reservations') || '[]');
      existing.unshift(newRes);
      localStorage.setItem('parkingo_reservations', JSON.stringify(existing));
    } catch (e) {}

    alert(`¡Reserva Confirmada Exitosamente! Ticket #${newResCode} para Plaza ${this.state.selectedSlot}. Redirigiendo a tu boleta...`);
    window.location.href = 'parking-driver.html';
  },

  requestMonthlySubscription() {
    const p = this.state.currentParking;
    alert(`Solicitud de Abono Mensual enviada a ${p.name}. Tarifa solicitada: Bs ${p.monthlyPlanPrice.toFixed(2)}/mes. El administrador se pondrá en contacto.`);
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
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
