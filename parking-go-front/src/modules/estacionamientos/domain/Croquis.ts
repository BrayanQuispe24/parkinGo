import type { EstadoEspacio, TipoEspacio } from './Espacio';

export type TipoNodoCroquis = 'ESPACIO' | 'MURO' | 'FLECHA' | 'PUERTA' | 'ENTRADA';
export type SubtipoPuerta = 'ENTRADA' | 'SALIDA' | 'MIXTO';
export type SubtipoEntrada = 'VEHICULAR' | 'PEATONAL' | 'MIXTA';

export interface CroquisNodeBase {
  id: string;
  tipo: TipoNodoCroquis;
  x: number;
  y: number;
  rotation?: number;
}

export interface CroquisEspacioNode extends CroquisNodeBase {
  tipo: 'ESPACIO';
  espacioId: string;
  codigoEspacio: string;
  width: number;
  height: number;
  tipoVehiculo: TipoEspacio;
  estado: EstadoEspacio;
}

export interface CroquisMuroNode extends CroquisNodeBase {
  tipo: 'MURO';
  width: number;
  height: number;
}

export interface CroquisFlechaNode extends CroquisNodeBase {
  tipo: 'FLECHA';
  points: number[];
}

export interface CroquisPuertaNode extends CroquisNodeBase {
  tipo: 'PUERTA';
  subtipo: SubtipoPuerta;
  width: number;
  height: number;
}

export interface CroquisEntradaNode extends CroquisNodeBase {
  tipo: 'ENTRADA';
  subtipoEntrada: SubtipoEntrada;
  width: number;
  height: number;
  nombre?: string;
  conBarrera: boolean;
}

export type CroquisNode =
  | CroquisEspacioNode
  | CroquisMuroNode
  | CroquisFlechaNode
  | CroquisPuertaNode
  | CroquisEntradaNode;

// Constantes y funciones de conversión de escala arquitectónica (25 px = 1 metro)
export const PIXELS_PER_METER = 25;

export function pxToMeters(px: number): number {
  return Number((px / PIXELS_PER_METER).toFixed(2));
}

export function metersToPx(meters: number): number {
  return Math.round(meters * PIXELS_PER_METER);
}

export function formatDimension(px: number): string {
  const m = pxToMeters(px);
  return `${m.toFixed(1)} m`;
}

export type TipoFondoCroquis =
  | 'PLANO'
  | 'ASFALTO'
  | 'CONCRETO'
  | 'EPOXICO'
  | 'PERSONALIZADO';

export interface CroquisCanvasContent {
  anchoLienzo: number;
  altoLienzo: number;
  nodos: CroquisNode[];
}

export interface CroquisModel {
  id: string;
  codigo: string;
  anchoLienzo: number;
  altoLienzo: number;
  contenido: CroquisCanvasContent | null;
  fondoTipo?: TipoFondoCroquis;
  fondoImagenUrl?: string | null;
  fondoOpacidad?: number;
  nivelId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuardarCroquisPayload {
  codigo?: string;
  anchoLienzo?: number;
  altoLienzo?: number;
  contenido: CroquisCanvasContent;
  fondoTipo?: TipoFondoCroquis;
  fondoImagenUrl?: string | null;
  fondoOpacidad?: number;
}
