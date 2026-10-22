import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type Konva from 'konva';
import type { CroquisEntradaNode as CroquisEntradaNodeType } from '../../../domain/Croquis';
import { pxToMeters, PIXELS_PER_METER } from '../../../domain/Croquis';
import { useCroquisEditorStore, type ModoCroquis } from '../../../application/useCroquisEditorStore';

interface CroquisEntradaNodeProps {
  node: CroquisEntradaNodeType;
  isSelected: boolean;
  modo: ModoCroquis;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onChange: (updated: CroquisEntradaNodeType) => void;
}

export const CroquisEntradaNode: React.FC<CroquisEntradaNodeProps> = ({
  node,
  isSelected,
  modo,
  snapToGrid,
  onSelect,
  onChange,
}) => {
  const { showDimensions } = useCroquisEditorStore();
  const isDraggable = modo === 'DISENIO';

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    let newX = e.target.x();
    let newY = e.target.y();

    if (snapToGrid) {
      newX = Math.round(newX / PIXELS_PER_METER) * PIXELS_PER_METER;
      newY = Math.round(newY / PIXELS_PER_METER) * PIXELS_PER_METER;
      e.target.x(newX);
      e.target.y(newY);
    }

    onChange({
      ...node,
      x: newX,
      y: newY,
    });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const target = e.target;
    const scaleX = target.scaleX();
    const scaleY = target.scaleY();

    target.scaleX(1);
    target.scaleY(1);

    const newWidth = Math.max(50, Math.round(node.width * scaleX));
    const newHeight = Math.max(30, Math.round(node.height * scaleY));
    const newRotation = Math.round(target.rotation() % 360);

    onChange({
      ...node,
      x: target.x(),
      y: target.y(),
      width: newWidth,
      height: newHeight,
      rotation: newRotation,
    });
  };

  // Alternar subtipo con doble clic (VEHICULAR -> PEATONAL -> MIXTA)
  const handleDblClick = () => {
    if (modo !== 'DISENIO') return;
    const nextSubtipo =
      node.subtipoEntrada === 'VEHICULAR'
        ? 'PEATONAL'
        : node.subtipoEntrada === 'PEATONAL'
        ? 'MIXTA'
        : 'VEHICULAR';
    onChange({ ...node, subtipoEntrada: nextSubtipo });
  };

  const widthMeters = pxToMeters(node.width);
  const shouldShowDimensions = showDimensions || isSelected;

  return (
    <Group
      id={node.id}
      x={node.x}
      y={node.y}
      rotation={node.rotation || 0}
      draggable={isDraggable}
      onClick={(e) => {
        e.cancelBubble = true;
        onSelect(node.id);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelect(node.id);
      }}
      onDblClick={handleDblClick}
      onDblTap={handleDblClick}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      {/* Carril de asfalto / zona de acceso */}
      <Rect
        width={node.width}
        height={node.height}
        fill="#0F172A"
        stroke={isSelected ? '#006D36' : '#22C55E'}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={3}
        shadowColor={isSelected ? 'rgba(0, 109, 54, 0.35)' : 'rgba(0, 0, 0, 0.15)'}
        shadowBlur={isSelected ? 10 : 4}
      />

      {/* Líneas divisorias de carril viales (amarillo brillante discontinuo) */}
      <Line
        points={[node.width / 2, 4, node.width / 2, node.height - 4]}
        stroke="#EAB308"
        strokeWidth={2}
        dash={[6, 4]}
        listening={false}
      />

      {/* Líneas de parada / paso peatonal al inicio */}
      <Line
        points={[4, 6, node.width - 4, 6]}
        stroke="#FFFFFF"
        strokeWidth={3}
        dash={[8, 4]}
        listening={false}
      />

      {/* Poste / Caseta izquierda de control de acceso */}
      <Rect
        x={2}
        y={node.height - 10}
        width={8}
        height={8}
        fill="#22C55E"
        cornerRadius={2}
        stroke="#FFFFFF"
        strokeWidth={1}
      />

      {/* Poste derecho */}
      <Rect
        x={node.width - 10}
        y={node.height - 10}
        width={8}
        height={8}
        fill="#22C55E"
        cornerRadius={2}
        stroke="#FFFFFF"
        strokeWidth={1}
      />

      {/* Pluma / Barrera de control vehicular (si conBarrera está activo) */}
      {node.conBarrera && (
        <Line
          points={[10, node.height - 6, node.width - 10, node.height - 6]}
          stroke="#EF4444"
          strokeWidth={3.5}
          dash={[8, 6]}
          listening={false}
        />
      )}

      {/* Flechas verdes direccionales apuntando hacia el interior (hacia arriba) */}
      <Line
        points={[
          node.width / 4 - 6,
          node.height / 2 + 4,
          node.width / 4,
          node.height / 2 - 4,
          node.width / 4 + 6,
          node.height / 2 + 4,
        ]}
        stroke="#4ADE80"
        strokeWidth={2.5}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />
      <Line
        points={[
          (3 * node.width) / 4 - 6,
          node.height / 2 + 4,
          (3 * node.width) / 4,
          node.height / 2 - 4,
          (3 * node.width) / 4 + 6,
          node.height / 2 + 4,
        ]}
        stroke="#4ADE80"
        strokeWidth={2.5}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />

      {/* Etiqueta ENTRADA */}
      <Text
        text={node.nombre || 'ENTRADA ⬇'}
        width={node.width}
        y={node.height / 2 - 5}
        align="center"
        fontSize={Math.max(9, Math.min(11, node.height / 3.5))}
        fontStyle="bold"
        fill="#F8FAFC"
        listening={false}
      />

      {/* Subtipo badge */}
      {node.height >= 40 && (
        <Text
          text={node.subtipoEntrada}
          width={node.width}
          y={node.height / 2 + 8}
          align="center"
          fontSize={7}
          fontStyle="bold"
          fill="#86EFAC"
          listening={false}
        />
      )}

      {/* Cotas arquitectónicas exteriores */}
      {shouldShowDimensions && (
        <Group listening={false}>
          {/* Cota de ancho de carril */}
          <Line
            points={[0, -8, node.width, -8]}
            stroke={isSelected ? '#006D36' : '#22C55E'}
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[0, -12, 0, -4]}
            stroke={isSelected ? '#006D36' : '#22C55E'}
            strokeWidth={1.2}
          />
          <Line
            points={[node.width, -12, node.width, -4]}
            stroke={isSelected ? '#006D36' : '#22C55E'}
            strokeWidth={1.2}
          />
          <Rect
            x={Math.max(0, node.width / 2 - 28)}
            y={-19}
            width={56}
            height={13}
            fill={isSelected ? '#006D36' : '#064E3B'}
            cornerRadius={2}
          />
          <Text
            x={Math.max(0, node.width / 2 - 28)}
            y={-17}
            width={56}
            text={`Paso ${widthMeters.toFixed(1)}m`}
            align="center"
            fontSize={7.5}
            fontStyle="bold"
            fill="#ECFDF5"
          />
        </Group>
      )}
    </Group>
  );
};
