/* ==========================================================================
   DASHBOARD CORE CONTROLLER & SPA ROUTER
   Skill Mandate: Highly Interactive Vanilla JS Architecture (No Reloads)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize SPA Router & Core Listeners
  initNavigation();
  initSidebarToggle();
  initModals();
  
  // Render Initial Views
  renderAnalytics();
  renderUsers();
  renderPermissions();
  renderParkings();
  renderParkingRequests();
  renderPlans();
  renderCommissions();
  renderPromotions();
  renderDenuncias();
  renderAuditLogs();
  renderBackups();

  // Initialize Analytical Chart
  initIncomeChart();

  console.log('✨ Dashboard Administrative Prototype Initialized Successfully.');
});

/* ==========================================================================
   1. SPA NAVIGATION ENGINE
   ========================================================================== */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  const views = document.querySelectorAll('.dashboard-view');
  const titleDisplay = document.getElementById('current-page-title');
  const breadcrumbDisplay = document.getElementById('current-page-breadcrumb');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      const viewTitle = item.querySelector('span')?.textContent || 'Dashboard';

      // Update Nav active states
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update Views display
      views.forEach(view => {
        if (view.id === `view-${targetView}`) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });

      // Update Topbar Title & Breadcrumb
      if (titleDisplay) titleDisplay.textContent = viewTitle;
      if (breadcrumbDisplay) breadcrumbDisplay.textContent = `Admin / ${viewTitle}`;

      // Close mobile sidebar if open
      document.querySelector('.sidebar')?.classList.remove('mobile-open');
    });
  });
}

function initSidebarToggle() {
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
}

/* ==========================================================================
   2. ANALYTICS & CHART.JS INITIALIZATION
   ========================================================================== */
let incomeChartInstance = null;

function initIncomeChart() {
  const ctx = document.getElementById('incomeChart')?.getContext('2d');
  if (!ctx) return;

  const gradientIncome = ctx.createLinearGradient(0, 0, 0, 300);
  gradientIncome.addColorStop(0, 'rgba(0, 109, 54, 0.25)');
  gradientIncome.addColorStop(1, 'rgba(0, 109, 54, 0.0)');

  const gradientTx = ctx.createLinearGradient(0, 0, 0, 300);
  gradientTx.addColorStop(0, 'rgba(37, 99, 235, 0.2)');
  gradientTx.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

  incomeChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: MockData.chartData.months,
      datasets: [
        {
          label: 'Ingresos Comisiones ($)',
          data: MockData.chartData.incomeData,
          borderColor: '#006D36',
          backgroundColor: gradientIncome,
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Total Transacciones',
          data: MockData.chartData.transactionsData,
          borderColor: '#2563EB',
          backgroundColor: gradientTx,
          borderWidth: 2,
          borderDash: [4, 4],
          fill: false,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          labels: { color: '#66736B', font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' } }
        },
        tooltip: {
          backgroundColor: '#17211B',
          titleColor: '#FFFFFF',
          bodyColor: '#DDE3DE',
          borderColor: '#006D36',
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          grid: { color: '#E2E8F0' },
          ticks: { color: '#66736B' }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: '#E2E8F0' },
          ticks: { color: '#006D36', callback: value => '$' + value.toLocaleString() }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#2563EB' }
        }
      }
    }
  });
}

