import React from 'react';
import { useCroquisEditorStore } from '../../../application/useCroquisEditorStore';

interface CroquisToolbarProps {
  onSave: () => void;
  isSaving: boolean;
  hasSelectedNode: boolean;
  onDeleteSelected: () => void;
  onAddMuro: () => void;
  onAddFlecha: () => void;
  onAddPuerta: (subtipo: 'ENTRADA' | 'SALIDA' | 'MIXTO') => void;
  onAddEntrada: () => void;
  onOpenDimensionsModal: () => void;
  onOpenFondoModal?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onCenterGrid?: () => void;
  onFitGrid?: () => void;
  onZoom?: (delta: number) => void;
  onReset100?: () => void;
}

export const CroquisToolbar: React.FC<CroquisToolbarProps> = ({
  onSave,
  isSaving,
  hasSelectedNode,
  onDeleteSelected,
  onAddMuro,
  onAddFlecha,
  onAddPuerta,
  onAddEntrada,
  onOpenDimensionsModal,
  onOpenFondoModal,
  onRefresh,
  isRefreshing = false,
  onCenterGrid,
  onFitGrid,
  onZoom,
  onReset100,
}) => {
  const {
    modo,
    herramienta,
    stageScale,
    snapToGrid,
    isFullscreen,
    showDimensions,
    fondoTipo,
    setModo,
    setHerramienta,
    setStageScale,
    toggleSnapToGrid,
    toggleFullscreen,
    toggleShowDimensions,
    setIsFondoModalOpen,
    resetView,
  } = useCroquisEditorStore();

  const handleZoom = (delta: number) => {
    if (onZoom) {
      onZoom(delta);
    } else {
      const newScale = Math.min(2.5, Math.max(0.4, stageScale + delta));
      setStageScale(Number(newScale.toFixed(2)));
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '4px',
        padding: '0.5rem 0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Grupo 1: Switch de Modo (Diseño vs Monitoreo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <div
          style={{
            background: '#F1F5F9',
            padding: '0.2rem',
            borderRadius: '4px',
            display: 'inline-flex',
            gap: '0.2rem',
          }}
        >
          <button
            type="button"
            onClick={() => setModo('DISENIO')}
            style={{
              background: modo === 'DISENIO' ? '#006D36' : 'transparent',
              color: modo === 'DISENIO' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '3px',
              padding: '0.25rem 0.65rem',
              fontSize: '0.74rem',
              fontWeight: modo === 'DISENIO' ? 700 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-pen-ruler"></i>
            <span>Diseño</span>
          </button>

          <button
            type="button"
            onClick={() => setModo('MONITOREO')}
            style={{
              background: modo === 'MONITOREO' ? '#006D36' : 'transparent',
              color: modo === 'MONITOREO' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '3px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.74rem',
              fontWeight: modo === 'MONITOREO' ? 700 : 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-satellite-dish"></i>
            <span>En Vivo</span>
          </button>
        </div>

        {/* Botón de Sincronización / Recarga Manual */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Sincronizar y recargar en caliente los espacios, estados y croquis"
            style={{
              background: '#FFFFFF',
              color: isRefreshing ? '#006D36' : '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '3px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: isRefreshing ? 'wait' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.15s ease',
            }}
          >
            <i
              className={`fa-solid fa-arrows-rotate ${isRefreshing ? 'fa-spin' : ''}`}
              style={{ color: '#006D36' }}
            ></i>
            <span>{isRefreshing ? 'Sincronizando...' : 'Recargar'}</span>
          </button>
        )}

        {/* Separador */}
        <div style={{ height: '20px', width: '1px', background: '#E2E8F0', margin: '0 0.35rem' }} />

        {/* Grupo 2: Herramientas en Modo Diseño */}
        {modo === 'DISENIO' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setHerramienta('SELECT')}
              title="Herramienta Selección / Mover"
              style={{
                background: herramienta === 'SELECT' ? '#DCFCE7' : '#FFFFFF',
                color: herramienta === 'SELECT' ? '#166534' : '#334155',
                border: '1px solid ' + (herramienta === 'SELECT' ? '#BBF7D0' : '#CBD5E1'),
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-arrow-pointer"></i>
            </button>

            <button
              type="button"
              onClick={() => setHerramienta('PAN')}
              title="Herramienta Paneo / Mano"
              style={{
                background: herramienta === 'PAN' ? '#DCFCE7' : '#FFFFFF',
                color: herramienta === 'PAN' ? '#166534' : '#334155',
                border: '1px solid ' + (herramienta === 'PAN' ? '#BBF7D0' : '#CBD5E1'),
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <i className="fa-solid fa-hand"></i>
            </button>

            <button
              type="button"
              onClick={onAddMuro}
              title="Añadir Muro / Columna"
              style={{
                background: '#FFFFFF',
                color: '#334155',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <i className="fa-solid fa-square"></i>
              <span>Muro</span>
            </button>

            <button
              type="button"
              onClick={onAddFlecha}
              title="Añadir Flecha de Tráfico"
              style={{
                background: '#FFFFFF',
                color: '#334155',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <i className="fa-solid fa-arrow-right"></i>
              <span>Flecha</span>
            </button>

            {/* Botón Entrada Vehicular Independiente */}
            <button
              type="button"
              onClick={onAddEntrada}
              title="Añadir Acceso / Entrada Vehicular con carril, pluma y cota"
              style={{
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #10B981',
                borderRadius: '3px',
                padding: '0.3rem 0.6rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <i className="fa-solid fa-right-to-bracket" style={{ color: '#059669' }}></i>
              <span>Entrada</span>
            </button>

            {/* Botón Portón / Puerta */}
            <button
              type="button"
              onClick={() => onAddPuerta('MIXTO')}
              title="Añadir Portón / Puerta Peatonal"
              style={{
                background: '#F8FAFC',
                color: '#334155',
                border: '1px solid #CBD5E1',
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <i className="fa-solid fa-door-open"></i>
              <span>Portón</span>
            </button>

            {/* Botón Salida */}
            <button
              type="button"
              onClick={() => onAddPuerta('SALIDA')}
              title="Añadir Salida Vehicular"
              style={{
                background: '#FFFBEB',
                color: '#92400E',
                border: '1px solid #FDE68A',
                borderRadius: '3px',
                padding: '0.3rem 0.55rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
              <span>Salida</span>
            </button>

            {hasSelectedNode && (
              <button
                type="button"
                onClick={onDeleteSelected}
                title="Eliminar elemento seleccionado del plano"
                style={{
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  borderRadius: '3px',
                  padding: '0.3rem 0.55rem',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>Quitar</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grupo 3: Zoom, Dimensiones Grid, Cotas, Snap to Grid, Pantalla Completa y Guardar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* Configurar Dimensiones del Lienzo / Grid */}
        <button
          type="button"
          onClick={onOpenDimensionsModal}
          title="Ajustar dimensiones métricas del plano (ancho y alto)"
          style={{
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #CBD5E1',
            borderRadius: '3px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i className="fa-solid fa-ruler-combined" style={{ color: '#006D36' }}></i>
          <span>Dimensiones Grid</span>
        </button>

        {/* Configurar Textura / Fondo de Suelo */}
        <button
          type="button"
          onClick={() => {
            if (onOpenFondoModal) onOpenFondoModal();
            else setIsFondoModalOpen(true);
          }}
          title="Configurar textura de suelo (Asfalto, Concreto, Epóxico) o subir plano arquitectónico"
          style={{
            background: fondoTipo !== 'PLANO' ? '#F0FDF4' : '#FFFFFF',
            color: fondoTipo !== 'PLANO' ? '#166534' : '#0F172A',
            border: '1px solid ' + (fondoTipo !== 'PLANO' ? '#BBF7D0' : '#CBD5E1'),
            borderRadius: '3px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i
            className="fa-solid fa-layer-group"
            style={{ color: fondoTipo !== 'PLANO' ? '#059669' : '#006D36' }}
          ></i>
          <span>
            Fondo Suelo {fondoTipo !== 'PLANO' ? `(${fondoTipo})` : ''}
          </span>
        </button>

        {/* Toggle Cotas arquitectónicas */}
        <button
          type="button"
          onClick={toggleShowDimensions}
          title={showDimensions ? 'Ocultar cotas métricas' : 'Mostrar cotas métricas'}
          style={{
            background: showDimensions ? '#F0FDF4' : '#F8FAFC',
            color: showDimensions ? '#166534' : '#64748B',
            border: '1px solid ' + (showDimensions ? '#BBF7D0' : '#E2E8F0'),
            borderRadius: '3px',
            padding: '0.25rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i className="fa-solid fa-ruler"></i>
          <span>Cotas {showDimensions ? 'ON' : 'OFF'}</span>
        </button>

        {/* Toggle Snap to grid */}
        <button
          type="button"
          onClick={toggleSnapToGrid}
          title={snapToGrid ? 'Ajuste a la cuadrícula activado' : 'Ajuste libre'}
          style={{
            background: snapToGrid ? '#F0FDF4' : '#F8FAFC',
            color: snapToGrid ? '#166534' : '#64748B',
            border: '1px solid ' + (snapToGrid ? '#BBF7D0' : '#E2E8F0'),
            borderRadius: '3px',
            padding: '0.25rem 0.55rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i className="fa-solid fa-border-all"></i>
          <span>Grid {snapToGrid ? 'ON' : 'OFF'}</span>
        </button>

        {/* Controles de Zoom */}
        <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '3px' }}>
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            title="Reducir zoom"
            style={{
              background: '#FFFFFF',
              border: 'none',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <button
            type="button"
            onClick={onReset100 || onCenterGrid || resetView}
            title="Restablecer zoom a 100% y centrar"
            style={{
              background: '#F8FAFC',
              borderLeft: '1px solid #E2E8F0',
              borderRight: '1px solid #E2E8F0',
              borderTop: 'none',
              borderBottom: 'none',
              padding: '0.25rem 0.55rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            {Math.round(stageScale * 100)}%
          </button>
          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            title="Aumentar zoom"
            style={{
              background: '#FFFFFF',
              border: 'none',
              padding: '0.25rem 0.5rem',
              fontSize: '0.72rem',
              cursor: 'pointer',
              color: '#334155',
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        {/* Botón Centrar Vista */}
        {onCenterGrid && (
          <button
            type="button"
            onClick={onCenterGrid}
            title="Centrar el plano en el visor"
            style={{
              background: '#FFFFFF',
              color: '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '3px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-arrows-to-dot" style={{ color: '#006D36' }}></i>
            <span>Centrar</span>
          </button>
        )}

        {/* Botón Ajustar a Pantalla */}
        {onFitGrid && (
          <button
            type="button"
            onClick={onFitGrid}
            title="Ajustar todo el plano al tamaño de la pantalla"
            style={{
              background: '#FFFFFF',
              color: '#334155',
              border: '1px solid #CBD5E1',
              borderRadius: '3px',
              padding: '0.25rem 0.55rem',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-expand" style={{ color: '#2563EB', fontSize: '0.65rem' }}></i>
            <span>Ajustar</span>
          </button>
        )}

        {/* Botón Pantalla Completa */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Ver en pantalla completa'}
          style={{
            background: isFullscreen ? '#F1F5F9' : '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #CBD5E1',
            borderRadius: '3px',
            padding: '0.25rem 0.6rem',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <i className={isFullscreen ? 'fa-solid fa-compress' : 'fa-solid fa-expand'}></i>
          <span>{isFullscreen ? 'Salir' : 'Maximizar'}</span>
        </button>

        {/* Botón Guardar Croquis */}
        {modo === 'DISENIO' && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            style={{
              background: '#006D36',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '3px',
              padding: '0.35rem 0.85rem',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              <i className="fa-solid fa-floppy-disk"></i>
            )}
            <span>Guardar Croquis</span>
          </button>
        )}
      </div>
    </div>
  );
};
