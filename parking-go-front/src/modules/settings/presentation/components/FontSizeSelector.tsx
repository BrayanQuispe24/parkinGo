// src/modules/settings/presentation/components/FontSizeSelector.tsx
import React from 'react';
import type { FontSizeScale } from '../../domain/Settings';

interface FontSizeSelectorProps {
    value: FontSizeScale;
    onChange: (size: FontSizeScale) => void;
}

interface FontSizeOption {
    id: FontSizeScale;
    label: string;
    sizePx: string;
    displayIconSize: string;
}

const FONT_OPTIONS: readonly FontSizeOption[] = [
    { id: 'sm', label: 'Pequeño', sizePx: '14px', displayIconSize: '0.85rem' },
    { id: 'md', label: 'Normal', sizePx: '16px', displayIconSize: '1rem' },
    { id: 'lg', label: 'Grande', sizePx: '18px', displayIconSize: '1.2rem' },
    { id: 'xl', label: 'Extra', sizePx: '20px', displayIconSize: '1.4rem' },
];

export const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="font-size-options-grid" role="radiogroup" aria-label="Seleccionar escala de tipografía">
            {FONT_OPTIONS.map((opt) => {
                const isSelected = value === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`font-size-option-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => onChange(opt.id)}
                    >
                        <span className="font-size-icon-display" style={{ fontSize: opt.displayIconSize }}>
                            Aa
                        </span>
                        <span className="font-size-label">{opt.label}</span>
                        <span className="font-size-scale-px">{opt.sizePx}</span>
                    </button>
                );
            })}
        </div>
    );
};
