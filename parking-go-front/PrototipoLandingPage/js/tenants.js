/* ==========================================================================
   PARKINGO - TENANTS MANAGEMENT LOGIC (MULTI-TENANT SAAS)
   Dynamic Filtering, CRUD Simulation, Audit Log & 8-Tab Detail View
   ========================================================================== */

// Initial Mock Dataset for Tenants
let mockTenants = [
    {
        id: "TNT-101",
        name: "Parking Center SRL",
        adminName: "Carlos Méndez",
        adminEmail: "carlos.mendez@parkingcenter.bo",
        adminPhone: "+591 773-48291",
        type: "Empresa",
        nit: "10293847019",
        parqueosCount: 4,
        operadoresCount: 8,
        plan: "Profesional",
        status: "Activo",
        regDate: "2025-02-10",
        comision: 8.5,
        parqueos: [
            { name: "Parqueo Centro Histórico", address: "Av. Juárez 42, Centro, Santa Cruz", capacity: 150, occupied: 128, available: 22, status: "OPERATIVO" },
            { name: "Plaza San Pedro Garage", address: "Calzada del Valle 401, Equipetrol", capacity: 220, occupied: 125, available: 95, status: "OPERATIVO" },
            { name: "AutoPark Guadalajara Expo", address: "Av. Mariano Otero 1499, Zona Norte", capacity: 300, occupied: 292, available: 8, status: "LLENO" },
            { name: "Estación Querétaro Antea", address: "Paseo de la República 111, Urubó", capacity: 180, occupied: 180, available: 0, status: "MANTENIMIENTO" },
            { name: "VIP Aeropuerto Terminal 1", address: "Av. Capitán Carlos León s/n", capacity: 400, occupied: 290, available: 110, status: "OPERATIVO" }
        ],
        usuarios: [
            { name: "Carlos Méndez", email: "carlos.mendez@parkingcenter.bo", role: "Administrador de Parqueo", parking: "Todos los parqueos", status: "Activo" },
            { name: "Jorge Claros", email: "jclaro@parkingcenter.bo", role: "Operador", parking: "Equipetrol", status: "Activo" },
            { name: "Lucía Vaca", email: "lvaca@parkingcenter.bo", role: "Operador", parking: "Centro", status: "Activo" }
        ],
        bitacora: [
            { user: "Sistema ParkinGo", action: "Tenant creado", date: "2025-02-10", time: "09:30 AM", desc: "Registro inicial de organización comercial Parking Center SRL." },
            { user: "Carlos Méndez", action: "Administrador asociado", date: "2025-02-10", time: "09:35 AM", desc: "Asignado como responsable legal principal." },
            { user: "Admin General", action: "Plan actualizado", date: "2025-03-01", time: "14:15 PM", desc: "Upgrade a Plan Profesional con tasa preferencial del 8.5%." }
        ]
    },
    {
        id: "TNT-102",
        name: "Garaje Rodríguez",
        adminName: "Juan Rodríguez",
        adminEmail: "juan.rodriguez@gmail.com",
        adminPhone: "+591 710-92834",
        type: "Particular",
        nit: "4839201014",
        parqueosCount: 1,
        operadoresCount: 0,
        plan: "Gratuito",
        status: "Activo",
        regDate: "2025-03-14",
        comision: 10.0,
        parqueos: [
            { name: "Garaje Rodríguez Particular", address: "Calle Arenales #312", capacity: 15, available: 5, status: "Activo", verification: "Verificado" }
        ],
        usuarios: [
            { name: "Juan Rodríguez", email: "juan.rodriguez@gmail.com", role: "Administrador de Parqueo", parking: "Garaje Arenales", status: "Activo" }
        ],
        bitacora: [
            { user: "Juan Rodríguez", action: "Tenant creado", date: "2025-03-14", time: "11:20 AM", desc: "Registro como propietario particular independiente." }
        ]
    },
    {
        id: "TNT-103",
        name: "Smart Parking Bolivia",
        adminName: "María Suárez",
        adminEmail: "msuarez@smartparking.bo",
        adminPhone: "+591 784-11920",
        type: "Empresa",
        nit: "3948201029",
        parqueosCount: 7,
        operadoresCount: 15,
        plan: "Empresarial",
        status: "Suspendido",
        regDate: "2024-11-05",
        comision: 7.0,
        parqueos: [
            { name: "Smart Parking Plaza 24 de Septiembre", address: "Calle Ayacucho #50", capacity: 110, available: 0, status: "Inactivo", verification: "Verificado" }
        ],
        usuarios: [
            { name: "María Suárez", email: "msuarez@smartparking.bo", role: "Administrador de Parqueo", parking: "Todos", status: "Suspendido" }
        ],
        bitacora: [
            { user: "Admin General", action: "Tenant suspendido", date: "2025-08-20", time: "16:45 PM", desc: "Suspensión administrativa por mora recurrente en facturación." }
        ]
    },
    {
        id: "TNT-104",
        name: "Estacionamientos Urubó SRL",
        adminName: "Fernando Prado",
        adminEmail: "fprado@uruboparking.com",
        adminPhone: "+591 760-44910",
        type: "Empresa",
        nit: "8492019382",
        parqueosCount: 3,
        operadoresCount: 5,
        plan: "Básico",
        status: "Activo",
        regDate: "2025-01-22",
        comision: 9.0,
        parqueos: [
            { name: "Estacionamiento Urubó Village", address: "Av. Los Cusis #200", capacity: 45, available: 12, status: "Activo", verification: "Verificado" }
        ],
        usuarios: [
            { name: "Fernando Prado", email: "fprado@uruboparking.com", role: "Administrador de Parqueo", parking: "Urubó Village", status: "Activo" }
        ],
        bitacora: [
            { user: "Fernando Prado", action: "Tenant creado", date: "2025-01-22", time: "10:00 AM", desc: "Alta en plataforma ParkinGo." }
        ]
    },
    {
        id: "TNT-105",
        name: "Parqueo Equipetrol Norte",
        adminName: "Patricia Aguilera",
        adminEmail: "paguilera@hotmail.com",
        adminPhone: "+591 721-88492",
        type: "Particular",
        nit: "5839201",
        parqueosCount: 2,
        operadoresCount: 2,
        plan: "Básico",
        status: "Pendiente",
        regDate: "2025-09-01",
        comision: 9.5,
        parqueos: [
            { name: "Parqueo Equipetrol 3er Anillo", address: "Calle 7 Oeste #14", capacity: 30, available: 10, status: "Pendiente", verification: "Pendiente" }
        ],
        usuarios: [
            { name: "Patricia Aguilera", email: "paguilera@hotmail.com", role: "Administrador de Parqueo", parking: "Equipetrol Norte", status: "Pendiente" }
        ],
        bitacora: [
            { user: "Patricia Aguilera", action: "Solicitud de Tenant enviada", date: "2025-09-01", time: "15:10 PM", desc: "Pendiente de aprobación de documentos por Admin General." }
        ]
    }
];

