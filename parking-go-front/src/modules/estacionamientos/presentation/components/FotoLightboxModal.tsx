import React, { useEffect, useCallback } from 'react';

interface FotoLightboxModalProps {
  fotos: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const FotoLightboxModal: React.FC<FotoLightboxModalProps> = ({
  fotos,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const total = fotos.length;
  const currentUrl = fotos[currentIndex];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onNavigate((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onNavigate]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onNavigate((currentIndex + 1) % total);
  }, [currentIndex, total, onNavigate]);

  // Manejo de atajos con teclado (Esc, Flecha Izq, Flecha Der)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  if (!currentUrl) return null;

  const fullImageUrl = currentUrl.startsWith('http')
    ? currentUrl
    : `http://localhost:3000${currentUrl}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(3, 20, 12, 0.88)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeInLightbox 0.2s ease',
      }}
      onClick={onClose}
    >
      {/* Barra Superior con Controles */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contador */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.4rem 0.85rem',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          <i className="fa-regular fa-image" style={{ marginRight: '0.45rem', color: '#34D399' }}></i>
          Fotografía {currentIndex + 1} de {total}
        </div>

        {/* Botón Cerrar */}
        <button
          type="button"
          onClick={onClose}
          title="Cerrar (Esc)"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#EF4444';
            (e.currentTarget as HTMLElement).style.borderColor = '#EF4444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.15)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.25)';
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* Botón Anterior */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          title="Foto anterior (←)"
          style={{
            position: 'absolute',
            left: '1.5rem',
            zIndex: 3,
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#006D36';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.45)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
      )}

      {/* Imagen Principal en Grande */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '82vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={fullImageUrl}
          alt={`Foto del estacionamiento ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '82vh',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      </div>

      {/* Botón Siguiente */}
      {total > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          title="Foto siguiente (→)"
          style={{
            position: 'absolute',
            right: '1.5rem',
            zIndex: 3,
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#006D36';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.45)';
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
          }}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      )}
    </div>
  );
};
