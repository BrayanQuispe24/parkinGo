// src/modules/settings/presentation/components/ThemeSelector.tsx
import React from 'react';
import type { ThemeMode } from '../../domain/Settings';

interface ThemeSelectorProps {
    value: ThemeMode;
    onChange: (mode: ThemeMode) => void;
}

interface ThemeOption {
    id: ThemeMode;
    title: string;
    description: string;
    icon: string;
    previewClass: string;
}

const THEME_OPTIONS: readonly ThemeOption[] = [
    {
        id: 'light',
        title: 'Claro',
        description: 'Emerald Enterprise',
        icon: 'fa-regular fa-sun',
        previewClass: 'preview-light',
    },
    {
        id: 'dark',
        title: 'Oscuro',
        description: 'Dark Mode Tech',
        icon: 'fa-regular fa-moon',
        previewClass: 'preview-dark',
    },
    {
        id: 'system',
        title: 'Sistema',
        description: 'Automático S.O.',
        icon: 'fa-solid fa-circle-half-stroke',
        previewClass: 'preview-system',
    },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="theme-options-grid" role="radiogroup" aria-label="Seleccionar tema visual">
            {THEME_OPTIONS.map((opt) => {
                const isSelected = value === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`theme-card-option ${isSelected ? 'active' : ''}`}
                        onClick={() => onChange(opt.id)}
                    >
                        <div className={`theme-preview-box ${opt.previewClass}`}>
                            {opt.id === 'system' ? (
                                <div className="mock-icon">
                                    <i className={opt.icon}></i>
                                </div>
                            ) : (
                                <>
                                    <div className="mock-sidebar"></div>
                                    <div className="mock-topbar"></div>
                                </>
                            )}
                        </div>
                        <div className="theme-card-label">
                            <i className={opt.icon} style={{ fontSize: '0.85rem' }}></i>
                            <span>{opt.title}</span>
                            {isSelected && (
                                <i className="fa-solid fa-check" style={{ fontSize: '0.75rem', color: '#006D36' }}></i>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