function renderAnalytics() {
  if (document.getElementById('kpi-total-users')) document.getElementById('kpi-total-users').textContent = MockData.stats.totalRegisteredUsers.toLocaleString();
  if (document.getElementById('kpi-parking-admins')) document.getElementById('kpi-parking-admins').textContent = MockData.stats.totalParkingAdmins;
  if (document.getElementById('kpi-active-parkings')) document.getElementById('kpi-active-parkings').textContent = MockData.stats.totalActiveParkings;
  if (document.getElementById('kpi-total-slots')) document.getElementById('kpi-total-slots').textContent = MockData.stats.totalPublishedSlots.toLocaleString();
  if (document.getElementById('kpi-transactions')) document.getElementById('kpi-transactions').textContent = MockData.stats.totalReservations.toLocaleString();
  if (document.getElementById('kpi-revenue')) document.getElementById('kpi-revenue').textContent = `Bs. ${MockData.stats.totalRevenueCommissions.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
  if (document.getElementById('kpi-service-fees')) document.getElementById('kpi-service-fees').textContent = `Bs. ${MockData.stats.totalRevenueServiceFees.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`;
  if (document.getElementById('kpi-plans-breakdown')) document.getElementById('kpi-plans-breakdown').textContent = `45 Planes`;
}

/* ==========================================================================
   3. GESTIÓN DE USUARIOS (DUEÑOS)
   ========================================================================== */
function renderUsers() {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  const searchVal = document.getElementById('search-users-input')?.value.toLowerCase() || '';
  const roleFilter = document.getElementById('filter-user-role')?.value || 'todos';
  const statusFilter = document.getElementById('filter-user-status')?.value || 'todos';

  const filtered = MockData.users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchVal) ||
      u.company.toLowerCase().includes(searchVal) ||
      u.email.toLowerCase().includes(searchVal) ||
      (u.role && u.role.toLowerCase().includes(searchVal));

    const matchesRole = roleFilter === 'todos' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'todos' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  tbody.innerHTML = filtered.map(u => {
    let roleBadgeClass = 'badge-blue';
    if (u.role === 'Dueño de Empresa') roleBadgeClass = 'badge-active';
    if (u.role === 'Conductor') roleBadgeClass = 'badge-pending';

    return `
      <tr>
        <td style="width:30px;"><input type="checkbox"></td>
        <td>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <div class="admin-avatar">${u.name.charAt(0)}</div>
            <div>
              <div style="font-weight:600;">${u.name}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="badge ${roleBadgeClass}">${u.role || 'Dueño de Empresa'}</span></td>
        <td><strong>${u.company}</strong></td>
        <td>${u.phone}</td>
        <td>
          <span class="badge ${u.status === 'Activo' ? 'badge-active' : 'badge-suspended'}">
            <i class="fa-solid fa-circle" style="font-size:0.5rem;"></i> ${u.status}
          </span>
        </td>
        <td><span class="badge badge-blue"><i class="fa-solid fa-square-parking"></i> ${u.parkingsCount} Parqueos</span></td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.4rem; justify-content:flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="viewUserDetail(${u.id})" title="Ver Detalle">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="editUser(${u.id})" title="Editar">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn ${u.status === 'Activo' ? 'btn-danger' : 'btn-outline'} btn-sm" onclick="toggleUserStatus(${u.id})">
              ${u.status === 'Activo' ? '<i class="fa-solid fa-user-slash"></i> Suspender' : '<i class="fa-solid fa-user-check"></i> Activar'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function toggleUserStatus(id) {
  const user = MockData.users.find(u => u.id === id);
  if (user) {
    user.status = user.status === 'Activo' ? 'Suspendido' : 'Activo';
    renderUsers();
    showToast(`El usuario ${user.name} ahora está ${user.status}.`, 'success');
  }
}

function viewUserDetail(id) {
  const user = MockData.users.find(u => u.id === id);
  if (!user) return;

  const content = `
    <div style="line-height:1.8;">
      <p><strong>ID Usuario:</strong> #${user.id}</p>
      <p><strong>Nombre Completo:</strong> ${user.name}</p>
      <p><strong>Rol Asignado:</strong> <span class="badge badge-blue">${user.role || 'Dueño de Empresa'}</span></p>
      <p><strong>Empresa / Organización:</strong> ${user.company}</p>
      <p><strong>Correo Electrónico:</strong> ${user.email}</p>
      <p><strong>Teléfono Directo:</strong> ${user.phone}</p>
      <p><strong>Fecha de Registro:</strong> ${user.joinedDate}</p>
      <p><strong>Parqueos Asociados:</strong> ${user.parkingsCount} Sucursales</p>
      <p><strong>Estado Actual:</strong> <span class="badge ${user.status === 'Activo' ? 'badge-active' : 'badge-suspended'}">${user.status}</span></p>
    </div>
  `;
  document.getElementById('userDetailBody').innerHTML = content;
  openModal('modalUserDetail');
}

function editUser(id) {
  const user = MockData.users.find(u => u.id === id);
  if (!user) return;
  alert(`Ventana de edición de prototipo para: ${user.name} (${user.role})`);
}

/* Search & Filters Users listeners */
document.getElementById('search-users-input')?.addEventListener('input', renderUsers);
document.getElementById('filter-user-role')?.addEventListener('change', renderUsers);
document.getElementById('filter-user-status')?.addEventListener('change', renderUsers);

function selectRole(roleName) {
  if (!MockData.permissionsByRole[roleName]) return;
  MockData.selectedRole = roleName;
  
  // Update button active state
  document.querySelectorAll('#role-selector-container .role-btn').forEach(btn => {
    if (btn.textContent.trim() === roleName) {
      btn.className = 'btn btn-primary btn-sm role-btn active';
    } else {
      btn.className = 'btn btn-secondary btn-sm role-btn';
    }
  });

  renderPermissions();
}

function renderPermissions() {
  const tbody = document.getElementById('permissions-table-body');
  if (!tbody) return;

  const currentRole = MockData.selectedRole || "Administrador General";
  const matrix = MockData.permissionsByRole[currentRole] || [];

  tbody.innerHTML = matrix.map((item, idx) => `
    <tr>
      <td><strong>${item.module}</strong></td>
      <td style="text-align:center;"><input type="checkbox" ${item.read ? 'checked' : ''} onchange="MockData.permissionsByRole['${currentRole}'][${idx}].read = this.checked"></td>
      <td style="text-align:center;"><input type="checkbox" ${item.create ? 'checked' : ''} onchange="MockData.permissionsByRole['${currentRole}'][${idx}].create = this.checked"></td>
      <td style="text-align:center;"><input type="checkbox" ${item.edit ? 'checked' : ''} onchange="MockData.permissionsByRole['${currentRole}'][${idx}].edit = this.checked"></td>
      <td style="text-align:center;"><input type="checkbox" ${item.delete ? 'checked' : ''} onchange="MockData.permissionsByRole['${currentRole}'][${idx}].delete = this.checked"></td>
    </tr>
  `).join('');
}

function savePermissions() {
  showToast('Matriz de roles y permisos guardada exitosamente.', 'success');
  // Log event
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: 'Actualización de Matriz de Permisos',
    module: 'Roles & Permisos',
    ip: '189.201.42.10'
  });
  renderAuditLogs();
}

/* ==========================================================================
   5. GESTIÓN DE PARQUEOS (SUCURSALES)
   ========================================================================== */
function populateCompanyDropdown() {
  const companySelect = document.getElementById('filter-parking-company');
  if (!companySelect || companySelect.children.length > 1) return;

  const companies = [...new Set(MockData.parkings.map(p => p.owner))];
  companies.forEach(company => {
    const opt = document.createElement('option');
    opt.value = company;
    opt.textContent = company;
    companySelect.appendChild(opt);
  });
}

function renderParkings() {
  const container = document.getElementById('parkings-cards-container');
  if (!container) return;

  populateCompanyDropdown();

  const searchVal = document.getElementById('search-parking-input')?.value.toLowerCase() || '';
  const companyFilter = document.getElementById('filter-parking-company')?.value || 'todas';
  const statusFilter = document.getElementById('filter-parking-status')?.value || 'todos';

  const filtered = MockData.parkings.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) || p.city.toLowerCase().includes(searchVal) || p.owner.toLowerCase().includes(searchVal);
    const matchesCompany = companyFilter === 'todas' || p.owner === companyFilter;
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;
    return matchesSearch && matchesCompany && matchesStatus;
  });

  container.innerHTML = filtered.map(p => {
    let progressClass = 'low';
    if (p.occupancy > 70) progressClass = 'medium';
    if (p.occupancy > 90) progressClass = 'high';

    let badgeClass = 'badge-active';
    if (p.status === 'Lleno') badgeClass = 'badge-pending';
    if (p.status === 'Mantenimiento') badgeClass = 'badge-blue';
    if (p.status === 'Suspendido') badgeClass = 'badge-suspended';

    return `
      <div class="card parking-card">
        <div class="parking-card-header">
          <div class="parking-title">
            <h4>${p.name}</h4>
            <div class="parking-owner"><i class="fa-solid fa-building"></i> ${p.owner}</div>
          </div>
          <span class="badge ${badgeClass}">
            ${p.status}
          </span>
        </div>

        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
          <i class="fa-solid fa-location-dot"></i> ${p.address}, ${p.city}
        </div>

        <div class="occupancy-bar-container">
          <div class="occupancy-labels">
            <span>Ocupación (${p.occupancy}%)</span>
            <span><strong>${p.totalSlots - p.availableSlots}</strong> / ${p.totalSlots} Ocupados</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${progressClass}" style="width: ${p.occupancy}%;"></div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:0.85rem; margin-top:0.5rem;">
          <span style="font-size:0.8rem; color:${p.status === 'Suspendido' ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-weight:600;">
            <i class="fa-solid ${p.status === 'Suspendido' ? 'fa-circle-pause' : 'fa-circle-check'}"></i> ${p.status === 'Suspendido' ? 'Operación Pausada' : p.availableSlots + ' Disponibles'}
          </span>
          <div style="display:flex; gap:0.35rem;">
            <button class="btn btn-secondary btn-sm" onclick="alert('Monitoreo en vivo de cámaras e ingresos de: ${p.name}')" title="Monitorear">
              <i class="fa-solid fa-tower-observation"></i>
            </button>
            ${p.status === 'Suspendido' ? `
              <button class="btn btn-primary btn-sm" onclick="toggleParkingStatus(${p.id}, 'Operativo')" title="Reactivar Parqueo">
                <i class="fa-solid fa-play"></i> Reactivar
              </button>
            ` : `
              <button class="btn btn-secondary btn-sm" style="color:var(--accent-rose); border-color:var(--accent-rose);" onclick="toggleParkingStatus(${p.id}, 'Suspendido')" title="Suspender Parqueo">
                <i class="fa-solid fa-pause"></i> Suspender
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleParkingStatus(id, newStatus) {
  const parking = MockData.parkings.find(p => p.id === id);
  if (!parking) return;

  parking.status = newStatus;

  // Log in Audit
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Cambio de estado de parqueo '${parking.name}' a: ${newStatus}`,
    module: 'Gestión de Parqueos',
    ip: '189.201.42.10'
  });

  showToast(`El estacionamiento '${parking.name}' ahora está en estado: ${newStatus}`, newStatus === 'Operativo' ? 'success' : 'warning');
  renderParkings();
  renderAuditLogs();
}

document.getElementById('search-parking-input')?.addEventListener('input', renderParkings);
document.getElementById('filter-parking-company')?.addEventListener('change', renderParkings);
document.getElementById('filter-parking-status')?.addEventListener('change', renderParkings);

/* ==========================================================================
   6. PLANES Y SUSCRIPCIONES
   ========================================================================== */
function renderPlans() {
  const container = document.getElementById('plans-cards-container');
  if (!container) return;

  container.innerHTML = MockData.plans.map(plan => `
    <div class="card plan-card ${plan.popular ? 'popular' : ''}">
      ${plan.popular ? '<div class="popular-tag">Más Popular</div>' : ''}
      <div>
        <h3 style="font-size:1.3rem; margin-bottom:0.4rem;">${plan.name}</h3>
        <p style="font-size:0.8rem; color:var(--text-muted);">Límite: ${plan.parkingLimit} Parqueos</p>
        
        <div class="plan-price">
          $${plan.priceMonth} <span>/ mes</span>
        </div>

        <ul class="plan-features">
          <li><i class="fa-solid fa-check"></i> Transacciones: ${plan.transactionLimit}</li>
          ${plan.features.map(f => `<li><i class="fa-solid fa-check"></i> ${f}</li>`).join('')}
        </ul>
      </div>

      <button class="btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}" style="width:100%; margin-top:1.25rem;" onclick="openEditPlanModal('${plan.id}')">
        <i class="fa-solid fa-pen"></i> Editar Plan
      </button>
    </div>
  `).join('');
}

function openEditPlanModal(planId) {
  const plan = MockData.plans.find(p => p.id === planId);
  if (!plan) return;

  document.getElementById('edit-plan-id').value = plan.id;
  document.getElementById('edit-plan-name').value = plan.name;
  document.getElementById('edit-plan-price').value = plan.priceMonth;
  openModal('modalEditPlan');
}

/* ==========================================================================
   7. GESTIÓN DE COMISIONES
   ========================================================================== */
function renderCommissions() {
  document.getElementById('commission-rate-input').value = MockData.stats.monthlyCommissionRate;
  
  const tbody = document.getElementById('settlements-table-body');
  if (!tbody) return;

  tbody.innerHTML = MockData.settlements.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td>${s.ownerCompany}</td>
      <td>$${s.grossAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
      <td style="color:var(--accent-emerald); font-weight:600;">$${s.commissionAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
      <td>$${s.netPayout.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
      <td>
        <span class="badge ${s.status === 'Pagado' ? 'badge-active' : 'badge-pending'}">${s.status}</span>
      </td>
      <td>${s.date}</td>
      <td>
        ${s.status === 'Pendiente' ? 
          `<button class="btn btn-primary btn-sm" onclick="processSettlement('${s.id}')"><i class="fa-solid fa-hand-holding-dollar"></i> Liquidar</button>` : 
          `<button class="btn btn-secondary btn-sm" disabled><i class="fa-solid fa-circle-check"></i> Pagado</button>`
        }
      </td>
    </tr>
  `).join('');
}

function saveCommissionRate() {
  const newRate = parseFloat(document.getElementById('commission-rate-input').value);
  if (isNaN(newRate) || newRate < 0 || newRate > 100) {
    showToast('Ingresa un porcentaje de comisión válido.', 'error');
    return;
  }
  MockData.stats.monthlyCommissionRate = newRate;
  showToast(`Porcentaje de comisión global actualizado a ${newRate}%.`, 'success');
}

function processSettlement(settlementId) {
  const item = MockData.settlements.find(s => s.id === settlementId);
  if (item) {
    item.status = 'Pagado';
    renderCommissions();
    showToast(`Liquidación ${settlementId} procesada y pagada a ${item.ownerCompany}.`, 'success');
  }
}

/* ==========================================================================
   8. PROMOCIONES DEL SISTEMA
   ========================================================================== */
function renderPromotions() {
  const tbody = document.getElementById('promotions-table-body');
  if (!tbody) return;

  tbody.innerHTML = MockData.promotions.map(p => `
    <tr>
      <td><span class="badge badge-blue" style="font-family:monospace; font-size:0.85rem;">${p.code}</span></td>
      <td>${p.type} (${p.discount})</td>
      <td>${p.startDate} al ${p.endDate}</td>
      <td><strong>${p.usedCount}</strong> / ${p.maxLimit} Usos</td>
      <td>
        <span class="badge ${p.status === 'Activo' ? 'badge-active' : 'badge-suspended'}">${p.status}</span>
      </td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deletePromotion('${p.id}')">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  `).join('');
}

function deletePromotion(id) {
  MockData.promotions = MockData.promotions.filter(p => p.id !== id);
  renderPromotions();
  showToast('Promoción eliminada.', 'success');
}

/* ==========================================================================
   9. BITÁCORA DEL SISTEMA (AUDIT LOG)
   ========================================================================== */
function renderAuditLogs() {
  const tbody = document.getElementById('audit-table-body');
  if (!tbody) return;

  const searchVal = document.getElementById('search-audit-input')?.value.toLowerCase() || '';

  const filtered = MockData.auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchVal) ||
    log.action.toLowerCase().includes(searchVal) ||
    log.module.toLowerCase().includes(searchVal) ||
    log.ip.includes(searchVal)
  );

  tbody.innerHTML = filtered.map(log => `
    <tr>
      <td style="font-size:0.8rem; color:var(--text-dim);">${log.timestamp}</td>
      <td>
        <strong>${log.user}</strong>
        <div style="font-size:0.72rem; color:var(--accent-emerald);">${log.role}</div>
      </td>
      <td>${log.action}</td>
      <td><span class="badge badge-blue">${log.module}</span></td>
      <td style="font-family:monospace; font-size:0.8rem;">${log.ip}</td>
    </tr>
  `).join('');
}

