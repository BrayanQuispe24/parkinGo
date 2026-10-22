import React from 'react';
import { Group, Rect, Text, Line } from 'react-konva';
import type Konva from 'konva';
import type { CroquisPuertaNode as CroquisPuertaNodeType } from '../../../domain/Croquis';
import { pxToMeters, PIXELS_PER_METER } from '../../../domain/Croquis';
import { useCroquisEditorStore, type ModoCroquis } from '../../../application/useCroquisEditorStore';

interface CroquisPuertaNodeProps {
  node: CroquisPuertaNodeType;
  isSelected: boolean;
  modo: ModoCroquis;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onChange: (updated: CroquisPuertaNodeType) => void;
}

export const CroquisPuertaNode: React.FC<CroquisPuertaNodeProps> = ({
  node,
  isSelected,
  modo,
  snapToGrid,
  onSelect,
  onChange,
}) => {
  const { showDimensions } = useCroquisEditorStore();
  const isDraggable = modo === 'DISENIO';

  const getColorTheme = () => {
    switch (node.subtipo) {
      case 'ENTRADA':
        return {
          fill: '#ECFDF5',
          stroke: '#059669',
          barColor: '#10B981',
          textColor: '#065F46',
          label: 'ENTRADA ➜',
        };
      case 'SALIDA':
        return {
          fill: '#FFFBEB',
          stroke: '#D97706',
          barColor: '#F59E0B',
          textColor: '#92400E',
          label: 'SALIDA ➜',
        };
      case 'MIXTO':
      default:
        return {
          fill: '#EFF6FF',
          stroke: '#2563EB',
          barColor: '#3B82F6',
          textColor: '#1E40AF',
          label: 'PORTÓN ⇄',
        };
    }
  };

  const theme = getColorTheme();

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

    const newWidth = Math.max(40, Math.round(node.width * scaleX));
    const newHeight = Math.max(16, Math.round(node.height * scaleY));
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

  // Alternar subtipo con doble clic (ENTRADA -> SALIDA -> MIXTO -> ENTRADA)
  const handleDblClick = () => {
    if (modo !== 'DISENIO') return;
    const nextSubtipo =
      node.subtipo === 'ENTRADA'
        ? 'SALIDA'
        : node.subtipo === 'SALIDA'
        ? 'MIXTO'
        : 'ENTRADA';
    onChange({ ...node, subtipo: nextSubtipo });
  };

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
      {/* Fondo del área de puerta/acceso */}
      <Rect
        width={node.width}
        height={node.height}
        fill={theme.fill}
        stroke={isSelected ? '#006D36' : theme.stroke}
        strokeWidth={isSelected ? 3 : 2}
        cornerRadius={3}
        dash={[4, 4]}
      />

      {/* Postes laterales de la puerta */}
      <Rect
        x={0}
        y={0}
        width={6}
        height={node.height}
        fill={theme.stroke}
        cornerRadius={1}
      />
      <Rect
        x={node.width - 6}
        y={0}
        width={6}
        height={node.height}
        fill={theme.stroke}
        cornerRadius={1}
      />

      {/* Barrera central */}
      <Line
        points={[6, node.height / 2, node.width - 6, node.height / 2]}
        stroke={theme.barColor}
        strokeWidth={3}
        dash={[8, 4]}
      />

      {/* Etiqueta de la puerta */}
      <Text
        text={theme.label}
        width={node.width}
        y={node.height / 2 - 5}
        align="center"
        fontSize={Math.max(9, Math.min(11, node.height / 2.2))}
        fontStyle="bold"
        fill={theme.textColor}
        listening={false}
      />

      {/* Cota de dimensión de ancho */}
      {(showDimensions || isSelected) && (
        <Group listening={false}>
          <Line
            points={[0, -8, node.width, -8]}
            stroke={isSelected ? '#006D36' : theme.stroke}
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[0, -12, 0, -4]}
            stroke={isSelected ? '#006D36' : theme.stroke}
            strokeWidth={1.2}
          />
          <Line
            points={[node.width, -12, node.width, -4]}
            stroke={isSelected ? '#006D36' : theme.stroke}
            strokeWidth={1.2}
          />
          <Rect
            x={Math.max(0, node.width / 2 - 24)}
            y={-18}
            width={48}
            height={13}
            fill={isSelected ? '#006D36' : theme.stroke}
            cornerRadius={2}
          />
          <Text
            x={Math.max(0, node.width / 2 - 24)}
            y={-16}
            width={48}
            text={`${pxToMeters(node.width).toFixed(1)}m`}
            align="center"
            fontSize={7.5}
            fontStyle="bold"
            fill="#FFFFFF"
          />
        </Group>
      )}
    </Group>
  );
};
