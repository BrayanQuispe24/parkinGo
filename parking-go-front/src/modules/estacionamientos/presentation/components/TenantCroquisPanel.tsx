import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import type Konva from 'konva';
import axios from 'axios';

import { useMisNivelesQuery } from '../../application/useNivelesQuery';
import { useMisEspaciosQuery } from '../../application/useEspaciosQuery';
import { useCroquisByNivelQuery } from '../../application/useCroquisQuery';
import { useGuardarCroquisMutation } from '../../application/useCroquisMutations';
import { useCroquisEditorStore } from '../../application/useCroquisEditorStore';

import type {
  CroquisCanvasContent,
  CroquisEspacioNode,
  CroquisFlechaNode as CroquisFlechaNodeType,
  CroquisMuroNode as CroquisMuroNodeType,
  CroquisPuertaNode as CroquisPuertaNodeType,
  CroquisEntradaNode as CroquisEntradaNodeType,
  CroquisNode,
  SubtipoPuerta,
  TipoFondoCroquis,
} from '../../domain/Croquis';
import { pxToMeters } from '../../domain/Croquis';
import type { EspacioModel } from '../../domain/Espacio';

import { CroquisToolbar } from './croquis/CroquisToolbar';
import { CroquisGridBackground } from './croquis/CroquisGridBackground';
import { CroquisBoxNode } from './croquis/CroquisBoxNode';
import { CroquisMuroNode } from './croquis/CroquisMuroNode';
import { CroquisFlechaNode } from './croquis/CroquisFlechaNode';
import { CroquisPuertaNode } from './croquis/CroquisPuertaNode';
import { CroquisEntradaNode } from './croquis/CroquisEntradaNode';
import { CroquisGridDimensionModal } from './croquis/CroquisGridDimensionModal';
import { CroquisFondoModal } from './croquis/CroquisFondoModal';
import { CroquisElementInspector } from './croquis/CroquisElementInspector';
import { CroquisSidebarEspacios } from './croquis/CroquisSidebarEspacios';
import { showToast } from '../../../../core/utils/toastr';

export interface TenantCroquisPanelProps {
  onGoToNiveles?: () => void;
  onGoToEspacios?: () => void;
}

