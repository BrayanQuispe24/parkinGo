/* ==========================================
   ParkinGo - Main Application JavaScript
   Header Scroll, Tab Switching, Dark Mode & General Controls
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initThemeToggle();
    initMobileMenu();
    initRoleTabs();
    initQuickChips();
    initScrollReveal();
    initUserMenuPopover();
    initCarAssistant();
});

function initUserMenuPopover() {
    const trigger = document.getElementById('user-menu-trigger');
    const popover = document.getElementById('user-menu-popover');
    if (!trigger || !popover) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        popover.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && !trigger.contains(e.target)) {
            popover.classList.remove('show');
        }
    });
}

// Scroll Reveal Observer (Fade In & Left/Right Entrance on Scroll)
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
    if (!revealElements.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}


// Sticky Header & Active Nav with Top Scroll Fade Effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    const fadeOverlay = document.getElementById('top-scroll-fade');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 25) {
            header.classList.add('scrolled');
            document.body.classList.add('is-scrolled');
            if (fadeOverlay) fadeOverlay.classList.add('active');
        } else {
            header.classList.remove('scrolled');
            document.body.classList.remove('is-scrolled');
            if (fadeOverlay) fadeOverlay.classList.remove('active');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

// Light / Dark Theme Toggle Support
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;

    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('parkingo_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeBtn, savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('parkingo_theme', newTheme);
        updateThemeIcon(themeBtn, newTheme);
    });
}

function updateThemeIcon(btn, theme) {
    const icon = btn.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            btn.title = 'Cambiar a Modo Claro';
        } else {
            icon.className = 'fa-solid fa-moon';
            btn.title = 'Cambiar a Modo Oscuro';
        }
    }
}

// Mobile Hamburger Menu Toggle
function initMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                if (toggleBtn.querySelector('i')) {
                    toggleBtn.querySelector('i').className = 'fa-solid fa-bars';
                }
            });
        });
    }
}

// Role Tabs Switcher
function initRoleTabs() {
    const tabs = document.querySelectorAll('.role-tab');
    const panels = document.querySelectorAll('.role-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const role = tab.getAttribute('data-role');

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(`panel-${role}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// Quick Search Chips in Hero Section
function initQuickChips() {
    const chips = document.querySelectorAll('.quick-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const mapSection = document.getElementById('mapa-envivo');
            if (mapSection) {
                mapSection.scrollIntoView({ behavior: 'smooth' });
            }

            const zoneText = chip.textContent.trim().toLowerCase();
            const zoneSelect = document.getElementById('select-zone');
            if (zoneSelect) {
                if (zoneText.includes('equipetrol')) zoneSelect.value = 'equipetrol';
                else if (zoneText.includes('uagrm')) zoneSelect.value = 'uagrm';
                else if (zoneText.includes('centro')) zoneSelect.value = 'centro';
                else if (zoneText.includes('estadio')) zoneSelect.value = 'estadio';

                zoneSelect.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Category Slider Carousel Function
window.scrollCategorySlider = function (direction) {
    const slider = document.getElementById('category-slider');
    if (!slider) return;
    const scrollAmount = 260 * direction;
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
};

// Roles Component Showcase Carousel Functions
let currentRoleIndex = 0;
const roleKeys = ['conductor', 'comercial', 'anfitrion'];

window.navigateRoleCarousel = function (direction) {
    currentRoleIndex = (currentRoleIndex + direction + roleKeys.length) % roleKeys.length;
    window.setRoleCarousel(currentRoleIndex);
};

window.setRoleCarousel = function (index) {
    currentRoleIndex = index;
    const role = roleKeys[index];
    if (!role) return;

    const tabs = document.querySelectorAll('.role-tab');
    const panels = document.querySelectorAll('.role-panel');
    const dots = document.querySelectorAll('.role-dot');

    tabs.forEach((t, idx) => {
        if (idx === index) t.classList.add('active');
        else t.classList.remove('active');
    });

    panels.forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(`panel-${role}`);
    if (targetPanel) targetPanel.classList.add('active');

    dots.forEach((d, idx) => {
        if (idx === index) d.classList.add('active');
        else d.classList.remove('active');
    });
};

// Pricing Plans Component Carousel Function
window.scrollPlansCarousel = function (direction) {
    const container = document.getElementById('pricing-grid');
    if (!container) return;
    const scrollAmount = 340 * direction;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
};

// Animated Parking Car Assistant Controller
function initCarAssistant() {
    const carAssistant = document.getElementById('parking-car-assistant');
    if (!carAssistant) return;

    // Respetar preferencia de reducción de movimiento de accesibilidad
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        carAssistant.classList.add('is-stopped');
        return;
    }

    function runCarCycle() {
        // 1. Limpiar estados anteriores e iniciar avance
        carAssistant.classList.remove('is-stopped', 'is-reversing');
        carAssistant.classList.add('is-driving');

        // 2. Transición de avance finalizada (3.6s) -> Detenerse durante 3 segundos
        setTimeout(() => {
            carAssistant.classList.remove('is-driving');
            carAssistant.classList.add('is-stopped');

            // 3. Tras 6 segundos detenido -> Retroceder y desaparecer
            setTimeout(() => {
                carAssistant.classList.remove('is-stopped');
                carAssistant.classList.add('is-reversing');

                // 4. Salida finalizada -> Limpiar estado para quedar oculto fuera de pantalla
                setTimeout(() => {
                    carAssistant.classList.remove('is-reversing');
                }, 3100);
            }, 6000);
        }, 3600);
    }

    // Ejecutar el primer ciclo tras 1.5s de carga
    setTimeout(() => {
        runCarCycle();
        // Repetir el ciclo completo cada 60 segundos (1 minuto)
        setInterval(runCarCycle, 60000);
    }, 1500);
}

