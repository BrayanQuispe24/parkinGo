/* ==========================================
   ParkinGo - Host Revenue Calculator Logic
   Dynamic Pricing & Commission Calculations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initEarningsCalculator();
});

function initEarningsCalculator() {
    const rangeSpaces = document.getElementById('range-spaces');
    const rangeHours = document.getElementById('range-hours');
    const rangeRate = document.getElementById('range-rate');
    const checkEvent = document.getElementById('check-event-bonus');

    const valSpaces = document.getElementById('val-spaces');
    const valHours = document.getElementById('val-hours');
    const valRate = document.getElementById('val-rate');

    const netMonthlyEl = document.getElementById('calc-net-monthly');
    const grossMonthlyEl = document.getElementById('calc-gross-monthly');
    const commissionEl = document.getElementById('calc-commission');
    const annualEl = document.getElementById('calc-annual');
    const applyBtn = document.getElementById('btn-calc-apply');

    if (!rangeSpaces || !rangeHours || !rangeRate) return;

    function calculate() {
        const spaces = parseInt(rangeSpaces.value);
        const hours = parseInt(rangeHours.value);
        const rate = parseInt(rangeRate.value);
        const hasEventBonus = checkEvent.checked;

        // Label UI Updates
        valSpaces.textContent = `${spaces} ${spaces === 1 ? 'espacio' : 'espacios'}`;
        valHours.textContent = `${hours} hrs/día`;
        valRate.textContent = `Bs. ${rate} / hr`;

        // Financial Computations
        const eventMultiplier = hasEventBonus ? 1.30 : 1.0;
        const dailyGross = spaces * hours * rate * eventMultiplier;
        const monthlyGross = Math.round(dailyGross * 30);
        
        // 20% ParkinGo Commission
        const commission = Math.round(monthlyGross * 0.20);
        const netMonthly = monthlyGross - commission;
        const annualNet = netMonthly * 12;

        // Render formatted outputs with thousand separators
        netMonthlyEl.textContent = formatNumber(netMonthly);
        grossMonthlyEl.textContent = `Bs. ${formatNumber(monthlyGross)}`;
        commissionEl.textContent = `Bs. ${formatNumber(commission)}`;
        annualEl.textContent = `Bs. ${formatNumber(annualNet)}`;
    }

    // Attach Listeners
    [rangeSpaces, rangeHours, rangeRate, checkEvent].forEach(input => {
        input.addEventListener('input', calculate);
        input.addEventListener('change', calculate);
    });

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            if (window.openRegistrationModal) {
                window.openRegistrationModal();
            }
        });
    }

    // Initial Trigger
    calculate();
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
