import React, { useState, useRef } from 'react';
import type { TipoFondoCroquis } from '../../../domain/Croquis';
import { croquisRepositoryInstance } from '../../../infrastructure/HttpCroquisRepository';
import { resolveImageUrl } from './CroquisGridBackground';

interface CroquisFondoModalProps {
  isOpen: boolean;
  onClose: () => void;
  nivelId: string;
  currentTipo: TipoFondoCroquis;
  currentImagenUrl?: string | null;
  currentOpacidad?: number;
  onApplyFondo: (config: {
    fondoTipo: TipoFondoCroquis;
    fondoImagenUrl?: string | null;
    fondoOpacidad: number;
  }) => void;
}

interface TexturaPreset {
  id: TipoFondoCroquis;
  nombre: string;
  descripcion: string;
  colorPreview: string;
  icon: string;
}

const PRESETS: TexturaPreset[] = [
  {
    id: 'PLANO',
    nombre: 'Lienzo Técnico',
    descripcion: 'Fondo neutro blanco/gris con cuadrícula arquitectónica limpia',
    colorPreview: '#F8FAFC',
    icon: 'fa-regular fa-square',
  },
  {
    id: 'ASFALTO',
    nombre: 'Asfalto Vial',
    descripcion: 'Superficie bituminosa oscura para parqueos abiertos o parkings',
    colorPreview: '#1E293B',
    icon: 'fa-solid fa-road',
  },
  {
    id: 'CONCRETO',
    nombre: 'Concreto Industrial',
    descripcion: 'Losa de cemento pulido con juntas de dilatación estructuradas',
    colorPreview: '#94A3B8',
    icon: 'fa-solid fa-cubes',
  },
  {
    id: 'EPOXICO',
    nombre: 'Resina Epóxica',
    descripcion: 'Pintura verde esmeralda de alto tráfico para estacionamientos bajo techo',
    colorPreview: '#064E3B',
    icon: 'fa-solid fa-gem',
  },
];

