// src/modules/settings/presentation/components/SettingsModal.tsx
import React, { useEffect } from 'react';
import { useSettingsStore } from '../../../../store/useSettingsStore';
import { ThemeSelector } from './ThemeSelector';
import { FontSizeSelector } from './FontSizeSelector';

export const SettingsModal: React.FC = () => {
    const {
        isSettingsOpen,
        theme,
        fontSize,
        setTheme,
        setFontSize,
        closeSettings,
    } = useSettingsStore();

    // Cerrar con tecla Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSettingsOpen) {
                closeSettings();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSettingsOpen, closeSettings]);

    if (!isSettingsOpen) {
        return null;
    }

    return (
        <div
            className="settings-overlay"
            onClick={closeSettings}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-modal-title"
        >
            <div
                className="settings-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <header className="settings-header">
                    <div className="settings-header-info">
                        <div className="settings-header-icon">
                            <i className="fa-solid fa-sliders"></i>
                        </div>
                        <div>
                            <h2 id="settings-modal-title" className="settings-title">
                                Configuración de Interfaz
                            </h2>
                            <p className="settings-subtitle">
                                Personaliza la apariencia visual y tamaño de tipografía
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="settings-close-btn"
                        onClick={closeSettings}
                        aria-label="Cerrar ventana de configuración"
                        title="Cerrar (Esc)"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </header>

                {/* Body */}
                <div className="settings-body">
                    {/* Sección 1: Selector de Tema */}
                    <section className="settings-section">
                        <div className="settings-section-header">
                            <span className="settings-section-title">
                                <i className="fa-solid fa-palette" style={{ color: '#006D36' }}></i>
                                Tema de la Plataforma
                            </span>
                            <span className="settings-section-badge">
                                {theme === 'light' ? 'Claro Activo' : theme === 'dark' ? 'Oscuro Activo' : 'Sincronizado'}
                            </span>
                        </div>
                        <ThemeSelector value={theme} onChange={setTheme} />
                    </section>

                    {/* Sección 2: Selector de Tamaño de Fuente */}
                    <section className="settings-section">
                        <div className="settings-section-header">
                            <span className="settings-section-title">
                                <i className="fa-solid fa-text-height" style={{ color: '#006D36' }}></i>
                                Tamaño de Tipografía
                            </span>
                            <span className="settings-section-badge">
                                {fontSize.toUpperCase()}
                            </span>
                        </div>
                        <FontSizeSelector value={fontSize} onChange={setFontSize} />
                    </section>

                    {/* Sección 3: Previsualización en Vivo */}
                    <section className="settings-section">
                        <div className="settings-preview-card">
                            <span className="settings-preview-tag">
                                <i className="fa-solid fa-eye" style={{ marginRight: '0.35rem' }}></i>
                                Previsualización en Tiempo Real
                            </span>
                            <h4 className="settings-preview-title">
                                Parqueo Central Equipetrol
                            </h4>
                            <p className="settings-preview-text">
                                El texto, tablas y botones del sistema escalan inmediatamente manteniendo una nitidez óptima.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="settings-footer">
                    <div className="settings-footer-note">
                        <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#006D36' }}></i>
                        <span>Guardado automático en tu navegador</span>
                    </div>
                    <button
                        type="button"
                        className="settings-done-btn"
                        onClick={closeSettings}
                    >
                        Listo
                    </button>
                </footer>
            </div>
        </div>
    );
};
