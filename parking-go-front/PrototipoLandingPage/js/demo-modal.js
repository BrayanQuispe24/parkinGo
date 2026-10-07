/* ==========================================
   ParkinGo - Interactive Demo & Booking Modal
   Simulated Digital Ticket Generation & Registration Forms
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initDemoModal();
});

function initDemoModal() {
    const backdrop = document.getElementById('demo-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    if (!backdrop || !closeBtn) return;

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
    });

    // Header & Hero Triggers
    const heroBtn = document.getElementById('btn-demo-modal');
    const ctaBtn = document.getElementById('btn-cta-demo');
    const registerBtn = document.getElementById('btn-register-host');
    const contactBtn = document.getElementById('btn-cta-contact');

    if (heroBtn) heroBtn.addEventListener('click', () => openBookingModal("Garaje Equipetrol Norte", "Bs. 6 / hr"));
    if (ctaBtn) ctaBtn.addEventListener('click', () => openBookingModal("Parqueo Centro Plaza", "Bs. 10 / día"));
    if (registerBtn) registerBtn.addEventListener('click', openRegistrationModal);
    if (contactBtn) contactBtn.addEventListener('click', openB2BModal);

    // Hero inline booking triggers
    document.querySelectorAll('.btn-trigger-booking').forEach(btn => {
        btn.addEventListener('click', () => {
            const spotName = btn.getAttribute('data-spot') || "Garaje Equipetrol";
            openBookingModal(spotName, "Bs. 6 / hr");
        });
    });

    // Role tabs triggers
    document.querySelectorAll('.btn-open-demo-role').forEach(btn => {
        btn.addEventListener('click', () => {
            const roleType = btn.getAttribute('data-demo-type');
            if (roleType === 'anfitrion') {
                openRegistrationModal();
            } else if (roleType === 'comercial') {
                openB2BModal();
            } else {
                openBookingModal("Parqueo Centro Plaza", "Bs. 6 / hr");
            }
        });
    });

    // Pricing plan selectors
    document.querySelectorAll('.btn-select-plan').forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan');
            openRegistrationModal(planName);
        });
    });
}

function closeModal() {
    const backdrop = document.getElementById('demo-modal');
    if (backdrop) backdrop.classList.remove('active');
}

// Open Booking Simulation Modal
window.openBookingModal = function(spotName = "Parqueo Equipetrol", spotPrice = "Bs. 6 / hr") {
    const backdrop = document.getElementById('demo-modal');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const body = document.getElementById('modal-body');

    if (!backdrop || !body) return;

    title.textContent = `Reserva Digital • ${spotName}`;
    subtitle.textContent = "Simula el proceso instantáneo de reserva de parqueo en Santa Cruz de la Sierra.";

    body.innerHTML = `
        <form id="booking-sim-form">
            <div class="form-group">
                <label><i class="fa-solid fa-warehouse"></i> Espacio Seleccionado:</label>
                <input type="text" class="form-control" value="${spotName} (${spotPrice})" readonly style="background: rgba(16,185,129,0.1); color: var(--primary-light); font-weight:700;">
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label><i class="fa-solid fa-car"></i> Placa del Vehículo:</label>
                    <input type="text" id="sim-plate" class="form-control" placeholder="Ej: 4821-KLX" value="3912-BZX" required style="text-transform: uppercase;">
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-clock"></i> Tiempo Estimado:</label>
                    <select id="sim-duration" class="form-control">
                        <option value="1">1 Hora (Bs. 6)</option>
                        <option value="2" selected>2 Horas (Bs. 12)</option>
                        <option value="4">4 Horas (Bs. 24)</option>
                        <option value="12">Jornada Día Completo (Bs. 35)</option>
                    </select>
                </div>
            </div>

            <div style="background: rgba(255,255,255,0.04); padding: 1rem; border-radius: 8px; margin: 1rem 0; font-size: 0.88rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color: var(--text-muted);">
                    <span>Tarifa del Parqueo:</span>
                    <strong id="sim-cost-base" style="color:#fff;">Bs. 12.00</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom: 6px; color: var(--text-muted);">
                    <span>Tarifa de Servicio Digital ParkinGo:</span>
                    <strong style="color: var(--accent-gold);">Bs. 2.00</strong>
                </div>
                <div style="display:flex; justify-content:space-between; border-top: 1px solid var(--border-color); padding-top: 6px; font-weight:700; font-size:1rem; color: var(--primary-light);">
                    <span>Total a Confirmar:</span>
                    <strong id="sim-cost-total">Bs. 14.00</strong>
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
                <i class="fa-solid fa-check-circle"></i> Confirmar y Generar Token QR
            </button>
        </form>
    `;

    // Dynamic cost calculation on duration change
    const durationSelect = document.getElementById('sim-duration');
    if (durationSelect) {
        durationSelect.addEventListener('change', () => {
            const hours = parseInt(durationSelect.value);
            let baseCost = hours * 6;
            if (hours === 12) baseCost = 35;
            
            document.getElementById('sim-cost-base').textContent = `Bs. ${baseCost}.00`;
            document.getElementById('sim-cost-total').textContent = `Bs. ${baseCost + 2}.00`;
        });
    }

    // Submit Simulation
    const form = document.getElementById('booking-sim-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const plate = document.getElementById('sim-plate').value.toUpperCase();
        renderBookingConfirmation(spotName, plate);
    });

    backdrop.classList.add('active');
};

function renderBookingConfirmation(spotName, plate) {
    const body = document.getElementById('modal-body');
    const randomCode = `PG-${Math.floor(1000 + Math.random() * 9000)}`;

    body.innerHTML = `
        <div class="text-center" style="padding: 1rem 0;">
            <div style="width: 70px; height: 70px; background: rgba(16,185,129,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: var(--primary-light); margin: 0 auto 1rem;">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            
            <h4 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.4rem;">¡Reserva Confirmada!</h4>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                Tu cupo en <strong>${spotName}</strong> está asegurado para el vehículo <strong>${plate}</strong>.
            </p>

            <div style="background: #ffffff; color: #000; padding: 1.5rem; border-radius: 14px; max-width: 280px; margin: 0 auto 1.5rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                <i class="fa-solid fa-qrcode" style="font-size: 6rem; display: block; margin-bottom: 0.5rem; color: #000;"></i>
                <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.2rem; letter-spacing: 2px;">
                    ${randomCode}
                </div>
                <div style="font-size: 0.75rem; color: #666; margin-top: 0.3rem;">Muestra este código al ingresar o escanear</div>
            </div>

            <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); padding: 0.8rem; border-radius: 8px; font-size: 0.85rem; color: var(--primary-light); margin-bottom: 1.5rem;">
                <i class="fa-solid fa-bell"></i> Recibirás una alerta en tu celular 15 minutos antes del vencimiento.
            </div>

            <button class="btn btn-primary btn-block" onclick="closeModal()">
                <i class="fa-solid fa-check"></i> Entendido, Volver al Inicio
            </button>
        </div>
    `;
}

// Registration Form Modal for Hosts
window.openRegistrationModal = function(planName = "Plan Comisión 20%") {
    const backdrop = document.getElementById('demo-modal');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const body = document.getElementById('modal-body');

    if (!backdrop || !body) return;

    title.textContent = "Registrar Espacio de Parqueo";
    subtitle.textContent = `Regístrate en ParkinGo bajo el ${planName} y empieza a recibir conductores en Santa Cruz.`;

    body.innerHTML = `
        <form id="host-reg-form">
            <div class="form-group">
                <label><i class="fa-solid fa-signature"></i> Nombre del Parqueo / Garaje:</label>
                <input type="text" class="form-control" placeholder="Ej: Garaje Privado Calle 21 de Septiembre" required>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label><i class="fa-solid fa-tag"></i> Tipo de Espacio:</label>
                    <select class="form-control">
                        <option value="host">Garaje / Patio Particular (C2C)</option>
                        <option value="commercial">Parqueo Comercial (B2B)</option>
                        <option value="terreno">Terreno para Eventos</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-car-tunnel"></i> Cantidad de Plazas:</label>
                    <input type="number" class="form-control" value="2" min="1" max="100" required>
                </div>
            </div>

            <div class="form-group">
                <label><i class="fa-solid fa-location-dot"></i> Dirección en Santa Cruz de la Sierra:</label>
                <input type="text" class="form-control" placeholder="Ej: Av. San Martín #420 (Equipetrol / Zona Estadio)" required>
            </div>

            <div class="grid grid-2">
                <div class="form-group">
                    <label><i class="fa-solid fa-phone"></i> Teléfono WhatsApp:</label>
                    <input type="tel" class="form-control" placeholder="+591 700-00000" required>
                </div>
                <div class="form-group">
                    <label><i class="fa-solid fa-money-bill-1"></i> Tarifa Estimada (Bs/hr):</label>
                    <input type="number" class="form-control" value="6" min="1" max="50">
                </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;">
                <i class="fa-solid fa-paper-plane"></i> Enviar Solicitud de Verificación
            </button>
        </form>
    `;

    const form = document.getElementById('host-reg-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        body.innerHTML = `
            <div class="text-center" style="padding: 2rem 0;">
                <div style="width: 70px; height: 70px; background: rgba(16,185,129,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: var(--primary-light); margin: 0 auto 1rem;">
                    <i class="fa-solid fa-paper-plane"></i>
                </div>
                <h4 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.4rem;">¡Solicitud Recibida!</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    El Administrador General de ParkinGo revisará tu ubicación y coordenadas para activar tu espacio en el mapa interactivo.
                </p>
                <button class="btn btn-primary btn-block" onclick="closeModal()">Cerrar</button>
            </div>
        `;
    });

    backdrop.classList.add('active');
};

// B2B Enterprise Contact Modal
window.openB2BModal = function() {
    const backdrop = document.getElementById('demo-modal');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const body = document.getElementById('modal-body');

    if (!backdrop || !body) return;

    title.textContent = "Planes B2B Parqueos Comerciales";
    subtitle.textContent = "Contacta con nuestro equipo comercial para integrar tu empresa de estacionamientos a ParkinGo.";

    body.innerHTML = `
        <form id="b2b-form">
            <div class="form-group">
                <label>Nombre de la Empresa o Parqueo Comercial:</label>
                <input type="text" class="form-control" placeholder="Ej: Central Parking Santa Cruz S.R.L." required>
            </div>
            <div class="form-group">
                <label>Nombre de Contacto:</label>
                <input type="text" class="form-control" placeholder="Ej: Lic. Roberto Aguilera" required>
            </div>
            <div class="grid grid-2">
                <div class="form-group">
                    <label>Correo Electrónico:</label>
                    <input type="email" class="form-control" placeholder="contacto@empresa.bo" required>
                </div>
                <div class="form-group">
                    <label>Número de WhatsApp:</label>
                    <input type="tel" class="form-control" placeholder="+591 710-00000" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top: 1rem;">
                <i class="fa-solid fa-handshake"></i> Solicitar Demostración Corporativa
            </button>
        </form>
    `;

    const form = document.getElementById('b2b-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        body.innerHTML = `
            <div class="text-center" style="padding: 2rem 0;">
                <div style="width: 70px; height: 70px; background: rgba(6,182,212,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; color: var(--secondary); margin: 0 auto 1rem;">
                    <i class="fa-solid fa-building-circle-check"></i>
                </div>
                <h4 style="font-size: 1.4rem; color: #fff; margin-bottom: 0.4rem;">¡Gracias por tu interés!</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">
                    Un asesor B2B de ParkinGo se pondrá en contacto contigo a la brevedad para configurar tu plan mensual (Bs. 200 - Bs. 500).
                </p>
                <button class="btn btn-primary btn-block" onclick="closeModal()">Cerrar</button>
            </div>
        `;
    });

    backdrop.classList.add('active');
};