let selectedTenantIdForSuspend = null;
let currentDetailTenant = null;

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    initTenantEvents();
    renderKPIs();
    renderTenantsTable();
});

function initTenantEvents() {
    // Search & Filter listeners
    const searchInput = document.getElementById('tenant-search-input');
    const filterStatus = document.getElementById('filter-status');
    const filterType = document.getElementById('filter-type');
    const filterPlan = document.getElementById('filter-plan');
    const btnReset = document.getElementById('btn-reset-filters');

    if (searchInput) searchInput.addEventListener('input', renderTenantsTable);
    if (filterStatus) filterStatus.addEventListener('change', renderTenantsTable);
    if (filterType) filterType.addEventListener('change', renderTenantsTable);
    if (filterPlan) filterPlan.addEventListener('change', renderTenantsTable);
    if (btnReset) btnReset.addEventListener('click', resetFilters);

    // Modal listeners
    const btnOpenNew = document.getElementById('btn-open-new-tenant');
    const btnCloseNew = document.getElementById('btn-close-new-modal');
    const btnCancelNew = document.getElementById('btn-cancel-new-tenant');
    const formNew = document.getElementById('form-new-tenant');

    if (btnOpenNew) btnOpenNew.addEventListener('click', openNewTenantModal);
    if (btnCloseNew) btnCloseNew.addEventListener('click', closeNewTenantModal);
    if (btnCancelNew) btnCancelNew.addEventListener('click', closeNewTenantModal);
    if (formNew) formNew.addEventListener('submit', handleSaveNewTenant);

    // Close popovers when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.actions-dropdown-wrap')) {
            document.querySelectorAll('.dropdown-popover').forEach(el => el.classList.remove('show'));
        }
    });
}

