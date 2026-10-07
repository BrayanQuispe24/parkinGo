import { useState, useMemo } from 'react';

function formatNumber(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function Calculator() {
    const [spaces, setSpaces] = useState(2);
    const [hours, setHours] = useState(6);
    const [rate, setRate] = useState(6);
    const [hasEventBonus, setHasEventBonus] = useState(true);

    const { netMonthly, monthlyGross, commission, annualNet } = useMemo(() => {
        const eventMultiplier = hasEventBonus ? 1.30 : 1.0;
        const dailyGross = spaces * hours * rate * eventMultiplier;
        const gross = Math.round(dailyGross * 30);
        const comm = Math.round(gross * 0.20);
        const net = gross - comm;
        const annual = net * 12;

        return {
            netMonthly: net,
            monthlyGross: gross,
            commission: comm,
            annualNet: annual
        };
    }, [spaces, hours, rate, hasEventBonus]);

    return (
        <section className="section calculator-section" id="calculadora">
            <div className="container">
                <div className="section-header text-center reveal-up reveal-visible">
                    <span className="section-subtitle">ESTIMADOR DE INGRESOS</span>
                    <h2 className="section-title">Calcula cuánto puedes ganar alquilando tu espacio</h2>
                    <p className="section-description">
                        Ajusta la cantidad de espacios, las horas diarias de ocupación y tu tarifa por hora para conocer
                        tus proyecciones de ganancias en Bolivia.
                    </p>
                </div>

                <div className="calculator-card grid grid-2">
                    {/* Controles de Rango */}
                    <div className="calc-inputs">
                        <div className="calc-group">
                            <div className="calc-label-row">
                                <label htmlFor="range-spaces">
                                    <i className="fa-solid fa-car-tunnel"></i> Cantidad de Espacios / Garajes:
                                </label>
                                <span className="calc-val">{spaces} {spaces === 1 ? 'espacio' : 'espacios'}</span>
                            </div>
                            <input 
                                type="range" 
                                id="range-spaces" 
                                min="1" 
                                max="50" 
                                value={spaces} 
                                step="1" 
                                onChange={(e) => setSpaces(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="calc-group">
                            <div className="calc-label-row">
                                <label htmlFor="range-hours">
                                    <i className="fa-solid fa-clock"></i> Horas Promedio Ocupadas al Día:
                                </label>
                                <span className="calc-val">{hours} horas/día</span>
                            </div>
                            <input 
                                type="range" 
                                id="range-hours" 
                                min="1" 
                                max="14" 
                                value={hours} 
                                step="1" 
                                onChange={(e) => setHours(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="calc-group">
                            <div className="calc-label-row">
                                <label htmlFor="range-rate">
                                    <i className="fa-solid fa-money-bill-wave"></i> Tarifa por Hora (Bs.):
                                </label>
                                <span className="calc-val">Bs. {rate} / hr</span>
                            </div>
                            <input 
                                type="range" 
                                id="range-rate" 
                                min="3" 
                                max="20" 
                                value={rate} 
                                step="1" 
                                onChange={(e) => setRate(parseInt(e.target.value))}
                            />
                        </div>

                        <div className="calc-group">
                            <label className="checkbox-container">
                                <input 
                                    type="checkbox" 
                                    id="check-event-bonus" 
                                    checked={hasEventBonus} 
                                    onChange={(e) => setHasEventBonus(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                <span>Incluir bono de alta demanda / eventos masivos (+30% fin de semana)</span>
                            </label>
                        </div>
                    </div>

                    {/* Tarjeta de Resultado */}
                    <div className="calc-result-card surface-card reveal-right reveal-visible">
                        <span className="calc-result-title">Proyección de Ingreso Mensual Neto</span>
                        <div className="calc-amount-primary">
                            <span className="currency">Bs.</span>
                            <span>{formatNumber(netMonthly)}</span>
                        </div>
                        <p className="calc-sub-note">Neto para ti después de la comisión del 20% de ParkinGo</p>

                        <div className="calc-breakdown">
                            <div className="breakdown-item">
                                <span>Ingreso Bruto Mensual:</span>
                                <strong>Bs. {formatNumber(monthlyGross)}</strong>
                            </div>
                            <div className="breakdown-item">
                                <span>Comisión ParkinGo (20%):</span>
                                <strong>Bs. {formatNumber(commission)}</strong>
                            </div>
                            <div className="breakdown-item highlight">
                                <span>Ganancia Anual Estimada:</span>
                                <strong>Bs. {formatNumber(annualNet)}</strong>
                            </div>
                        </div>

                        <button className="btn btn-accent btn-block btn-calc-cta" onClick={() => console.log('Publicar mi garaje')}>
                            <i className="fa-solid fa-rocket"></i> Publicar Mi Garaje Gratis
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
