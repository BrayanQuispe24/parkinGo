import { create } from 'zustand';
import type { TipoFondoCroquis } from '../domain/Croquis';

export type HerramientaCroquis = 'SELECT' | 'PAN' | 'MURO' | 'FLECHA';
export type ModoCroquis = 'DISENIO' | 'MONITOREO';

interface CroquisEditorState {
  modo: ModoCroquis;
  herramienta: HerramientaCroquis;
  selectedNodeId: string | null;
  stageScale: number;
  stagePosition: { x: number; y: number };
  snapToGrid: boolean;
  isFullscreen: boolean;
  showDimensions: boolean;
  isDimensionModalOpen: boolean;

  // Configuración del fondo del lienzo (suelo / plano)
  fondoTipo: TipoFondoCroquis;
  fondoImagenUrl: string | null;
  fondoOpacidad: number;
  isFondoModalOpen: boolean;

  setModo: (modo: ModoCroquis) => void;
  setHerramienta: (herramienta: HerramientaCroquis) => void;
  setSelectedNodeId: (id: string | null) => void;
  setStageScale: (scale: number) => void;
  setStagePosition: (pos: { x: number; y: number }) => void;
  toggleSnapToGrid: () => void;
  toggleFullscreen: () => void;
  setIsFullscreen: (val: boolean) => void;
  toggleShowDimensions: () => void;
  setIsDimensionModalOpen: (open: boolean) => void;
  resetView: () => void;

  setFondoTipo: (tipo: TipoFondoCroquis) => void;
  setFondoImagenUrl: (url: string | null) => void;
  setFondoOpacidad: (opacidad: number) => void;
  setIsFondoModalOpen: (open: boolean) => void;
  setFondoConfig: (config: {
    fondoTipo?: TipoFondoCroquis;
    fondoImagenUrl?: string | null;
    fondoOpacidad?: number;
  }) => void;
}

export const useCroquisEditorStore = create<CroquisEditorState>((set) => ({
  modo: 'DISENIO',
  herramienta: 'SELECT',
  selectedNodeId: null,
  stageScale: 1,
  stagePosition: { x: 0, y: 0 },
  snapToGrid: true,
  isFullscreen: false,
  showDimensions: true,
  isDimensionModalOpen: false,

  fondoTipo: 'PLANO',
  fondoImagenUrl: null,
  fondoOpacidad: 0.4,
  isFondoModalOpen: false,

  setModo: (modo) =>
    set({
      modo,
      selectedNodeId: null,
      herramienta: 'SELECT',
    }),

  setHerramienta: (herramienta) => set({ herramienta }),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  setStageScale: (stageScale) => set({ stageScale }),

  setStagePosition: (stagePosition) => set({ stagePosition }),

  toggleSnapToGrid: () =>
    set((state) => ({ snapToGrid: !state.snapToGrid })),

  toggleFullscreen: () =>
    set((state) => ({ isFullscreen: !state.isFullscreen })),

  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),

  toggleShowDimensions: () =>
    set((state) => ({ showDimensions: !state.showDimensions })),

  setIsDimensionModalOpen: (isDimensionModalOpen) => set({ isDimensionModalOpen }),

  resetView: () =>
    set({
      stageScale: 1,
      stagePosition: { x: 0, y: 0 },
    }),

  setFondoTipo: (fondoTipo) => set({ fondoTipo }),
  setFondoImagenUrl: (fondoImagenUrl) => set({ fondoImagenUrl }),
  setFondoOpacidad: (fondoOpacidad) => set({ fondoOpacidad }),
  setIsFondoModalOpen: (isFondoModalOpen) => set({ isFondoModalOpen }),
  setFondoConfig: (config) =>
    set((state) => ({
      fondoTipo: config.fondoTipo ?? state.fondoTipo,
      fondoImagenUrl:
        config.fondoImagenUrl !== undefined
          ? config.fondoImagenUrl
          : state.fondoImagenUrl,
      fondoOpacidad:
        config.fondoOpacidad !== undefined
          ? config.fondoOpacidad
          : state.fondoOpacidad,
    })),
}));