export const TenantCroquisPanel: React.FC<TenantCroquisPanelProps> = ({
  onGoToNiveles,
}) => {
  const { data: niveles = [], isLoading: isLoadingNiveles, refetch: refetchNiveles } = useMisNivelesQuery();
  const [selectedNivelId, setSelectedNivelId] = useState<string>('');

  // Seleccionar automáticamente el primer nivel disponible
  useEffect(() => {
    if (!selectedNivelId && niveles.length > 0) {
      setSelectedNivelId(niveles[0].id);
    }
  }, [niveles, selectedNivelId]);

  // Carga de espacios del nivel seleccionado
  const {
    data: espacios = [],
    refetch: refetchEspacios,
    isFetching: isFetchingEspacios,
  } = useMisEspaciosQuery(selectedNivelId || undefined);

  // Carga del croquis persistido del nivel seleccionado
  const {
    data: croquisRemoto,
    isLoading: isLoadingCroquis,
    isFetching: isFetchingCroquis,
    error: errorCroquis,
    refetch: refetchCroquis,
  } = useCroquisByNivelQuery(selectedNivelId || undefined);

  const guardarMutation = useGuardarCroquisMutation();

  // Estado del lienzo local
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 1600,
    height: 1000,
  });
  const [nodos, setNodos] = useState<CroquisNode[]>([]);

  // Dimensiones del contenedor del Stage
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageDimensions, setStageDimensions] = useState<{ width: number; height: number }>({
    width: 1100,
    height: 620,
  });

  // Zustand editor store
  const {
    modo,
    herramienta,
    selectedNodeId,
    stageScale,
    stagePosition,
    snapToGrid,
    isFullscreen,
    isDimensionModalOpen,
    fondoTipo,
    fondoImagenUrl,
    fondoOpacidad,
    isFondoModalOpen,
    setSelectedNodeId,
    setStageScale,
    setStagePosition,
    setIsFullscreen,
    setIsDimensionModalOpen,
    setIsFondoModalOpen,
    setFondoConfig,
  } = useCroquisEditorStore();

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const hasInitializedCenter = useRef(false);

  // Función para centrar el grid en el visor
  const centerGrid = useCallback(
    (fitToView = false) => {
      if (stageDimensions.width <= 0 || stageDimensions.height <= 0) return;
      let targetScale = useCroquisEditorStore.getState().stageScale;
      if (fitToView) {
        const padding = 60;
        const scaleX = (stageDimensions.width - padding) / canvasDimensions.width;
        const scaleY = (stageDimensions.height - padding) / canvasDimensions.height;
        targetScale = Math.min(1, Math.max(0.35, Number(Math.min(scaleX, scaleY).toFixed(2))));
        setStageScale(targetScale);
      }
      const centerX = Math.round((stageDimensions.width - canvasDimensions.width * targetScale) / 2);
      const centerY = Math.round((stageDimensions.height - canvasDimensions.height * targetScale) / 2);
      setStagePosition({ x: centerX, y: centerY });
    },
    [stageDimensions, canvasDimensions, setStageScale, setStagePosition]
  );

  // Zoom centrado hacia el punto medio del viewport
  const handleZoomDelta = useCallback(
    (delta: number) => {
      const currentScale = useCroquisEditorStore.getState().stageScale;
      const currentPos = useCroquisEditorStore.getState().stagePosition;
      const newScale = Math.min(2.5, Math.max(0.4, Number((currentScale + delta).toFixed(2))));
      if (newScale === currentScale) return;

      const viewportCenter = {
        x: stageDimensions.width / 2,
        y: stageDimensions.height / 2,
      };

      const mousePointTo = {
        x: (viewportCenter.x - currentPos.x) / currentScale,
        y: (viewportCenter.y - currentPos.y) / currentScale,
      };

      setStageScale(newScale);
      setStagePosition({
        x: Math.round(viewportCenter.x - mousePointTo.x * newScale),
        y: Math.round(viewportCenter.y - mousePointTo.y * newScale),
      });
    },
    [stageDimensions, setStageScale, setStagePosition]
  );

  // Restablecer vista al 100% de escala y centrar
  const handleReset100 = useCallback(() => {
    const targetScale = 1.0;
    setStageScale(targetScale);
    const centerX = Math.round((stageDimensions.width - canvasDimensions.width * targetScale) / 2);
    const centerY = Math.round((stageDimensions.height - canvasDimensions.height * targetScale) / 2);
    setStagePosition({ x: centerX, y: centerY });
  }, [stageDimensions, canvasDimensions, setStageScale, setStagePosition]);

  // ResizeObserver para adaptar el Stage fluidamente al contenedor (en modo normal o fullscreen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageDimensions({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isFullscreen]);

  // Centrar automáticamente cuando las dimensiones del contenedor se inicializan por primera vez
  useEffect(() => {
    if (stageDimensions.width > 0 && stageDimensions.height > 0 && !hasInitializedCenter.current) {
      hasInitializedCenter.current = true;
      centerGrid(true);
    }
  }, [stageDimensions, canvasDimensions, centerGrid]);

  // Re-centrar únicamente cuando el estado de pantalla completa realmente cambia
  const lastFullscreenRef = useRef<boolean>(isFullscreen);
  useEffect(() => {
    if (isFullscreen !== lastFullscreenRef.current) {
      lastFullscreenRef.current = isFullscreen;
      if (stageDimensions.width > 0 && stageDimensions.height > 0) {
        setTimeout(() => centerGrid(true), 60);
      }
    }
  }, [isFullscreen, stageDimensions, centerGrid]);

  // Centrar automáticamente únicamente cuando cambia el nivel seleccionado
  const lastNivelIdRef = useRef<string | null>(selectedNivelId || null);
  useEffect(() => {
    if (selectedNivelId && selectedNivelId !== lastNivelIdRef.current) {
      lastNivelIdRef.current = selectedNivelId;
      if (stageDimensions.width > 0 && stageDimensions.height > 0) {
        centerGrid(true);
      }
    }
  }, [selectedNivelId, stageDimensions, centerGrid]);

  // Desplazamiento reactivo de nodo seleccionado (con flechas o controles visuales)
  const handleNudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selectedNodeId || modo !== 'DISENIO') return;

      setNodos((prevNodos) => {
        const nodoIndex = prevNodos.findIndex((n) => n.id === selectedNodeId);
        if (nodoIndex === -1) return prevNodos;

        const nodo = prevNodos[nodoIndex];
        const newX = Math.max(0, Math.min(canvasDimensions.width - 20, Math.round(nodo.x + dx)));
        const newY = Math.max(0, Math.min(canvasDimensions.height - 20, Math.round(nodo.y + dy)));

        if (newX === nodo.x && newY === nodo.y) return prevNodos;

        const copia = [...prevNodos];
        copia[nodoIndex] = { ...nodo, x: newX, y: newY };
        return copia;
      });
    },
    [selectedNodeId, modo, canvasDimensions]
  );

  // Manejo de atajos de teclado (Escape y Flechas de movimiento)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Tecla Escape: deseleccionar nodo o salir de pantalla completa
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (selectedNodeId) {
          setSelectedNodeId(null);
        }
        return;
      }

      // 2. Mover elemento seleccionado con flechas del teclado
      if (
        selectedNodeId &&
        modo === 'DISENIO' &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        // Ignorar si el foco activo está en un campo de texto o número
        const activeTagName = document.activeElement?.tagName?.toLowerCase();
        if (
          activeTagName === 'input' ||
          activeTagName === 'textarea' ||
          activeTagName === 'select'
        ) {
          return;
        }

        e.preventDefault();

        // Paso: Flechas solas = 1px (precisión milimétrica). Shift + Flechas = 25px (salto de rejilla de 1 metro).
        const step = e.shiftKey ? 25 : 1;

        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        handleNudgeSelected(dx, dy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isFullscreen,
    setIsFullscreen,
    selectedNodeId,
    setSelectedNodeId,
    modo,
    snapToGrid,
    handleNudgeSelected,
  ]);

  // Sincronizar nodos locales al cargar croquis remoto o al cambiar de nivel
  useEffect(() => {
    if (croquisRemoto) {
      setFondoConfig({
        fondoTipo: croquisRemoto.fondoTipo || 'PLANO',
        fondoImagenUrl: croquisRemoto.fondoImagenUrl || null,
        fondoOpacidad: croquisRemoto.fondoOpacidad ?? 0.4,
      });

      if (croquisRemoto.contenido) {
        const contenido = croquisRemoto.contenido as CroquisCanvasContent;
        setCanvasDimensions({
          width: contenido.anchoLienzo || croquisRemoto.anchoLienzo || 1600,
          height: contenido.altoLienzo || croquisRemoto.altoLienzo || 1000,
        });

        // Actualizar los estados de los espacios en el croquis según los datos más recientes del backend
        const nodosActualizados = (contenido.nodos || []).map((nodo) => {
          if (nodo.tipo === 'ESPACIO') {
            const espacioActual = espacios.find((e) => e.id === nodo.espacioId);
            if (espacioActual) {
              return {
                ...nodo,
                codigoEspacio: espacioActual.codigoEspacio,
                estado: espacioActual.estado,
                tipoVehiculo: espacioActual.tipo,
              };
            }
          }
          return nodo;
        });

        setNodos(nodosActualizados);
      } else {
        setNodos([]);
        setCanvasDimensions({ width: 1600, height: 1000 });
      }
    } else {
      setNodos([]);
      setCanvasDimensions({ width: 1600, height: 1000 });
      setFondoConfig({
        fondoTipo: 'PLANO',
        fondoImagenUrl: null,
        fondoOpacidad: 0.4,
      });
    }
    setSelectedNodeId(null);
  }, [croquisRemoto, espacios, setSelectedNodeId, setFondoConfig]);

  // Actualizar el Transformer de Konva cuando cambia el nodo seleccionado
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    if (selectedNodeId && modo === 'DISENIO') {
      const selectedNode = stageRef.current.findOne(`#${selectedNodeId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
        return;
      }
    }
    transformerRef.current.nodes([]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedNodeId, modo, nodos]);

  // IDs de los espacios que ya están en el plano
  const espacioIdsEnLienzo = useMemo(() => {
    const ids = new Set<string>();
    nodos.forEach((n) => {
      if (n.tipo === 'ESPACIO') ids.add(n.espacioId);
    });
    return ids;
  }, [nodos]);

  // Nodo actualmente seleccionado en el lienzo
  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return nodos.find((n) => n.id === selectedNodeId) || null;
  }, [nodos, selectedNodeId]);

  // Manejador activo de rueda del ratón con { passive: false } sobre el contenedor del canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;

      const currentScale = useCroquisEditorStore.getState().stageScale;
      const currentPos = useCroquisEditorStore.getState().stagePosition;

      const scaleBy = 1.08;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newScale = direction > 0 ? currentScale * scaleBy : currentScale / scaleBy;
      const clampedScale = Math.min(2.5, Math.max(0.4, Number(newScale.toFixed(2))));

      if (clampedScale === currentScale) return;

      const mousePointTo = {
        x: (pointerX - currentPos.x) / currentScale,
        y: (pointerY - currentPos.y) / currentScale,
      };

      useCroquisEditorStore.getState().setStageScale(clampedScale);
      useCroquisEditorStore.getState().setStagePosition({
        x: Math.round(pointerX - mousePointTo.x * clampedScale),
        y: Math.round(pointerY - mousePointTo.y * clampedScale),
      });
    };

    el.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelEvent);
    };
  }, []);

  // Agregar un espacio al plano
  const handleColocarEspacio = (espacio: EspacioModel) => {
    const defaultWidth = espacio.tipo === 'MOTO' ? 50 : 70;
    const defaultHeight = espacio.tipo === 'MOTO' ? 90 : 120;

    const nuevoNodo: CroquisEspacioNode = {
      id: espacio.id,
      tipo: 'ESPACIO',
      espacioId: espacio.id,
      codigoEspacio: espacio.codigoEspacio,
      tipoVehiculo: espacio.tipo,
      estado: espacio.estado,
      x: 100 + (nodos.length % 8) * 85,
      y: 100 + Math.floor(nodos.length / 8) * 135,
      width: defaultWidth,
      height: defaultHeight,
      rotation: 0,
    };

    setNodos((prev) => [...prev, nuevoNodo]);
    setSelectedNodeId(nuevoNodo.id);
    showToast.info(`Espacio ${espacio.codigoEspacio} añadido al croquis.`, 'Croquis');
  };

  // Agregar un muro
  const handleAddMuro = () => {
    const nuevoMuro: CroquisMuroNodeType = {
      id: `muro-${Date.now()}`,
      tipo: 'MURO',
      x: 150,
      y: 150,
      width: 160,
      height: 20,
      rotation: 0,
    };
    setNodos((prev) => [...prev, nuevoMuro]);
    setSelectedNodeId(nuevoMuro.id);
  };

  // Agregar una flecha
  const handleAddFlecha = () => {
    const nuevaFlecha: CroquisFlechaNodeType = {
      id: `flecha-${Date.now()}`,
      tipo: 'FLECHA',
      x: 200,
      y: 200,
      points: [0, 0, 80, 0],
      rotation: 0,
    };
    setNodos((prev) => [...prev, nuevaFlecha]);
    setSelectedNodeId(nuevaFlecha.id);
  };

  // Agregar un portón / puerta de acceso
  const handleAddPuerta = (subtipo: SubtipoPuerta) => {
    const nuevaPuerta: CroquisPuertaNodeType = {
      id: `puerta-${Date.now()}`,
      tipo: 'PUERTA',
      subtipo,
      x: 180,
      y: 180,
      width: 100,
      height: 24,
      rotation: 0,
    };
    setNodos((prev) => [...prev, nuevaPuerta]);
    setSelectedNodeId(nuevaPuerta.id);
    showToast.info(`Elemento de ${subtipo} añadido al croquis.`, 'Croquis');
  };

  // Agregar una entrada vehicular independiente
  const handleAddEntrada = () => {
    const nuevaEntrada: CroquisEntradaNodeType = {
      id: `entrada-${Date.now()}`,
      tipo: 'ENTRADA',
      subtipoEntrada: 'VEHICULAR',
      x: 180,
      y: 180,
      width: 75, // 3 metros estándar
      height: 50, // 2 metros
      rotation: 0,
      conBarrera: true,
    };
    setNodos((prev) => [...prev, nuevaEntrada]);
    setSelectedNodeId(nuevaEntrada.id);
    showToast.info('Elemento de Entrada Vehicular añadido al croquis.', 'Croquis');
  };

  // Aplicar nuevas dimensiones métricas del grid / lienzo
  const handleApplyDimensions = (newWidth: number, newHeight: number) => {
    setCanvasDimensions({ width: newWidth, height: newHeight });
    showToast.success(
      `Dimensiones del grid ajustadas a ${pxToMeters(newWidth).toFixed(1)}m × ${pxToMeters(newHeight).toFixed(1)}m (${newWidth} × ${newHeight} px).`,
      'Grid'
    );
  };

  // Actualizar un nodo existente tras drag o resize
  const handleUpdateNode = (updated: CroquisNode) => {
    setNodos((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  // Eliminar nodo seleccionado del plano
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodos((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setSelectedNodeId(null);
    showToast.info('Elemento retirado del croquis.', 'Croquis');
  };

  // Guardar la distribución en el backend
  const handleSaveCroquis = async () => {
    if (!selectedNivelId) {
      showToast.error('Debes seleccionar un nivel para guardar el croquis.', 'Error');
      return;
    }

    const payloadContent: CroquisCanvasContent = {
      anchoLienzo: canvasDimensions.width,
      altoLienzo: canvasDimensions.height,
      nodos,
    };

    const currentFondoTipo = useCroquisEditorStore.getState().fondoTipo;
    const currentFondoImagenUrl = useCroquisEditorStore.getState().fondoImagenUrl;
    const currentFondoOpacidad = useCroquisEditorStore.getState().fondoOpacidad;

    try {
      await guardarMutation.mutateAsync({
        nivelId: selectedNivelId,
        payload: {
          codigo: 'PLANO-PRINCIPAL',
          anchoLienzo: canvasDimensions.width,
          altoLienzo: canvasDimensions.height,
          contenido: payloadContent,
          fondoTipo: currentFondoTipo,
          fondoImagenUrl: currentFondoImagenUrl,
          fondoOpacidad: currentFondoOpacidad,
        },
      });
      showToast.success('¡Distribución del croquis guardada exitosamente!', 'Croquis 2D');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || 'Error al guardar el croquis.';
        showToast.error(Array.isArray(msg) ? msg.join(', ') : msg, 'Error');
      } else {
        showToast.error('Ocurrió un error inesperado al guardar.', 'Error');
      }
    }
  };

  // Aplicar configuración de fondo desde el modal
  const handleApplyFondo = (config: {
    fondoTipo: TipoFondoCroquis;
    fondoImagenUrl?: string | null;
    fondoOpacidad: number;
  }) => {
    setFondoConfig(config);
    showToast.success('Textura / fondo de suelo aplicado.', 'Croquis 2D');
  };

  // Sincronizar y recargar en caliente el contenido y estados del nivel
  const handleRefreshContenido = useCallback(async () => {
    try {
      await Promise.all([
        refetchEspacios(),
        refetchCroquis(),
        refetchNiveles(),
      ]);
      showToast.success('Espacios y croquis sincronizados con el servidor.', 'Croquis 2D');
    } catch {
      showToast.error('No se pudo sincronizar el contenido del croquis.', 'Error');
    }
  }, [refetchEspacios, refetchCroquis, refetchNiveles]);

  // Enfocar espacio desde la barra lateral
  const handleSeleccionarEspacioEnLienzo = (espacioId: string) => {
    setSelectedNodeId(espacioId);
    const nodo = nodos.find((n) => n.id === espacioId);
    if (nodo) {
      setStagePosition({
        x: -nodo.x * stageScale + 300,
        y: -nodo.y * stageScale + 200,
      });
    }
  };

  if (isLoadingNiveles) {
    return (
      <div
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '4px',
          color: '#64748B',
          fontSize: '0.85rem',
        }}
      >
        <i
          className="fa-solid fa-spinner fa-spin"
          style={{ color: '#006D36', fontSize: '1.2rem', marginBottom: '0.5rem' }}
        ></i>
        <div>Cargando plantas y niveles del parqueo...</div>
      </div>
    );
  }

  if (niveles.length === 0) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px dashed #CBD5E1',
          borderRadius: '4px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: '#64748B',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.75rem auto',
            color: '#94A3B8',
            fontSize: '1.25rem',
          }}
        >
          <i className="fa-solid fa-layer-group"></i>
        </div>
        <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1E293B' }}>
          No hay niveles configurados
        </h3>
        <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '0.35rem auto 1rem auto' }}>
          Para diagramar un croquis con Konva primero debes registrar los pisos o plantas físicas del parqueo.
        </p>
        {onGoToNiveles && (
          <button
            type="button"
            onClick={onGoToNiveles}
            style={{
              background: '#006D36',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '3px',
              padding: '0.45rem 1rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Crear Primer Nivel</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={
        isFullscreen
          ? {
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: '#F8FAFC',
              width: '100vw',
              height: '100vh',
              padding: '0.65rem 0.85rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }
          : {
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              width: '100%',
            }
      }
    >
      {/* 1. Selector de Planta / Nivel */}
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
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>
            Nivel a Diseñar:
          </span>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {niveles.map((n) => {
              const isSelected = selectedNivelId === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setSelectedNivelId(n.id)}
                  style={{
                    background: isSelected ? '#006D36' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: '1px solid ' + (isSelected ? '#006D36' : '#CBD5E1'),
                    borderRadius: '3px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <i className="fa-solid fa-stairs"></i>
                  <span>{n.codigo}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leyenda de Estados en Modo Monitoreo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.68rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '2px' }} />
            <span>Disponible</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '2px' }} />
            <span>Ocupado</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#3B82F6', borderRadius: '2px' }} />
            <span>Reservado</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#F59E0B', borderRadius: '2px' }} />
            <span>Mantenimiento</span>
          </span>
        </div>
      </div>

      {/* 2. Barra de Herramientas Konva */}
      <CroquisToolbar
        onSave={handleSaveCroquis}
        isSaving={guardarMutation.isPending}
        hasSelectedNode={!!selectedNodeId}
        onDeleteSelected={handleDeleteSelected}
        onAddMuro={handleAddMuro}
        onAddFlecha={handleAddFlecha}
        onAddPuerta={handleAddPuerta}
        onAddEntrada={handleAddEntrada}
        onOpenDimensionsModal={() => setIsDimensionModalOpen(true)}
        onRefresh={handleRefreshContenido}
        isRefreshing={isFetchingEspacios || isFetchingCroquis}
        onZoom={handleZoomDelta}
        onReset100={handleReset100}
        onCenterGrid={() => centerGrid(false)}
        onFitGrid={() => centerGrid(true)}
      />

      {/* 2.1 Panel Inspector de Dimensiones y Propiedades del Elemento Seleccionado */}
      {modo === 'DISENIO' && selectedNode && (
        <CroquisElementInspector
          node={selectedNode}
          onChange={handleUpdateNode}
          onDelete={handleDeleteSelected}
          onDeselect={() => setSelectedNodeId(null)}
          onNudge={handleNudgeSelected}
        />
      )}

      {/* 3. Área Principal del Canvas (HTML5 Stage) */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? 'calc(100vh - 120px)' : '620px',
          flex: isFullscreen ? 1 : undefined,
          background: '#E2E8F0',
          border: '1px solid #CBD5E1',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Sidebar flotante con la lista de espacios del nivel */}
        {modo === 'DISENIO' && (
          <CroquisSidebarEspacios
            espacios={espacios}
            espacioIdsEnLienzo={espacioIdsEnLienzo}
            selectedNodeId={selectedNodeId}
            onColocarEspacio={handleColocarEspacio}
            onSeleccionarEspacioEnLienzo={handleSeleccionarEspacioEnLienzo}
          />
        )}

        {/* Feedback de carga del croquis */}
        {isLoadingCroquis && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 20,
              background: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#0F172A',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36' }}></i>
            <span>Cargando plano del nivel...</span>
          </div>
        )}

        {/* Feedback de error */}
        {errorCroquis && !isLoadingCroquis && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 20,
              padding: '0.45rem 0.75rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '3px',
              color: '#991B1B',
              fontSize: '0.74rem',
            }}
          >
            Error al consultar el plano. Puedes diseñar uno nuevo y guardarlo.
          </div>
        )}

        {/* Konva Stage con dimensiones reactivas al contenedor */}
        <Stage
          ref={stageRef}
          width={stageDimensions.width}
          height={stageDimensions.height}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePosition.x}
          y={stagePosition.y}
          draggable={herramienta === 'PAN'}
          onClick={(e) => {
            // Deseleccionar al hacer clic en el fondo vacío del lienzo
            if (e.target === e.target.getStage()) {
              setSelectedNodeId(null);
            }
          }}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setStagePosition({ x: e.target.x(), y: e.target.y() });
            }
          }}
          style={{ cursor: herramienta === 'PAN' ? 'grab' : 'default' }}
        >
          <Layer>
            {/* Fondo Cuadriculado */}
            <CroquisGridBackground
              width={canvasDimensions.width}
              height={canvasDimensions.height}
            />

            {/* Renderizado de Nodos */}
            {nodos.map((nodo) => {
              const isSelected = selectedNodeId === nodo.id;

              if (nodo.tipo === 'ESPACIO') {
                return (
                  <CroquisBoxNode
                    key={nodo.id}
                    node={nodo}
                    isSelected={isSelected}
                    modo={modo}
                    snapToGrid={snapToGrid}
                    onSelect={setSelectedNodeId}
                    onChange={handleUpdateNode}
                  />
                );
              }

              if (nodo.tipo === 'MURO') {
                return (
                  <CroquisMuroNode
                    key={nodo.id}
                    node={nodo}
                    isSelected={isSelected}
                    modo={modo}
                    snapToGrid={snapToGrid}
                    onSelect={setSelectedNodeId}
                    onChange={handleUpdateNode}
                  />
                );
              }

              if (nodo.tipo === 'FLECHA') {
                return (
                  <CroquisFlechaNode
                    key={nodo.id}
                    node={nodo}
                    isSelected={isSelected}
                    modo={modo}
                    snapToGrid={snapToGrid}
                    onSelect={setSelectedNodeId}
                    onChange={handleUpdateNode}
                  />
                );
              }

              if (nodo.tipo === 'PUERTA') {
                return (
                  <CroquisPuertaNode
                    key={nodo.id}
                    node={nodo}
                    isSelected={isSelected}
                    modo={modo}
                    snapToGrid={snapToGrid}
                    onSelect={setSelectedNodeId}
                    onChange={handleUpdateNode}
                  />
                );
              }

              if (nodo.tipo === 'ENTRADA') {
                return (
                  <CroquisEntradaNode
                    key={nodo.id}
                    node={nodo}
                    isSelected={isSelected}
                    modo={modo}
                    snapToGrid={snapToGrid}
                    onSelect={setSelectedNodeId}
                    onChange={handleUpdateNode}
                  />
                );
              }

              return null;
            })}

            {/* Transformer de Konva para redimensionar y rotar */}
            {modo === 'DISENIO' && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 15 || newBox.height < 15) {
                    return oldBox;
                  }
                  return newBox;
                }}
                rotateEnabled={true}
                borderStroke="#006D36"
                borderDash={[3, 3]}
                anchorFill="#FFFFFF"
                anchorStroke="#006D36"
                anchorSize={7}
              />
            )}
          </Layer>
        </Stage>

        {/* Badge flotante con dimensiones métricas del lienzo */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '12px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.94)',
            border: '1px solid #CBD5E1',
            borderRadius: '4px',
            padding: '0.28rem 0.6rem',
            fontSize: '0.73rem',
            fontWeight: 600,
            color: '#1E293B',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            pointerEvents: 'none',
          }}
        >
          <i className="fa-solid fa-ruler-combined" style={{ color: '#006D36' }}></i>
          <span>
            Lienzo: {pxToMeters(canvasDimensions.width).toFixed(1)}m × {pxToMeters(canvasDimensions.height).toFixed(1)}m
          </span>
          <span style={{ color: '#94A3B8' }}>•</span>
          <span style={{ color: '#64748B', fontSize: '0.68rem' }}>
            {canvasDimensions.width} × {canvasDimensions.height} px
          </span>
        </div>
      </div>

      {/* Modal de ajuste de dimensiones del grid */}
      <CroquisGridDimensionModal
        isOpen={isDimensionModalOpen}
        onClose={() => setIsDimensionModalOpen(false)}
        currentWidth={canvasDimensions.width}
        currentHeight={canvasDimensions.height}
        onApplyDimensions={handleApplyDimensions}
      />

      {/* Modal de configuración de fondo del suelo / plano */}
      <CroquisFondoModal
        isOpen={isFondoModalOpen}
        onClose={() => setIsFondoModalOpen(false)}
        nivelId={selectedNivelId}
        currentTipo={fondoTipo}
        currentImagenUrl={fondoImagenUrl}
        currentOpacidad={fondoOpacidad}
        onApplyFondo={handleApplyFondo}
      />
    </div>
  );
};
