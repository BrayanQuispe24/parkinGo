/* ==========================================
   ParkinGo - Auth Module Logic (Login & Registration)
   Interactive Prototype Implementation
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAuthTabs();
    initUrlMode();
    initPasswordToggles();
    initPasswordStrengthMeter();
    initFormSubmissions();
});

/**
 * Initialize tab switching between Login and Register
 */
function initAuthTabs() {
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAuthTab(targetTab);
        });
    });
}

/**
 * Switch active tab programmatically
 * @param {string} tabName - 'login' or 'register'
 */
function switchAuthTab(tabName) {
    const tabBtns = document.querySelectorAll('.auth-tab-btn');
    const formPanels = document.querySelectorAll('.auth-form-panel');
    const cardTitle = document.getElementById('auth-card-title');
    const cardSubtitle = document.getElementById('auth-card-subtitle');

    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    formPanels.forEach(panel => {
        if (panel.id === `panel-${tabName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Clear feedback toasts
    hideToast('login-toast');
    hideToast('register-toast');

    // Update Header Text depending on tab
    if (tabName === 'register') {
        if (cardTitle) cardTitle.textContent = 'Crear una Cuenta';
        if (cardSubtitle) cardSubtitle.textContent = 'Únete a ParkinGo y gestiona o reserva parqueos en Bolivia';
    } else {
        if (cardTitle) cardTitle.textContent = '¡Bienvenido de Nuevo!';
        if (cardSubtitle) cardSubtitle.textContent = 'Ingresa tus credenciales para acceder a tu panel';
    }
}

/**
 * Read URL query param ?mode=login or ?mode=register
 */
function initUrlMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'register' || mode === 'registro') {
        switchAuthTab('register');
    } else if (mode === 'login' || mode === 'ingresar') {
        switchAuthTab('login');
    }
}

/**
 * Enable Password Show/Hide buttons
 */
function initPasswordToggles() {
    const toggleBtns = document.querySelectorAll('.btn-toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Dynamic Password Strength Meter for Registration
 */
function initPasswordStrengthMeter() {
    const passInput = document.getElementById('reg-password');
    const strengthFill = document.getElementById('password-strength-fill');
    const strengthLabel = document.getElementById('password-strength-label');

    if (!passInput || !strengthFill) return;

    passInput.addEventListener('input', () => {
        const val = passInput.value;
        if (!val) {
            strengthFill.style.width = '0%';
            strengthFill.style.backgroundColor = '#EF4444';
            if (strengthLabel) strengthLabel.textContent = 'Fuerza de la contraseña';
            return;
        }

        let score = 0;
        if (val.length >= 6) score += 25;
        if (val.length >= 10) score += 25;
        if (/[A-Z]/.test(val)) score += 20;
        if (/[0-9]/.test(val)) score += 15;
        if (/[^A-Za-z0-9]/.test(val)) score += 15;

        strengthFill.style.width = score + '%';

        if (score < 40) {
            strengthFill.style.backgroundColor = '#EF4444'; // Red (Debil)
            if (strengthLabel) strengthLabel.textContent = 'Debil';
        } else if (score < 75) {
            strengthFill.style.backgroundColor = '#F59E0B'; // Orange (Media)
            if (strengthLabel) strengthLabel.textContent = 'Aceptable';
        } else {
            strengthFill.style.backgroundColor = '#22C55E'; // Green (Fuerte)
            if (strengthLabel) strengthLabel.textContent = 'Segura';
        }
    });
}

/**
 * Form Submit Handling & Mock Validation
 */
function initFormSubmissions() {
    // 1. Login Form Submit
    const loginForm = document.getElementById('form-login');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLoginSubmit();
        });
    }

    // 2. Register Form Submit
    const registerForm = document.getElementById('form-register');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegisterSubmit();
        });
    }
}

/**
 * Process Mock Login
 */
function handleLoginSubmit() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const submitBtn = document.getElementById('btn-login-submit');
    const toast = document.getElementById('login-toast');

    if (!email || !password) {
        showToast(toast, 'error', 'Por favor complete el correo electrónico y la contraseña.');
        return;
    }

    // Set Loading State
    setButtonLoading(submitBtn, true);

    setTimeout(() => {
        setButtonLoading(submitBtn, false);
        showToast(toast, 'success', '¡Inicio de sesión exitoso! Redirigiendo a tu panel...');

        // Save mock session
        const mockUser = {
            email: email,
            role: 'conductor',
            isLoggedIn: true
        };
        localStorage.setItem('parkingo_user', JSON.stringify(mockUser));

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1200);
    }, 1200);
}

/**
 * Process Mock Register
 */
function handleRegisterSubmit() {
    const fullname = document.getElementById('reg-fullname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const estado = document.getElementById('reg-estado').value;
    const birthdate = document.getElementById('reg-birthdate').value;
    const ciNumber = document.getElementById('reg-ci-number').value.trim();
    const ciExp = document.getElementById('reg-ci-exp').value;
    const submitBtn = document.getElementById('btn-register-submit');
    const toast = document.getElementById('register-toast');

    // Get selected Role radio
    const roleRadio = document.querySelector('input[name="reg_role"]:checked');
    const role = roleRadio ? roleRadio.value : '';

    // Get selected Sex radio
    const sexRadio = document.querySelector('input[name="reg_sexo"]:checked');
    const sexo = sexRadio ? sexRadio.value : '';

    // Validation
    if (!fullname) {
        showToast(toast, 'error', 'Por favor ingrese su Nombre Completo.');
        return;
    }
    if (!email) {
        showToast(toast, 'error', 'Por favor ingrese un Correo Electrónico válido.');
        return;
    }
    if (!password || password.length < 6) {
        showToast(toast, 'error', 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    if (!role) {
        showToast(toast, 'error', 'Por favor seleccione su Rol / Tipo de usuario.');
        return;
    }
    if (!sexo) {
        showToast(toast, 'error', 'Por favor seleccione su Sexo.');
        return;
    }
    if (!birthdate) {
        showToast(toast, 'error', 'Por favor ingrese su Fecha de Nacimiento.');
        return;
    }
    if (!ciNumber) {
        showToast(toast, 'error', 'Por favor ingrese su Carnet de Identidad (C.I.).');
        return;
    }

    // Set Loading State
    setButtonLoading(submitBtn, true);

    setTimeout(() => {
        setButtonLoading(submitBtn, false);
        showToast(toast, 'success', `¡Cuenta de ${getRoleName(role)} registrada con éxito! Iniciando sesión...`);

        // Save Registered User Data
        const newUser = {
            fullname: fullname,
            email: email,
            role: role,
            estado: estado,
            sexo: sexo,
            birthdate: birthdate,
            ci: `${ciNumber} ${ciExp}`,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('parkingo_user', JSON.stringify(newUser));

        setTimeout(() => {
            if (role === 'anfitrion' || role === 'operador') {
                window.location.href = 'parking-admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1400);
    }, 1400);
}

function getRoleName(roleKey) {
    switch (roleKey) {
        case 'conductor': return 'Conductor';
        case 'anfitrion': return 'Anfitrión de Parqueo';
        case 'operador': return 'Operador de Garaje';
        case 'admin': return 'Administrador';
        default: return 'Usuario';
    }
}

function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function showToast(toastEl, type, message) {
    if (!toastEl) return;
    toastEl.className = `auth-feedback-toast ${type}`;
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation';
    toastEl.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>${message}</span>`;
    toastEl.style.display = 'flex';
}

function hideToast(toastId) {
    const toastEl = document.getElementById(toastId);
    if (toastEl) {
        toastEl.style.display = 'none';
    }
}
