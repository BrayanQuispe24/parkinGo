import React, { useMemo, useState, useEffect } from 'react';
import { Group, Line, Rect, Text, Image as KonvaImage } from 'react-konva';
import { useCroquisEditorStore } from '../../../application/useCroquisEditorStore';
import { parkingoApi } from '../../../../../core/api/parkingoApi';

export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  const apiBase = (parkingoApi.defaults.baseURL || 'http://localhost:3000/api').replace(
    /\/api\/?$/,
    '',
  );
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
}

interface CroquisGridBackgroundProps {
  width: number;
  height: number;
  gridSize?: number;
}

export const CroquisGridBackground: React.FC<CroquisGridBackgroundProps> = ({
  width,
  height,
  gridSize = 25,
}) => {
  const { showDimensions, fondoTipo, fondoImagenUrl, fondoOpacidad } =
    useCroquisEditorStore();

  // Imagen HTML para KonvaImage si es PERSONALIZADO
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (fondoTipo !== 'PERSONALIZADO' || !fondoImagenUrl) {
      setCustomImage(null);
      return;
    }

    const fullUrl = resolveImageUrl(fondoImagenUrl);
    if (!fullUrl) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = fullUrl;
    img.onload = () => {
      setCustomImage(img);
    };
    img.onerror = () => {
      console.warn('No se pudo cargar la imagen de fondo:', fullUrl);
      setCustomImage(null);
    };
  }, [fondoTipo, fondoImagenUrl]);

  const lines = useMemo(() => {
    const verticalLines: number[][] = [];
    const horizontalLines: number[][] = [];

    for (let x = 0; x <= width; x += gridSize) {
      verticalLines.push([x, 0, x, height]);
    }

    for (let y = 0; y <= height; y += gridSize) {
      horizontalLines.push([0, y, width, y]);
    }

    return { verticalLines, horizontalLines };
  }, [width, height, gridSize]);

  // Juntas de dilatación para textura de CONCRETO (cada 5 metros = 125px)
  const concreteExpansionJoints = useMemo(() => {
    if (fondoTipo !== 'CONCRETO') return [];
    const joints: number[][] = [];
    const jointStep = gridSize * 5; // 125px = 5 metros
    for (let x = 0; x <= width; x += jointStep) {
      joints.push([x, 0, x, height]);
    }
    for (let y = 0; y <= height; y += jointStep) {
      joints.push([0, y, width, y]);
    }
    return joints;
  }, [fondoTipo, width, height, gridSize]);

  // Colores dinámicos del lienzo y del grid según el fondo
  const gridStyle = useMemo(() => {
    switch (fondoTipo) {
      case 'ASFALTO':
        return {
          baseFill: '#1E293B',
          majorGridColor: 'rgba(255, 255, 255, 0.15)',
          minorGridColor: 'rgba(255, 255, 255, 0.05)',
          rulerBg: '#0F172A',
          rulerText: '#94A3B8',
          rulerTick: '#64748B',
        };
      case 'CONCRETO':
        return {
          baseFill: '#94A3B8',
          majorGridColor: 'rgba(15, 23, 42, 0.25)',
          minorGridColor: 'rgba(15, 23, 42, 0.10)',
          rulerBg: '#64748B',
          rulerText: '#F1F5F9',
          rulerTick: '#CBD5E1',
        };
      case 'EPOXICO':
        return {
          baseFill: '#064E3B',
          majorGridColor: 'rgba(255, 255, 255, 0.22)',
          minorGridColor: 'rgba(255, 255, 255, 0.08)',
          rulerBg: '#022C22',
          rulerText: '#A7F3D0',
          rulerTick: '#34D399',
        };
      case 'PERSONALIZADO':
        return {
          baseFill: '#F8FAFC',
          majorGridColor: 'rgba(15, 23, 42, 0.35)',
          minorGridColor: 'rgba(15, 23, 42, 0.15)',
          rulerBg: '#F1F5F9',
          rulerText: '#334155',
          rulerTick: '#64748B',
        };
      case 'PLANO':
      default:
        return {
          baseFill: '#F8FAFC',
          majorGridColor: '#E2E8F0',
          minorGridColor: '#F1F5F9',
          rulerBg: '#F1F5F9',
          rulerText: '#475569',
          rulerTick: '#94A3B8',
        };
    }
  }, [fondoTipo]);

  // Marcadores de regla métrica cada 5 metros (125px) y cada 1 metro (25px)
  const rulerTicks = useMemo(() => {
    const xTicks: Array<{ x: number; label?: string; isMajor: boolean }> = [];
    const yTicks: Array<{ y: number; label?: string; isMajor: boolean }> = [];

    for (let x = 0; x <= width; x += gridSize) {
      const meter = Math.round(x / gridSize);
      const isMajor = meter % 5 === 0;
      xTicks.push({
        x,
        isMajor,
        label: isMajor ? `${meter}m` : undefined,
      });
    }

    for (let y = 0; y <= height; y += gridSize) {
      const meter = Math.round(y / gridSize);
      const isMajor = meter % 5 === 0;
      yTicks.push({
        y,
        isMajor,
        label: isMajor ? `${meter}m` : undefined,
      });
    }

    return { xTicks, yTicks };
  }, [width, height, gridSize]);

  return (
    <>
      {/* Fondo base sólido neutro */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#F8FAFC"
        stroke="#94A3B8"
        strokeWidth={2}
        shadowColor="rgba(0, 0, 0, 0.05)"
        shadowBlur={12}
        shadowOffset={{ x: 0, y: 4 }}
        listening={false}
      />

      {/* Capa de textura simulada (Asfalto, Concreto, Epoxico) */}
      {fondoTipo !== 'PLANO' && fondoTipo !== 'PERSONALIZADO' && (
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={gridStyle.baseFill}
          opacity={fondoOpacidad ?? 0.4}
          listening={false}
        />
      )}

      {/* Juntas de dilatación para textura de concreto */}
      {concreteExpansionJoints.map((pts, idx) => (
        <Line
          key={`joint-${idx}`}
          points={pts}
          stroke="#475569"
          strokeWidth={1.5}
          dash={[8, 4]}
          opacity={(fondoOpacidad ?? 0.4) * 0.7}
          listening={false}
        />
      ))}

      {/* Imagen personalizada de fondo (plano arquitectónico) */}
      {fondoTipo === 'PERSONALIZADO' && customImage && (
        <KonvaImage
          image={customImage}
          x={0}
          y={0}
          width={width}
          height={height}
          opacity={fondoOpacidad ?? 0.4}
          listening={false}
        />
      )}

      {/* Cuadrícula milimétrica vertical */}
      {lines.verticalLines.map((pts, idx) => (
        <Line
          key={`v-${idx}`}
          points={pts}
          stroke={idx % 4 === 0 ? gridStyle.majorGridColor : gridStyle.minorGridColor}
          strokeWidth={idx % 4 === 0 ? 1 : 0.6}
          listening={false}
        />
      ))}

      {/* Cuadrícula milimétrica horizontal */}
      {lines.horizontalLines.map((pts, idx) => (
        <Line
          key={`h-${idx}`}
          points={pts}
          stroke={idx % 4 === 0 ? gridStyle.majorGridColor : gridStyle.minorGridColor}
          strokeWidth={idx % 4 === 0 ? 1 : 0.6}
          listening={false}
        />
      ))}

      {/* Regla métrica y cotas perimetrales */}
      {showDimensions && (
        <Group listening={false}>
          {/* Banda de regla superior (Eje X) */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={16}
            fill="#F1F5F9"
            opacity={0.85}
          />
          <Line
            points={[0, 16, width, 16]}
            stroke="#CBD5E1"
            strokeWidth={1}
          />

          {/* Banda de regla izquierda (Eje Y) */}
          <Rect
            x={0}
            y={0}
            width={24}
            height={height}
            fill="#F1F5F9"
            opacity={0.85}
          />
          <Line
            points={[24, 0, 24, height]}
            stroke="#CBD5E1"
            strokeWidth={1}
          />

          {/* Ticks y etiquetas del Eje X */}
          {rulerTicks.xTicks.map((tick, idx) => (
            <React.Fragment key={`rx-${idx}`}>
              <Line
                points={[tick.x, 0, tick.x, tick.isMajor ? 16 : 8]}
                stroke={tick.isMajor ? '#475569' : '#94A3B8'}
                strokeWidth={tick.isMajor ? 1.2 : 0.8}
              />
              {tick.label && tick.x > 15 && tick.x < width - 10 && (
                <Text
                  x={tick.x - 14}
                  y={3}
                  text={tick.label}
                  fontSize={9}
                  fontStyle="bold"
                  fill="#475569"
                />
              )}
            </React.Fragment>
          ))}

          {/* Ticks y etiquetas del Eje Y */}
          {rulerTicks.yTicks.map((tick, idx) => (
            <React.Fragment key={`ry-${idx}`}>
              <Line
                points={[0, tick.y, tick.isMajor ? 24 : 12]}
                stroke={tick.isMajor ? '#475569' : '#94A3B8'}
                strokeWidth={tick.isMajor ? 1.2 : 0.8}
              />
              {tick.label && tick.y > 15 && tick.y < height - 10 && (
                <Text
                  x={3}
                  y={tick.y - 5}
                  text={tick.label}
                  fontSize={8}
                  fontStyle="bold"
                  fill="#475569"
                />
              )}
            </React.Fragment>
          ))}

          {/* Esquina origen 0,0 */}
          <Rect
            x={0}
            y={0}
            width={24}
            height={16}
            fill="#E2E8F0"
          />
          <Text
            x={2}
            y={3}
            text="0,0"
            fontSize={8}
            fontStyle="bold"
            fill="#334155"
          />

          {/* Etiqueta de cotas totales en la esquina inferior derecha */}
          <Rect
            x={width - 150}
            y={height - 24}
            width={146}
            height={20}
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth={1}
            cornerRadius={3}
            opacity={0.92}
          />
          <Text
            x={width - 146}
            y={height - 20}
            text={`${(width / gridSize).toFixed(1)}m × ${(height / gridSize).toFixed(1)}m`}
            fontSize={10}
            fontStyle="bold"
            fill="#0F172A"
          />
        </Group>
      )}
    </>
  );
};