document.getElementById('search-audit-input')?.addEventListener('input', renderAuditLogs);

/* ==========================================================================
   10. GESTIÓN DE COPIAS DE SEGURIDAD (BACKUP ENGINE)
   ========================================================================== */
function renderBackups() {
  const tbody = document.getElementById('backups-table-body');
  if (!tbody) return;

  tbody.innerHTML = MockData.backups.map(b => `
    <tr>
      <td><strong style="font-family:monospace;">${b.id}</strong></td>
      <td style="font-size:0.8rem; color:var(--text-muted);">${b.timestamp}</td>
      <td><span class="badge ${b.type === 'Automática' ? 'badge-active' : 'badge-blue'}">${b.type}</span></td>
      <td><strong>${b.size}</strong></td>
      <td><span class="badge badge-pending" style="font-family:monospace;">${b.format}</span></td>
      <td><i class="fa-solid fa-lock" style="color:var(--accent-emerald);"></i> ${b.encryption}</td>
      <td><span class="badge badge-active">${b.status}</span></td>
      <td style="text-align:right;">
        <div style="display:inline-flex; gap:0.4rem; justify-content:flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="downloadBackup('${b.id}')" title="Descargar Copia">
            <i class="fa-solid fa-download"></i> Descargar
          </button>
          <button class="btn btn-outline btn-sm" onclick="restoreBackup('${b.id}')" title="Restaurar de Emergencia">
            <i class="fa-solid fa-rotate-left"></i> Restaurar
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteBackup('${b.id}')" title="Eliminar Respaldado">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function createBackup() {
  showToast('Iniciando volcado de base de datos...', 'success');

  setTimeout(() => {
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const dateCode = now.toISOString().replace(/[-:T]/g, '').substring(0, 12);

    const newBackup = {
      id: `BKP-${dateCode}`,
      timestamp: timestampStr,
      type: "Manual",
      size: `${(240 + Math.random() * 20).toFixed(1)} MB`,
      format: ".sql.gz",
      encryption: "AES-256",
      status: "Completado"
    };

    MockData.backups.unshift(newBackup);

    // Audit log entry
    MockData.auditLogs.unshift({
      id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
      timestamp: timestampStr,
      user: 'Admin General (Tú)',
      role: 'SuperAdmin',
      action: `Creación de Copia de Seguridad (${newBackup.id})`,
      module: 'Copias de Seguridad',
      ip: '189.201.42.10'
    });

    renderBackups();
    renderAuditLogs();
    showToast(`Copia de seguridad ${newBackup.id} creada y encriptada exitosamente.`, 'success');
  }, 1200);
}

function downloadBackup(id) {
  showToast(`Descargando archivo de respaldo ${id}...`, 'success');
}

function restoreBackup(id) {
  if (confirm(`⚠️ ¿Deseas restaurar la base de datos al estado del respaldo ${id}? Esto sobreescribirá la sesión actual.`)) {
    showToast(`Restauración completa aplicada desde ${id}.`, 'success');
  }
}

function deleteBackup(id) {
  MockData.backups = MockData.backups.filter(b => b.id !== id);
  renderBackups();
  showToast(`Respaldo ${id} eliminado del almacenamiento cloud.`, 'success');
}

/* ==========================================================================
   10. MODALS ENGINE & UTILITIES
   ========================================================================== */
function initModals() {
  // Close modals on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  });

  // Modal forms handlers
  document.getElementById('formNewOwner')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = document.getElementById('owner-role')?.value || "Dueño de Empresa";
    const name = document.getElementById('owner-name').value;
    const company = document.getElementById('owner-company').value || "Particular";
    const email = document.getElementById('owner-email').value;
    const phone = document.getElementById('owner-phone').value;

    const newOwner = {
      id: MockData.users.length + 1,
      name,
      role,
      company,
      email,
      phone,
      status: "Activo",
      parkingsCount: 0,
      joinedDate: new Date().toISOString().substring(0, 10)
    };

    MockData.users.unshift(newOwner);
    renderUsers();
    closeModal('modalNewOwner');
    e.target.reset();
    showToast(`Usuario "${name}" (${role}) registrado con éxito.`, 'success');
  });

  document.getElementById('formNewPromo')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('promo-code').value.toUpperCase();
    const type = document.getElementById('promo-type').value;
    const discount = document.getElementById('promo-discount').value;
    const limit = parseInt(document.getElementById('promo-limit').value);

    MockData.promotions.unshift({
      id: `PROM-${MockData.promotions.length + 1}`,
      code,
      type,
      discount,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "2026-12-31",
      usedCount: 0,
      maxLimit: limit,
      status: "Activo"
    });

    renderPromotions();
    closeModal('modalNewPromo');
    e.target.reset();
    showToast(`Cupón de promoción "${code}" creado con éxito.`, 'success');
  });

  document.getElementById('formEditPlan')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-plan-id').value;
    const newPrice = parseFloat(document.getElementById('edit-plan-price').value);

    const plan = MockData.plans.find(p => p.id === id);
    if (plan) {
      plan.priceMonth = newPrice;
      renderPlans();
      closeModal('modalEditPlan');
      showToast(`Plan ${plan.name} actualizado a $${newPrice}/mes.`, 'success');
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
}

/* Toast System */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}" style="color:var(--accent-emerald);"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   10. SOLICITUDES DE REGISTRO DE PARQUEOS (PENDIENTES DE REVISIÓN)
   ========================================================================== */
function renderParkingRequests() {
  const tbody = document.getElementById('requests-table-body');
  if (!tbody) return;

  const searchVal = document.getElementById('search-requests-input')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filter-request-status')?.value || 'todos';

  const requests = MockData.parkingRequests || [];

  // Update KPIs
  const pendingList = requests.filter(r => r.status === 'Pendiente');
  const approvedList = requests.filter(r => r.status === 'Aprobado');
  const rejectedList = requests.filter(r => r.status === 'Rechazado');

  const pendingBadge = document.getElementById('pending-requests-count');
  if (pendingBadge) {
    pendingBadge.textContent = pendingList.length;
    pendingBadge.style.display = pendingList.length > 0 ? 'inline-block' : 'none';
  }

  if (document.getElementById('req-kpi-total')) document.getElementById('req-kpi-total').textContent = requests.length;
  if (document.getElementById('req-kpi-pending')) document.getElementById('req-kpi-pending').textContent = pendingList.length;
  if (document.getElementById('req-kpi-approved')) document.getElementById('req-kpi-approved').textContent = approvedList.length;
  if (document.getElementById('req-kpi-rejected')) document.getElementById('req-kpi-rejected').textContent = rejectedList.length;

  const filtered = requests.filter(r => {
    const matchesSearch = !searchVal || 
      (r.id && r.id.toLowerCase().includes(searchVal)) ||
      (r.parkingName && r.parkingName.toLowerCase().includes(searchVal)) ||
      (r.applicantName && r.applicantName.toLowerCase().includes(searchVal)) ||
      (r.city && r.city.toLowerCase().includes(searchVal)) ||
      (r.company && r.company.toLowerCase().includes(searchVal));

    const matchesStatus = statusFilter === 'todos' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <i class="fa-solid fa-inbox" style="font-size:2rem; margin-bottom:0.5rem; opacity:0.5; display:block;"></i>
          No se encontraron solicitudes que coincidan con los filtros.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    let statusBadge = '<span class="badge badge-pending"><i class="fa-solid fa-clock"></i> Pendiente</span>';
    if (r.status === 'Aprobado') {
      statusBadge = '<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Aprobado</span>';
    } else if (r.status === 'Observado') {
      statusBadge = '<span class="badge" style="background:rgba(217,119,6,0.15); color:#D97706;"><i class="fa-solid fa-triangle-exclamation"></i> Observado</span>';
    } else if (r.status === 'Rechazado') {
      statusBadge = '<span class="badge badge-suspended"><i class="fa-solid fa-circle-xmark"></i> Rechazado</span>';
    }

    return `
      <tr>
        <td><strong style="font-family:monospace; color:var(--primary-color);">${r.id}</strong></td>
        <td>
          <div style="font-weight:600;">${r.parkingName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${r.address}</div>
        </td>
        <td>
          <div style="font-weight:500;">${r.applicantName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${r.company}</div>
        </td>
        <td><span class="badge badge-blue"><i class="fa-solid fa-location-dot"></i> ${r.city}</span></td>
        <td>
          <div style="font-weight:600; font-size:0.85rem;">${r.totalSlots} Cupos</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Bs. ${Number(r.hourlyRate).toFixed(2)}/hr</div>
        </td>
        <td><span style="font-size:0.8rem; color:var(--text-muted);">${r.requestDate}</span></td>
        <td>${statusBadge}</td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.35rem; justify-content:flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="viewRequestDetail('${r.id}')" title="Ver Expediente / Detalle">
              <i class="fa-solid fa-eye"></i> Detalle
            </button>
            ${(r.status === 'Pendiente' || r.status === 'Observado') ? `
              <button class="btn btn-primary btn-sm" onclick="approveParkingRequest('${r.id}')" title="Aprobar y Dar de Alta">
                <i class="fa-solid fa-check"></i> Aprobar
              </button>
              <button class="btn btn-secondary btn-sm" style="color:#D97706; border-color:#D97706;" onclick="openObserveRequestModal('${r.id}')" title="Observar / Solicitar Corrección">
                <i class="fa-solid fa-triangle-exclamation"></i>
              </button>
              <button class="btn btn-secondary btn-sm" style="color:var(--accent-rose); border-color:var(--accent-rose);" onclick="openRejectRequestModal('${r.id}')" title="Rechazar">
                <i class="fa-solid fa-xmark"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function viewRequestDetail(id) {
  const req = MockData.parkingRequests.find(r => r.id === id);
  if (!req) return;

  const body = document.getElementById('requestDetailBody');
  const footer = document.getElementById('requestDetailFooter');
  if (!body) return;

  let statusBadge = '<span class="badge badge-pending"><i class="fa-solid fa-clock"></i> Pendiente de Revisión</span>';
  if (req.status === 'Aprobado') statusBadge = '<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Solicitud Aprobada (Alta Oficial)</span>';
  if (req.status === 'Observado') statusBadge = '<span class="badge" style="background:rgba(217,119,6,0.15); color:#D97706;"><i class="fa-solid fa-triangle-exclamation"></i> Solicitud Observada</span>';
  if (req.status === 'Rechazado') statusBadge = '<span class="badge badge-suspended"><i class="fa-solid fa-circle-xmark"></i> Solicitud Rechazada</span>';

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.75rem; margin-bottom:1rem;">
      <div>
        <span style="font-family:monospace; font-size:0.8rem; color:var(--text-muted);">EXPEDIENTE ${req.id}</span>
        <h3 style="font-size:1.15rem; margin:0.1rem 0;">${req.parkingName}</h3>
      </div>
      <div>${statusBadge}</div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
      <div style="background:var(--card-bg); border:1px solid var(--border-subtle); padding:0.85rem; border-radius:6px;">
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:0.4rem; text-transform:uppercase;">Datos del Estacionamiento</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Dirección:</strong> ${req.address}</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Ciudad:</strong> ${req.city}</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Capacidad Proyectada:</strong> ${req.totalSlots} plazas</div>
        <div style="font-size:0.85rem;"><strong>Tarifa Propuesta:</strong> Bs. ${Number(req.hourlyRate).toFixed(2)} / hora</div>
      </div>

      <div style="background:var(--card-bg); border:1px solid var(--border-subtle); padding:0.85rem; border-radius:6px;">
        <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:0.4rem; text-transform:uppercase;">Solicitante y Empresa</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Administrador:</strong> ${req.applicantName}</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Empresa / Operadora:</strong> ${req.company}</div>
        <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Email:</strong> ${req.email}</div>
        <div style="font-size:0.85rem;"><strong>Teléfono:</strong> ${req.phone}</div>
      </div>
    </div>

    <div style="background:var(--card-bg); border:1px solid var(--border-subtle); padding:0.85rem; border-radius:6px; margin-bottom:1rem;">
      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:0.4rem; text-transform:uppercase;">Documentación Fiscal y Legal Adjunta</div>
      <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Identificación Tributaria:</strong> ${req.taxId}</div>
      <div style="font-size:0.85rem; color:var(--accent-emerald);"><strong>Documentos Verificados:</strong> <i class="fa-solid fa-file-pdf"></i> ${req.legalDocs}</div>
    </div>

    <div style="background:rgba(0,109,54,0.04); border-left:3px solid var(--primary-color); padding:0.75rem; border-radius:0 6px 6px 0;">
      <div style="font-size:0.75rem; color:var(--primary-color); font-weight:700; margin-bottom:0.2rem;">Notas de la Solicitud</div>
      <div style="font-size:0.82rem; color:var(--text-dark);">${req.notes}</div>
    </div>
  `;

  if (footer) {
    footer.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="closeModal('modalRequestDetail')">Cerrar Expediente</button>
      ${(req.status === 'Pendiente' || req.status === 'Observado') ? `
        <button type="button" class="btn btn-secondary" style="color:#D97706; border-color:#D97706;" onclick="closeModal('modalRequestDetail'); openObserveRequestModal('${req.id}')">
          <i class="fa-solid fa-triangle-exclamation"></i> Observar
        </button>
        <button type="button" class="btn btn-secondary" style="color:var(--accent-rose); border-color:var(--accent-rose);" onclick="closeModal('modalRequestDetail'); openRejectRequestModal('${req.id}')">
          <i class="fa-solid fa-xmark"></i> Rechazar
        </button>
        <button type="button" class="btn btn-primary" onclick="closeModal('modalRequestDetail'); approveParkingRequest('${req.id}')">
          <i class="fa-solid fa-check"></i> Aprobar y Registrar
        </button>
      ` : ''}
    `;
  }

  openModal('modalRequestDetail');
}

function approveParkingRequest(id) {
  const req = MockData.parkingRequests.find(r => r.id === id);
  if (!req) return;

  req.status = 'Aprobado';

  // Automatically create active parking lot entry
  const newParkingId = Math.floor(Math.random() * 900 + 200);
  MockData.parkings.unshift({
    id: newParkingId,
    name: req.parkingName,
    owner: req.company,
    city: req.city,
    address: req.address,
    totalSlots: req.totalSlots,
    availableSlots: req.totalSlots,
    status: "Operativo",
    occupancy: 0.0
  });

  // Log in Audit Trail
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Aprobación de Registro de Estacionamiento: ${req.parkingName} (${req.id})`,
    module: 'Solicitudes',
    ip: '189.201.42.10'
  });

  showToast(`¡Solicitud ${req.id} aprobada! El parqueo '${req.parkingName}' ha sido registrado y activado como Operativo.`, 'success');

  renderParkingRequests();
  renderParkings();
  renderAuditLogs();
}

function openRejectRequestModal(id) {
  const reqIdInput = document.getElementById('reject-request-id');
  const reasonInput = document.getElementById('reject-reason-input');
  if (reqIdInput) reqIdInput.value = id;
  if (reasonInput) reasonInput.value = '';
  openModal('modalRejectRequest');
}

function confirmRejectRequest() {
  const id = document.getElementById('reject-request-id')?.value;
  const reason = document.getElementById('reject-reason-input')?.value.trim();

  const req = MockData.parkingRequests.find(r => r.id === id);
  if (!req) return;

  req.status = 'Rechazado';
  if (reason) req.notes += ` [Rechazado por Admin: ${reason}]`;

  // Log audit
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Rechazo de Registro de Estacionamiento: ${req.parkingName} (${req.id})`,
    module: 'Solicitudes',
    ip: '189.201.42.10'
  });

  closeModal('modalRejectRequest');
  showToast(`La solicitud ${req.id} ha sido rechazada.`, 'warning');

  renderParkingRequests();
  renderAuditLogs();
}

// Bind search and filter inputs for solicitudes
document.getElementById('search-requests-input')?.addEventListener('input', renderParkingRequests);
document.getElementById('filter-request-status')?.addEventListener('change', renderParkingRequests);

function openObserveRequestModal(id) {
  const inputId = document.getElementById('observe-request-id');
  const inputReason = document.getElementById('observe-reason-input');
  if (inputId) inputId.value = id;
  if (inputReason) inputReason.value = '';
  openModal('modalObserveRequest');
}

function confirmObserveRequest() {
  const id = document.getElementById('observe-request-id')?.value;
  const reason = document.getElementById('observe-reason-input')?.value.trim();

  const req = MockData.parkingRequests.find(r => r.id === id);
  if (!req) return;

  req.status = 'Observado';
  if (reason) req.notes += ` [Observación del Admin: ${reason}]`;

  // Log in Audit
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Solicitud de parqueo ${req.id} marcada como OBSERVADA: ${reason || 'Corrección de documentos'}`,
    module: 'Solicitudes',
    ip: '189.201.42.10'
  });

  closeModal('modalObserveRequest');
  showToast(`La solicitud ${req.id} ha sido marcada como OBSERVADA.`, 'warning');

  renderParkingRequests();
  renderAuditLogs();
}

function saveDriverFee() {
  const val = parseFloat(document.getElementById('driver-fee-input')?.value || '2.50');
  MockData.stats.driverServiceFee = val;
  MockData.platformConfig.driverServiceFee = val;

  // Log audit
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Actualización de Tarifa de Servicio al Conductor a: Bs. ${val.toFixed(2)}`,
    module: 'Comisiones',
    ip: '189.201.42.10'
  });

  showToast(`Tarifa de servicio al conductor actualizada a: Bs. ${val.toFixed(2)} por reserva.`, 'success');
  renderAnalytics();
  renderAuditLogs();
}

function saveSystemConfig() {
  const name = document.getElementById('cfg-platform-name')?.value;
  const currency = document.getElementById('cfg-currency')?.value;
  const sla = document.getElementById('cfg-sla')?.value;
  const maint = document.getElementById('cfg-maintenance')?.value === 'true';

  MockData.platformConfig.platformName = name;
  MockData.platformConfig.currencyCode = currency;
  MockData.platformConfig.guaranteedSla = sla;
  MockData.platformConfig.maintenanceMode = maint;

  // Log audit
  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Actualización de Configuración General del Sistema`,
    module: 'Configuración Sistema',
    ip: '189.201.42.10'
  });

  showToast(`Configuración del sistema guardada exitosamente.`, 'success');
  renderAuditLogs();
}

