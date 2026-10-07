/* ==========================================================================
   ParkinGo Enterprise - Terminal Operativa de Garita / Operador de Parqueo
   Controller JS: Estado en vivo, Check-In/Out, Walk-in Instant Booking, Escáner & Croquis
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  OperatorApp.init();
});

const OperatorApp = {
  // Estado general simulado en memoria de la garita
  state: {
    activeView: 'control-entrada-salida',
    currentOperator: {
      name: 'Carlos Mendoza',
      shift: 'Turno Mañana (07:00 - 15:00)',
      garita: 'Caseta Principal Norte',
      parqueo: 'ParkinGo Equipetrol Central'
    },
    // Plazas de estacionamiento (60 plazas en 2 sectores)
    slots: [],
    // Reservas de la jornada actual
    reservations: [],
    // Historial de movimientos del turno (Check-ins y Check-outs)
    shiftLogs: []
  },

  init() {
    this.seedData();
    this.setupEventListeners();
    this.startLiveClock();
    this.updateSummaryCounters();
    this.renderActiveView();
  },

  // Seed de datos realistas para el prototipo operativo
  seedData() {
    const plates = ['ABC-1234', '7849-XYZ', '3421-KLP', '5521-BCD', '9012-MNP', '1188-FGH', '6643-RST', '4490-WXY'];
    const drivers = ['Juan Pérez', 'María Rodríguez', 'Roberto Gómez', 'Ana Martínez', 'Carlos Silva', 'Laura Fernández', 'Diego Morales', 'Elena Torres'];

    // 1. Generar 60 Plazas (Sector A: A-01 a A-30, Sector B: B-01 a B-30)
    const slots = [];
    
    // Sector A (Planta Baja - 30 plazas)
    for (let i = 1; i <= 30; i++) {
      const code = `A-${i < 10 ? '0' + i : i}`;
      let status = 'disponible';
      let plate = '';
      let driver = '';
      let entryTime = null;
      let isEV = i === 15 || i === 16;
      let isDisability = i === 1 || i === 2;

      if (i === 3 || i === 7 || i === 12 || i === 18 || i === 22) {
        status = 'ocupado';
        plate = plates[(i % plates.length)];
        driver = drivers[(i % drivers.length)];
        entryTime = new Date(Date.now() - (i * 25 * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (i === 5 || i === 10) {
        status = 'reservado';
        driver = drivers[(i % drivers.length)];
      } else if (i === 14) {
        status = 'mora'; // Tiempo excedido
        plate = '8821-EXP';
        driver = 'Marcos Escalante';
        entryTime = '07:15 AM';
      }

      slots.push({
        id: code,
        sector: 'Sector A (Planta Baja)',
        code: code,
        status: status, // disponible, ocupado, reservado, mora
        plate: plate,
        driver: driver,
        entryTime: entryTime,
        isEV: isEV,
        isDisability: isDisability,
        pricePerHour: isEV ? 15 : 10
      });
    }

    // Sector B (Nivel 1 - 30 plazas)
    for (let i = 1; i <= 30; i++) {
      const code = `B-${i < 10 ? '0' + i : i}`;
      let status = 'disponible';
      let plate = '';
      let driver = '';
      let entryTime = null;

      if (i === 2 || i === 9 || i === 15 || i === 24) {
        status = 'ocupado';
        plate = plates[((i + 3) % plates.length)];
        driver = drivers[((i + 3) % drivers.length)];
        entryTime = new Date(Date.now() - (i * 18 * 60000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (i === 4 || i === 19) {
        status = 'reservado';
        driver = drivers[((i + 2) % drivers.length)];
      }

      slots.push({
        id: code,
        sector: 'Sector B (Nivel 1)',
        code: code,
        status: status,
        plate: plate,
        driver: driver,
        entryTime: entryTime,
        isEV: false,
        isDisability: false,
        pricePerHour: 10
      });
    }

    this.state.slots = slots;

    // 2. Generar Reservas del Día
    this.state.reservations = [
      {
        code: 'RES-9041',
        plate: 'ABC-1234',
        driver: 'Juan Pérez',
        phone: '77123456',
        vehicleType: 'Automóvil',
        slot: 'A-03',
        timeWindow: '08:00 AM - 12:00 PM',
        status: 'en-sitio', // pendiente, en-sitio, finalizada, atrasado
        checkInTime: '08:05 AM',
        checkOutTime: null,
        totalPaid: 'Bs. 40.00'
      },
      {
        code: 'RES-9042',
        plate: '7849-XYZ',
        driver: 'María Rodríguez',
        phone: '68987654',
        vehicleType: 'SUV / Camioneta',
        slot: 'A-07',
        timeWindow: '08:30 AM - 10:30 AM',
        status: 'en-sitio',
        checkInTime: '08:28 AM',
        checkOutTime: null,
        totalPaid: 'Bs. 20.00'
      },
      {
        code: 'RES-9043',
        plate: '9912-KLS',
        driver: 'Gonzalo Claros',
        phone: '71009988',
        vehicleType: 'Automóvil',
        slot: 'A-05',
        timeWindow: '09:00 AM - 11:00 AM',
        status: 'pendiente',
        checkInTime: null,
        checkOutTime: null,
        totalPaid: 'Bs. 20.00'
      },
      {
        code: 'RES-9044',
        plate: '8821-EXP',
        driver: 'Marcos Escalante',
        phone: '76543210',
        vehicleType: 'Automóvil',
        slot: 'A-14',
        timeWindow: '07:00 AM - 08:30 AM',
        status: 'atrasado',
        checkInTime: '07:15 AM',
        checkOutTime: null,
        totalPaid: 'Bs. 15.00'
      },
      {
        code: 'RES-9045',
        plate: '4410-QWE',
        driver: 'Patricia Vaca',
        phone: '78811223',
        vehicleType: 'Vehículo Eléctrico (EV)',
        slot: 'A-15',
        timeWindow: '10:00 AM - 01:00 PM',
        status: 'pendiente',
        checkInTime: null,
        checkOutTime: null,
        totalPaid: 'Bs. 45.00'
      },
      {
        code: 'RES-9046',
        plate: '5543-FGT',
        driver: 'Lucía Méndez',
        phone: '69002244',
        vehicleType: 'Motocicleta',
        slot: 'B-04',
        timeWindow: '09:30 AM - 13:30 PM',
        status: 'pendiente',
        checkInTime: null,
        checkOutTime: null,
        totalPaid: 'Bs. 20.00'
      },
      {
        code: 'RES-9038',
        plate: '2219-MNO',
        driver: 'Fernando Alarcón',
        phone: '77665544',
        vehicleType: 'Automóvil',
        slot: 'A-02',
        timeWindow: '07:00 AM - 09:00 AM',
        status: 'finalizada',
        checkInTime: '07:02 AM',
        checkOutTime: '08:58 AM',
        totalPaid: 'Bs. 20.00'
      }
    ];

    // 3. Movimientos del Turno
    this.state.shiftLogs = [
      { id: 1, type: 'check-in', time: '08:28 AM', plate: '7849-XYZ', slot: 'A-07', driver: 'María Rodríguez', details: 'Reserva Web RES-9042' },
      { id: 2, type: 'check-in', time: '08:05 AM', plate: 'ABC-1234', slot: 'A-03', driver: 'Juan Pérez', details: 'Reserva Web RES-9041' },
      { id: 3, type: 'check-out', time: '08:58 AM', plate: '2219-MNO', slot: 'A-02', driver: 'Fernando Alarcón', details: 'Salida a tiempo - Ticket #9038' }
    ];
  },

  setupEventListeners() {
    // 1. Sidebar navigation links
    document.querySelectorAll('.sidebar-nav .nav-item[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        this.switchView(viewId);
      });
    });

    // 2. Sidebar toggle (Desktop Collapsed & Mobile Drawer)
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
          sidebar.classList.toggle('mobile-open');
        } else {
          sidebar.classList.toggle('collapsed');
          if (mainWrapper) mainWrapper.classList.toggle('collapsed');
        }
      });
    }

    // 3. Formulario de Reserva al Instante (Walk-in)
    const instantForm = document.getElementById('instant-booking-form');
    if (instantForm) {
      instantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleInstantBookingSubmit();
      });
    }

    // 4. Quick plate lookup in Check-in station
    const expressPlateInput = document.getElementById('express-plate-input');
    if (expressPlateInput) {
      expressPlateInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this.searchVehicleOrTicket(expressPlateInput.value);
        }
      });
    }

    // 5. Croquis filter buttons
    document.querySelectorAll('.croquis-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.croquis-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        this.renderCroquis(filter);
      });
    });

    // 6. Reservation list tab filters
    document.querySelectorAll('.res-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.res-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        this.renderReservationsTable(filter);
      });
    });

    // 7. Search box inside reservations table
    const resSearchInput = document.getElementById('res-search-input');
    if (resSearchInput) {
      resSearchInput.addEventListener('input', (e) => {
        this.renderReservationsTable('all', e.target.value.trim());
      });
    }

    // Keyboard shortcut (⌘K or Ctrl+K) for scanner/search focus
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('express-plate-input')?.focus();
      }
    });
  },

  startLiveClock() {
    const clockEl = document.getElementById('live-clock-display');
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: 'short' });
      const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (clockEl) {
        clockEl.innerHTML = `<i class="fa-regular fa-clock"></i> <strong>${timeStr}</strong> <span style="opacity:0.75; margin-left:4px;">${dateStr}</span>`;
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  },

  // Cambiar pestaña / sección activa
  switchView(viewId) {
    this.state.activeView = viewId;

    // Modificar clases del sidebar
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Mostrar sección correspondiente con la clase .dashboard-view active
    document.querySelectorAll('.dashboard-view').forEach(sec => {
      if (sec.id === `view-${viewId}`) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Actualizar títulos de topbar
    const titleEl = document.getElementById('current-page-title');
    const breadcrumbEl = document.getElementById('current-page-breadcrumb');

    const titles = {
      'control-entrada-salida': 'Terminal Operativa de Caseta',
      'reserva-instante': 'Registrar Reserva al Instante (Walk-In)',
      'plazas-disponibles': 'Plazas & Disponibilidad en Tiempo Real',
      'reservas-dia': 'Gestión de Reservas de la Jornada',
      'reporte-operador': 'Reporte & Cierre del Turno (Garita)'
    };

    const breadcrumbs = {
      'control-entrada-salida': 'Garita Principal / Terminal Caseta',
      'reserva-instante': 'Garita Principal / Conductor sin Reserva',
      'plazas-disponibles': 'Garita Principal / Mapa de Estacionamiento',
      'reservas-dia': 'Garita Principal / Control de Reservas',
      'reporte-operador': 'Garita Principal / Reportes & Arqueo'
    };

    if (titleEl) titleEl.textContent = titles[viewId] || 'Terminal Operador';
    if (breadcrumbEl) breadcrumbEl.textContent = breadcrumbs[viewId] || 'ParkinGo Operación';

    // Renderizado específico al cambiar
    this.renderActiveView();
  },

  renderActiveView() {
    this.updateSummaryCounters();
    if (this.state.activeView === 'control-entrada-salida') {
      this.renderShiftLogs();
      this.renderActiveVehiclesTable();
    } else if (this.state.activeView === 'plazas-disponibles') {
      const activeFilter = document.querySelector('.croquis-filter-btn.active')?.getAttribute('data-filter') || 'all';
      this.renderCroquis(activeFilter);
    } else if (this.state.activeView === 'reservas-dia') {
      const activeFilter = document.querySelector('.res-filter-btn.active')?.getAttribute('data-filter') || 'all';
      this.renderReservationsTable(activeFilter);
    } else if (this.state.activeView === 'reserva-instante') {
      this.populateInstantSlotOptions();
    } else if (this.state.activeView === 'reporte-operador') {
      this.renderOperatorReportView();
    }
  },

  updateSummaryCounters() {
    const total = this.state.slots.length; // 60
    const occupied = this.state.slots.filter(s => s.status === 'ocupado' || s.status === 'mora').length;
    const reserved = this.state.slots.filter(s => s.status === 'reservado').length;
    const available = this.state.slots.filter(s => s.status === 'disponible').length;
    const overstay = this.state.slots.filter(s => s.status === 'mora').length;

    // Actualizar badges en topbar y métricas rápidas
    const badgeOccupancy = document.getElementById('topbar-occupancy');
    if (badgeOccupancy) {
      const pct = Math.round((occupied / total) * 100);
      badgeOccupancy.innerHTML = `<div class="pulse-dot"></div> Libre: <strong>${available}/${total}</strong> (${pct}% ocupado)`;
    }

    // Contadores en vistas
    const elAvailable = document.getElementById('count-available');
    const elOccupied = document.getElementById('count-occupied');
    const elReserved = document.getElementById('count-reserved');
    const elOverstay = document.getElementById('count-overstay');

    if (elAvailable) elAvailable.textContent = available;
    if (elOccupied) elOccupied.textContent = occupied;
    if (elReserved) elReserved.textContent = reserved;
    if (elOverstay) elOverstay.textContent = overstay;
  },

  // ==========================================================================
  // 1. ESTACIÓN DE CONTROL ENTRADA / SALIDA (CHECK-IN / CHECK-OUT)
  // ==========================================================================
  searchVehicleOrTicket(rawQuery) {
    const query = (rawQuery || '').trim().toUpperCase();
    if (!query) {
      this.showToast('Atención', 'Ingrese una placa o número de reserva para buscar', 'warning');
      return;
    }

    // Buscar en reservas
    const reservationMatch = this.state.reservations.find(r => 
      r.plate.toUpperCase() === query || 
      r.code.toUpperCase() === query
    );

    // Buscar en plazas activas
    const slotMatch = this.state.slots.find(s => 
      s.plate.toUpperCase() === query || 
      s.code.toUpperCase() === query
    );

    const resultBox = document.getElementById('search-result-display');
    if (!resultBox) return;

    resultBox.style.display = 'block';

    if (reservationMatch) {
      // Mostrar tarjeta de reserva encontrada
      const isCheckInAvailable = reservationMatch.status === 'pendiente';
      const isCheckedIn = reservationMatch.status === 'en-sitio' || reservationMatch.status === 'atrasado';

      resultBox.innerHTML = `
        <div class="result-card-found" style="background:#F0FDF4; border:1px solid #86EFAC; border-radius:8px; padding:1.2rem; margin-top:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="badge badge-success" style="font-size:0.75rem;">Reserva Encontrada</span>
              <h3 style="font-size:1.3rem; margin:0.3rem 0; font-family:'Outfit'; color:#063D25;">${reservationMatch.plate}</h3>
              <p style="margin:0; font-weight:600; color:#1E293B;">${reservationMatch.driver} &bull; ${reservationMatch.phone}</p>
              <p style="margin:0.2rem 0 0 0; font-size:0.85rem; color:#64748B;">
                Código: <strong>${reservationMatch.code}</strong> | Plaza Asignada: <strong class="text-emerald" style="font-size:1rem;">${reservationMatch.slot}</strong>
              </p>
              <p style="margin:0.2rem 0 0 0; font-size:0.85rem; color:#64748B;">
                Horario: <strong>${reservationMatch.timeWindow}</strong> | Vehículo: <strong>${reservationMatch.vehicleType}</strong>
              </p>
            </div>
            <div style="text-align:right;">
              <span class="badge ${this.getStatusBadgeClass(reservationMatch.status)}" style="font-size:0.85rem; padding:0.4rem 0.8rem;">
                ${this.getStatusLabel(reservationMatch.status)}
              </span>
            </div>
          </div>
          
          <div style="margin-top:1rem; pt-3; border-top:1px dashed #CBD5E1; display:flex; gap:0.75rem; justify-content:flex-end;">
            ${isCheckInAvailable ? `
              <button class="btn btn-primary" onclick="OperatorApp.processCheckIn('${reservationMatch.code}')" style="background:#006D36;">
                <i class="fa-solid fa-right-to-bracket"></i> Confirmar Entrada (Check-In)
              </button>
            ` : ''}
            
            ${isCheckedIn ? `
              <button class="btn btn-danger" onclick="OperatorApp.openCheckOutModal('${reservationMatch.plate}')">
                <i class="fa-solid fa-right-from-bracket"></i> Registrar Salida (Check-Out)
              </button>
            ` : ''}

            <button class="btn btn-secondary" onclick="OperatorApp.printTicketForReservation('${reservationMatch.code}')">
              <i class="fa-solid fa-print"></i> Re-Imprimir Ticket
            </button>
          </div>
        </div>
      `;
    } else if (slotMatch && (slotMatch.status === 'ocupado' || slotMatch.status === 'mora')) {
      resultBox.innerHTML = `
        <div class="result-card-found" style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:1.2rem; margin-top:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
              <span class="badge badge-info" style="font-size:0.75rem;">Vehículo en Sitio</span>
              <h3 style="font-size:1.3rem; margin:0.3rem 0; font-family:'Outfit'; color:#0F172A;">${slotMatch.plate}</h3>
              <p style="margin:0; font-weight:600; color:#334155;">Conductor: ${slotMatch.driver || 'Conductor Garita'}</p>
              <p style="margin:0.2rem 0 0 0; font-size:0.85rem; color:#64748B;">
                Plaza Ocupada: <strong>${slotMatch.code}</strong> (${slotMatch.sector}) | Hora Ingreso: <strong>${slotMatch.entryTime || '08:00 AM'}</strong>
              </p>
            </div>
            <div>
              <button class="btn btn-danger" onclick="OperatorApp.openCheckOutModal('${slotMatch.plate}')">
                <i class="fa-solid fa-right-from-bracket"></i> Registrar Salida
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      resultBox.innerHTML = `
        <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:8px; padding:1rem; margin-top:1rem; color:#991B1B; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <i class="fa-solid fa-circle-exclamation" style="font-size:1.2rem; margin-right:0.5rem;"></i>
            No se encontró reserva o vehículo activo con la placa o código <strong>"${query}"</strong>.
          </div>
          <button class="btn btn-sm btn-primary" onclick="OperatorApp.switchView('reserva-instante'); document.getElementById('walkin-plate').value='${query}'">
            <i class="fa-solid fa-bolt"></i> Registrar Walk-in Ahora
          </button>
        </div>
      `;
    }
  },

  processCheckIn(resCode) {
    const res = this.state.reservations.find(r => r.code === resCode);
    if (!res) return;

    res.status = 'en-sitio';
    res.checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Actualizar plaza correspondiente
    const slot = this.state.slots.find(s => s.code === res.slot);
    if (slot) {
      slot.status = 'ocupado';
      slot.plate = res.plate;
      slot.driver = res.driver;
      slot.entryTime = res.checkInTime;
    }

    // Registrar en logs del turno
    this.state.shiftLogs.unshift({
      id: Date.now(),
      type: 'check-in',
      time: res.checkInTime,
      plate: res.plate,
      slot: res.slot,
      driver: res.driver,
      details: `Entrada confirmada - Ticket #${res.code}`
    });

    this.showToast('Check-In Exitoso', `Vehículo ${res.plate} ingresó a la plaza ${res.slot}`, 'success');
    this.renderActiveView();

    // Abrir ticket impreso
    this.printTicketForReservation(res.code);
  },

  openCheckOutModal(plateOrCode) {
    // Buscar datos del vehículo saliente
    let res = this.state.reservations.find(r => r.plate.toUpperCase() === plateOrCode.toUpperCase() || r.code === plateOrCode);
    let slot = this.state.slots.find(s => s.plate.toUpperCase() === plateOrCode.toUpperCase() || s.code === plateOrCode);

    const plate = res ? res.plate : (slot ? slot.plate : plateOrCode);
    const slotCode = res ? res.slot : (slot ? slot.code : 'A-01');
    const driver = res ? res.driver : (slot ? slot.driver : 'Conductor Garita');
    const checkInTime = res ? (res.checkInTime || '08:00 AM') : (slot ? (slot.entryTime || '08:00 AM') : '08:00 AM');
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Cálculos simulados de estancia y tarifa
    const isOverstay = slot ? slot.status === 'mora' : (res ? res.status === 'atrasado' : false);
    const baseTariff = 20.00;
    const penaltyTariff = isOverstay ? 15.00 : 0.00;
    const totalPay = baseTariff + penaltyTariff;

    const modalBody = document.getElementById('checkout-modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="text-align:center; padding-bottom:1rem; border-bottom:1px dashed #CBD5E1; margin-bottom:1rem;">
          <span class="badge badge-warning" style="font-size:0.8rem; margin-bottom:0.4rem;">Registrar Salida de Vehículo</span>
          <h2 style="font-family:'Outfit'; font-size:2rem; color:#063D25; margin:0.2rem 0;">${plate}</h2>
          <p style="margin:0; color:#64748B; font-weight:600;">Plaza: <strong style="color:#006D36;">${slotCode}</strong> &bull; Conductor: ${driver}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.2rem; background:#F8FAFC; padding:1rem; border-radius:6px;">
          <div>
            <span style="font-size:0.75rem; color:#64748B; font-weight:600;">HORA DE ENTRADA</span>
            <div style="font-size:1.1rem; font-weight:700; color:#1E293B;"><i class="fa-regular fa-clock text-emerald"></i> ${checkInTime}</div>
          </div>
          <div>
            <span style="font-size:0.75rem; color:#64748B; font-weight:600;">HORA ACTUAL (SALIDA)</span>
            <div style="font-size:1.1rem; font-weight:700; color:#1E293B;"><i class="fa-solid fa-flag-checkered text-emerald"></i> ${nowTime}</div>
          </div>
        </div>

        <div style="background:#FFF; border:1px solid #E2E8F0; border-radius:6px; padding:1rem; margin-bottom:1.2rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem;">
            <span style="color:#64748B;">Estancia Base (2 horas):</span>
            <strong style="color:#1E293B;">Bs. ${baseTariff.toFixed(2)}</strong>
          </div>
          ${isOverstay ? `
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.9rem; color:#DC2626;">
              <span><i class="fa-solid fa-triangle-exclamation"></i> Recargo por Tiempo Excedido:</span>
              <strong>+ Bs. ${penaltyTariff.toFixed(2)}</strong>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; pt-2; border-top:1px solid #E2E8F0; font-size:1.15rem; margin-top:0.5rem;">
            <strong style="color:#063D25;">Total a Cobrar:</strong>
            <strong style="color:#006D36; font-size:1.3rem;">Bs. ${totalPay.toFixed(2)}</strong>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label style="font-weight:600; font-size:0.85rem; display:block; margin-bottom:0.4rem;">Método de Pago Recibido:</label>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:0.5rem;">
            <label style="border:1px solid #CBD5E1; border-radius:6px; padding:0.6rem; text-align:center; cursor:pointer; font-weight:600; font-size:0.85rem;">
              <input type="radio" name="pay-method" value="efectivo" checked> Efectivo
            </label>
            <label style="border:1px solid #CBD5E1; border-radius:6px; padding:0.6rem; text-align:center; cursor:pointer; font-weight:600; font-size:0.85rem;">
              <input type="radio" name="pay-method" value="qr"> QR Simbol
            </label>
            <label style="border:1px solid #CBD5E1; border-radius:6px; padding:0.6rem; text-align:center; cursor:pointer; font-weight:600; font-size:0.85rem;">
              <input type="radio" name="pay-method" value="tarjeta"> Tarjeta
            </label>
          </div>
        </div>

        <div style="display:flex; gap:0.75rem; justify-content:flex-end; margin-top:1.5rem;">
          <button class="btn btn-secondary" onclick="OperatorApp.closeModal('modalCheckOut')">Cancelar</button>
          <button class="btn btn-primary" onclick="OperatorApp.confirmCheckOut('${plate}', '${slotCode}')" style="background:#006D36; min-width:180px;">
            <i class="fa-solid fa-check-double"></i> Confirmar Salida y Liberar
          </button>
        </div>
      `;
    }

    this.openModal('modalCheckOut');
  },

  confirmCheckOut(plate, slotCode) {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Liberar la plaza
    const slot = this.state.slots.find(s => s.code === slotCode || s.plate.toUpperCase() === plate.toUpperCase());
    if (slot) {
      slot.status = 'disponible';
      slot.plate = '';
      slot.driver = '';
      slot.entryTime = null;
    }

    // Actualizar estado de reserva si existe
    const res = this.state.reservations.find(r => r.plate.toUpperCase() === plate.toUpperCase() && (r.status === 'en-sitio' || r.status === 'atrasado'));
    if (res) {
      res.status = 'finalizada';
      res.checkOutTime = nowTime;
    }

    // Registrar en log del turno
    this.state.shiftLogs.unshift({
      id: Date.now(),
      type: 'check-out',
      time: nowTime,
      plate: plate,
      slot: slotCode,
      driver: res ? res.driver : 'Conductor Garita',
      details: `Salida completada - Plaza ${slotCode} liberada`
    });

    this.closeModal('modalCheckOut');
    this.showToast('Salida Registrada', `El vehículo ${plate} ha salido y la plaza ${slotCode} quedó libre.`, 'info');
    
    // Ocultar buscador si estaba activo
    const searchBox = document.getElementById('search-result-display');
    if (searchBox) searchBox.style.display = 'none';

    this.renderActiveView();
  },

  renderShiftLogs() {
    const tbody = document.getElementById('table-movimientos-caseta-operator');
    if (!tbody) return;

    if (this.state.shiftLogs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-muted);">Sin movimientos registrados en este turno.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.state.shiftLogs.slice(0, 10).map((log, idx) => `
      <tr>
        <td>
          <span class="badge ${log.type === 'check-in' ? 'badge-success' : 'badge-neutral'}" style="font-size:0.7rem;">
            <i class="fa-solid ${log.type === 'check-in' ? 'fa-right-to-bracket' : 'fa-right-from-bracket'}"></i> ${log.type === 'check-in' ? 'ENTRADA' : 'SALIDA'}
          </span>
        </td>
        <td style="font-weight:700; font-size:0.82rem; color:var(--text-main);">${log.time}</td>
        <td>
          <div style="font-weight:800; font-family:'Outfit'; color:#063D25; font-size:0.95rem;">${log.plate}</div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-main);">${log.driver}</div>
        </td>
        <td>
          <span class="badge badge-success" style="font-size:0.8rem; font-weight:700;">${log.slot}</span>
        </td>
        <td style="font-size:0.78rem; color:var(--text-muted);">${log.details}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="OperatorApp.printTicketForReservation('${log.plate}')" title="Re-imprimir Ticket">
            <i class="fa-solid fa-print"></i> Ticket
          </button>
        </td>
      </tr>
    `).join('');
  },

  renderActiveVehiclesTable() {
    const tbody = document.getElementById('table-active-vehicles-operator');
    if (!tbody) return;

    const activeSlots = this.state.slots.filter(s => s.status === 'ocupado' || s.status === 'mora');

    if (activeSlots.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No hay vehículos estacionados actualmente en el parqueo.</td></tr>`;
      return;
    }

    tbody.innerHTML = activeSlots.map(slot => `
      <tr>
        <td>
          <div style="font-weight:800; font-family:'Outfit'; color:#0F172A; font-size:1rem;">${slot.plate || 'S/N'}</div>
        </td>
        <td>
          <div style="font-weight:600; color:var(--text-main);">${slot.driver || 'Conductor Garita'}</div>
        </td>
        <td>
          <span class="badge badge-success" style="font-size:0.82rem; font-weight:700;">${slot.code}</span>
        </td>
        <td style="font-size:0.85rem; font-weight:700; color:var(--text-main);">
          <i class="fa-regular fa-clock text-emerald"></i> ${slot.entryTime || '08:00 AM'}
        </td>
        <td>
          ${slot.status === 'mora' ? `
            <span class="badge badge-danger" style="font-size:0.75rem;"><i class="fa-solid fa-triangle-exclamation"></i> Tiempo Excedido</span>
          ` : `
            <span class="badge badge-success" style="font-size:0.75rem;"><i class="fa-solid fa-check"></i> En Tiempo Normal</span>
          `}
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="OperatorApp.openCheckOutModal('${slot.plate || slot.code}')">
            <i class="fa-solid fa-right-from-bracket"></i> Registrar Salida
          </button>
        </td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // 2. RESERVA AL INSTANTE (WALK-IN INSTANT BOOKING)
  // ==========================================================================
  populateInstantSlotOptions() {
    const selectSlot = document.getElementById('walkin-slot-select');
    if (!selectSlot) return;

    const availableSlots = this.state.slots.filter(s => s.status === 'disponible');
    selectSlot.innerHTML = availableSlots.map(s => `
      <option value="${s.code}">${s.code} - ${s.sector} ${s.isEV ? '(Carga EV)' : ''}</option>
    `).join('');
  },

  handleInstantBookingSubmit() {
    const plateInput = document.getElementById('walkin-plate');
    const driverInput = document.getElementById('walkin-driver');
    const phoneInput = document.getElementById('walkin-phone');
    const vehicleTypeInput = document.getElementById('walkin-vehicle-type');
    const slotSelect = document.getElementById('walkin-slot-select');
    const durationInput = document.getElementById('walkin-duration');

    const plate = (plateInput?.value || '').trim().toUpperCase();
    const driver = (driverInput?.value || 'Conductor Garita').trim();
    const phone = (phoneInput?.value || 'S/N').trim();
    const vehicleType = vehicleTypeInput?.value || 'Automóvil';
    const slotCode = slotSelect?.value || 'A-01';
    const durationHours = parseInt(durationInput?.value || '2', 10);

    if (!plate) {
      this.showToast('Campo Requerido', 'Por favor ingrese la placa del vehículo', 'warning');
      return;
    }

    const now = new Date();
    const checkInTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const endObj = new Date(now.getTime() + (durationHours * 3600000));
    const timeWindow = `${checkInTime} - ${endObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newCode = `WALK-${Math.floor(1000 + Math.random() * 9000)}`;
    const cost = (durationHours * 10).toFixed(2);

    // 1. Agregar a Reservas
    const newReservation = {
      code: newCode,
      plate: plate,
      driver: driver,
      phone: phone,
      vehicleType: vehicleType,
      slot: slotCode,
      timeWindow: timeWindow,
      status: 'en-sitio',
      checkInTime: checkInTime,
      checkOutTime: null,
      totalPaid: `Bs. ${cost}`
    };

    this.state.reservations.unshift(newReservation);

    // 2. Ocupar Plaza
    const slot = this.state.slots.find(s => s.code === slotCode);
    if (slot) {
      slot.status = 'ocupado';
      slot.plate = plate;
      slot.driver = driver;
      slot.entryTime = checkInTime;
    }

    // 3. Registrar Log
    this.state.shiftLogs.unshift({
      id: Date.now(),
      type: 'check-in',
      time: checkInTime,
      plate: plate,
      slot: slotCode,
      driver: driver,
      details: `Reserva Instante Garita #${newCode}`
    });

    // Resetear formulario
    plateInput.value = '';
    driverInput.value = '';
    phoneInput.value = '';

    this.showToast('Reserva Registrada', `Ingreso instantáneo procesado para vehículo ${plate} en la plaza ${slotCode}`, 'success');

    // Imprimir Ticket Digital
    this.printTicketForReservation(newCode);

    // Cambiar a la vista de entradas/salidas para ver el resultado
    this.switchView('control-entrada-salida');
  },

  // ==========================================================================
  // 3. MAPA / CROQUIS DE PLAZAS EN TIEMPO REAL
  // ==========================================================================
  renderCroquis(filter = 'all') {
    const gridContainer = document.getElementById('croquis-grid-container');
    if (!gridContainer) return;

    let filteredSlots = this.state.slots;
    if (filter === 'disponible') filteredSlots = this.state.slots.filter(s => s.status === 'disponible');
    else if (filter === 'ocupado') filteredSlots = this.state.slots.filter(s => s.status === 'ocupado' || s.status === 'mora');
    else if (filter === 'reservado') filteredSlots = this.state.slots.filter(s => s.status === 'reservado');
    else if (filter === 'ev') filteredSlots = this.state.slots.filter(s => s.isEV);

    gridContainer.innerHTML = filteredSlots.map(slot => {
      const statusClasses = {
        'disponible': 'slot-status-disponible',
        'ocupado': 'slot-status-ocupado',
        'reservado': 'slot-status-reservado',
        'mora': 'slot-status-mora'
      };

      const statusLabels = {
        'disponible': 'DISPONIBLE',
        'ocupado': 'OCUPADO',
        'reservado': 'RESERVADO',
        'mora': 'EN MORA / EXCEDIDO'
      };

      return `
        <div class="slot-card ${statusClasses[slot.status] || ''}" onclick="OperatorApp.handleSlotClick('${slot.code}')" style="cursor:pointer;">
          <div class="slot-header">
            <span class="slot-code">${slot.code}</span>
            <span class="badge ${this.getStatusBadgeClass(slot.status)}" style="font-size:0.65rem;">
              ${statusLabels[slot.status]}
            </span>
          </div>

          ${slot.status === 'disponible' ? `
            <div class="slot-empty" style="color:#006D36;">
              <i class="fa-solid fa-circle-check"></i> Libre para ingreso
            </div>
            <div class="slot-driver" style="color:#64748B;">${slot.isEV ? '⚡ Plaza EV' : 'Estándar'}</div>
          ` : `
            <div class="slot-plate">${slot.plate || 'RESERVA'}</div>
            <div class="slot-driver" title="${slot.driver}">${slot.driver || 'Conductor asignado'}</div>
            <div class="slot-time"><i class="fa-regular fa-clock"></i> ${slot.entryTime || 'Pendiente'}</div>
          `}

          ${slot.status === 'mora' ? `
            <div class="slot-mora-tag"><i class="fa-solid fa-triangle-exclamation"></i> Tiempo excedido</div>
          ` : ''}
        </div>
      `;
    }).join('');
  },

  handleSlotClick(slotCode) {
    const slot = this.state.slots.find(s => s.code === slotCode);
    if (!slot) return;

    if (slot.status === 'disponible') {
      // Abrir modal de reserva al instante precargando esa plaza
      this.switchView('reserva-instante');
      const selectSlot = document.getElementById('walkin-slot-select');
      if (selectSlot) selectSlot.value = slot.code;
    } else if (slot.status === 'ocupado' || slot.status === 'mora') {
      // Abrir checkout
      this.openCheckOutModal(slot.plate || slot.code);
    } else if (slot.status === 'reservado') {
      // Buscar la reserva asignada a esta plaza
      const res = this.state.reservations.find(r => r.slot === slot.code && r.status === 'pendiente');
      if (res) {
        this.switchView('control-entrada-salida');
        this.searchVehicleOrTicket(res.code);
      } else {
        this.showToast('Plaza Reservada', `La plaza ${slotCode} está apartada para una reserva web del día.`, 'info');
      }
    }
  },

  // ==========================================================================
  // 4. RESERVAS DEL DÍA (GESTIÓN DE RESERVAS)
  // ==========================================================================
  renderReservationsTable(filter = 'all', searchQuery = '') {
    const tbody = document.getElementById('reservations-tbody');
    if (!tbody) return;

    let list = this.state.reservations;

    if (filter === 'pendiente') list = list.filter(r => r.status === 'pendiente');
    else if (filter === 'en-sitio') list = list.filter(r => r.status === 'en-sitio');
    else if (filter === 'finalizada') list = list.filter(r => r.status === 'finalizada');
    else if (filter === 'atrasado') list = list.filter(r => r.status === 'atrasado');

    if (searchQuery) {
      const q = searchQuery.toUpperCase();
      list = list.filter(r => 
        r.plate.toUpperCase().includes(q) ||
        r.code.toUpperCase().includes(q) ||
        r.driver.toUpperCase().includes(q) ||
        r.slot.toUpperCase().includes(q)
      );
    }

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:2rem; color:#94A3B8;">
            No se encontraron reservas con los criterios seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td style="font-weight:700; font-family:'Outfit'; color:#063D25;">${r.code}</td>
        <td>
          <div style="font-weight:800; font-family:'Outfit'; color:#0F172A; font-size:0.95rem;">${r.plate}</div>
          <div style="font-size:0.75rem; color:#64748B;">${r.vehicleType}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#1E293B;">${r.driver}</div>
          <div style="font-size:0.75rem; color:#64748B;"><i class="fa-solid fa-phone"></i> ${r.phone}</div>
        </td>
        <td>
          <span class="badge badge-success" style="font-size:0.85rem; font-weight:700;">${r.slot}</span>
        </td>
        <td style="font-size:0.85rem; color:#334155;">
          ${r.timeWindow}
        </td>
        <td>
          <span class="badge ${this.getStatusBadgeClass(r.status)}">
            ${this.getStatusLabel(r.status)}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            ${r.status === 'pendiente' ? `
              <button class="btn btn-sm btn-primary" onclick="OperatorApp.processCheckIn('${r.code}')" title="Registrar Ingreso">
                <i class="fa-solid fa-right-to-bracket"></i> Entrada
              </button>
            ` : ''}

            ${(r.status === 'en-sitio' || r.status === 'atrasado') ? `
              <button class="btn btn-sm btn-danger" onclick="OperatorApp.openCheckOutModal('${r.plate}')" title="Registrar Salida">
                <i class="fa-solid fa-right-from-bracket"></i> Salida
              </button>
            ` : ''}

            <button class="btn btn-sm btn-secondary" onclick="OperatorApp.printTicketForReservation('${r.code}')" title="Imprimir Ticket">
              <i class="fa-solid fa-print"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // ==========================================================================
  // ESCÁNER Y IMPRESIÓN DE TICKETS (MODALES Y UTILIDADES)
  // ==========================================================================
  openScannerModal() {
    this.openModal('modalScanner');
  },

  simulateScannerCode(code) {
    this.closeModal('modalScanner');
    this.switchView('control-entrada-salida');
    const input = document.getElementById('express-plate-input');
    if (input) input.value = code;
    this.searchVehicleOrTicket(code);
  },

  printTicketForReservation(resCode) {
    const res = this.state.reservations.find(r => r.code === resCode);
    if (!res) return;

    const ticketBody = document.getElementById('ticket-modal-body');
    if (ticketBody) {
      ticketBody.innerHTML = `
        <div style="text-align:center; margin-bottom:1rem; border-bottom:1px dashed #000; padding-bottom:0.75rem;">
          <h3 style="margin:0; font-family:'Outfit', sans-serif; font-size:1.2rem; font-weight:800;">PARKINGO ENTERPRISE</h3>
          <p style="margin:0.2rem 0 0 0; font-size:0.75rem;">SUCURSAL EQUIPETROL CENTRAL</p>
          <p style="margin:0; font-size:0.7rem; color:#555;">TICKET DE GARITA - CONTROL DE ACCESO</p>
        </div>

        <div style="margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>TICKET #:</span> <strong>${res.code}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>PLACA:</span> <strong style="font-size:1.1rem;">${res.plate}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>PLAZA ASIGNADA:</span> <strong style="font-size:1.1rem; color:#006D36;">${res.slot}</strong>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>CONDUCTOR:</span> <span>${res.driver}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>HORA INGRESO:</span> <span>${res.checkInTime || '08:00 AM'}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>HORARIO RESERVADO:</span> <span>${res.timeWindow}</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span>MONTO PAGADO:</span> <strong>${res.totalPaid}</strong>
          </div>
        </div>

        <div style="text-align:center; border-top:1px dashed #000; pt-2; margin-top:1rem;">
          <div style="font-family:monospace; letter-spacing:4px; font-size:1.4rem; font-weight:bold; margin:0.5rem 0;">||| | |||| ||| |||| |</div>
          <p style="font-size:0.7rem; margin:0;">CONSERVE ESTE TICKET PARA PRESENTAR A LA SALIDA</p>
          <p style="font-size:0.65rem; color:#666; margin-top:0.2rem;">Atendido por: ${this.state.currentOperator.name}</p>
        </div>
      `;
    }

    this.openModal('modalPrintTicket');
  },

  // Helpers Modal & Toast
  openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  },

  showToast(title, message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:10px;';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const colors = {
      success: '#006D36',
      warning: '#D97706',
      danger: '#DC2626',
      info: '#2563EB'
    };

    toast.style.cssText = `
      background: #FFFFFF;
      border-left: 5px solid ${colors[type] || colors.info};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-radius: 6px;
      padding: 12px 16px;
      min-width: 280px;
      max-width: 360px;
      animation: slideInRight 0.3s ease-out;
    `;

    toast.innerHTML = `
      <div style="font-weight:700; font-size:0.9rem; color:#0F172A; margin-bottom:2px;">${title}</div>
      <div style="font-size:0.8rem; color:#475569;">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  getStatusBadgeClass(status) {
    switch (status) {
      case 'disponible': return 'badge-success';
      case 'en-sitio':
      case 'ocupado': return 'badge-neutral';
      case 'pendiente':
      case 'reservado': return 'badge-info';
      case 'atrasado':
      case 'mora': return 'badge-danger';
      case 'finalizada': return 'badge-secondary';
      default: return 'badge-neutral';
    }
  },

  getStatusLabel(status) {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'en-sitio': return 'En Sitio';
      case 'ocupado': return 'Ocupado';
      case 'pendiente': return 'Pendiente Ingreso';
      case 'reservado': return 'Reservado';
      case 'atrasado': return 'Retrasado (+Mora)';
      case 'mora': return 'En Mora';
      case 'finalizada': return 'Finalizada';
      default: return status;
    }
  },

  // ==========================================================================
  // 5. REPORTE Y CIERRE DE TURNO DEL OPERADOR
  // ==========================================================================
  renderOperatorReportView() {
    const atendidas = this.state.reservations.length;
    const walkins = this.state.reservations.filter(r => r.code.startsWith('WALK')).length;
    const multas = this.state.reservations.filter(r => r.status === 'atrasado').length;
    const canceladas = 1;
    const totalRecaudado = 520.00;

    const elAtendidas = document.getElementById('op-kpi-atendidas');
    const elWalkins = document.getElementById('op-kpi-walkins');
    const elMultas = document.getElementById('op-kpi-multas');
    const elCanceladas = document.getElementById('op-kpi-canceladas');
    const elTotal = document.getElementById('op-kpi-total-recaudado');

    if (elAtendidas) elAtendidas.textContent = atendidas;
    if (elWalkins) elWalkins.textContent = walkins;
    if (elMultas) elMultas.textContent = multas;
    if (elCanceladas) elCanceladas.textContent = canceladas;
    if (elTotal) elTotal.textContent = `Bs. ${totalRecaudado.toFixed(2)}`;

    // Render transactions table
    const tbody = document.getElementById('table-operator-shift-transactions');
    if (!tbody) return;

    const sampleTransactions = [
      { code: 'WALK-8812', time: '09:15 AM', plate: '7849-XYZ', driver: 'María Rodríguez', slot: 'A-07', mode: 'Walk-In 2h', extra: 'Bs. 0.00', total: 'Bs. 20.00', method: 'Efectivo' },
      { code: 'RES-9041', time: '08:05 AM', plate: 'ABC-1234', driver: 'Juan Pérez', slot: 'A-03', mode: 'Reserva Web 4h', extra: 'Bs. 0.00', total: 'Bs. 40.00', method: 'QR Simbol' },
      { code: 'WALK-7741', time: '07:30 AM', plate: '8821-EXP', driver: 'Marcos Escalante', slot: 'A-14', mode: 'Walk-In + Mora 30m', extra: 'Bs. 15.00', total: 'Bs. 35.00', method: 'Efectivo' },
      { code: 'RES-9038', time: '07:02 AM', plate: '2219-MNO', driver: 'Fernando Alarcón', slot: 'A-02', mode: 'Reserva Web 2h', extra: 'Bs. 0.00', total: 'Bs. 20.00', method: 'Tarjeta' },
      { code: 'WALK-5510', time: '07:10 AM', plate: '3421-KLP', driver: 'Roberto Gómez', slot: 'B-02', mode: 'Walk-In Pase Día', extra: 'Bs. 0.00', total: 'Bs. 70.00', method: 'Efectivo' }
    ];

    tbody.innerHTML = sampleTransactions.map(tx => `
      <tr>
        <td style="font-weight:700; font-family:'Outfit'; color:#063D25;">${tx.code}</td>
        <td style="font-size:0.8rem;">${tx.time}</td>
        <td style="font-weight:800; font-family:'Outfit'; color:#0F172A;">${tx.plate}</td>
        <td>${tx.driver}</td>
        <td><span class="badge badge-success" style="font-size:0.75rem;">${tx.slot}</span></td>
        <td style="font-size:0.78rem; color:var(--text-muted);">${tx.mode}</td>
        <td style="font-weight:700; color:${tx.extra !== 'Bs. 0.00' ? '#DC2626' : 'var(--text-muted)'};">${tx.extra}</td>
        <td style="font-weight:800; color:#006D36; font-size:0.95rem;">${tx.total}</td>
        <td>
          <span class="badge badge-neutral" style="font-size:0.7rem;">${tx.method}</span>
        </td>
      </tr>
    `).join('');
  },

  generateShiftClosingReport() {
    const closingBody = document.getElementById('closing-modal-body');
    if (!closingBody) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    closingBody.innerHTML = `
      <div style="text-align:center; margin-bottom:1rem; border-bottom:1px dashed #000; padding-bottom:0.75rem;">
        <h3 style="margin:0; font-family:'Outfit', sans-serif; font-size:1.2rem; font-weight:800;">PARKINGO ENTERPRISE</h3>
        <p style="margin:0.2rem 0 0 0; font-size:0.75rem;">COMPROBANTE DE ARQUEO Y CIERRE DE GARITA</p>
        <p style="margin:0; font-size:0.7rem; color:#555;">SUCURSAL EQUIPETROL CENTRAL</p>
      </div>

      <div style="margin-bottom:0.75rem; font-size:0.8rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>FECHA / HORA:</span> <strong>${dateStr} - ${timeStr}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>OPERADOR:</span> <strong>${this.state.currentOperator.name}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>TURNO:</span> <span>${this.state.currentOperator.shift}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>GARITA:</span> <span>${this.state.currentOperator.garita}</span>
        </div>
      </div>

      <div style="border-top:1px dashed #000; border-bottom:1px dashed #000; padding:0.6rem 0; margin:0.75rem 0; font-size:0.82rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>Reservas Atendidas:</span> <strong>18</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>Registros Walk-In:</span> <strong>7</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>Cobros con Multa/Mora:</span> <strong style="color:#DC2626;">2</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
          <span>Reservas Canceladas:</span> <strong>1</strong>
        </div>
      </div>

      <div style="margin-bottom:0.75rem; font-size:0.85rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>(+) EFECTIVO EN CAJA:</span> <strong>Bs. 320.00</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>(+) COBROS QR SIMBOL:</span> <strong>Bs. 140.00</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
          <span>(+) TARJETA DÉBITO/CRÉDITO:</span> <strong>Bs. 60.00</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:0.5rem; pt-2; border-top:1px solid #000; font-size:1.05rem; font-weight:bold;">
          <span>TOTAL RECAUDADO:</span> <span style="color:#006D36;">Bs. 520.00</span>
        </div>
      </div>

      <div style="text-align:center; border-top:1px dashed #000; pt-3; margin-top:1.2rem;">
        <div style="margin-top:2rem; border-top:1px solid #333; width:70%; margin-left:auto; margin-right:auto; padding-top:0.2rem; font-size:0.72rem;">
          Firma Operador de Garita
        </div>
        <p style="font-size:0.65rem; color:#666; margin-top:0.5rem;">ARQUEO DE GARITA GENERADO CORRECTAMENTE</p>
      </div>
    `;

    this.openModal('modalShiftClosing');
  }
};
