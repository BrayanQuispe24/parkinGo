// src/store/useSettingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState, ThemeMode, FontSizeScale } from '../modules/settings/domain/Settings';

export const applyGlobalSettingsToDOM = (theme: ThemeMode, fontSize: FontSizeScale): void => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-font-size', fontSize);

    let isDark = false;
    if (theme === 'system') {
        isDark = Boolean(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } else {
        isDark = theme === 'dark';
    }

    const resolvedTheme = isDark ? 'dark' : 'light';
    root.setAttribute('data-theme', resolvedTheme);
    if (isDark) {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
};

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            fontSize: 'md',
            isSettingsOpen: false,

            setTheme: (theme: ThemeMode) => {
                set({ theme });
                applyGlobalSettingsToDOM(theme, get().fontSize);
            },
            setFontSize: (fontSize: FontSizeScale) => {
                set({ fontSize });
                applyGlobalSettingsToDOM(get().theme, fontSize);
            },
            openSettings: () => set({ isSettingsOpen: true }),
            closeSettings: () => set({ isSettingsOpen: false }),
            toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
        }),
        {
            name: 'parkingo_settings',
            partialize: (state) => ({
                theme: state.theme,
                fontSize: state.fontSize,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    applyGlobalSettingsToDOM(state.theme, state.fontSize);
                }
            },
        }
    )
);
