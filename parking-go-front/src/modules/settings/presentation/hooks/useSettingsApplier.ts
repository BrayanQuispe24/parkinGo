// src/modules/settings/presentation/hooks/useSettingsApplier.ts
import { useEffect } from 'react';
import { useSettingsStore, applyGlobalSettingsToDOM } from '../../../../store/useSettingsStore';

export const useSettingsApplier = (): void => {
    const theme = useSettingsStore((state) => state.theme);
    const fontSize = useSettingsStore((state) => state.fontSize);

    useEffect(() => {
        applyGlobalSettingsToDOM(theme, fontSize);

        if (theme === 'system' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyGlobalSettingsToDOM('system', fontSize);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, fontSize]);
};
