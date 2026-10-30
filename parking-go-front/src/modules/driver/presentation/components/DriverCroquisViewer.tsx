// src/modules/driver/presentation/components/DriverCroquisViewer.tsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import type { DriverParking, DriverParkingSpace } from '../../domain/DriverParking';
import { useCroquisEstacionamientoQuery } from '../../../estacionamientos/application/useCroquisQuery';
import type {
  CroquisNode,
  CroquisEspacioNode,
  CroquisMuroNode as CroquisMuroNodeType,
  CroquisFlechaNode as CroquisFlechaNodeType,
  CroquisPuertaNode as CroquisPuertaNodeType,
  CroquisEntradaNode as CroquisEntradaNodeType,
} from '../../../estacionamientos/domain/Croquis';
import { CroquisGridBackground } from '../../../estacionamientos/presentation/components/croquis/CroquisGridBackground';
import { CroquisBoxNode } from '../../../estacionamientos/presentation/components/croquis/CroquisBoxNode';
import { CroquisMuroNode } from '../../../estacionamientos/presentation/components/croquis/CroquisMuroNode';
import { CroquisFlechaNode } from '../../../estacionamientos/presentation/components/croquis/CroquisFlechaNode';
import { CroquisPuertaNode } from '../../../estacionamientos/presentation/components/croquis/CroquisPuertaNode';
import { CroquisEntradaNode } from '../../../estacionamientos/presentation/components/croquis/CroquisEntradaNode';

interface DriverCroquisViewerProps {
  parking: DriverParking;
  selectedSpaceId: string | null;
  selectedSpaceCode: string | null;
  onSelectSpace: (spaceId: string, spaceCode: string) => void;
  onClearSelection?: () => void;
  onProceedToBooking?: () => void;
}

interface NivelOption {
  id: string;
  code: string;
  label: string;
  espaciosCount: number;
}