function renderKPIs() {
    const total = mockTenants.length;
    const active = mockTenants.filter(t => t.status === 'Activo').length;
    const suspended = mockTenants.filter(t => t.status === 'Suspendido').length;
    const totalParqueos = mockTenants.reduce((acc, t) => acc + t.parqueosCount, 0);

    const elTotal = document.getElementById('kpi-total-tenants');
    const elActive = document.getElementById('kpi-active-tenants');
    const elSuspended = document.getElementById('kpi-suspended-tenants');
    const elParqueos = document.getElementById('kpi-total-parqueos');

    if (elTotal) elTotal.textContent = total;
    if (elActive) elActive.textContent = active;
    if (elSuspended) elSuspended.textContent = suspended;
    if (elParqueos) elParqueos.textContent = totalParqueos;
}

function renderTenantsTable() {
    const searchInput = document.getElementById('tenant-search-input');
    const filterStatus = document.getElementById('filter-status');
    const filterType = document.getElementById('filter-type');
    const filterPlan = document.getElementById('filter-plan');

    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const statusVal = filterStatus ? filterStatus.value : 'all';
    const typeVal = filterType ? filterType.value : 'all';
    const planVal = filterPlan ? filterPlan.value : 'all';

    const tbody = document.getElementById('tenants-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const filtered = mockTenants.filter(t => {
        const matchesQuery = t.name.toLowerCase().includes(query) ||
                             t.adminName.toLowerCase().includes(query) ||
                             t.adminEmail.toLowerCase().includes(query) ||
                             t.id.toLowerCase().includes(query);
        const matchesStatus = statusVal === 'all' || t.status.toLowerCase() === statusVal.toLowerCase();
        const matchesType = typeVal === 'all' || t.type.toLowerCase() === typeVal.toLowerCase();
        const matchesPlan = planVal === 'all' || t.plan.toLowerCase() === planVal.toLowerCase();

        return matchesQuery && matchesStatus && matchesType && matchesPlan;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted, #66736B);">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-dim, #94A09A);"></i>
                    <p style="margin: 0; font-weight: 600;">No se encontraron tenants con los filtros seleccionados.</p>
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(t => {
        const initial = t.name.charAt(0).toUpperCase();
        const statusClass = t.status.toLowerCase();
        const planClass = t.plan.toLowerCase();

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong style="color: var(--accent-emerald, #006D36);">${t.id}</strong></td>
            <td>
                <div class="tenant-brand-cell">
                    <div class="tenant-avatar-circle">${initial}</div>
                    <div class="tenant-name-wrap">
                        <h4>${t.name}</h4>
                        <span>NIT/Doc: ${t.nit}</span>
                    </div>
                </div>
            </td>
            <td>
                <strong>${t.adminName}</strong><br>
                <span style="font-size: 0.78rem; color: var(--text-muted, #66736B);">${t.adminEmail}</span>
            </td>
            <td>${t.type}</td>
            <td><strong style="font-size: 0.95rem;">${t.parqueosCount}</strong></td>
            <td>${t.operadoresCount}</td>
            <td><span class="badge-plan ${planClass}">${t.plan}</span></td>
            <td><span class="badge-status ${statusClass}">${t.status}</span></td>
            <td>${t.regDate}</td>
            <td>
                <div class="actions-dropdown-wrap">
                    <button type="button" class="btn-icon-action" onclick="toggleDropdown(event, '${t.id}')" title="Acciones">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div class="dropdown-popover" id="dropdown-${t.id}">
                        <div class="dropdown-item" onclick="openDetailView('${t.id}')">
                            <i class="fa-solid fa-eye"></i> Ver detalle
                        </div>
                        <div class="dropdown-item" onclick="editTenantPrompt('${t.id}')">
                            <i class="fa-solid fa-pen-to-square"></i> Editar
                        </div>
                        <div class="dropdown-item" onclick="openAssociateAdminPrompt('${t.id}')">
                            <i class="fa-solid fa-user-plus"></i> Asociar administrador
                        </div>
                        <div class="dropdown-item" onclick="openDetailViewTab('${t.id}', 'parqueos')">
                            <i class="fa-solid fa-square-parking"></i> Ver parqueos
                        </div>
                        <div class="dropdown-divider"></div>
                        ${t.status === 'Suspendido' ? `
                            <div class="dropdown-item" onclick="reactivateTenant('${t.id}')">
                                <i class="fa-solid fa-circle-play" style="color:#22C55E;"></i> Reactivar tenant
                            </div>
                        ` : `
                            <div class="dropdown-item danger" onclick="openSuspendConfirmModal('${t.id}')">
                                <i class="fa-solid fa-circle-pause"></i> Suspender tenant
                            </div>
                        `}
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleDropdown(e, tenantId) {
    e.stopPropagation();
    document.querySelectorAll('.dropdown-popover').forEach(el => {
        if (el.id !== `dropdown-${tenantId}`) el.classList.remove('show');
    });
    const target = document.getElementById(`dropdown-${tenantId}`);
    if (target) target.classList.toggle('show');
}

function resetFilters() {
    document.getElementById('tenant-search-input').value = '';
    document.getElementById('filter-status').value = 'all';
    document.getElementById('filter-type').value = 'all';
    document.getElementById('filter-plan').value = 'all';
    renderTenantsTable();
}

/* New Tenant Modal Functions */
function openNewTenantModal() {
    const modal = document.getElementById('modal-new-tenant');
    if (modal) modal.classList.add('open');
}

function closeNewTenantModal() {
    const modal = document.getElementById('modal-new-tenant');
    if (modal) modal.classList.remove('open');
    const form = document.getElementById('form-new-tenant');
    if (form) form.reset();
}

function toggleAdminOption(mode) {
    const existingGroup = document.getElementById('admin-select-group');
    const newGroup = document.getElementById('admin-new-fields-group');
    if (mode === 'new') {
        if (existingGroup) existingGroup.style.display = 'none';
        if (newGroup) newGroup.style.display = 'block';
    } else {
        if (existingGroup) existingGroup.style.display = 'block';
        if (newGroup) newGroup.style.display = 'none';
    }
}

function handleSaveNewTenant(e) {
    e.preventDefault();
    const name = document.getElementById('new-tenant-name').value.trim();
    const type = document.getElementById('new-tenant-type').value;
    const nit = document.getElementById('new-tenant-nit').value.trim();
    const email = document.getElementById('new-tenant-email').value.trim();
    const phone = document.getElementById('new-tenant-phone').value.trim();
    const plan = document.getElementById('new-tenant-plan').value;
    const status = document.getElementById('new-tenant-status').value;
    const comision = parseFloat(document.getElementById('new-tenant-comision').value) || 8.0;

    // Read admin choice
    const adminRadio = document.querySelector('input[name="admin_option"]:checked');
    const adminMode = adminRadio ? adminRadio.value : 'existing';
    let adminName = '';
    let adminEmail = '';

    if (adminMode === 'existing') {
        const select = document.getElementById('new-tenant-admin-select');
        adminName = select.options[select.selectedIndex].text.split('(')[0].trim();
        adminEmail = select.value;
    } else {
        adminName = document.getElementById('new-admin-name').value.trim();
        adminEmail = document.getElementById('new-admin-email').value.trim();
    }

    if (!name || !email) {
        showToast('Por favor ingrese todos los campos requeridos.', 'error');
        return;
    }

    // Duplicate Check
    const exists = mockTenants.some(t => t.adminEmail.toLowerCase() === email.toLowerCase() || t.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        showToast('Advertencia: Ya existe un tenant registrado con esa Razón Social o Correo.', 'error');
        return;
    }

    const newId = `TNT-${100 + mockTenants.length + 1}`;
    const today = new Date().toISOString().split('T')[0];

    const newTenant = {
        id: newId,
        name: name,
        adminName: adminName || 'Admin Asignado',
        adminEmail: adminEmail || email,
        adminPhone: phone || '+591 700-00000',
        type: type,
        nit: nit || 'Sin NIT registrado',
        parqueosCount: 0,
        operadoresCount: 0,
        plan: plan,
        status: status,
        regDate: today,
        comision: comision,
        parqueos: [],
        usuarios: [
            { name: adminName, email: adminEmail, role: 'Administrador de Parqueo', parking: 'Pendiente', status: 'Activo' }
        ],
        bitacora: [
            { user: 'Admin General', action: 'Tenant creado', date: today, time: 'Ahora mismo', desc: `Creación de tenant comercial con plan ${plan} y comisión ${comision}%.` }
        ]
    };

    mockTenants.unshift(newTenant);
    closeNewTenantModal();
    renderKPIs();
    renderTenantsTable();
    showToast(`Tenant "${name}" (${newId}) registrado exitosamente.`, 'success');
}

/* Detail View Functions */
function openDetailView(tenantId) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (!tenant) return;
    currentDetailTenant = tenant;

    const mainList = document.getElementById('tenants-main-list-view');
    const detailContainer = document.getElementById('tenants-detail-view');
    if (mainList) mainList.style.display = 'none';
    if (detailContainer) detailContainer.classList.add('active');

    // Populate Detail Header
    document.getElementById('detail-tenant-name').textContent = tenant.name;
    document.getElementById('detail-tenant-id').textContent = tenant.id;
    document.getElementById('detail-tenant-avatar').textContent = tenant.name.charAt(0).toUpperCase();

    const statusBadge = document.getElementById('detail-tenant-status');
    statusBadge.className = `badge-status ${tenant.status.toLowerCase()}`;
    statusBadge.textContent = tenant.status;

    document.getElementById('detail-tenant-type').textContent = tenant.type;
    document.getElementById('detail-tenant-plan').textContent = tenant.plan;
    document.getElementById('detail-tenant-date').textContent = tenant.regDate;

    // Populate Tab 1: Resumen
    document.getElementById('sum-parqueos-count').textContent = tenant.parqueosCount;
    document.getElementById('sum-operadores-count').textContent = tenant.operadoresCount;
    document.getElementById('sum-admin-name').textContent = tenant.adminName;
    document.getElementById('sum-admin-email').textContent = tenant.adminEmail;
    document.getElementById('sum-admin-phone').textContent = tenant.adminPhone;
    document.getElementById('sum-nit').textContent = tenant.nit;
    document.getElementById('sum-comision').textContent = `${tenant.comision}%`;

    // Populate Tab 2: Parqueos
    renderDetailParqueos(tenant);

    // Populate Tab 3: Usuarios
    renderDetailUsuarios(tenant);

    // Populate Tab 8: Bitacora
    renderDetailBitacora(tenant);

    // Switch to first tab (Resumen)
    switchDetailTab('resumen');
}

function backToMainList() {
    const detailContainer = document.getElementById('tenants-detail-view');
    const mainList = document.getElementById('tenants-main-list-view');
    if (detailContainer) detailContainer.classList.remove('active');
    if (mainList) mainList.style.display = 'block';
}

function openDetailViewTab(tenantId, tabId) {
    openDetailView(tenantId);
    switchDetailTab(tabId);
}

function switchDetailTab(tabId) {
    document.querySelectorAll('.tenant-tab-item').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    document.querySelectorAll('.detail-tab-pane').forEach(pane => {
        if (pane.id === `tab-pane-${tabId}`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

function renderDetailParqueos(tenant) {
    const container = document.getElementById('detail-parqueos-cards-container');
    if (!container) return;
    container.innerHTML = '';

    if (!tenant.parqueos || tenant.parqueos.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 3rem; background:#FFFFFF; border:1px solid var(--border-subtle, #DDE3DE); border-radius:8px; color:var(--text-muted, #66736B);">
                <i class="fa-solid fa-square-parking" style="font-size:2.5rem; color:var(--text-dim, #94A09A); margin-bottom:0.75rem;"></i>
                <p style="margin:0; font-weight:600;">No hay parqueos o sucursales registradas para este tenant.</p>
            </div>
        `;
        return;
    }

    const searchVal = (document.getElementById('detail-parking-search')?.value || '').toLowerCase().trim();
    const statusVal = (document.getElementById('detail-parking-status-filter')?.value || 'all').toLowerCase();

    const filtered = tenant.parqueos.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(searchVal) || p.address.toLowerCase().includes(searchVal);
        const matchesStatus = statusVal === 'all' || p.status.toLowerCase() === statusVal;
        return matchesQuery && matchesStatus;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 2.5rem; background:#FFFFFF; border:1px solid var(--border-subtle, #DDE3DE); border-radius:8px; color:var(--text-muted, #66736B);">
                <p style="margin:0; font-weight:600;">No se encontraron sucursales de parqueo con los filtros seleccionados.</p>
            </div>
        `;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'parking-branches-grid';

    filtered.forEach(p => {
        const capacity = p.capacity || 100;
        const available = p.available !== undefined ? p.available : 10;
        const occupied = p.occupied !== undefined ? p.occupied : (capacity - available);
        const percent = Math.round((occupied / capacity) * 100);

        let fillClass = 'low';
        if (percent >= 90) fillClass = 'high';
        else if (percent >= 70) fillClass = 'medium';

        let statusKey = (p.status || 'OPERATIVO').toLowerCase();
        let statusLabel = p.status || 'OPERATIVO';

        const card = document.createElement('div');
        card.className = 'parking-branch-card';
        card.innerHTML = `
            <div>
                <div class="branch-card-header">
                    <div class="branch-title">${p.name}</div>
                    <span class="badge-branch-status ${statusKey}">${statusLabel}</span>
                </div>
                <div class="branch-company-name">
                    <i class="fa-solid fa-warehouse"></i> ${tenant.name}
                </div>
                <div class="branch-address-row">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${p.address}</span>
                </div>
            </div>

            <div>
                <div class="branch-occupancy-block">
                    <div class="occupancy-labels-row">
                        <span>Ocupación (${percent}%)</span>
                        <span class="occ-count">${occupied}/${capacity} Ocupados</span>
                    </div>
                    <div class="occupancy-track">
                        <div class="occupancy-fill ${fillClass}" style="width: ${percent}%;"></div>
                    </div>
                </div>

                <div class="branch-card-footer">
                    <div class="branch-avail-count">
                        <i class="fa-solid fa-circle-check" style="color:#22C55E;"></i>
                        <span>${available} Disponibles</span>
                    </div>
                    <div class="branch-actions-row">
                        <button type="button" class="btn-icon-action" title="Ver garita/croquis" onclick="alert('Visualizando garita de ${p.name}');">
                            <i class="fa-solid fa-warehouse"></i>
                        </button>
                        <button type="button" class="btn-card-suspend" onclick="alert('Acción de suspensión para sucursal ${p.name}');">
                            <i class="fa-solid fa-circle-pause"></i> Suspender
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function filterTenantBranchCards() {
    if (currentDetailTenant) {
        renderDetailParqueos(currentDetailTenant);
    }
}

function renderDetailUsuarios(tenant) {
    const tbody = document.getElementById('detail-usuarios-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (tenant.usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color:var(--text-muted, #66736B);">Sin usuarios asociados.</td></tr>`;
        return;
    }
    tenant.usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge-plan profesional">${u.role}</span></td>
            <td>${u.parking}</td>
            <td><span class="badge-status ${u.status.toLowerCase()}">${u.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderDetailBitacora(tenant) {
    const container = document.getElementById('detail-bitacora-timeline');
    if (!container) return;
    container.innerHTML = '';
    if (tenant.bitacora.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted, #66736B);">Sin eventos registrados en la bitácora.</p>`;
        return;
    }
    tenant.bitacora.forEach(b => {
        const entry = document.createElement('div');
        entry.className = 'timeline-entry';
        entry.innerHTML = `
            <div class="timeline-content-card">
                <div class="timeline-header">
                    <span class="timeline-action-title"><i class="fa-solid fa-clock-rotate-left" style="color:var(--accent-emerald, #006D36);"></i> ${b.action}</span>
                    <span class="timeline-time">${b.date} • ${b.time}</span>
                </div>
                <div class="timeline-desc">${b.desc}</div>
                <div style="font-size: 0.75rem; color: var(--text-dim, #94A09A); margin-top: 4px;">Ejecutado por: <strong>${b.user}</strong></div>
            </div>
        `;
        container.appendChild(entry);
    });
}

/* Suspend & Reactivate */
function openSuspendConfirmModal(tenantId) {
    selectedTenantIdForSuspend = tenantId;
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (!tenant) return;
    document.getElementById('suspend-tenant-name').textContent = tenant.name;
    const modal = document.getElementById('modal-confirm-suspend');
    if (modal) modal.classList.add('open');
}

function closeSuspendConfirmModal() {
    const modal = document.getElementById('modal-confirm-suspend');
    if (modal) modal.classList.remove('open');
    selectedTenantIdForSuspend = null;
}

function confirmSuspendTenant() {
    if (!selectedTenantIdForSuspend) return;
    const tenant = mockTenants.find(t => t.id === selectedTenantIdForSuspend);
    if (tenant) {
        tenant.status = 'Suspendido';
        const today = new Date().toISOString().split('T')[0];
        tenant.bitacora.unshift({
            user: 'Admin General',
            action: 'Tenant suspendido',
            date: today,
            time: 'Hace un momento',
            desc: 'Suspensión administrativa activada. Preservación total de datos operativos.'
        });
        showToast(`Tenant "${tenant.name}" ha sido suspendido.`, 'error');
        renderKPIs();
        renderTenantsTable();
        if (currentDetailTenant && currentDetailTenant.id === tenant.id) {
            openDetailView(tenant.id);
        }
    }
    closeSuspendConfirmModal();
}

function reactivateTenant(tenantId) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (tenant) {
        tenant.status = 'Activo';
        const today = new Date().toISOString().split('T')[0];
        tenant.bitacora.unshift({
            user: 'Admin General',
            action: 'Tenant reactivado',
            date: today,
            time: 'Hace un momento',
            desc: 'Reactivación de operaciones completada.'
        });
        showToast(`Tenant "${tenant.name}" reactivado exitosamente.`, 'success');
        renderKPIs();
        renderTenantsTable();
        if (currentDetailTenant && currentDetailTenant.id === tenant.id) {
            openDetailView(tenant.id);
        }
    }
}

function editTenantPrompt(tenantId) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (!tenant) return;
    const newPlan = prompt(`Editar Plan para ${tenant.name} (Gratuito, Básico, Profesional, Empresarial):`, tenant.plan);
    if (newPlan && ['Gratuito', 'Básico', 'Profesional', 'Empresarial'].includes(newPlan)) {
        tenant.plan = newPlan;
        showToast(`Plan de ${tenant.name} actualizado a ${newPlan}.`, 'success');
        renderTenantsTable();
    }
}

function openAssociateAdminPrompt(tenantId) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    if (!tenant) return;
    const newAdmin = prompt(`Nombre del nuevo Administrador para ${tenant.name}:`, tenant.adminName);
    if (newAdmin) {
        tenant.adminName = newAdmin;
        showToast(`Administrador de ${tenant.name} actualizado a ${newAdmin}.`, 'success');
        renderTenantsTable();
    }
}

/* Toast Notifications */
function showToast(message, type = 'success') {
    const stack = document.getElementById('toast-stack');
    if (!stack) return;
    const toast = document.createElement('div');
    toast.className = `toast-msg ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3500);
}