export const CroquisFondoModal: React.FC<CroquisFondoModalProps> = ({
  isOpen,
  onClose,
  nivelId,
  currentTipo,
  currentImagenUrl,
  currentOpacidad = 0.4,
  onApplyFondo,
}) => {
  const [selectedTipo, setSelectedTipo] = useState<TipoFondoCroquis>(currentTipo || 'PLANO');
  const [imagenUrl, setImagenUrl] = useState<string | null>(currentImagenUrl || null);
  const [opacidad, setOpacidad] = useState<number>(() =>
    Math.round((currentOpacidad ?? 0.4) * 100),
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación de tipo en frontend
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato no válido. Debe ser PNG, JPG, WEBP o SVG.');
      return;
    }

    // Validación de tamaño (15MB máx)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('El archivo excede el tamaño máximo permitido (15 MB).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await croquisRepositoryInstance.subirFondoImagen(nivelId, file);
      if (res && res.fondoImagenUrl) {
        setImagenUrl(res.fondoImagenUrl);
        setSelectedTipo('PERSONALIZADO');
      }
    } catch (err: unknown) {
      console.error('Error al subir plano de fondo:', err);
      const message =
        err instanceof Error ? err.message : 'Error inesperado al subir la imagen.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setImagenUrl(null);
    if (selectedTipo === 'PERSONALIZADO') {
      setSelectedTipo('PLANO');
    }
  };

  const handleSave = () => {
    onApplyFondo({
      fondoTipo: selectedTipo,
      fondoImagenUrl: imagenUrl,
      fondoOpacidad: Number((opacidad / 100).toFixed(2)),
    });
    onClose();
  };

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
          maxWidth: '520px',
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
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0F172A' }}>
                Fondo y Textura del Suelo
              </h3>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
                Personaliza la apariencia del suelo o sube un plano arquitectónico
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

        {/* Contenido */}
        <div style={{ padding: '1.25rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Sección 1: Texturas Estándar */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '0.45rem',
              }}
            >
              Texturas simuladas del piso:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {PRESETS.map((preset) => {
                const isSelected = selectedTipo === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedTipo(preset.id)}
                    style={{
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      border: '1.5px solid ' + (isSelected ? '#006D36' : '#E2E8F0'),
                      borderRadius: '5px',
                      padding: '0.6rem 0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          background: preset.colorPreview,
                          border: '1px solid #CBD5E1',
                          display: 'inline-block',
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: isSelected ? '#006D36' : '#1E293B',
                        }}
                      >
                        {preset.nombre}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.3 }}>
                      {preset.descripcion}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sección 2: Subir Plano o Imagen Propia */}
          <div
            style={{
              border: '1px solid ' + (selectedTipo === 'PERSONALIZADO' ? '#006D36' : '#E2E8F0'),
              background: selectedTipo === 'PERSONALIZADO' ? '#F0FDF4' : '#F8FAFC',
              borderRadius: '5px',
              padding: '0.85rem 1rem',
              marginBottom: '1.2rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i
                  className="fa-solid fa-file-image"
                  style={{ color: selectedTipo === 'PERSONALIZADO' ? '#006D36' : '#475569' }}
                ></i>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: selectedTipo === 'PERSONALIZADO' ? '#006D36' : '#1E293B',
                  }}
                >
                  Plano Arquitectónico / Imagen Personalizada
                </span>
              </div>
              {imagenUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedTipo('PERSONALIZADO')}
                  style={{
                    background: selectedTipo === 'PERSONALIZADO' ? '#006D36' : '#FFFFFF',
                    color: selectedTipo === 'PERSONALIZADO' ? '#FFFFFF' : '#334155',
                    border: '1px solid ' + (selectedTipo === 'PERSONALIZADO' ? '#006D36' : '#CBD5E1'),
                    borderRadius: '3px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {selectedTipo === 'PERSONALIZADO' ? 'Activo' : 'Seleccionar'}
                </button>
              )}
            </div>

            <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.7rem', color: '#64748B' }}>
              Sube una fotografía de satélite, plano en AutoCAD exportado a imagen o render. Quedará de fondo escalado a las dimensiones del croquis.
            </p>

            {/* Vista previa o botón de subida */}
            {imagenUrl ? (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <img
                    src={resolveImageUrl(imagenUrl) || ''}
                    alt="Plano fondo"
                    style={{
                      width: '42px',
                      height: '42px',
                      objectFit: 'cover',
                      borderRadius: '3px',
                      border: '1px solid #E2E8F0',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        color: '#0F172A',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Plano cargado en el servidor
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                      <i className="fa-solid fa-circle-check"></i> Disponible para este nivel
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    title="Reemplazar archivo"
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '3px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    Reemplazar
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    title="Quitar plano"
                    style={{
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '3px',
                      padding: '0.25rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#DC2626',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px dashed #94A3B8',
                    borderRadius: '4px',
                    padding: '0.85rem',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    textAlign: 'center',
                    color: '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {isUploading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36' }}></i>
                      <span>Subiendo plano al servidor...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#006D36', fontSize: '1rem' }}></i>
                      <span>Haz clic para subir un plano o imagen (PNG, JPG, SVG - Máx 15MB)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {uploadError && (
              <div
                style={{
                  marginTop: '0.5rem',
                  color: '#DC2626',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Sección 3: Slider de Opacidad */}
          <div style={{ marginBottom: '1.2rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.35rem',
              }}
            >
              <label
                htmlFor="opacidad-range"
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                Opacidad de la textura / plano:
              </label>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#006D36',
                  background: '#ECFDF5',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '3px',
                }}
              >
                {opacidad}%
              </span>
            </div>
            <input
              id="opacidad-range"
              type="range"
              min={10}
              max={100}
              step={5}
              value={opacidad}
              onChange={(e) => setOpacidad(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#006D36',
                cursor: 'pointer',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: '#94A3B8',
                marginTop: '0.2rem',
              }}
            >
              <span>10% (Muy tenue)</span>
              <span>40% (Recomendado)</span>
              <span>100% (Sólido)</span>
            </div>
          </div>

          {/* Resumen explicativo */}
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '4px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.72rem',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>
              La cuadrícula milimétrica, cotas arquitectónicas y plazas continuarán siempre visibles por encima de la textura o plano.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.6rem',
          }}
        >
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
            type="button"
            onClick={handleSave}
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
            <span>Aplicar Fondo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
