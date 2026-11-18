import { useEffect } from 'react';

export function useRoleTabs() {
    useEffect(() => {
        let currentRoleIndex = 0;
        const roleKeys = ['conductor', 'comercial', 'anfitrion'] as const;
        let interval: ReturnType<typeof setInterval> | null = null;
        let isVisible = false;

        const setRoleCarousel = (index: number) => {
            currentRoleIndex = index;
            const role = roleKeys[index];
            if (!role) return;

            const tabs = document.querySelectorAll('.role-tab');
            const dots = document.querySelectorAll('.role-dot');
            const panels = document.querySelectorAll('.role-panel');

            tabs.forEach((t, idx) => {
                if (idx === index) t.classList.add('active');
                else t.classList.remove('active');
            });

            dots.forEach((d, idx) => {
                if (idx === index) d.classList.add('active');
                else d.classList.remove('active');
            });

            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${role}`);
            if (targetPanel) targetPanel.classList.add('active');
        };

        const stopInterval = () => {
            if (interval !== null) {
                clearInterval(interval);
                interval = null;
            }
        };

        const startInterval = () => {
            stopInterval();
            if (!isVisible) return;
            interval = setInterval(() => {
                currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
                setRoleCarousel(currentRoleIndex);
            }, 5000);
        };

        const handleTabClick = (idx: number) => {
            stopInterval();
            setRoleCarousel(idx);
            startInterval();
        };

        const tabs = Array.from(document.querySelectorAll('.role-tab'));
        const tabListeners = tabs.map((tab, idx) => {
            const listener = () => handleTabClick(idx);
            tab.addEventListener('click', listener);
            return { el: tab, listener };
        });

        const dots = Array.from(document.querySelectorAll('.role-dot'));
        const dotListeners = dots.map((dot, idx) => {
            const listener = () => handleTabClick(idx);
            dot.addEventListener('click', listener);
            return { el: dot, listener };
        });

        const prevBtn = document.getElementById('role-prev-btn');
        const nextBtn = document.getElementById('role-next-btn');

        const handlePrev = () => {
            stopInterval();
            currentRoleIndex = (currentRoleIndex - 1 + roleKeys.length) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        const handleNext = () => {
            stopInterval();
            currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        if (prevBtn) prevBtn.addEventListener('click', handlePrev);
        if (nextBtn) nextBtn.addEventListener('click', handleNext);

        const rolesSection = document.getElementById('roles');
        let observer: IntersectionObserver | null = null;

        if (rolesSection) {
            observer = new IntersectionObserver(
                (entries: IntersectionObserverEntry[]) => {
                    const entry = entries[0];
                    if (!entry) return;
                    isVisible = entry.isIntersecting;
                    if (isVisible) {
                        startInterval();
                    } else {
                        stopInterval();
                    }
                },
                { threshold: 0.2 }
            );
            observer.observe(rolesSection);
        }

        return () => {
            stopInterval();
            if (observer) observer.disconnect();
            tabListeners.forEach(({ el, listener }) => el.removeEventListener('click', listener));
            dotListeners.forEach(({ el, listener }) => el.removeEventListener('click', listener));
            if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
            if (nextBtn) nextBtn.removeEventListener('click', handleNext);
        };
    }, []);
}