export const DriverCroquisViewer: React.FC<DriverCroquisViewerProps> = ({
  parking,
  selectedSpaceId,
  selectedSpaceCode,
  onSelectSpace,
  onClearSelection,
  onProceedToBooking,
}) => {
  // 1. Extraer los niveles del parqueo a partir de los espacios
  const rawSpaces: DriverParkingSpace[] = parking.spaces && parking.spaces.length > 0 ? parking.spaces : [];

  const nivelesOptions: NivelOption[] = useMemo(() => {
    const map = new Map<string, { id: string; code: string; label: string; count: number }>();

    rawSpaces.forEach((s) => {
      const levelCode = s.level || 'Planta Baja';
      const levelId = s.levelId || `lvl-${levelCode.toLowerCase().replace(/\s+/g, '-')}`;

      if (!map.has(levelCode)) {
        map.set(levelCode, {
          id: levelId,
          code: levelCode,
          label: levelCode,
          count: 1,
        });
      } else {
        const item = map.get(levelCode)!;
        item.count += 1;
      }
    });

    if (map.size === 0) {
      return [
        {
          id: 'lvl-planta-baja',
          code: 'Planta Baja',
          label: 'Planta Principal',
          espaciosCount: Math.min(parking.totalSpots || 12, 30),
        },
      ];
    }

    return Array.from(map.values()).map((n) => ({
      id: n.id,
      code: n.code,
      label: n.code,
      espaciosCount: n.count,
    }));
  }, [rawSpaces, parking.totalSpots]);

  const [selectedNivelCode, setSelectedNivelCode] = useState<string>(
    nivelesOptions[0]?.code || 'Planta Baja',
  );

  // Sincronizar nivel automáticamente cuando se navega con un espacio seleccionado
  useEffect(() => {
    if (!selectedSpaceCode && !selectedSpaceId) return;
    const foundSpace = rawSpaces.find(
      (s) => s.id === selectedSpaceId || s.code === selectedSpaceCode,
    );
    if (foundSpace && foundSpace.level) {
      setSelectedNivelCode(foundSpace.level);
    }
  }, [selectedSpaceCode, selectedSpaceId, rawSpaces]);

  const currentNivel = useMemo(() => {
    return (
      nivelesOptions.find((n) => n.code === selectedNivelCode) ||
      nivelesOptions[0]
    );
  }, [nivelesOptions, selectedNivelCode]);

  // 2. Consulta del croquis remoto persistido para este estacionamiento y nivel
  const {
    data: croquisRemoto,
    isLoading: isLoadingCroquis,
    isFetching: isFetchingCroquis,
    refetch: refetchCroquis,
  } = useCroquisEstacionamientoQuery(parking.id, currentNivel?.id);

  // Espacios filtrados para el nivel seleccionado
  const spacesForCurrentLevel = useMemo(() => {
    if (rawSpaces.length > 0) {
      return rawSpaces.filter(
        (s) => (s.level || 'Planta Baja') === currentNivel.code,
      );
    }
    // Si no vinieran de backend, generar espacios representativos para el nivel
    return Array.from({ length: currentNivel.espaciosCount }, (_, i) => {
      const isFree = i < (parking.availableSpots || 0);
      const codeNum = (i + 1).toString().padStart(2, '0');
      const prefix = currentNivel.code.toLowerCase().includes('2') ? 'B' : 'A';
      return {
        id: `gen-slot-${parking.id}-${currentNivel.code}-${i}`,
        code: `${prefix}-${codeNum}`,
        type: i % 7 === 3 ? 'ELECTRICO' : i % 5 === 2 ? 'MOTO' : 'AUTO',
        level: currentNivel.code,
        status: isFree ? 'DISPONIBLE' : 'OCUPADO',
      };
    });
  }, [rawSpaces, currentNivel, parking.availableSpots, parking.id]);

  // Nodos Konva remotos (si existen)
  const nodosRemotos: CroquisNode[] = useMemo(() => {
    if (
      croquisRemoto &&
      croquisRemoto.contenido &&
      Array.isArray(croquisRemoto.contenido.nodos) &&
      croquisRemoto.contenido.nodos.length > 0
    ) {
      return croquisRemoto.contenido.nodos;
    }
    return [];
  }, [croquisRemoto]);

  const hasRemoteCanvas = nodosRemotos.length > 0;

  // Dimensiones del lienzo del croquis remoto
  const canvasDimensions = useMemo(
    () => ({
      width: croquisRemoto?.anchoLienzo || 1200,
      height: croquisRemoto?.altoLienzo || 800,
    }),
    [croquisRemoto?.anchoLienzo, croquisRemoto?.altoLienzo],
  );

  // Estado del visor Konva (Zoom y Pan)
  const [stageScale, setStageScale] = useState<number>(0.85);
  const stageScaleRef = useRef<number>(0.85);
  stageScaleRef.current = stageScale;

  const [stagePosition, setStagePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 850,
    height: 560,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setContainerDimensions({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Función para centrar o ajustar el croquis a la pantalla
  const centerGrid = useCallback(
    (fitToView = false) => {
      const stageW = containerDimensions.width;
      const stageH = containerDimensions.height;
      if (stageW <= 0 || stageH <= 0) return;

      let targetScale = stageScaleRef.current;
      if (fitToView) {
        const padding = 36;
        const scaleX = (stageW - padding) / canvasDimensions.width;
        const scaleY = (stageH - padding) / canvasDimensions.height;
        targetScale = Math.min(1.25, Math.max(0.25, Number(Math.min(scaleX, scaleY).toFixed(2))));
        setStageScale(targetScale);
        stageScaleRef.current = targetScale;
      }

      const centerX = Math.round((stageW - canvasDimensions.width * targetScale) / 2);
      const centerY = Math.round((stageH - canvasDimensions.height * targetScale) / 2);
      setStagePosition({ x: centerX, y: centerY });
    },
    [containerDimensions, canvasDimensions],
  );

  // Auto-centrado y ajuste al cargar el croquis o cambiar de nivel
  useEffect(() => {
    if (isLoadingCroquis) return;
    const timer = setTimeout(() => {
      centerGrid(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedNivelCode, croquisRemoto?.id, containerDimensions.width, isLoadingCroquis, centerGrid]);

  const handleZoom = (factor: number) => {
    const currentScale = stageScaleRef.current;
    const newScale = Math.min(2.5, Math.max(0.25, Number((currentScale * factor).toFixed(2))));
    if (newScale === currentScale) return;

    // Zoom hacia el punto central del contenedor
    const viewportCenter = {
      x: containerDimensions.width / 2,
      y: containerDimensions.height / 2,
    };

    const mousePointTo = {
      x: (viewportCenter.x - stagePosition.x) / currentScale,
      y: (viewportCenter.y - stagePosition.y) / currentScale,
    };

    setStageScale(newScale);
    stageScaleRef.current = newScale;
    setStagePosition({
      x: Math.round(viewportCenter.x - mousePointTo.x * newScale),
      y: Math.round(viewportCenter.y - mousePointTo.y * newScale),
    });
  };

  const handleResetZoom = () => {
    setStageScale(1.0);
    stageScaleRef.current = 1.0;
    const centerX = Math.round((containerDimensions.width - canvasDimensions.width) / 2);
    const centerY = Math.round((containerDimensions.height - canvasDimensions.height) / 2);
    setStagePosition({ x: centerX, y: centerY });
  };

  const handleNodeSelect = useCallback(
    (nodeId: string) => {
      const targetNode = nodosRemotos.find(
        (n) => n.id === nodeId && n.tipo === 'ESPACIO',
      ) as CroquisEspacioNode | undefined;

      if (!targetNode) return;

      if (targetNode.estado === 'DISPONIBLE') {
        onSelectSpace(targetNode.espacioId || targetNode.id, targetNode.codigoEspacio);
      }
    },
    [nodosRemotos, onSelectSpace],
  );

  // Helper para tipo de vehículo
  const getTypeBadge = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MOTO':
        return { label: 'Moto', icon: 'fa-solid fa-motorcycle', color: '#1D4ED8', bg: '#EFF6FF' };
      case 'CAMIONETA':
        return { label: 'SUV', icon: 'fa-solid fa-truck-pickup', color: '#B45309', bg: '#FEF3C7' };
      case 'ELECTRICO':
        return { label: 'EV ⚡', icon: 'fa-solid fa-charging-station', color: '#047857', bg: '#ECFDF5' };
      case 'DISCAPACITADO':
        return { label: 'PMR', icon: 'fa-solid fa-wheelchair', color: '#6D28D9', bg: '#F5F3FF' };
      default:
        return { label: 'Auto', icon: 'fa-solid fa-car', color: '#006D36', bg: '#EBF7EE' };
    }
  };

  const availableInLevel = spacesForCurrentLevel.filter((s) => s.status === 'DISPONIBLE').length;
  const occupiedInLevel = spacesForCurrentLevel.length - availableInLevel;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 1. Header del Visor de Croquis */}
      <div
        style={{
          padding: '1rem 1.25rem',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#EBF7EE',
              border: '1px solid #BAE6C8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#006D36',
              fontSize: '1.1rem',
            }}
          >
            <i className="fa-solid fa-map-location-dot"></i>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#0F172A' }}>
                Plano Arquitectónico & Distribución 2D
              </h4>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  background: '#E0F2FE',
                  color: '#0369A1',
                  border: '1px solid #BAE6FD',
                  borderRadius: '4px',
                  padding: '0.1rem 0.45rem',
                }}
              >
                MODO LECTURA
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
              Explora las bahías y selecciona una plaza libre en color verde para asignarla a tu reserva.
            </p>
          </div>
        </div>

        {/* Métricas rápidas del nivel */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
            <span style={{ color: '#475569', fontWeight: 600 }}>Libres:</span>
            <strong style={{ color: '#059669' }}>{availableInLevel}</strong>
          </div>
          <div
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }}></span>
            <span style={{ color: '#475569', fontWeight: 600 }}>Ocupadas:</span>
            <strong style={{ color: '#DC2626' }}>{occupiedInLevel}</strong>
          </div>
        </div>
      </div>

      {/* 2. Barra de Navegación de Niveles y Herramientas */}
      <div
        style={{
          padding: '0.65rem 1.25rem',
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        {/* Selector de Nivel / Piso */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginRight: '0.25rem' }}>
            <i className="fa-solid fa-layer-group" style={{ marginRight: '0.35rem', color: '#006D36' }}></i>
            Nivel:
          </span>
          {nivelesOptions.map((opt) => {
            const isActive = opt.code === selectedNivelCode;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedNivelCode(opt.code)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: isActive ? '1.5px solid #006D36' : '1px solid #CBD5E1',
                  background: isActive ? '#EBF7EE' : '#F8FAFC',
                  color: isActive ? '#006D36' : '#334155',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{opt.label}</span>
                <span
                  style={{
                    background: isActive ? '#006D36' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontSize: '0.62rem',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                  }}
                >
                  {opt.espaciosCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Herramientas de Zoom, Ajuste y Centrado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            title="Ajustar croquis a la pantalla"
            onClick={() => centerGrid(true)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              border: '1.5px solid #006D36',
              background: '#EBF7EE',
              color: '#006D36',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-expand"></i>
            <span>Ajustar a Pantalla</span>
          </button>
          <button
            type="button"
            title="Centrar croquis en el visor"
            onClick={() => centerGrid(false)}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '5px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#1E293B',
              cursor: 'pointer',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <i className="fa-solid fa-crosshairs" style={{ color: '#006D36' }}></i>
            <span>Centrar</span>
          </button>
          <button
            type="button"
            title="Acercar plano (+)"
            onClick={() => handleZoom(1.15)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '5px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </button>
          <button
            type="button"
            title="Alejar plano (-)"
            onClick={() => handleZoom(0.85)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '5px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <i className="fa-solid fa-magnifying-glass-minus"></i>
          </button>
          <button
            type="button"
            title="Restablecer zoom al 100%"
            onClick={handleResetZoom}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '5px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            100%
          </button>
          <button
            type="button"
            title="Refrescar estado del croquis"
            onClick={() => refetchCroquis()}
            disabled={isFetchingCroquis}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '5px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
            }}
          >
            <i className={`fa-solid fa-rotate-right ${isFetchingCroquis ? 'fa-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      {/* 3. Leyenda de Simbología Arquitectónica */}
      <div
        style={{
          padding: '0.45rem 1.25rem',
          background: '#F1F5F9',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.7rem',
          color: '#475569',
        }}
      >
        <span style={{ fontWeight: 700, color: '#1E293B' }}>Simbología:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#DCFCE7', border: '1px solid #166534' }}></span>
          <span>Disponible (Clic para elegir)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#FEE2E2', border: '1px solid #991B1B' }}></span>
          <span>Ocupado</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#DBEAFE', border: '1px solid #1E40AF' }}></span>
          <span>Reservado</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#006D36', border: '1px solid #063D25' }}></span>
          <span style={{ fontWeight: 700, color: '#006D36' }}>Tu Selección Actual</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fa-solid fa-road" style={{ color: '#64748B' }}></i>
          <span>Vía de Tránsito</span>
        </div>
      </div>

      {/* 4. Contenedor del Plano / Lienzo */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          minHeight: '480px',
          height: '560px',
          background: '#F8FAFC',
          overflow: 'auto',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        {isLoadingCroquis && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 15,
              background: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: '#0F172A',
            }}
          >
            <i className="fa-solid fa-spinner fa-spin" style={{ color: '#006D36', fontSize: '1.2rem' }}></i>
            <span>Sincronizando plano 2D con el parqueo...</span>
          </div>
        )}

        {/* ESCENARIO A: Si el parqueo tiene croquis en Konva guardado */}
        {hasRemoteCanvas ? (
          <Stage
            width={containerDimensions.width}
            height={containerDimensions.height}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePosition.x}
            y={stagePosition.y}
            draggable={true}
            onDragEnd={(e) => {
              if (e.target === e.target.getStage()) {
                setStagePosition({ x: e.target.x(), y: e.target.y() });
              }
            }}
            style={{ cursor: 'grab' }}
          >
            <Layer>
              <CroquisGridBackground
                width={croquisRemoto?.anchoLienzo || 1600}
                height={croquisRemoto?.altoLienzo || 1000}
              />
              {nodosRemotos.map((nodo) => {
                const isSelected = Boolean(
                  (selectedSpaceCode &&
                    nodo.tipo === 'ESPACIO' &&
                    nodo.codigoEspacio === selectedSpaceCode) ||
                  (selectedSpaceId &&
                    nodo.tipo === 'ESPACIO' &&
                    nodo.espacioId === selectedSpaceId),
                );

                if (nodo.tipo === 'ESPACIO') {
                  return (
                    <CroquisBoxNode
                      key={nodo.id}
                      node={nodo}
                      isSelected={isSelected}
                      modo="MONITOREO"
                      snapToGrid={false}
                      onSelect={handleNodeSelect}
                      onChange={() => {}}
                    />
                  );
                }

                if (nodo.tipo === 'MURO') {
                  return (
                    <CroquisMuroNode
                      key={nodo.id}
                      node={nodo as CroquisMuroNodeType}
                      isSelected={false}
                      modo="MONITOREO"
                      snapToGrid={false}
                      onSelect={() => {}}
                      onChange={() => {}}
                    />
                  );
                }

                if (nodo.tipo === 'FLECHA') {
                  return (
                    <CroquisFlechaNode
                      key={nodo.id}
                      node={nodo as CroquisFlechaNodeType}
                      isSelected={false}
                      modo="MONITOREO"
                      snapToGrid={false}
                      onSelect={() => {}}
                      onChange={() => {}}
                    />
                  );
                }

                if (nodo.tipo === 'PUERTA') {
                  return (
                    <CroquisPuertaNode
                      key={nodo.id}
                      node={nodo as CroquisPuertaNodeType}
                      isSelected={false}
                      modo="MONITOREO"
                      snapToGrid={false}
                      onSelect={() => {}}
                      onChange={() => {}}
                    />
                  );
                }

                if (nodo.tipo === 'ENTRADA') {
                  return (
                    <CroquisEntradaNode
                      key={nodo.id}
                      node={nodo as CroquisEntradaNodeType}
                      isSelected={false}
                      modo="MONITOREO"
                      snapToGrid={false}
                      onSelect={() => {}}
                      onChange={() => {}}
                    />
                  );
                }

                return null;
              })}
            </Layer>
          </Stage>
        ) : (
          /* ESCENARIO B: Plano Arquitectónico Generativo Estructurado 2D */
          <div
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '820px',
              transform: `scale(${stageScale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease',
            }}
          >
            {/* Marco de Edificación / Nivel */}
            <div
              style={{
                width: '100%',
                maxWidth: '920px',
                background: '#FFFFFF',
                border: '3px solid #0F172A',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                position: 'relative',
                padding: '1.5rem',
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            >
              {/* Acceso Vehicular (Entrada / Salida) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '60px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  letterSpacing: '0.04em',
                }}
              >
                <i className="fa-solid fa-arrow-down" style={{ color: '#22C55E' }}></i>
                ACCESO VEHICULAR (BARRERA AUTOMÁTICA)
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '-18px',
                  right: '60px',
                  background: '#334155',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  letterSpacing: '0.04em',
                }}
              >
                <i className="fa-solid fa-person-walking" style={{ color: '#38BDF8' }}></i>
                ACCESO PEATONAL
              </div>

              {/* Batería Superior de Boxes (Norte) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                  Bahía Norte • Estacionamiento Perimetral
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {spacesForCurrentLevel.slice(0, Math.ceil(spacesForCurrentLevel.length / 2)).map((space) => {
                    const isAvailable = space.status === 'DISPONIBLE';
                    const isSelected = selectedSpaceCode === space.code || selectedSpaceId === space.id;
                    const typeInfo = getTypeBadge(space.type);

                    return (
                      <div
                        key={space.id}
                        onClick={() => {
                          if (isAvailable) {
                            onSelectSpace(space.id, space.code);
                          }
                        }}
                        style={{
                          background: isSelected ? '#EBF7EE' : isAvailable ? '#F0FDF4' : '#F8FAFC',
                          border: isSelected
                            ? '2px solid #006D36'
                            : isAvailable
                            ? '1.5px solid #86EFAC'
                            : '1.5px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '0.6rem 0.5rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 0 0 3px rgba(0, 109, 54, 0.2)' : 'none',
                          opacity: !isAvailable && !isSelected ? 0.7 : 1,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.65rem',
                          }}
                        >
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                            {space.code}
                          </span>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isSelected ? '#006D36' : isAvailable ? '#10B981' : '#EF4444',
                            }}
                          ></span>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            height: '42px',
                            background: isSelected ? '#DCFCE7' : isAvailable ? '#FFFFFF' : '#E2E8F0',
                            borderRadius: '4px',
                            border: isSelected
                              ? '1px dashed #006D36'
                              : isAvailable
                              ? '1px dashed #A7F3D0'
                              : '1px dashed #94A3B8',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.15rem',
                          }}
                        >
                          <i
                            className={typeInfo.icon}
                            style={{
                              fontSize: '1.1rem',
                              color: isSelected ? '#006D36' : isAvailable ? typeInfo.color : '#94A3B8',
                            }}
                          ></i>
                          <span
                            style={{
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              color: isSelected ? '#006D36' : isAvailable ? '#059669' : '#64748B',
                            }}
                          >
                            {isSelected ? 'ELEGIDO' : isAvailable ? 'LIBRE' : 'OCUPADO'}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 700,
                            padding: '0.05rem 0.35rem',
                            borderRadius: '3px',
                            background: typeInfo.bg,
                            color: typeInfo.color,
                          }}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vía Principal de Circulación Vehicular (Calle central demarcada) */}
              <div
                style={{
                  margin: '1.25rem 0',
                  padding: '1rem 1.5rem',
                  background: '#1E293B',
                  borderRadius: '6px',
                  color: '#F8FAFC',
                  borderTop: '2px dashed #EAB308',
                  borderBottom: '2px dashed #EAB308',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: '#FACC15' }}>
                  <i className="fa-solid fa-arrow-right-long" style={{ fontSize: '1.1rem' }}></i>
                  <span>CARRIL DE CIRCULACIÓN VEHICULAR (VELOCIDAD MÁX. 10 KM/H)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                  <span>SENTIDO ÚNICO</span>
                  <i className="fa-solid fa-arrow-right-long" style={{ color: '#FACC15' }}></i>
                </div>
              </div>

              {/* Batería Inferior de Boxes (Sur) */}
              <div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                  Bahía Sur • Estacionamiento Techado
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(105px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {spacesForCurrentLevel.slice(Math.ceil(spacesForCurrentLevel.length / 2)).map((space) => {
                    const isAvailable = space.status === 'DISPONIBLE';
                    const isSelected = selectedSpaceCode === space.code || selectedSpaceId === space.id;
                    const typeInfo = getTypeBadge(space.type);

                    return (
                      <div
                        key={space.id}
                        onClick={() => {
                          if (isAvailable) {
                            onSelectSpace(space.id, space.code);
                          }
                        }}
                        style={{
                          background: isSelected ? '#EBF7EE' : isAvailable ? '#F0FDF4' : '#F8FAFC',
                          border: isSelected
                            ? '2px solid #006D36'
                            : isAvailable
                            ? '1.5px solid #86EFAC'
                            : '1.5px solid #CBD5E1',
                          borderRadius: '6px',
                          padding: '0.6rem 0.5rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 0 0 3px rgba(0, 109, 54, 0.2)' : 'none',
                          opacity: !isAvailable && !isSelected ? 0.7 : 1,
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.65rem',
                          }}
                        >
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                            {space.code}
                          </span>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: isSelected ? '#006D36' : isAvailable ? '#10B981' : '#EF4444',
                            }}
                          ></span>
                        </div>

                        <div
                          style={{
                            width: '100%',
                            height: '42px',
                            background: isSelected ? '#DCFCE7' : isAvailable ? '#FFFFFF' : '#E2E8F0',
                            borderRadius: '4px',
                            border: isSelected
                              ? '1px dashed #006D36'
                              : isAvailable
                              ? '1px dashed #A7F3D0'
                              : '1px dashed #94A3B8',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.15rem',
                          }}
                        >
                          <i
                            className={typeInfo.icon}
                            style={{
                              fontSize: '1.1rem',
                              color: isSelected ? '#006D36' : isAvailable ? typeInfo.color : '#94A3B8',
                            }}
                          ></i>
                          <span
                            style={{
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              color: isSelected ? '#006D36' : isAvailable ? '#059669' : '#64748B',
                            }}
                          >
                            {isSelected ? 'ELEGIDO' : isAvailable ? 'LIBRE' : 'OCUPADO'}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '0.58rem',
                            fontWeight: 700,
                            padding: '0.05rem 0.35rem',
                            borderRadius: '3px',
                            background: typeInfo.bg,
                            color: typeInfo.color,
                          }}
                        >
                          {typeInfo.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Salida Vehicular (Pie de plano) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-18px',
                  right: '60px',
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  letterSpacing: '0.04em',
                }}
              >
                <i className="fa-solid fa-arrow-up" style={{ color: '#FACC15' }}></i>
                SALIDA VEHICULAR
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Banner de Plaza Seleccionada desde el Croquis */}
      {selectedSpaceCode && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            background: '#EBF7EE',
            borderTop: '1px solid #BAE6C8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#006D36',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: '#0F172A', fontWeight: 800 }}>
                Plaza elegida en el croquis: <span style={{ color: '#006D36', fontFamily: 'monospace' }}>{selectedSpaceCode}</span>
              </span>
              <p style={{ margin: 0, fontSize: '0.74rem', color: '#047857' }}>
                Este box quedará asignado en tu ticket de reserva. Presiona "Reservar Ahora" en la barra inferior para continuar.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onClearSelection && (
              <button
                type="button"
                onClick={onClearSelection}
                style={{
                  background: 'transparent',
                  border: '1px solid #BAE6C8',
                  borderRadius: '4px',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#065F46',
                  cursor: 'pointer',
                }}
              >
                Deseleccionar
              </button>
            )}
            {onProceedToBooking && (
              <button
                type="button"
                onClick={onProceedToBooking}
                style={{
                  background: '#006D36',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 4px rgba(0, 109, 54, 0.25)',
                }}
              >
                <span>Apartar {selectedSpaceCode}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
