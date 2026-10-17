// src/modules/settings/domain/Settings.ts

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';

export interface UserUiSettings {
    theme: ThemeMode;
    fontSize: FontSizeScale;
}

export interface SettingsState extends UserUiSettings {
    isSettingsOpen: boolean;
    setTheme: (theme: ThemeMode) => void;
    setFontSize: (size: FontSizeScale) => void;
    openSettings: () => void;
    closeSettings: () => void;
    toggleSettings: () => void;
}
