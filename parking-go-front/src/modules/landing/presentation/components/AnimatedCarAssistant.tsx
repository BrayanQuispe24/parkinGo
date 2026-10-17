import { useEffect, useState } from 'react';
import autoSinRuedasImg from '../../../../assets/autoSinRuedas.png';
import ruedaImg from '../../../../assets/rueda.png';

export function AnimatedCarAssistant() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const [carState, setCarState] = useState(prefersReducedMotion ? 'is-stopped' : '');

    useEffect(() => {
        let isMounted = true;
        
        if (prefersReducedMotion) {
            return;
        }

        let timeout1: ReturnType<typeof setTimeout>;
        let timeout2: ReturnType<typeof setTimeout>;
        let timeout3: ReturnType<typeof setTimeout>;

        const runCarCycle = () => {
            if (!isMounted) return;
            setCarState('is-driving');

            timeout1 = setTimeout(() => {
                if (!isMounted) return;
                setCarState('is-stopped');

                timeout2 = setTimeout(() => {
                    if (!isMounted) return;
                    setCarState('is-reversing');

                    timeout3 = setTimeout(() => {
                        if (!isMounted) return;
                        setCarState('');
                    }, 3100);
                }, 6000);
            }, 3600);
        };

        let intervalTimer: ReturnType<typeof setInterval>;
        const initialTimer = setTimeout(() => {
            if (!isMounted) return;
            runCarCycle();
            intervalTimer = setInterval(runCarCycle, 60000);
        }, 1500);

        return () => {
            isMounted = false;
            clearTimeout(initialTimer);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
            if (intervalTimer) clearInterval(intervalTimer);
        };
    }, []);

    return (
        <div className={`parking-car-assistant ${carState}`} id="parking-car-assistant">
            <div className="parking-car-bubble" id="parking-car-bubble">
                <span>¿Tienes alguna duda? 👋</span>
                <div className="bubble-arrow"></div>
            </div>

            <div className="parking-car-wrapper">
                <img src={autoSinRuedasImg} className="parking-car-body" alt="Auto ParkinGo" />
                <img src={ruedaImg} className="parking-wheel parking-wheel-front" alt="Rueda Delantera" />
                <img src={ruedaImg} className="parking-wheel parking-wheel-back" alt="Rueda Trasera" />
            </div>
        </div>
    );
}
