import React from 'react';
import { Group, Arrow, Text, Line, Rect } from 'react-konva';
import type Konva from 'konva';
import type { CroquisFlechaNode as CroquisFlechaNodeType } from '../../../domain/Croquis';
import { pxToMeters, PIXELS_PER_METER } from '../../../domain/Croquis';
import { useCroquisEditorStore, type ModoCroquis } from '../../../application/useCroquisEditorStore';

interface CroquisFlechaNodeProps {
  node: CroquisFlechaNodeType;
  isSelected: boolean;
  modo: ModoCroquis;
  snapToGrid: boolean;
  onSelect: (id: string) => void;
  onChange: (updated: CroquisFlechaNodeType) => void;
}

export const CroquisFlechaNode: React.FC<CroquisFlechaNodeProps> = ({
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
    target.scaleX(1);
    target.scaleY(1);
    const newRotation = Math.round(target.rotation() % 360);

    const currentPoints = node.points || [0, 0, 80, 0];
    const currentLength = Math.abs(currentPoints[2] - currentPoints[0]) || 80;
    const newLength = Math.max(25, Math.round(currentLength * scaleX));

    onChange({
      ...node,
      x: target.x(),
      y: target.y(),
      points: [0, 0, newLength, 0],
      rotation: newRotation,
    });
  };

  const currentPoints = node.points || [0, 0, 80, 0];
  const arrowLength = Math.abs(currentPoints[2] - currentPoints[0]) || 80;
  const lengthMeters = pxToMeters(arrowLength);
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
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      <Arrow
        points={currentPoints}
        pointerLength={12}
        pointerWidth={12}
        fill={isSelected ? '#006D36' : '#2563EB'}
        stroke={isSelected ? '#006D36' : '#2563EB'}
        strokeWidth={4}
      />

      {shouldShowDimensions && (
        <Group listening={false}>
          <Line
            points={[0, -10, arrowLength, -10]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[0, -14, 0, -6]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1.2}
          />
          <Line
            points={[arrowLength, -14, arrowLength, -6]}
            stroke={isSelected ? '#006D36' : '#64748B'}
            strokeWidth={1.2}
          />
          <Rect
            x={Math.max(0, arrowLength / 2 - 20)}
            y={-20}
            width={40}
            height={12}
            fill={isSelected ? '#006D36' : '#1E293B'}
            cornerRadius={2}
          />
          <Text
            x={Math.max(0, arrowLength / 2 - 20)}
            y={-18}
            width={40}
            text={`${lengthMeters.toFixed(1)}m`}
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