/* ==========================================================================
   11. CALIFICACIONES, DENUNCIAS Y REPORTES DE PARQUEOS
   ========================================================================== */
function renderDenuncias() {
  const tbody = document.getElementById('denuncias-table-body');
  if (!tbody) return;

  const searchVal = document.getElementById('search-denuncias-input')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('filter-denuncia-status')?.value || 'todos';

  const incidents = MockData.incidents || [];

  // Update KPIs
  const pendingCount = incidents.filter(i => i.status === 'Pendiente' || i.status === 'En Investigación').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resuelto').length;
  const sanctionedCount = incidents.filter(i => i.status === 'Sancionado').length;

  const badgeEl = document.getElementById('pending-denuncias-count');
  if (badgeEl) {
    badgeEl.textContent = pendingCount;
    badgeEl.style.display = pendingCount > 0 ? 'inline-block' : 'none';
  }

  if (document.getElementById('den-kpi-total')) document.getElementById('den-kpi-total').textContent = incidents.length;
  if (document.getElementById('den-kpi-pending')) document.getElementById('den-kpi-pending').textContent = pendingCount;
  if (document.getElementById('den-kpi-resolved')) document.getElementById('den-kpi-resolved').textContent = resolvedCount;
  if (document.getElementById('den-kpi-sanctioned')) document.getElementById('den-kpi-sanctioned').textContent = sanctionedCount;

  const filtered = incidents.filter(i => {
    const matchesSearch = !searchVal ||
      i.id.toLowerCase().includes(searchVal) ||
      i.parkingName.toLowerCase().includes(searchVal) ||
      i.complainantName.toLowerCase().includes(searchVal) ||
      i.category.toLowerCase().includes(searchVal);

    const matchesStatus = statusFilter === 'todos' || i.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:2.5rem; color:var(--text-muted);">
          <i class="fa-solid fa-shield-cat" style="font-size:2rem; margin-bottom:0.5rem; opacity:0.5; display:block;"></i>
          No hay reportes o denuncias que coincidan con la búsqueda.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(i => {
    let sevBadge = '<span class="badge badge-blue">Baja</span>';
    if (i.severity === 'Media') sevBadge = '<span class="badge" style="background:rgba(217,119,6,0.15); color:#D97706;">Media</span>';
    if (i.severity === 'Alta') sevBadge = '<span class="badge badge-suspended">Alta</span>';

    let statusBadge = '<span class="badge badge-pending">Pendiente</span>';
    if (i.status === 'En Investigación') statusBadge = '<span class="badge" style="background:rgba(37,99,235,0.15); color:#2563EB;"><i class="fa-solid fa-magnifying-glass"></i> En Investigación</span>';
    if (i.status === 'Resuelto') statusBadge = '<span class="badge badge-active"><i class="fa-solid fa-circle-check"></i> Resuelto</span>';
    if (i.status === 'Sancionado') statusBadge = '<span class="badge badge-suspended"><i class="fa-solid fa-gavel"></i> Sancionado</span>';

    return `
      <tr>
        <td><strong style="font-family:monospace; color:var(--primary-color);">${i.id}</strong></td>
        <td><strong>${i.parkingName}</strong></td>
        <td>
          <div style="font-weight:500;">${i.complainantName}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${i.complainantRole}</div>
        </td>
        <td><span class="badge badge-blue">${i.category}</span></td>
        <td>${sevBadge}</td>
        <td><span style="font-size:0.8rem; color:var(--text-muted);">${i.date}</span></td>
        <td>${statusBadge}</td>
        <td style="text-align:right;">
          <div style="display:inline-flex; gap:0.35rem; justify-content:flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="viewDenunciaDetail('${i.id}')" title="Ver Expediente de Denuncia">
              <i class="fa-solid fa-eye"></i> Detalle
            </button>
            ${i.status !== 'Resuelto' && i.status !== 'Sancionado' ? `
              <button class="btn btn-primary btn-sm" onclick="resolveDenuncia('${i.id}')" title="Marcar como Resuelto">
                <i class="fa-solid fa-check"></i> Resolver
              </button>
              <button class="btn btn-secondary btn-sm" style="color:var(--accent-rose); border-color:var(--accent-rose);" onclick="sanctionParkingFromDenuncia('${i.id}')" title="Sancionar / Suspender Parqueo">
                <i class="fa-solid fa-gavel"></i>
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function viewDenunciaDetail(id) {
  const inc = MockData.incidents.find(i => i.id === id);
  if (!inc) return;

  const body = document.getElementById('denunciaDetailBody');
  const footer = document.getElementById('denunciaDetailFooter');
  if (!body) return;

  body.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-subtle); padding-bottom:0.75rem; margin-bottom:1rem;">
      <div>
        <span style="font-family:monospace; font-size:0.8rem; color:var(--text-muted);">EXPEDIENTE DE RECLAMO ${inc.id}</span>
        <h3 style="font-size:1.15rem; margin:0.1rem 0;">${inc.category}</h3>
      </div>
      <div><span class="badge badge-suspended">${inc.severity} Severidad</span></div>
    </div>

    <div style="background:var(--card-bg); border:1px solid var(--border-subtle); padding:0.85rem; border-radius:6px; margin-bottom:1rem;">
      <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Parqueo Reportado:</strong> ${inc.parkingName}</div>
      <div style="font-size:0.85rem; margin-bottom:0.25rem;"><strong>Denunciante:</strong> ${inc.complainantName} (${inc.complainantRole})</div>
      <div style="font-size:0.85rem;"><strong>Fecha de Registro:</strong> ${inc.date}</div>
    </div>

    <div style="background:rgba(225,29,72,0.04); border-left:3px solid var(--accent-rose); padding:0.85rem; border-radius:0 6px 6px 0; margin-bottom:1rem;">
      <div style="font-weight:700; font-size:0.8rem; color:var(--accent-rose); margin-bottom:0.25rem;">Descripción del Incidente por el Conductor:</div>
      <div style="font-size:0.85rem; color:var(--text-dark);">${inc.description}</div>
    </div>

    <div style="background:var(--card-bg); border:1px solid var(--border-subtle); padding:0.85rem; border-radius:6px;">
      <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; margin-bottom:0.25rem;">Notas de Auditoría Administrativa</div>
      <div style="font-size:0.82rem; color:var(--text-dark);">${inc.notes}</div>
    </div>
  `;

  if (footer) {
    footer.innerHTML = `
      <button type="button" class="btn btn-secondary" onclick="closeModal('modalDenunciaDetail')">Cerrar</button>
      ${inc.status !== 'Resuelto' && inc.status !== 'Sancionado' ? `
        <button type="button" class="btn btn-secondary" style="color:var(--accent-rose); border-color:var(--accent-rose);" onclick="closeModal('modalDenunciaDetail'); sanctionParkingFromDenuncia('${inc.id}')">
          <i class="fa-solid fa-gavel"></i> Sancionar y Suspender Parqueo
        </button>
        <button type="button" class="btn btn-primary" onclick="closeModal('modalDenunciaDetail'); resolveDenuncia('${inc.id}')">
          <i class="fa-solid fa-check"></i> Marcar como Resuelto
        </button>
      ` : ''}
    `;
  }

  openModal('modalDenunciaDetail');
}

function resolveDenuncia(id) {
  const inc = MockData.incidents.find(i => i.id === id);
  if (!inc) return;

  inc.status = 'Resuelto';
  inc.notes += ' [Resuelto y conciliado por Admin General]';

  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `Denuncia ${inc.id} resuelta para parqueo '${inc.parkingName}'`,
    module: 'Denuncias',
    ip: '189.201.42.10'
  });

  showToast(`La denuncia ${inc.id} ha sido marcada como RESUELTA.`, 'success');
  renderDenuncias();
  renderAuditLogs();
}

function sanctionParkingFromDenuncia(id) {
  const inc = MockData.incidents.find(i => i.id === id);
  if (!inc) return;

  inc.status = 'Sancionado';

  // Find parking and suspend it
  const parking = MockData.parkings.find(p => p.id === inc.parkingId || p.name === inc.parkingName);
  if (parking) {
    parking.status = 'Suspendido';
  }

  MockData.auditLogs.unshift({
    id: `LOG-${Math.floor(Math.random()*900 + 100)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: 'Admin General (Tú)',
    role: 'SuperAdmin',
    action: `SANCIÓN APLICADA: Parqueo '${inc.parkingName}' suspendido por denuncia grave ${inc.id}`,
    module: 'Denuncias',
    ip: '189.201.42.10'
  });

  showToast(`Sanción aplicada: El parqueo '${inc.parkingName}' ha sido suspendido de la plataforma.`, 'warning');
  renderDenuncias();
  renderParkings();
  renderAuditLogs();
}

// Bind search and filter inputs for denuncias
document.getElementById('search-denuncias-input')?.addEventListener('input', renderDenuncias);
document.getElementById('filter-denuncia-status')?.addEventListener('change', renderDenuncias);


