import React, { useState } from 'react';
import { PIXELS_PER_METER, pxToMeters, metersToPx } from '../../../domain/Croquis';

interface CroquisGridDimensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWidth: number;
  currentHeight: number;
  onApplyDimensions: (newWidth: number, newHeight: number) => void;
}

export const CroquisGridDimensionModal: React.FC<CroquisGridDimensionModalProps> = ({
  isOpen,
  onClose,
  currentWidth,
  currentHeight,
  onApplyDimensions,
}) => {
  const [widthMeters, setWidthMeters] = useState<number>(() => pxToMeters(currentWidth));
  const [heightMeters, setHeightMeters] = useState<number>(() => pxToMeters(currentHeight));

  if (!isOpen) return null;

  const handleWidthMetersChange = (val: number) => {
    setWidthMeters(Math.max(10, Math.min(200, val)));
  };

  const handleHeightMetersChange = (val: number) => {
    setHeightMeters(Math.max(10, Math.min(200, val)));
  };

  const handlePreset = (mWidth: number, mHeight: number) => {
    setWidthMeters(mWidth);
    setHeightMeters(mHeight);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWidthPx = metersToPx(widthMeters);
    const finalHeightPx = metersToPx(heightMeters);
    onApplyDimensions(finalWidthPx, finalHeightPx);
    onClose();
  };

  const currentPxW = metersToPx(widthMeters);
  const currentPxH = metersToPx(heightMeters);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10050,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F8FAFC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: '#ECFDF5',
                color: '#006D36',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
              }}
            >
              <i className="fa-solid fa-ruler-combined"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                Dimensiones del Lienzo / Grid
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
                Escala arquitectónica: 1 metro = {PIXELS_PER_METER} píxeles
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0.2rem',
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
          {/* Presets rápidos */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Plantillas de dimensiones sugeridas:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {[
                { label: 'Compacto', w: 25, h: 18, desc: '625 × 450 px' },
                { label: 'Mediano', w: 40, h: 25, desc: '1000 × 625 px' },
                { label: 'Estándar', w: 64, h: 40, desc: '1600 × 1000 px' },
                { label: 'Amplio', w: 80, h: 50, desc: '2000 × 1250 px' },
              ].map((p) => {
                const isSelected = widthMeters === p.w && heightMeters === p.h;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePreset(p.w, p.h)}
                    style={{
                      background: isSelected ? '#ECFDF5' : '#F8FAFC',
                      border: '1px solid ' + (isSelected ? '#006D36' : '#CBD5E1'),
                      borderRadius: '4px',
                      padding: '0.45rem 0.6rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: isSelected ? '#006D36' : '#1E293B' }}>
                      {p.label} ({p.w}m × {p.h}m)
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs numéricos de Ancho y Alto */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.2rem' }}>
            {/* Ancho */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Ancho del plano (X)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                <input
                  type="number"
                  min={12}
                  max={200}
                  step={1}
                  value={widthMeters}
                  onChange={(e) => handleWidthMetersChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.6rem',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                <span style={{ padding: '0 0.6rem', background: '#F1F5F9', color: '#475569', fontSize: '0.74rem', fontWeight: 700 }}>
                  m
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '0.2rem' }}>
                Equivale a {currentPxW} px
              </div>
            </div>

            {/* Alto */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Alto del plano (Y)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '4px', overflow: 'hidden' }}>
                <input
                  type="number"
                  min={10}
                  max={200}
                  step={1}
                  value={heightMeters}
                  onChange={(e) => handleHeightMetersChange(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.6rem',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none',
                  }}
                />
                <span style={{ padding: '0 0.6rem', background: '#F1F5F9', color: '#475569', fontSize: '0.74rem', fontWeight: 700 }}>
                  m
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '0.2rem' }}>
                Equivale a {currentPxH} px
              </div>
            </div>
          </div>

          {/* Resumen info box */}
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '4px',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              color: '#166534',
              fontSize: '0.74rem',
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>
              Área total: <strong>{(widthMeters * heightMeters).toFixed(0)} m²</strong> ({currentPxW} × {currentPxH} px). Los elementos existentes conservarán sus posiciones absolutas.
            </span>
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#FFFFFF',
                color: '#475569',
                border: '1px solid #CBD5E1',
                borderRadius: '4px',
                padding: '0.45rem 0.95rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                background: '#006D36',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fa-solid fa-check"></i>
              <span>Aplicar Dimensiones</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
