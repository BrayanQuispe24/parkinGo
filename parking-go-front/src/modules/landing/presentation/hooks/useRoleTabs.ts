import { useEffect } from 'react';

export function useRoleTabs() {
    useEffect(() => {
        let currentRoleIndex = 0;
        const roleKeys = ['conductor', 'comercial', 'anfitrion'];
        let interval: ReturnType<typeof setInterval>;

        const setRoleCarousel = (index: number) => {
            currentRoleIndex = index;
            const role = roleKeys[index];
            if (!role) return;

            const tabs = document.querySelectorAll('.role-tab');
            const panels = document.querySelectorAll('.role-panel');

            tabs.forEach((t, idx) => {
                if (idx === index) t.classList.add('active');
                else t.classList.remove('active');
            });

            panels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById(`panel-${role}`);
            if (targetPanel) targetPanel.classList.add('active');
        };

        const startInterval = () => {
            interval = setInterval(() => {
                currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
                setRoleCarousel(currentRoleIndex);
            }, 5000);
        };

        startInterval();

        const handleTabClick = (idx: number) => {
            clearInterval(interval);
            setRoleCarousel(idx);
            startInterval();
        };

        const tabs = document.querySelectorAll('.role-tab');
        tabs.forEach((tab, idx) => {
            const listener = () => handleTabClick(idx);
            tab.addEventListener('click', listener);
        });

        const prevBtn = document.getElementById('role-prev-btn');
        const nextBtn = document.getElementById('role-next-btn');

        const handlePrev = () => {
            clearInterval(interval);
            currentRoleIndex = (currentRoleIndex - 1 + roleKeys.length) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        const handleNext = () => {
            clearInterval(interval);
            currentRoleIndex = (currentRoleIndex + 1) % roleKeys.length;
            setRoleCarousel(currentRoleIndex);
            startInterval();
        };

        if (prevBtn) prevBtn.addEventListener('click', handlePrev);
        if (nextBtn) nextBtn.addEventListener('click', handleNext);

        return () => {
            clearInterval(interval);
            if (prevBtn) prevBtn.removeEventListener('click', handlePrev);
            if (nextBtn) nextBtn.removeEventListener('click', handleNext);
        };
    }, []);
}
