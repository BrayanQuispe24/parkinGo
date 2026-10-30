import React, { useRef, useState } from 'react';
import type { FotoEstacionamientoModel } from '../../domain/Estacionamiento';
import { FotoLightboxModal } from './FotoLightboxModal';
import {
  useEliminarFotoMutation,
  useSubirFotosMutation,
} from '../../application/useEstacionamientosMutations';
import { showToast } from '../../../../core/utils/toastr';

interface GaleriaFotosEnterpriseProps {
  fotos: FotoEstacionamientoModel[];
  readOnly?: boolean;
}

export const GaleriaFotosEnterprise: React.FC<GaleriaFotosEnterpriseProps> = ({
  fotos,
  readOnly = false,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subirMutation = useSubirFotosMutation();
  const eliminarMutation = useEliminarFotoMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList: File[] = Array.from(files);

    // Validar tipo de archivo
    const validImages = fileList.filter((f) => f.type.startsWith('image/'));
    if (validImages.length === 0) {
      showToast.error('Por favor selecciona solo archivos de imagen válidos (PNG, JPG, WEBP).', 'Formato Inválido');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      await subirMutation.mutateAsync(validImages);
      showToast.success(
        `¡${validImages.length} fotografía(s) subida(s) exitosamente a la galería!`,
        'Galería Actualizada',
      );
    } catch (err: unknown) {
      showToast.error('Error al subir las fotografías. Inténtalo nuevamente.', 'Error de Carga');
      console.error('Error al subir fotos:', err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEliminarFoto = async (e: React.MouseEvent, foto: FotoEstacionamientoModel) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de que deseas eliminar permanentemente esta fotografía de la galería?')) {
      return;
    }

    setDeletingId(foto.id);
    try {
      await eliminarMutation.mutateAsync(foto.id);
      showToast.success('Fotografía eliminada de la galería.', 'Galería');
    } catch (err: unknown) {
      showToast.error('No se pudo eliminar la fotografía seleccionada.', 'Error');
      console.error('Error al eliminar foto:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="galeria-fotos-enterprise-container"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Lightbox para Pantalla Completa */}
      {lightboxIndex !== null && fotos.length > 0 && (
        <FotoLightboxModal
          fotos={fotos.map((f) => f.url)}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Input File Oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Toolbar Superior Enterprise */}
      <div
        style={{
          padding: '0.75rem 1.15rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.65rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '3px',
              background: '#E0F2FE',
              color: '#0284C7',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
            }}
          >
            <i className="fa-solid fa-camera"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#0F172A',
                }}
              >
                Galería Fotográfica del Estacionamiento
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.4rem',
                  background: '#E2E8F0',
                  color: '#334155',
                  borderRadius: '2px',
                  letterSpacing: '0.04em',
                }}
              >
                {fotos.length} {fotos.length === 1 ? 'FOTO' : 'FOTOS'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
              Visualiza en alta resolución, agrega nuevas tomas o elimina registros antiguos
            </span>
          </div>
        </div>

        {/* Acciones de la Galería */}
        {!readOnly && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={subirMutation.isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '3px',
              padding: '0.42rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0, 109, 54, 0.2)',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#063D25')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#006D36')}
          >
            {subirMutation.isPending ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <span>Subir Fotos</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Grid de Fotografías */}
      <div style={{ padding: '1rem' }}>
        {fotos.length === 0 ? (
          /* Estado Vacío de Galería */
          <div
            onClick={() => {
              if (!readOnly) fileInputRef.current?.click();
            }}
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#F8FAFC',
              border: '1px dashed #CBD5E1',
              borderRadius: '4px',
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '4px',
                background: '#E0F2FE',
                color: '#0284C7',
                border: '1px solid #BAE6FD',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                marginBottom: '0.75rem',
              }}
            >
              <i className="fa-solid fa-images"></i>
            </div>
            <h5
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#1E293B',
                margin: '0 0 0.25rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              No hay fotografías en la galería
            </h5>
            <p style={{ fontSize: '0.78rem', color: '#64748B', maxWidth: '380px', margin: '0 auto 0.75rem auto' }}>
              {readOnly
                ? 'El parqueo aún no ha cargado fotografías de su infraestructura.'
                : 'Haz clic aquí o pulsa en "Subir Fotos" para añadir imágenes del ingreso, plazas de parqueo y señalética.'}
            </p>
            {!readOnly && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#006D36',
                  textTransform: 'uppercase',
                }}
              >
                <i className="fa-solid fa-plus"></i> Seleccionar Imágenes del Dispositivo
              </span>
            )}
          </div>
        ) : (
          /* Mosaico Quilted Image List (Estilo Quilted de Material-UI con CSS Grid Nativo) */
          <div
            className="galeria-quilted-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridAutoRows: '150px',
              gap: '8px',
            }}
          >
            {fotos.map((foto, index) => {
              const fullUrl = foto.url.startsWith('http')
                ? foto.url
                : `http://localhost:3000${foto.url}`;
              const isDeleting = deletingId === foto.id;

              // Patrón Quilted MUI: [2x2, 1x1, 1x1, 2x1, 2x1, 2x2, 1x1, 1x1, 2x2, 1x1, 1x1, 2x1]
              const QUILTED_PATTERN = [
                { cols: 2, rows: 2 }, // 0: Destacada grande (arriba izq)
                { cols: 1, rows: 1 }, // 1: Mediana sup
                { cols: 1, rows: 1 }, // 2: Mediana sup
                { cols: 2, rows: 1 }, // 3: Horizontal med
                { cols: 2, rows: 1 }, // 4: Horizontal med
                { cols: 2, rows: 2 }, // 5: Destacada grande (der)
                { cols: 1, rows: 1 }, // 6: Pequeña
                { cols: 1, rows: 1 }, // 7: Pequeña
                { cols: 2, rows: 2 }, // 8: Destacada
                { cols: 1, rows: 1 }, // 9: Pequeña
                { cols: 1, rows: 1 }, // 10: Pequeña
                { cols: 2, rows: 1 }, // 11: Horizontal
              ];

              // Adaptación si hay 1, 2 o 3 fotos
              let span = QUILTED_PATTERN[index % QUILTED_PATTERN.length];
              if (fotos.length === 1) {
                span = { cols: 4, rows: 3 };
              } else if (fotos.length === 2) {
                span = { cols: 2, rows: 2 };
              } else if (fotos.length === 3) {
                span = index === 0 ? { cols: 2, rows: 2 } : { cols: 2, rows: 1 };
              }

              return (
                <div
                  key={foto.id}
                  onClick={() => setLightboxIndex(index)}
                  style={{
                    gridColumn: `span ${span.cols}`,
                    gridRow: `span ${span.rows}`,
                    position: 'relative',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#0F172A',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.12)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.06)';
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={fullUrl}
                    alt={`Fotografía ${index + 1}`}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: isDeleting ? 0.35 : 1,
                      transition: 'transform 0.3s ease, opacity 0.2s ease',
                    }}
                  />

                  {/* Badge de Foto Principal en la primera imagen */}
                  {index === 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(6, 61, 37, 0.9)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        letterSpacing: '0.03em',
                        zIndex: 2,
                      }}
                    >
                      <i className="fa-solid fa-star" style={{ color: '#FACC15', fontSize: '0.62rem' }}></i>
                      <span>PRINCIPAL</span>
                    </div>
                  )}

                  {/* Overlay sutil al pasar el cursor */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDeleting) e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isDeleting) e.currentTarget.style.opacity = '0';
                    }}
                  >
                    {isDeleting ? (
                      <div
                        style={{
                          width: '100%',
                          color: '#FFFFFF',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        <span>Eliminando...</span>
                      </div>
                    ) : (
                      <>
                        <span
                          style={{
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                          }}
                        >
                          <i className="fa-solid fa-magnifying-glass-plus"></i>
                          <span>Ampliar</span>
                        </span>

                        {!readOnly && (
                          <button
                            type="button"
                            onClick={(e) => handleEliminarFoto(e, foto)}
                            title="Eliminar fotografía permanentemente"
                            style={{
                              background: '#DC2626',
                              border: 'none',
                              borderRadius: '4px',
                              width: '28px',
                              height: '28px',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#B91C1C')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#DC2626')}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
